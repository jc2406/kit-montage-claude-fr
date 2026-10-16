# Guide de la transcription

## Comment les transcriptions sont générées

`hyperframes transcribe` gère à la fois la transcription et la conversion de format :

```bash
# Transcrire de l'audio/de la vidéo (utilise whisper.cpp en local, sans clé API)
npx hyperframes transcribe audio.mp3

# Pour du français : modèle multilingue + langue explicite
npx hyperframes transcribe audio.mp3 --model small --language fr

# Utiliser un modèle plus grand pour plus de précision
npx hyperframes transcribe audio.mp3 --model medium --language fr

# Filtrer sur l'anglais seulement (ignore la parole non anglaise)
npx hyperframes transcribe audio.mp3 --language en

# Importer une transcription existante issue d'un autre outil
npx hyperframes transcribe captions.srt
npx hyperframes transcribe captions.vtt
npx hyperframes transcribe openai-response.json
```

## Formats d'entrée pris en charge

La CLI détecte et normalise automatiquement ces formats :

| Format                    | Extension | Source                                                                      | Par mot ?            |
| ------------------------- | --------- | --------------------------------------------------------------------------- | -------------------- |
| JSON whisper.cpp          | `.json`   | `hyperframes init --video`, `hyperframes transcribe`                        | Oui                  |
| API OpenAI Whisper        | `.json`   | `openai.audio.transcriptions.create({ timestamp_granularities: ["word"] })` | Oui                  |
| Sous-titres SRT           | `.srt`    | Logiciels de montage, outils de sous-titres, YouTube                        | Non (par phrase)     |
| Sous-titres VTT           | `.vtt`    | Lecteurs web, YouTube, services de transcription                            | Non (par phrase)     |
| Tableau de mots normalisé | `.json`   | Prétraité par n'importe quel outil (par ex. ElevenLabs Scribe)              | Oui                  |

**Des horodatages par mot donnent de meilleurs sous-titres.** SRT/VTT donnent un timing par phrase,
qui fonctionne mais ne permet pas d'effets d'animation mot par mot.

## Guide des modèles Whisper

Le modèle par défaut de la CLI (`small.en`) équilibre précision et vitesse **pour l'anglais**. Pour le
français, utilise un modèle sans `.en`. Pour de meilleurs résultats, prends un modèle plus grand :

| Modèle     | Taille | Vitesse      | Précision  | Quand l'utiliser                                 |
| ---------- | ------ | ------------ | ---------- | ------------------------------------------------ |
| `tiny`     | 75 Mo  | La plus rapide | Faible   | Aperçus rapides, tests de la chaîne              |
| `base`     | 142 Mo | Rapide       | Correcte   | Extraits courts, audio clair                     |
| `small`    | 466 Mo | Moyenne      | Bonne      | **Par défaut** — convient à la plupart des contenus |
| `medium`   | 1,5 Go | Lente        | Très bonne | Contenus importants, audio bruité, musique       |
| `large-v3` | 3,1 Go | La plus lente | La meilleure | Qualité production                            |

**N'ajoute le suffixe `.en` que si l'utilisateur dit explicitement que l'audio est en anglais.** Les
modèles `.en` sont un peu plus précis en anglais mais TRADUIRONT un audio non anglais au lieu de le transcrire.

**Critique : les modèles `.en` traduisent l'audio non anglais en anglais** — ils ne le transcrivent
pas. Si l'audio n'est peut-être pas en anglais, utilise toujours un modèle sans le suffixe `.en` et
passe `--language` pour préciser la langue source. Si tu n'es pas sûr de la langue, utilise `small`
(pas `small.en`) sans `--language` — Whisper la détectera.

```bash
# Audio en français
npx hyperframes transcribe audio.mp3 --model small --language fr

# Audio en espagnol
npx hyperframes transcribe audio.mp3 --model small --language es

# Langue inconnue — laisser Whisper la détecter
npx hyperframes transcribe audio.mp3 --model small
```

**Musique et chant sur instrumentation** : `small` comprend mal les paroles — utilise au minimum
`medium`, ou importe les paroles à la main. Même `medium` a du mal avec les morceaux très produits ;
pour un clip musical, fournir les paroles connues en SRT/VTT et les importer avec
`hyperframes transcribe lyrics.srt` battra toujours la transcription automatique.

## Contrôle qualité de la transcription (obligatoire)

Après chaque transcription, **lis la transcription et cherche les problèmes de qualité avant de
continuer.** Une mauvaise transcription produit des sous-titres absurdes. Ne saute jamais cette étape.

### Ce qu'il faut chercher

| Signal                          | Exemple                                     | Cause                                                                    |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| Notes de musique (`♪`, `�`)     | `{ "text": "♪" }` ou `{ "text": "�" }`      | Whisper a détecté de la musique, pas de la parole                        |
| Mots déformés / absurdes        | « Do a chin », « Get so gay », « huh »      | Le modèle a mal entendu des paroles ou un bruit de fond                  |
| Longs trous sans mots           | Plus de 20 secondes de seuls jetons `♪`     | Passage instrumental — normal, mais une forte proportion signifie que la parole est ratée |
| Mots de remplissage répétés     | Beaucoup de « euh », « hein », « oh »       | Le modèle hallucine sur la musique                                       |
| Mots très courts                | Mots avec `end - start < 0.05`              | Alignement des horodatages peu fiable                                    |

### Règles de nouvelle tentative

**Si plus de 20 % des entrées sont des jetons `♪`/`�`, ou si la transcription contient des mots
manifestement absurdes, la transcription a échoué.** Ne continue pas avec la mauvaise transcription. À la place :

1. **Réessaie avec `medium`** (ou `medium.en` pour de l'anglais) si l'original utilisait `small` ou plus petit :
   ```bash
   npx hyperframes transcribe audio.mp3 --model medium --language fr
   ```
2. **Si `medium` échoue aussi** (toujours plus de 20 % de jetons de musique ou du charabia), dis à l'utilisateur que l'audio est trop bruité pour une transcription locale et propose :
   - De fournir les paroles à la main sous forme de fichier SRT/VTT
   - D'utiliser une API externe (ElevenLabs Scribe, OpenAI ou Groq Whisper — voir plus bas)
3. **Nettoie toujours la transcription** avant de construire les sous-titres — retire les jetons `♪`/`�` et les entrées dont `text` est un seul caractère qui n'est pas un mot. Seuls de vrais mots doivent arriver dans la composition des sous-titres.

### Nettoyer une transcription

Après la transcription (même avec un bon modèle), retire les entrées qui ne sont pas des mots :

```js
var raw = JSON.parse(transcriptJson);
var words = raw.filter(function (w) {
  if (!w.text || w.text.trim().length === 0) return false;
  if (/^[♪�♪♫♬♭♮♯]+$/.test(w.text)) return false;
  if (/^(huh|uh|um|ah|oh|euh|heu|bah|ben)$/i.test(w.text) && w.end - w.start < 0.1) return false;
  return true;
});
```

### Quel modèle utiliser (arbre de décision)

1. **De la parole sur un fond silencieux ou léger ?** → `small` (avec `--language fr` pour du français) suffit
2. **De la parole sur de la musique, ou de la musique chantée ?** → commence par `medium`
3. **Un morceau de musique produit (chant + instrumentation complète) ?** → commence par `medium`, attends-toi à avoir besoin des paroles à la main ou d'une API externe
4. **Du multilingue ?** → utilise `medium` ou `large-v3` (sans suffixe `.en`)

## Utiliser des API de transcription externes

Pour la meilleure précision, utilise une API externe et importe le résultat :

**API OpenAI Whisper** (recommandée pour la qualité) :

```bash
# Générer avec des horodatages par mot, puis importer
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file=@audio.mp3 -F model=whisper-1 \
  -F response_format=verbose_json \
  -F "timestamp_granularities[]=word" \
  -o transcript-openai.json

npx hyperframes transcribe transcript-openai.json
```

**API Groq Whisper** (rapide, offre gratuite disponible) :

```bash
curl https://api.groq.com/openai/v1/audio/transcriptions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -F file=@audio.mp3 -F model=whisper-large-v3 \
  -F response_format=verbose_json \
  -F "timestamp_granularities[]=word" \
  -o transcript-groq.json

npx hyperframes transcribe transcript-groq.json
```

Le kit fournit aussi `scripts/transcribe-elevenlabs.mjs` (ElevenLabs Scribe), qui donne d'excellents
résultats en français avec des horodatages par mot.

## S'il n'existe aucune transcription

1. Cherche à la racine du projet des fichiers `transcript.json`, `.srt` ou `.vtt`
2. S'il n'y en a pas, lance la transcription — choisis le modèle de départ selon le type de contenu :
   - Parole/voix off → `small` (+ `--language fr` en français, `small.en` seulement pour de l'anglais)
   - Musique chantée → `medium`
   ```bash
   npx hyperframes transcribe <fichier-audio-ou-video> --model medium --language fr
   ```
3. **Lis la transcription et fais le contrôle qualité** (voir plus haut). Si elle échoue, réessaie avec un modèle plus grand ou propose les paroles à la main.

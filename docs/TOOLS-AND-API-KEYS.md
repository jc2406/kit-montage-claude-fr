# Outils, comptes et clés API

Par défaut, le kit utilise **ElevenLabs Scribe pour la transcription** et **Kie.ai pour générer vidéos et
images**. Ce sont ses services préférés, pas des obligations pour chaque montage. Utilisez vos
propres comptes et crédits, et ne configurez que ce dont vous vous servez.

## Ce qu'il vous faut

| Outil ou service | Quand vous en avez besoin | Installation et coût |
| --- | --- | --- |
| Codex ou Claude Code | Suivre les skills de montage guidés par l'agent | Votre propre accès à l'assistant. Les crédits des API externes sont à part. |
| Node.js 22+, npm, Git, FFmpeg avec ffprobe, et Chrome ou Chromium | Montage, aperçu et rendu en local | À installer sur votre ordinateur. Voir [l'installation](SETUP.md). |
| HyperFrames et GSAP | Compositions vidéo et animation | Installés par `npm ci`. Le rendu tourne en local. Certains modèles utilisent des polices ou des CDN en ligne ; rapatriez en local les fichiers retenus pour le rendu final. |
| ElevenLabs Scribe | Choix par défaut pour la transcription | Votre propre clé avec l'accès `speech_to_text` et du crédit disponible. L'outil inclus envoie l'audio à ElevenLabs. |
| API OpenAI Whisper | Transcription dans le cloud, en alternative | Votre propre clé API OpenAI et sa facturation. Demandez à l'assistant de configurer l'appel et de normaliser les horodatages des mots. |
| Whisper ou whisper.cpp en local | Transcription sur votre ordinateur, en alternative | Installation séparée du moteur et du modèle. Pas de clé cloud ; demande le téléchargement des modèles, de l'espace disque et de la puissance de calcul locale. |
| Kie.ai | B-roll en mouvement, images et autres médias générés, en option | Votre propre compte, clé et crédits. Vos rushs et vos fichiers peuvent les remplacer. |
| Vos rushs, logos, polices, musiques et bruitages | Construire le montage réel | Fournissez des fichiers que vous avez le droit d'utiliser. Le kit n'inclut aucun abonnement à une banque d'images ou de musique. |

Le projet de départ synthétique et les vérifications ne demandent aucune API payante de
transcription ou de génération. Choisissez un fournisseur seulement quand l'étape suivante en a besoin.

## ElevenLabs : l'outil inclus

Créez une clé dans [les réglages API d'ElevenLabs](https://elevenlabs.io/app/settings/api-keys)
et ajoutez-la dans le `.env` à la racine sous le nom `ELEVENLABS_API_KEY`. Puis lancez :

```sh
node scripts/transcribe-elevenlabs.mjs video-projects/ma-video/assets/raw.mp4
```

L'outil écrit un JSON mot à mot à côté du fichier d'entrée. Réutilisez une transcription vérifiée
plutôt que de payer pour transcrire de nouveau la même prise. Voir la
[documentation officielle de l'API Scribe](https://elevenlabs.io/docs/api-reference/speech-to-text/convert)
pour les modèles disponibles et les conditions d'usage actuelles.

## Whisper et autres alternatives de transcription

Vous pouvez demander à l'assistant d'utiliser un autre fournisseur. Le script
`transcribe-elevenlabs.mjs` fourni n'appelle qu'ElevenLabs ; changer la clé ne change pas de fournisseur.

Pour l'API OpenAI, utilisez `whisper-1`, `response_format="verbose_json"` et
`timestamp_granularities=["word"]`. Gardez `OPENAI_API_KEY` en local. Vérifiez les limites
d'envoi actuelles avant d'envoyer de longs enregistrements ; découpez l'audio si besoin et gardez
le décalage de chaque morceau. Voir [le guide d'OpenAI](https://developers.openai.com/api/docs/guides/speech-to-text).

Pour une transcription en local, demandez à l'assistant de configurer
[OpenAI Whisper](https://github.com/openai/whisper) ou
[whisper.cpp](https://github.com/ggml-org/whisper.cpp). Whisper en Python demande Python et les
dépendances du modèle ; whisper.cpp a sa propre installation. Aucun des deux n'est installé par `npm ci`.

Les outils de coupe exigent ce format commun, avec des **temps par mot en secondes** sur la
timeline exacte de l'enregistrement source :

```json
{
  "text": "Bonjour à tous.",
  "audio_duration_secs": 2.0,
  "words": [
    { "text": "Bonjour", "start": 0.2, "end": 0.6 },
    { "text": "à", "start": 0.65, "end": 0.7 },
    { "text": "tous.", "start": 0.75, "end": 1.2 }
  ]
}
```

Demandez à l'assistant de renommer le champ `word` d'un fournisseur en `text` si nécessaire, de
garder les temps de début et de fin numériques et de récupérer la durée complète de la source avec
ffprobe. Les paragraphes, les sous-titres SRT et les transcriptions par segments seulement ne
fournissent pas le timing par mot exigé. Demandez des horodatages par mot ou faites un alignement ;
n'inventez jamais de timing. Les montages suivants doivent recaler les mots avec leur EDL. Les
plans du format court suivent en plus `sourceStart` et `sourceEnd`.

Copiez l'un de ces prompts :

> Utilise OpenAI Whisper au lieu d'ElevenLabs pour cet enregistrement. Utilise ma clé API configurée
> en local, demande des horodatages par mot et normalise le résultat pour ce kit avant de couper.
> Garde la source intacte et vérifie le timing sur son audio.

> Utilise Whisper en local pour la transcription. Vérifie d'abord son installation et le
> téléchargement des modèles, puis normalise les horodatages des mots pour ce kit. Garde la
> transcription en local et utilise mes rushs et mes fichiers, sans génération payante.

## Kie.ai : vidéos et médias générés

Le kit peut utiliser [Kie.ai](https://kie.ai/) pour générer des vidéos et des images. Ajoutez
`KIE_API_KEY` dans `.env` si vous le choisissez. Suivez le
[guide officiel de l'API](https://docs.kie.ai/) pour les clés, les requêtes propres à chaque
modèle, le suivi des tâches et les crédits.

Le skill de format court décrit une utilisation de Kie ; le kit **n'inclut pas** de script
universel de génération Kie ni de compte connecté. Le skill `motion-showreel` contient un petit
client (`scripts/kie.mjs`) pour ses trois médias de showreel : musique instrumentale Suno, images
fixes Seedream à partir d'un logo, et mouvements de caméra Kling.
Demandez à l'assistant de configurer le modèle choisi à partir de la documentation actuelle.
Ajouter une clé ne suffit pas à créer une intégration. Les entrées, formats, disponibilités et
coûts en crédits varient selon les modèles.

Préparez les médias proposés et le coût prévu avant tout travail payant que vous n'avez pas déjà
autorisé. Gardez les ID de tâche, réutilisez les résultats réussis et enregistrez les résultats
retenus dans les médias de votre projet privé. Vérifiez leur mouvement, leur durée, leur format
et leur cadrage dans le montage final.

> Utilise Kie.ai pour le B-roll en mouvement des scènes validées. Vérifie ma configuration locale
> et la documentation actuelle des modèles, puis montre-moi les médias que tu proposes et le coût
> prévu en crédits. Réutilise mes rushs existants partout où ils conviennent.

## Autres outils optionnels cités par les skills

Ce sont des options de déroulé, pas une affirmation que chaque exemple les a utilisées :

- **Narration :** les guides HyperFrames décrivent la synthèse vocale locale Kokoro, avec une
  installation supplémentaire du moteur et du modèle. Les voix ElevenLabs et HeyGen sont aussi
  citées ; chacune demande votre accès au service et une API ou un connecteur configuré.
- **Capture de sites web :** Gemini peut fournir en option des descriptions d'images plus riches.
  La capture de base ne demande pas cette clé.
- **Autres transcriptions :** la référence du framework cite Groq Whisper. Il demande sa propre
  clé et les mêmes vérifications de normalisation de la transcription.
- **Anciens exemples d'intégration :** un accès ClickUp ou OpenAI n'est nécessaire que si votre
  projet appelle réellement ces services.
- **Bruitages :** `motion-showreel` peut générer un kit de bruitages avec la génération de sons
  d'ElevenLabs (`scripts/sfx.mjs`). Il utilise `ELEVENLABS_API_KEY` ; la clé a besoin de l'accès
  aux effets sonores en plus de `speech_to_text`. Votre propre bibliothèque de bruitages fonctionne aussi.
- **Moteurs d'appoint :** certains scripts optionnels demandent Python. Playwright est inclus pour
  les déroulés qui utilisent un navigateur ; ses navigateurs peuvent demander une installation.

Qu'un skill cite un outil MCP n'installe pas cette intégration. Demandez d'abord à l'assistant de
vérifier quels connecteurs ou clients API sont disponibles.

## Ne configurez que ce que vous utilisez

`npm run setup` crée `.env` à partir de [`.env.example`](../.env.example) s'il n'existe pas.
Laissez vides les entrées inutilisées. Un `.env` existant est conservé : ajoutez vous-même les
nouvelles entrées nécessaires. L'outil ElevenLabs charge le `.env` à la racine ; les autres
fournisseurs demandent leur propre client ou chargement des variables, configuré par l'assistant.
Gardez les identifiants hors des compositions, des captures d'écran et des commits.

Vérifiez les tarifs actuels des fournisseurs et votre solde avant tout appel payant. Le kit
n'inclut aucun crédit de transcription, de génération, de voix off ou d'assistant.

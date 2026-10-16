# Synthèse vocale

Génère de l'audio de parole en local avec Kokoro-82M (sans clé API, tourne sur le processeur).

## Choix de la voix

Accorde la voix au contenu. Par défaut : `af_heart`.

| Type de contenu   | Voix                  | Pourquoi                       |
| ----------------- | --------------------- | ------------------------------ |
| Démo produit      | `af_heart`/`af_nova`  | Chaleureuse, professionnelle   |
| Tutoriel          | `am_adam`/`bf_emma`   | Neutre, facile à suivre        |
| Marketing         | `af_sky`/`am_michael` | Énergique ou autoritaire       |
| Documentation     | `bf_emma`/`bm_george` | Anglais britannique clair      |
| Décontracté       | `af_heart`/`af_sky`   | Accessible, naturelle          |

Lance `npx hyperframes tts --list` pour les 54 voix (8 langues). Ces voix par défaut sont
anglophones : pour une narration en français, cherche une voix française dans la liste, ou utilise
un service comme ElevenLabs (voix française ou voix clonée) et importe le fichier audio.

## Réglage de la vitesse

- **0,7-0,8** — tutoriel, contenu complexe
- **1,0** — débit naturel (par défaut)
- **1,1-1,2** — intros, contenu enjoué
- **1,5 et plus** — rarement approprié

## Utilisation

```bash
npx hyperframes tts "Ton script ici" --voice af_nova --output narration.wav
npx hyperframes tts script.txt --voice bf_emma --output narration.wav
```

Dans les compositions :

```html
<audio
  id="narration"
  data-start="0"
  data-duration="auto"
  data-track-index="2"
  src="narration.wav"
  data-volume="1"
></audio>
```

## Déroulé synthèse vocale + sous-titres

```bash
npx hyperframes tts script.txt --voice af_heart --output narration.wav
npx hyperframes transcribe narration.wav  # → transcript.json avec horodatages par mot
```

## Prérequis

- Python 3.8+ avec `kokoro-onnx` et `soundfile`
- Les modèles se téléchargent à la première utilisation (environ 311 Mo + environ 27 Mo de voix, mis en cache dans `~/.cache/hyperframes/tts/`)

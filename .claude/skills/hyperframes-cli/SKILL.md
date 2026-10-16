---
name: hyperframes-cli
description: Outil en ligne de commande HyperFrames — hyperframes init, lint, preview, render, transcribe, tts, doctor, browser, info, upgrade, compositions, docs, benchmark. À utiliser pour créer la structure d'un projet, lancer le lint ou valider des compositions, prévisualiser dans le Studio, faire le rendu en vidéo, transcrire de l'audio, générer de la synthèse vocale ou dépanner l'environnement HyperFrames.
---

# CLI HyperFrames

Tout passe par `npx hyperframes`. Demande Node.js >= 22 et FFmpeg.

## Déroulé

1. **Structure** — `npx hyperframes init ma-video`
2. **Écriture** — écrire la composition HTML (voir le skill `hyperframes`)
3. **Lint** — `npx hyperframes lint`
4. **Aperçu** — `npx hyperframes preview`
5. **Rendu** — `npx hyperframes render`

Lance le lint avant l'aperçu — il repère les `data-composition-id` manquants, les pistes qui se chevauchent, les timelines non enregistrées.

## Créer la structure

```bash
npx hyperframes init ma-video                        # assistant interactif
npx hyperframes init ma-video --example warm-grain   # choisir un exemple
npx hyperframes init ma-video --video clip.mp4       # avec un fichier vidéo
npx hyperframes init ma-video --audio track.mp3      # avec un fichier audio
npx hyperframes init ma-video --non-interactive      # sans questions (CI/agents)
```

Modèles : `blank`, `warm-grain`, `play-mode`, `swiss-grid`, `vignelli`, `decision-tree`, `kinetic-type`, `product-promo`, `nyt-graph`.

`init` crée la bonne structure de fichiers, copie les médias, transcrit l'audio avec Whisper et installe des skills de code pour l'IA. Utilise-le plutôt que de créer les fichiers à la main. (Dans ce kit, préfère `npm run new-video -- ma-video`, qui part du projet de départ du kit.)

## Lint

```bash
npx hyperframes lint                  # dossier courant
npx hyperframes lint ./mon-projet     # projet précis
npx hyperframes lint --verbose        # constats de niveau info
npx hyperframes lint --json           # lisible par une machine
```

Vérifie `index.html` et tous les fichiers de `compositions/`. Signale les erreurs (à corriger), les avertissements (à corriger de préférence) et les infos (avec `--verbose`).

## Aperçu

```bash
npx hyperframes preview                   # servir le dossier courant
npx hyperframes preview --port 4567       # port personnalisé (3002 par défaut)
```

Rechargement à chaud à chaque modification de fichier. Ouvre automatiquement le Studio dans ton navigateur.

## Rendu

```bash
npx hyperframes render                                # MP4 standard
npx hyperframes render --output final.mp4             # sortie nommée
npx hyperframes render --quality draft                # itération rapide
npx hyperframes render --fps 60 --quality high        # livraison finale
npx hyperframes render --format webm                  # WebM transparent
npx hyperframes render --docker                       # identique à l'octet près
```

| Option         | Valeurs               | Par défaut                  | Notes                                      |
| -------------- | --------------------- | --------------------------- | ------------------------------------------ |
| `--output`     | chemin                | renders/name_timestamp.mp4  | Chemin de sortie                           |
| `--fps`        | 24, 30, 60            | 30                          | 60 images/s double le temps de rendu       |
| `--quality`    | draft, standard, high | standard                    | draft pour itérer                          |
| `--format`     | mp4, webm             | mp4                         | WebM gère la transparence                  |
| `--workers`    | 1-8 ou auto           | auto                        | Chacun lance un Chrome                     |
| `--docker`     | option                | désactivée                  | Sortie reproductible                       |
| `--gpu`        | option                | désactivée                  | Encodage accéléré par le GPU               |
| `--strict`     | option                | désactivée                  | Échoue sur les erreurs de lint             |
| `--strict-all` | option                | désactivée                  | Échoue sur les erreurs ET les avertissements |

**Conseil de qualité :** `draft` pendant l'itération, `standard` pour la revue, `high` pour la livraison finale.

## Transcription

```bash
npx hyperframes transcribe audio.mp3
npx hyperframes transcribe video.mp4 --model small --language fr     # français
npx hyperframes transcribe video.mp4 --model medium.en --language en # anglais
npx hyperframes transcribe subtitles.srt   # importer l'existant
npx hyperframes transcribe subtitles.vtt
npx hyperframes transcribe openai-response.json
```

N'utilise un modèle `.en` que pour de l'audio en anglais : il traduirait un audio français au lieu de le transcrire.

## Synthèse vocale

```bash
npx hyperframes tts "Le texte ici" --voice af_nova --output narration.wav
npx hyperframes tts script.txt --voice bf_emma
npx hyperframes tts --list  # afficher toutes les voix
```

## Dépannage

```bash
npx hyperframes doctor       # vérifier l'environnement (Chrome, FFmpeg, Node, mémoire)
npx hyperframes browser      # gérer le Chrome intégré
npx hyperframes info         # version et détails de l'environnement
npx hyperframes upgrade      # chercher des mises à jour
```

Lance `doctor` en premier si le rendu échoue. Problèmes courants : FFmpeg manquant, Chrome manquant, mémoire insuffisante.

## Autres

```bash
npx hyperframes compositions   # lister les compositions du projet
npx hyperframes docs           # ouvrir la documentation
npx hyperframes benchmark .    # mesurer les performances de rendu
```

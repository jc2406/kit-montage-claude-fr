# De l'enregistrement au montage final

## 1. Créer un projet et transcrire

À la racine du dépôt, lancez `npm run new-video -- ma-video`. Placez votre enregistrement dans
`video-projects/ma-video/assets/raw.mp4`. Gardez cet original intact.

```sh
node scripts/transcribe-elevenlabs.mjs video-projects/ma-video/assets/raw.mp4
```

C'est le choix par défaut de Nate : l'audio est envoyé à ElevenLabs avec votre clé et vos crédits.
Vous pouvez choisir à la place OpenAI Whisper, Whisper en local ou un autre fournisseur ; voir
[la configuration des fournisseurs et la normalisation des transcriptions](TOOLS-AND-API-KEYS.md).
Vous pouvez aussi fournir une transcription JSON mot à mot existante avec
`words: [{text, start, end}]` et `audio_duration_secs`.

## 2. Supprimer les blancs

```sh
node .agents/skills/cut-silences/scripts/cut-silences.mjs video-projects/ma-video/assets/raw.json --video video-projects/ma-video/assets/raw.mp4 --out-dir video-projects/ma-video/assets --output video-projects/ma-video/assets/silenced.mp4 --apply
```

La transcription recalée est `raw.silence-transcript.json`. Réglez les paramètres d'écart et de
respiration dans le skill ; ne supprimez pas les pauses qui ont un sens.

## 3. Examiner les erreurs

```sh
node .agents/skills/cut-mistakes/scripts/find-cut-candidates.mjs video-projects/ma-video/assets/raw.silence-transcript.json --out-dir video-projects/ma-video/assets
```

Lisez chaque proposition en la comparant à ce qui est dit. Écrivez les décisions validées dans
`approved-cuts.json` sous la forme `{ "cuts": [{ "start": 1.2, "end": 1.5, "reason": "bégaiement" }] }`.
Ces temps sont sur la timeline APRÈS suppression des silences. Une liste de coupes vide est valide.

```sh
node .agents/skills/cut-mistakes/scripts/apply-cuts.mjs video-projects/ma-video/assets/raw.silence-transcript.json --cuts video-projects/ma-video/assets/approved-cuts.json --video video-projects/ma-video/assets/silenced.mp4 --out-dir video-projects/ma-video/assets --output video-projects/ma-video/assets/clean.mp4 --apply
```

Utilisez `raw.mistakes-transcript.json` avec `clean.mp4`. Copiez cette transcription dans
`assets/transcript.json` du projet pour la validation des temps forts. N'utilisez jamais les temps
bruts avec la vidéo nettoyée. Avec Claude, vous pouvez remplacer `.agents` par `.claude`.

## 4. Concevoir la couche visuelle

Lisez video-storytelling et la philosophie du mouvement. Remplissez une grille des temps forts avec
l'ancre parlée, l'idée à l'écran, le visuel, le moment d'entrée et le rappel. Choisissez un style et
copiez les cartes avec leurs CSS et médias dans votre composition. Préservez le visage de l'orateur
et utilisez un conteneur non temporisé pour les recadrages. Voir le skill style-library.
Le modèle papier millimétré est un fond ; il faut votre contenu par-dessus.

## 5. Vérifier, prévisualiser et rendre

```sh
node scripts/preflight.mjs video-projects/ma-video
node scripts/validate-beat-sync.mjs video-projects/ma-video
cd video-projects/ma-video
npx hyperframes lint
npx hyperframes preview
```

Lancez la vérification des temps forts uniquement pour les sous-compositions externes ancrées ;
elle échoue s'il n'y en a aucune. Pour les compositions en ligne, vérifiez le timing à la main.
Vérifiez dans le Studio, puis rendez un brouillon. Inspectez les images encodées aux moments clés et
aux transitions, et écoutez les raccords. Corrigez les problèmes et écrivez VERIFY.md avant un rendu
standard. La publication est une action séparée qui demande l'instruction de l'utilisateur.

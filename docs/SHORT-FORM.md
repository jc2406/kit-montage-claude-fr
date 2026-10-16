# Reels et YouTube Shorts

Utilisez `short-form-edit` pour un enregistrement brut face caméra, un reel, un YouTube Short ou
une publicité courte. Le format par défaut est 1080x1920. Demandez une version 1920x1080 composée
séparément si besoin ; un recadrage au centre n'est pas une deuxième composition.

## Démarrer

Lancez `npm run new-video -- mon-reel`, puis demandez à Codex (`$short-form-edit`) ou à Claude
Code (`/short-form-edit`) de monter votre enregistrement local dans ce projet. Précisez le public,
l'action attendue, la durée visée et vos préférences de marque.
Le projet de départ est en paysage ; le skill doit régler les dimensions, la mise en page et les
métadonnées de la composition du reel en 1080x1920 avant de construire. Gardez tous les rushs et
toutes les sorties dans le nouveau projet.

1. Transcrivez avec ElevenLabs Scribe ou l'alternative de votre choix, ou réutilisez des horodatages de mots vérifiés.
2. Examinez les erreurs dans leur contexte et établissez une seule liste de décisions de montage calée à l'image près.
3. Explorez trois pistes d'ouverture et choisissez une promesse et une chute honnêtes.
4. Planifiez les scènes, les sous-titres exacts, les plans en mouvement et les repères sonores sur les mots conservés.
5. Construisez la composition avec les skills HyperFrames et GSAP. Utilisez un registre des plans
   pour noter leur provenance et éviter de réutiliser sans le vouloir la même scène source.
6. Validez, prévisualisez, rendez un brouillon, inspectez les images et écoutez le montage en entier.
7. Réglez les problèmes de timing, de son et de composition avant d'exporter la vidéo finale.

Nate utilise ElevenLabs Scribe pour la transcription et Kie.ai pour générer vidéos et images.
Il vous faut vos propres clés et crédits pour ces services. Whisper est une alternative pour la
transcription, et vos rushs existants peuvent remplacer les médias générés.
Voir [les outils, comptes et clés API](TOOLS-AND-API-KEYS.md) pour l'installation et des prompts
à copier. Respectez les autorisations déjà données quand vous proposez des médias payants. L'exemple
de validation synthétique ne demande aucun service payant.

## Valider depuis la racine du dépôt

```sh
npm run validate:short-form -- video-projects/mon-reel
npm run validate:footage -- video-projects/mon-reel
node scripts/preflight.mjs video-projects/mon-reel
```

Le premier validateur lit `assets/plan.json`, `assets/transcript.json` et
`assets/edit-decisions.json`. Le second lit le plan et, pour les plans en mouvement,
`assets/footage-ledger.json` ; il vérifie les empreintes et que les fichiers référencés existent.
Suivez le [schéma du plan](../.claude/skills/short-form-edit/references/plan-schema.md).
Utilisez la [fiche d'analyse de référence](../.claude/skills/short-form-edit/references/reference-analysis.md)
pour analyser une vidéo de référence fournie.

Essayez l'exemple synthétique sans enregistrement ni clé API :

```sh
npm run validate:short-form -- examples/short-form
npm run validate:footage -- examples/short-form
npm test
```

L'exemple contient des mots et des timings inventés, pas un reel rendu.
Les validateurs vérifient la structure et les timings déclarés. Ils ne prouvent ni la force de
l'accroche, ni l'exactitude des affirmations, ni les droits sur les images, ni le bon recadrage,
ni la synchro audible. Les contrôles qualité du skill exigent de regarder et d'écouter la vraie sortie.

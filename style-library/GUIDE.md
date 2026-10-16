# Bibliothèque de styles — Guide

La bibliothèque de styles de cartes en motion design dans laquelle **l'agent 3** pioche pour ajouter des cartes par niveau (tier) à une vidéo. Chaque « style » est une identité visuelle nommée (par ex. un look explicatif inspiré de Vox, ou un look YouTubeur animé tout en douceur) avec son propre jeu de variantes de cartes. Ce fichier est le contrat : lis-le avant d'ajouter un style ou une carte.

## Modèle mental

```
style-library/
├── GUIDE.md                  ← ce fichier (les règles)
├── registry.json             ← index maître GÉNÉRÉ de tous les styles + cartes (l'agent 3 le lit)
├── _blueprint/               ← squelette à copier pour un nouveau style (ne jamais le modifier sur place ; le cloner)
└── NN-slug/                  ← un dossier par style, par ex. 01-vox-explainer/
```

Un style = un dossier. On construit **entièrement un style avant de commencer le suivant**.

## Identifiants

Schéma en trois parties (préfixe numérique + slug + identifiants à points) :

- **Dossier du style :** `NN-slug` — par ex. `02-vox-explainer`. `NN` est un ordre/identifiant sur deux chiffres, `slug` est en kebab-case lisible.
- **Identifiant du style :** le slug sans le numéro — par ex. `vox-explainer` (stable même si le numéro change).
- **Identifiant de carte :** `<style>.<tier>.<purpose>[.<variante>]` — par ex. `vox-explainer.t1.stat`, `vox-explainer.t2.list.compact`. Stable, unique, explicite.

## Un dossier de style

```
NN-slug/
├── style.json        ← manifeste : identité + palette + polices + mouvement + liste des cartes (avec slots, tiers, usages)
├── DESIGN.md         ← la spec de design : palette, typographie, règles de mouvement, « à ne pas faire » (format de design partagé)
├── tokens.css        ← variables CSS propres au style (couleurs, polices, courbes). Les cartes les référencent, jamais de valeurs en dur.
├── references/       ← les images de référence que tu fournis pour ce style (la source de vérité du look)
├── cards/
│   ├── tier1/        ← cartes plein écran (thèse, gros chiffre, intertitre de section, citation)
│   ├── tier2/        ← cartes d'appui qui laissent l'orateur visible (libellé, liste, équation, bandeau nominatif)
│   └── <custom>/     ← « innovations » optionnelles — tout type de carte qui ne rentre ni en tier1 ni en tier2
└── preview/          ← aperçu par carte : <id-carte>.mp4 (boucle de 2-3 s) + <id-carte>.png (vignette)
```

Versionnés : `style.json`, `DESIGN.md`, `tokens.css`, les fichiers `.html` des cartes, les spécifications de design et les éventuelles vignettes d'aperçu originales. La version publique exclut les captures de référence de tiers. Ignorées par git : les boucles **MP4** d'aperçu, plus lourdes (régénérables à partir des cartes).

## Le contrat d'une carte

Chaque carte est une **sous-composition HyperFrames autonome** — un `.html` indépendant qui s'affiche et se rend tout seul, et que l'agent 3 monte dans une vidéo via `data-composition-src`. Chaque carte DOIT :

1. Avoir une `<div>` racine avec `id`, `data-composition-id`, `data-start="0"`, `data-width="1920"`, `data-height="1080"`.
2. Enregistrer exactement une timeline GSAP **en pause** sur `window.__timelines["<data-composition-id>"]` (clé === identifiant de composition).
3. Prendre toutes les couleurs / polices / courbes dans les variables de `tokens.css` — jamais d'hexadécimal ni de nom de police en dur. (C'est la règle « mise en page sur mesure, tokens partagés » : les mises en page sont faites à la main pour chaque style ; la palette et la typo vivent dans les tokens pour rester cohérentes et faciles à ajuster.)
4. **Discipline du fond selon le tier :**
   - `tier1` (plein écran) → fond opaque sur tout le cadre (il remplace la vidéo).
   - `tier2` (appui) → transparent partout sauf sur la carte elle-même (il se superpose à la vidéo ; ne jamais couvrir le visage de l'orateur).
5. Exposer son texte sous forme de **slots nommés** : des éléments portant `data-slot="<nom>"` (par ex. `data-slot="headline"`). L'agent 3 remplit le texte des slots à chaque temps fort. Déclare chaque slot dans `style.json` (nom, type, nombre max. de caractères) pour que l'agent sache quoi remplir.
6. Être **déterministe** — pas de `Date.now()`, pas de `Math.random()` sans graine, pas d'appels réseau.

Une carte est « terminée » quand le lint passe, que l'aperçu est correct dans le Studio, et qu'elle a un MP4 d'aperçu rendu + une vignette.

> **Texte en français.** Le texte d'exemple des cartes est en français. Le français est 15 à 30 % plus long que l'anglais : respecte les `maxChars` déclarés et raccourcis plutôt que de laisser le texte déborder.

### Forme autonome vs forme montée

Les cartes sont écrites comme des **compositions autonomes** — la div `data-composition-id` est directement dans `<body>` et la carte inclut son propre `<script src=".../gsap.min.js">`, donc elle s'affiche et se rend toute seule. Quand **l'agent 3 monte** une carte dans une vraie vidéo, il l'enveloppe dans un `<template>` et la référence avec `data-composition-src` (la forme sous-composition de HyperFrames) ; le parent fournit GSAP et `data-duration`. Cet emballage est une transformation mécanique que l'agent 3 fait à l'assemblage — les cartes de la bibliothèque restent sous forme autonome.

## Tiers et usages (la taxonomie que l'agent 3 interroge)

- **tier1 — plein écran**, usages : `thesis`, `stat`, `section`, `quote`, `overview`
- **tier2 — appui**, usages : `label`, `list`, `equation`, `definition`, `lower-third`
- **custom** — tout le reste ; donne-lui une étiquette d'usage claire.

L'agent 3 demande au registre « une carte `tier1` `stat` dans le style `vox-explainer` », remplit les slots et la cale sur la transcription.

## La boucle de construction (par style)

1. **Échafauder :** `node scripts/style-library/new-style.mjs <NN> <slug>` → clone `_blueprint/` vers `NN-slug/`.
2. **Déposer les références** dans `NN-slug/references/`.
3. **Définir le look :** remplir `DESIGN.md` + `tokens.css` + les champs d'identité de `style.json` à partir des références.
4. **Construire les cartes :** écrire chaque `.html` de carte sous `cards/`, ajouter son entrée (id, tier, purpose, slots, file) dans `style.json`. Lint sur chacune.
5. **Aperçu :** rendre une boucle de 2-3 s + une vignette par carte dans `preview/` (voir plus bas).
6. **Indexer :** `node scripts/style-library/build-registry.mjs` → régénère `registry.json`.
7. **Relire et itérer** par rapport aux références, puis passer au style suivant.

## Aperçus

Le mouvement fait la moitié de l'identité, donc les aperçus sont de courtes boucles MP4 (2-3 s) + une vignette PNG, une par carte, dans le `preview/` du style. Comme chaque carte est une composition valide, un aperçu s'obtient en rendant la carte seule (via la CLI HyperFrames) et en prenant l'image 1 comme vignette. Le script d'aperçu est ajouté dès que la première vraie carte existe (pour être testé sur du concret).

## Notes

- Les `style-templates/` (dark-graph-paper, left-glass-popout) sont **une référence seulement** — ils ne font pas partie de cette bibliothèque. Reprends des idées, ne les porte pas tels quels.
- `MOTION_PHILOSOPHY.md` et `.claude/skills/hyperframes/` (palettes, transitions, typographie, styles visuels) sont des ressources de métier partagées dans lesquelles chaque style peut puiser.

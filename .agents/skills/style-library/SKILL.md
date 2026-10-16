---
name: style-library
description: Choisir, personnaliser ou enrichir la bibliothèque réutilisable de cartes de motion graphics et de modèles de style du projet. À utiliser pour choisir un style visuel, ajouter une carte, créer un nouveau pack de style ou réutiliser un modèle dans une vidéo HyperFrames.
---

# Réutiliser la bibliothèque de styles

Lis `style-library/GUIDE.md`, puis `style-library/registry.json`. Filtre par style, niveau et
usage avant d'ouvrir des cartes une par une. Lis le `DESIGN.md`, le `tokens.css` et les limites
d'emplacements du manifeste du style choisi.

Pour une incrustation, garde la transparence autour de la carte et le visage de l'orateur.
Pour une prise de contrôle plein écran, utilise un fond opaque. Copie la carte choisie dans le
dossier `compositions/` de la vidéo, rapatrie en local son CSS, ses polices et sa dépendance GSAP,
remplis ses valeurs `data-slot` nommées et branche son timing avec le skill HyperFrames. Copier
une carte sans ses dépendances relatives ne donne pas un élément complet.

Utilise `style-templates/` comme point de départ pour une scène entière. Un modèle avec média peut
demander le propre `assets/source.mp4` de l'utilisateur ; lis son README avant le rendu.

Le catalogue contient des brouillons, pas la promesse que chaque carte a passé un contrôle qualité
au rendu. Lance le lint et le rendu de la carte choisie à la résolution réelle du projet, inspecte
son image héros et sa transition, et vérifie le texte des emplacements à leur longueur maximale.
Les textes en français sont souvent 15 à 30 % plus longs qu'en anglais : vérifie qu'ils tiennent.

Pour ajouter un style, utilise `node scripts/style-library/new-style.mjs 03 mon-style "Mon style"`,
puis complète ses tokens de design, son manifeste et ses cartes. Lance
`node scripts/style-library/build-registry.mjs` après toute modification de manifeste. Garde les
textes propres à un projet dans le projet, et les cartes réutilisables de la bibliothèque génériques.

# Étape 2 : Écrire DESIGN.md

DESIGN.md est un **aide-mémoire de marque** pour le site capturé. Il encode l'identité visuelle pour
que tu puisses citer les couleurs, polices et motifs exacts en écrivant le storyboard et les compositions.

DESIGN.md n'est PAS le plan créatif. Le STORYBOARD (étape 4) porte la direction créative. DESIGN.md
est une référence que tu consultes, pas un document à suivre à la lettre.

## Les 6 sections

### `## Overview` (vue d'ensemble)

3 ou 4 phrases. Décris l'identité visuelle de façon factuelle : motifs de mise en page (grille
bento, mur de logos, section d'en-tête), stratégie de couleurs, ton typographique, impression
générale. Sois précis, pas poétique.

### `## Colors` (couleurs)

5 à 10 couleurs clés avec leurs valeurs HEX tirées de tokens.json et leurs rôles :

```
- **Surface principale** : `#020204` — fond noir profond
- **Contenu principal** : `#FFFFFF` — blanc très pur pour le texte et les bordures
- **Accent chaud** : `#FB923C` — orange pour les appels à l'action et les mises en avant
```

Inclus les couleurs sémantiques si le site utilise la couleur pour distinguer des zones de produit.

### `## Typography` (typographie)

Familles de polices avec leurs graisses, leurs rôles et tout usage distinctif :

```
- **Serif** : Cormorant Garamond (italique). Grands titres, identité de marque.
- **Monospace** : Geist Mono. Sous-titres, étiquettes, relevés de terminal. Interlettrage élevé (0,1-0,3em), tout en capitales.
- **Sans-serif** : Inter. Texte courant, éléments d'interface. Petites tailles (9-14 px).
```

Inclus la hiérarchie des tailles si elle est notable (en-tête : 64 px, section : 32 px, texte : 16 px).

### `## Elevation` (profondeur)

Un paragraphe sur la stratégie de profondeur : le site utilise-t-il des bordures, des ombres, du
verre dépoli ou des changements de couleur à plat ? Cite des motifs précis (par ex. « bordures de
1 px à blanc/10 d'opacité » ou « flou d'arrière-plan en couches avec bordures fines »).

### `## Components` (composants)

Nomme chaque composant d'interface notable que tu vois sur la capture. Sois précis :

- « Accordéon cinématographique » plutôt que « Cartes »
- « Bandeau de logos défilant » plutôt que « Section qui défile »
- « Cartes en verre avec grain » plutôt que « Conteneurs de contenu »

Pour chacun, note le traitement visuel distinctif (arrondi, espacement, comportement au survol).

### `## Do's and Don'ts` (à faire / à éviter)

3 à 5 règles de chaque, tirées de ce que le site fait et ne fait pas vraiment :

```
### À faire
- Utiliser des bordures fines et discrètes (blanc/10) pour séparer les sections
- Garder des images désaturées avec des dégradés sombres pour la lisibilité du texte

### À éviter
- Ne pas utiliser de fonds unis aux couleurs vives — rester dans « Le Vide »
- Ne pas utiliser d'ombres portées classiques — utiliser des lueurs radiales ou du bloom
- Ne pas utiliser d'animations nerveuses et rapides — tout mouvement doit être fluide
```

Les titres de section (`## Overview`, `## Colors`…) peuvent rester en anglais : ce sont des repères
stables pour les outils et les autres skills. Le contenu, lui, peut être en français.

## Règles

- Utilise les **valeurs HEX exactes** de tokens.json. N'approxime pas.
- Nomme les composants d'après ce que tu vois sur la capture, pas avec des termes génériques.
- Reste sous 100 lignes. C'est un aide-mémoire, pas un document de design system.
- Pas de section « Style Prompt » — le storyboard gère la direction créative.
- Pas de section « Assets » — `asset-descriptions.md` couvre déjà ça.
- Pas de section « Motion » — le storyboard précise le mouvement par temps fort.

## Exemple

Voici un vrai DESIGN.md issu d'une capture de production (Soulscape 2026) :

```markdown
# Design System

## Overview

Soulscape 2026 est une expérience numérique cinématographique à « signal fort », qui se positionne comme l'avant-garde du cinéma par IA. La personnalité visuelle est sombre, technique et premium, avec une esthétique très contrastée de « Flare » sur « Void » (blanc sur noir). La mise en page est dense mais organisée, avec de fortes superpositions horizontales et des sections délimitées par des bordures qui évoquent un format cinéma en grand écran. Le mouvement est un principe central : grain atmosphérique, fuites de lumière changeantes et bandeaux lents créent une texture qui respire en permanence.

## Colors

- **Surface principale** : `#020204` (Void) - Noir profond pour tout le fond.
- **Contenu principal** : `#FFFFFF` (Flare) - Blanc très pur pour la typographie et les bordures principales.
- **Accent 1 (chaud)** : `#FB923C` - Orange pour les niveaux industrie/direction et les principaux appels à l'action.
- **Accent 2 (froid)** : `#60A5FA` - Bleu pour les voix créatives et les composants liés au sommet.
- **Superpositions discrètes** : de `rgba(255, 255, 255, 0.02)` à `0.08` pour les fonds en verre.

## Typography

- **Serif** : Cormorant Garamond (italique). Grands titres et identité de marque « Soul ». Contraste cinématographique classique.
- **Monospace** : Geist Mono. Sous-titres, étiquettes, relevés de terminal. Interlettrage élevé (0,1-0,3em), tout en capitales.
- **Sans-serif** : Inter. Texte courant et éléments d'interface. Petites tailles (9-14 px).

## Elevation

- **Verre dépoli** : les composants utilisent backdrop-filter blur(10px) avec des bordures fines (1px solid rgba(255, 255, 255, 0.08)).
- **Superposition** : la profondeur vient d'un grain global fixe et de fuites de lumière en dégradés localisés plutôt que d'ombres.
- **Interaction** : le survol déclenche un léger translateY(-5px) et une bordure plus opaque.

## Components

- **Accordéon cinématographique** : système de cartes horizontales/verticales qui se déploient d'un état compressé pour révéler des images plein cadre et une grande typographie serif.
- **Explorateur HUD** : bouton de navigation mobile flottant façon « objectif », avec une lueur qui pulse et des relevés de terminal.
- **Bandeaux lents** : défilants horizontaux continus pour les logos partenaires et les listes d'intervenants.
- **Cartes en verre** : conteneurs avec dégradés discrets, coins arrondis (2.5rem) et iconographie très contrastée.
- **Grain et scintillement** : filtres de bruit CSS globaux et animations de scintillement holographique sur les étiquettes d'interface.

## Do's and Don'ts

### À faire

- Utiliser des bordures fines et discrètes (blanc/10) pour séparer les sections plutôt que des changements de couleur unie.
- Garder un interlettrage élevé sur toutes les étiquettes en Geist Mono.
- Utiliser la serif italique pour les affirmations émotionnelles ou visionnaires.
- Garder les images désaturées ou stylisées avec des dégradés sombres pour la lisibilité.

### À éviter

- Ne pas utiliser de fonds unis aux couleurs vives — la page doit rester dans « The Void ».
- Ne pas utiliser d'ombres portées classiques — utiliser des lueurs radiales ou du bloom.
- Ne pas utiliser d'animations nerveuses et rapides — tout mouvement doit être fluide et respirer.
```

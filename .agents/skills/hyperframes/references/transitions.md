# Transitions de scène

Une transition dit au spectateur comment deux scènes sont liées. Un fondu enchaîné dit « ça continue ».
Une poussée latérale dit « point suivant ». Un fondu flou dit « laisse-toi porter ». Choisis des
transitions qui correspondent à ce que fait le contenu sur le plan émotionnel, pas seulement technique.

## Règles d'animation des compositions à plusieurs scènes

Elles ne se négocient pas, pour chaque composition à plusieurs scènes :

1. **Chaque composition utilise des transitions.** Sans exception. Des scènes sans transitions font l'effet de jump cuts.
2. **Chaque scène utilise des animations d'entrée.** Les éléments entrent via `gsap.from()` — opacité, position, échelle, etc. Aucune scène ne doit apparaître d'un coup, déjà formée.
3. **Les animations de sortie sont INTERDITES**, sauf sur la dernière scène. N'utilise PAS `gsap.to()` pour faire sortir les éléments avant qu'une transition ne se déclenche. La transition EST la sortie. Le contenu de la scène sortante doit être entièrement visible quand la transition commence — c'est la transition qui gère le passage de relais visuel.
4. **Exception de la dernière scène :** la dernière scène PEUT faire disparaître des éléments en fondu (par ex. fondu au noir à la fin de la composition). C'est la seule scène où les animations de sortie sont autorisées.

## Énergie → transition principale

| Énergie                                         | CSS principale                     | Shader principal                        | Accent                                | Durée      | Courbe                 |
| ----------------------------------------------- | ---------------------------------- | --------------------------------------- | ------------------------------------- | ---------- | ---------------------- |
| **Calme** (bien-être, histoire de marque, luxe) | Fondu flou, bascule de mise au point | Cross-warp morph, thermal distortion   | Fuite de lumière, iris circulaire     | 0,5-0,8 s  | `sine.inOut`, `power1` |
| **Moyenne** (corporate, SaaS, explicatif)       | Poussée latérale, blocs décalés    | Whip pan, cinematic zoom                | Compression, poussée verticale        | 0,3-0,5 s  | `power2`, `power3`     |
| **Forte** (promos, sport, musique, lancement)   | Zoom à travers, surexposition      | Ridged burn, glitch, séparation chromatique | Blocs décalés, chute par gravité  | 0,15-0,3 s | `power4`, `expo`       |

Choisis UNE transition principale (60 à 70 % des changements de scène) + 1 ou 2 accents. N'utilise
jamais une transition différente pour chaque scène.

## Ambiance → type de transition

Pense à ce que la transition _communique_, pas seulement à son apparence.

| Ambiance                       | Transitions                                                                                                                                       | Pourquoi ça marche                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Chaleureuse / accueillante** | Fuite de lumière, fondu flou, bascule de mise au point, brûlure de pellicule · **Shader :** thermal distortion, light leak, cross-warp morph       | Bords doux, voiles de couleur chaude. Rien de tranchant ni de mécanique.                        |
| **Froide / clinique**          | Compression, zoom arrière, stores, obturateur, dissolution en grille · **Shader :** gravitational lens                                             | Le contenu se transforme mécaniquement — compressé, réduit, tranché, quadrillé.                 |
| **Éditoriale / magazine**      | Poussée latérale, poussée verticale, découpe en diagonale, obturateur · **Shader :** whip pan                                                      | Comme tourner une page ou découper une mise en page. Un mouvement directionnel propre.          |
| **Tech / futuriste**           | Dissolution en grille, blocs décalés, stores, aberration chromatique · **Shader :** glitch, chromatic split                                        | La dissolution en grille est la transition « données » de base. Le glitch en shader ajoute postérisation + lignes de balayage. |
| **Tendue / nerveuse**          | Glitch, VHS, aberration chromatique, ondulation · **Shader :** ridged burn, glitch, domain warp                                                    | Instabilité, distorsion, panne numérique. Le ridged burn ajoute des bords nets en éclair.       |
| **Ludique / fun**              | Poussée élastique, retournement 3D, iris circulaire, cercle qui se transforme, volet d'horloge · **Shader :** ripple waves, swirl vortex          | Dépassement, rebond, rotation, expansion. Le swirl vortex ajoute une distorsion en spirale organique. |
| **Dramatique / cinéma**        | Zoom à travers, zoom arrière, chute par gravité, surexposition, plongée au noir · **Shader :** cinematic zoom, gravitational lens, domain warp     | Échelle, poids, extrêmes de lumière. Les shaders ajoutent de la profondeur pixel par pixel.      |
| **Premium / luxe**             | Bascule de mise au point, fondu flou, plongée au noir · **Shader :** cross-warp morph, thermal distortion                                         | Retenue. Le cross-warp morph fait couler les deux scènes l'une dans l'autre de façon organique. |
| **Rétro / analogique**         | Brûlure de pellicule, fuite de lumière, VHS, volet d'horloge · **Shader :** light leak                                                            | Imperfection organique. Bavures de couleur chaude, décalage de lignes de balayage.              |

## Position dans le récit

| Position                     | À utiliser                                                                   | Pourquoi                                                          |
| ---------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Ouverture**                | Ta transition la plus distinctive. Accordée à l'ambiance. 0,4-0,6 s          | Elle pose le langage visuel de toute la pièce.                    |
| **Entre deux points liés**   | Ta transition principale. Cohérente. 0,3 s                                   | Ne distrais pas — le contenu continue.                            |
| **Changement de sujet**      | Quelque chose de différent de la principale. Blocs décalés, obturateur, compression. | Signale « nouvelle section » — le cerveau du spectateur se réinitialise. |
| **Sommet / révélation héros** | Ton accent le plus audacieux. Le plus rapide ou le plus spectaculaire.      | C'est la récompense — dépense ici ta meilleure transition.        |
| **Retombée**                 | Retour à la douceur. Fondu flou, fondu enchaîné. 0,5-0,7 s                   | Laisse le spectateur souffler après le sommet.                    |
| **Fin**                      | La plus lente, la plus simple. Fondu enchaîné, plongée au noir. 0,6-1,0 s    | Une clôture. N'introduis pas de nouvelle énergie à la fin.        |

## Intensité du flou selon l'énergie

| Énergie     | Flou     | Durée      | Tenue au pic |
| ----------- | -------- | ---------- | ------------ |
| **Calme**   | 20-30 px | 0,8-1,2 s  | 0,3-0,5 s    |
| **Moyenne** | 8-15 px  | 0,4-0,6 s  | 0,1-0,2 s    |
| **Forte**   | 3-6 px   | 0,2-0,3 s  | 0 s          |

## Préréglages

| Préréglage | Durée  | Courbe              |
| ---------- | ------ | ------------------- |
| `snappy`   | 0,2 s  | `power4.inOut`      |
| `smooth`   | 0,4 s  | `power2.inOut`      |
| `gentle`   | 0,6 s  | `sine.inOut`        |
| `dramatic` | 0,5 s  | `power3.in` → out   |
| `instant`  | 0,15 s | `expo.inOut`        |
| `luxe`     | 0,7 s  | `power1.inOut`      |

## Implémentation

Lis [transitions/catalog.md](transitions/catalog.md) pour le code GSAP et les règles dures de chaque type de transition.

| Catégorie           | CSS                                                                       | Shader (WebGL)                                                            |
| ------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Poussée/glissade    | Poussée latérale, poussée verticale, poussée élastique, compression      | Whip pan                                                                  |
| Échelle/zoom        | Zoom à travers, zoom arrière, chute par gravité, retournement 3D          | Cinematic zoom, gravitational lens                                        |
| Révélation/masque   | Iris circulaire, iris en losange, découpe en diagonale, volet d'horloge, obturateur | SDF iris                                                        |
| Dissolution         | Fondu enchaîné, fondu flou, bascule de mise au point, plongée de couleur  | Cross-warp morph, domain warp                                             |
| Recouvrement        | Blocs décalés, stores horizontaux, stores verticaux                      | —                                                                         |
| Lumière             | Fuite de lumière, brûlure par surexposition, brûlure de pellicule        | Light leak (shader), thermal distortion                                   |
| Distorsion          | Glitch, aberration chromatique, ondulation, bande VHS                    | Glitch (shader), chromatic split, ridged burn, ripple waves, swirl vortex |
| Motif               | Dissolution en grille, cercle qui se transforme                          | —                                                                         |

## Les transitions qui ne marchent pas en CSS

À éviter : iris en étoile, tilt-shift, reflet d'objectif (lens flare), charnière/porte. Voir catalog.md pour les raisons.

## CSS ou shader

Les transitions CSS animent les conteneurs de scène avec l'opacité, les transformations, clip-path
et les filtres. Les transitions en shader composent les textures des deux scènes pixel par pixel sur
un canvas WebGL — elles peuvent déformer, dissoudre et transformer d'une façon impossible en CSS.

**Les deux sont des options de premier plan.** Les shaders sont fournis par le paquet
`@hyperframes/shader-transitions` — importe-les depuis le paquet au lieu d'écrire du GLSL brut. Les
transitions CSS sont plus simples à mettre en place. Choisis selon l'effet voulu, pas selon la facilité.

Quand une composition utilise des transitions en shader, TOUTES ses transitions doivent être en
shader (le canvas WebGL remplace le changement de scène basé sur le DOM). Ne mélange pas transitions
CSS et shader dans la même composition.

## Règles CSS compatibles avec les shaders

Les transitions en shader capturent les scènes du DOM en textures WebGL via html2canvas. Le pipeline
de rendu du canvas 2D ne reproduit pas exactement le CSS. Suis ces règles pour éviter des artefacts
visibles aux limites des transitions :

1. **Pas de mot-clé `transparent` dans les dégradés.** Le canvas interpole `transparent` comme `rgba(0,0,0,0)` (noir à alpha nul), ce qui crée des franges sombres. Utilise toujours la couleur cible à alpha nul : `rgba(200,117,51,0)` et pas `transparent`.
2. **Pas de fonds en dégradé sur des éléments de moins de 4 px.** Le canvas ne reproduit pas le rendu des dégradés CSS sur des éléments de 1 ou 2 px. Utilise une `background-color` unie sur les fines lignes d'accent.
3. **Pas de variables CSS (`var()`) sur les éléments visibles pendant la capture.** html2canvas ne résout pas de façon fiable les propriétés personnalisées. Utilise des valeurs de couleur littérales dans les styles en ligne.
4. **Marque les éléments décoratifs non capturables avec `data-no-capture`.** La fonction de capture les ignore. Ils sont présents dans le DOM en direct mais absents de la texture du shader. À utiliser pour les éléments qui ne peuvent pas suivre les règles ci-dessus.
5. **Pas d'opacité de dégradé sous 0,15.** Les éléments en dégradé sous 10 % d'opacité se rendent différemment en canvas et en CSS. Monte à 0,15 ou plus, ou utilise une couleur unie de luminosité équivalente.
6. **Chaque div `.scene` doit avoir une `background-color` explicite, ET passer la même couleur en `bgColor` dans la configuration `init()`.** Le paquet capture les éléments de scène via html2canvas. La `background-color` CSS de `.scene` et la configuration `bgColor` doivent correspondre. Sans l'une ou l'autre, la texture se rend en noir.

Ces règles ne s'appliquent qu'aux compositions avec transitions en shader. Les compositions en CSS seul n'ont aucune restriction.

## Avertissement sur les motifs visuels

Évite les transitions qui créent des motifs géométriques répétitifs visibles — grilles de tuiles,
cellules hexagonales, tableaux de points uniformes, cercles de taches espacés régulièrement. Ça fait
bon marché et artificiel, quelles que soient les maths derrière. Le bruit organique (FBM, déformation
de domaine) est bien parce qu'il est irrégulier. La répétition géométrique est mauvaise parce que
l'œil voit tout de suite la grille.

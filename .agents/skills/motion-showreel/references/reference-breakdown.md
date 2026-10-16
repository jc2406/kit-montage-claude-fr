# Analyse de référence : le « CLAUDE / MOTION REEL » d'Opus 5.5

Source : un motion reel de 15 secondes réalisé par Opus 5.5 (septembre 2026).
1920x1080, 60 images/s, 15,06 s, 900 images. Analysé avec `scripts/analyze-reference.mjs` (planches
contact à 6 images/s, différence de luminance image par image, RMS audio et attaques).

## Faits mesurés

- **Tempo :** 128 BPM (temps = 0,469 s). Les attaques à 2,39, 2,86, 3,32, 4,25, 4,71, 5,20, 5,67, 6,13… sont exactement à un temps d'écart. Ancre de grille vers 0,51 s.
- **Les coupes franches tombent sur les temps :** 1,77 (flash), 4,23 (inversion), 7,50 (flash d'iris), 11,25, 11,73, 12,20, 12,43 (demi-temps), 12,67, 12,93 (demi-temps), 13,13. Chacune est à moins de 2 images d'une ligne de la grille.
- **Creux avant le drop :** l'audio passe d'environ −12 dB à −25 dB à 7,25 s, puis le flash d'iris frappe à 7,50 s. Un trou, un coup, au milieu.
- **Rythme de luminance (moyenne 0-255, toutes les 0,5 s) :** 11, 11, 14, 219, 212, 224, 190, 65, 48, 14, 17, 97, 98, 71, 22, 22, 21, 54, 46, 37, 223, 95, 109, 40, 22, 31, 32. Sombre, papier, sombre, saturé, bleu marine, papier, rafale saturée, noir. Les changements de chapitre inversent la valeur.
- **Niveau audio :** fond musical à environ −12 dB RMS du début à la fin. Pas de voix off. Fondu de sortie sur les 0,25 dernières secondes.

## Timeline

| Temps | Étiquette du HUD | Ce qui se passe | Transition de sortie |
|---|---|---|---|
| 0,00-1,78 | 01 Squash & Stretch (écrasement et étirement) | Un point rouge tombe sur une règle graduée et rebondit. Il s'étire dans la chute et s'écrase au contact, et une ellipse au sol ondule. Une ligne de rappel porte un relevé en direct (POS, SCL, VEL). | Le point s'étale en un laser rouge horizontal, le laser s'épanouit en blanc, et le blanc devient le papier du chapitre suivant. |
| 1,78-4,23 | 02 Kinetic Type (typographie cinétique) | Les lettres de « EVERY » tombent avec rebond et dépassement. « FRAME » reçoit un cadre de sélection rouge d'outil de design (W 929, H 282, SX 100.0%) et un curseur qui l'agrandit. « is a » arrive en serif italique rouge. Les lettres de « DECISION » se posent dans le désordre avec du flou de mouvement, puis le mot se répète en papier peint en contour. | Le papier peint pivote en bandes diagonales, certaines bandes se remplissent de rouge, et toute l'image s'inverse en noir sur un temps. |
| 4,23-5,30 | (suite du 02) | « DECISION » en blanc brille sur du noir. Ses lettres deviennent des points rouges une à une. | Les points forment une rangée de 8. |
| 5,30-7,40 | 03 Shape Language (langage des formes) | La rangée de points devient une grille plein cadre. Une vague rouge la parcourt, les cercles deviennent des carrés, les carrés des croix, les croix des triangles, et la caméra s'incline et avance dans la grille. | La grille plonge dans un iris d'objectif. |
| 7,40-9,30 | 04 Particle Systems (systèmes de particules) | Un anneau d'iris flashe (le drop), une explosion de particules rouges, blanches et bleues tourbillonne sur du bleu marine, puis se condense en un anneau fin. | L'anneau de particules se solidifie en tore chromé. |
| 9,30-11,25 | 05 Lookdev / SDF | Un tore chromé irisé s'incline, puis fusionne en douceur par SDF en blobs, puis en cube. Un relevé le suit (SDF, SMOOTH UNION, MORPH 0.000 à 1.994, IOR 1.40, ROUGH 0.02). | Le cube avance dans l'objectif. Coupe franche. |
| 11,25-11,73 | 06 Easing (courbe d'accélération) | Une courbe cubic-bezier(0.83, 0, 0.17, 1) sur papier. Une balle rouge la parcourt en laissant des fantômes en pelure d'oignon. | Coupe sur le temps. |
| 11,73-12,20 | Op Art | Rayures diagonales rouges et noires derrière une cible rayée bleu et blanc. | Coupe. |
| 12,20-12,43 | Glitch | « REEL » en blanc sur bleu électrique avec séparation RVB et décalage de tranches. | Coupe sur le demi-temps. |
| 12,43-12,67 | Isométrique | Champ de blocs isométriques bleus et blancs sur du rouge. | Coupe. |
| 12,67-12,93 | Symétrie | Un kaléidoscope de cercles rouges et bleus et de triangles blancs autour d'un anneau. | Volet du noir au bleu. |
| 12,93-13,13 | (bruit) | Un bruit de pixels rouges, bleus et blancs remplit l'image. | Le bruit se résout en nom de marque. |
| 13,13-15,06 | 07 Fin | « CLAUDE » se résout à partir du bruit avec du bloom. Une règle se trace dessous. « MOTION DESIGN » et « SHOWREEL 2026 » se tapent avec un curseur bloc rouge. Le point rouge tombe pour devenir le point final avec un écrasement et une ellipse au sol. L'accroche « EVERY FRAME WRITTEN IN CODE » apparaît en dernier, atténuée. | Tenue, puis fondu. |

## HUD persistant (sur chaque image)

- Repères de coupe dans les coins, branches de 30 px, en retrait d'environ 36 px.
- En haut à gauche : `CLAUDE  /  MOTION REEL`. En haut à droite : `● 1920×1080 · 60P · 128 BPM`. Le point clignote comme un voyant REC.
- En bas à gauche : timecode qui défile `TC 00:00:02:36`. En bas au centre : une règle graduée qui se remplit comme une barre de progression. En bas à droite : `02 · KINETIC TYPE` (le reel utilise un tiret entre le numéro et le nom).
- Monospace, tout en capitales, interlettrage d'environ 0,2em, environ 16 px, blanc à 85 % sur fond sombre ou encre à 85 % sur papier. Le HUD change de couleur avec le fond.
- Une légère grille de points couvre les images sombres.

## Pourquoi ça marche

1. **Un seul protagoniste, transformé.** Le point rouge est une balle, puis un laser, puis des lettres, des points, une grille, des particules, un anneau, un tore et un cube, et à la fin c'est le point final. Presque chaque transition transforme l'objet en cours en l'objet suivant. Le spectateur n'a jamais à se réorienter : 15 secondes paraissent une seule pensée continue.
2. **Le reel raconte son propre savoir-faire.** Les étiquettes de chapitre nomment la discipline à l'écran. Les incrustations d'outils (le relevé physique, le cadre de sélection avec un curseur, les paramètres SDF, une courbe de Bézier) montrent le travail derrière l'image. Ça se lit comme le reel d'un designer, pas comme une pub.
3. **Une petite palette, avec une couleur gardée en réserve.** L'encre, le papier et un seul rouge portent les 11 premières secondes. Le bleu électrique n'apparaît que dans la rafale du sommet, donc la nouvelle couleur fait l'effet du drop.
4. **La valeur s'inverse sur le temps.** Les changements de chapitre échangent sombre et clair, ou neutre et saturé. Le flash, l'inversion et les coupes d'iris sont les coups de poing, et ils tombent tous sur des lignes de la grille.
5. **Une courbe de coupe qui accélère, avec une fin tenue.** Les chapitres durent 1,8 s, 3,5 s (avec une inversion interne), 2,1 s, 1,9 s, 1,9 s. Puis six coupes arrivent en 1,9 s, espacées d'un temps puis d'un demi-temps, et un logo final de 1,9 s laisse l'œil se reposer. Soit environ 75 % de développement, 13 % de rafale et 12 % de résolution.
6. **La densité respire.** Un point, puis un mot, puis un mur de mots, une grille de 100, des milliers de particules, un objet, la rafale, et de nouveau un seul mot. Le peu et le beaucoup alternent.
7. **Trois voix typographiques.** Des capitales grotesques lourdes pour les affirmations, une serif italique rouge pour l'aparté humain, et une monospace très espacée pour la couche « machine ». Le texte sert aussi d'image : répété en papier peint, en bandes, inversé.
8. **Finition physique.** Écrasement et étirement, flou de mouvement sur les lettres rapides, bloom sur le blanc sur noir, légères franges chromatiques, grain, vignettage et un iris d'objectif. Ça paraît filmé, pas exporté.
9. **Des sauts d'échelle.** Point en macro, motif plein cadre, champ de particules cosmique, gros plan d'objet, et une poussée à travers l'objet vers la coupe suivante. Le mouvement de caméra devient le montage.
10. **Une boucle fermée.** Le premier objet revient comme ponctuation finale, et l'accroche arrive en dernier à faible opacité. La fin répond à l'ouverture.

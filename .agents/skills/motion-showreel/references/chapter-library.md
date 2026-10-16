# Bibliothèque de chapitres

Chaque entrée couvre la technique, la façon dont la référence l'a utilisée, comment la construire de
façon sûre au retour arrière dans HyperFrames (GSAP sur une seule timeline en pause) et des
équivalents pour d'autres marques. Choisis-en 5 à 7 et enchaîne-les pour que la transformation de
sortie de chacun soit la transformation d'entrée du suivant.

## Physique : écrasement et étirement
- **Référence :** un point rouge tombe sur une règle graduée et rebondit trois fois, avec une ellipse au sol et un relevé POS/SCL/VEL sur une ligne de rappel.
- **Construction :** anime le rebond à la main à partir de la feuille des temps (un contact sur chaque temps). La chute utilise `power2.in`, la remontée `power2.out`. Au contact, mets `scaleX 1.35 / scaleY 0.7` pendant 2 à 3 images, puis reviens en `elastic.out(1, 0.5)`. Pendant une chute rapide, étire jusqu'à `scaleY 1.3`. Calcule le texte du relevé dans un `onUpdate` à partir du `y` actuel du point et de sa vitesse (la différence avec l'image précédente), formaté avec une décimale.
- **Transformation de sortie :** le point accélère sur le côté pour devenir une ligne laser (`scaleX` jusqu'à 200, `height` 4 px, lueur), qui s'épanouit en flash plein cadre (un calque blanc à l'opacité 1 pendant 2 images), puis devient le papier du chapitre suivant.
- **Équivalents :** le point d'une barre de lecture vidéo (YouTube), un point de curseur (une appli SaaS), une goutte de liquide (une marque de boisson), une épingle (cartes).

## Typographie cinétique
- **Référence :** des lettres tombent dans le désordre avec dépassement et flou de mouvement. Un cadre de sélection rouge avec des chiffres W/H/SX et un curseur agrandit le mot. Un aparté en serif italique rouge répond à des capitales grotesques lourdes. Le mot clé se répète en papier peint en contour, qui passe en diagonale avec des bandes rouges, puis l'image s'inverse.
- **Construction :** découpe les mots en `<span>`. Décale `y: -120 -> 0` avec `back.out(2)`, avec 1 image d'écart dans un ordre mélangé. Simule le flou de mouvement en animant `filter: blur(6px) -> 0` en même temps qu'un étirement en `scaleY`. Pour le cadre de sélection, une div en position absolue avec 8 petites poignées suit la boîte du mot (lis la largeur une fois après `document.fonts.ready`) et un curseur SVG se déplace avec. Pour le papier peint, génère 12 lignes du mot avec `-webkit-text-stroke` (contour). Fais tourner le conteneur de −12 deg, fais glisser les lignes une sur deux dans des sens opposés et remplis 2 lignes avec l'accent. Pour l'inversion, un seul `tl.set` échange un calque de fond et les couleurs du texte sur le temps.
- **Équivalents :** une barre de recherche qui tape la phrase (YouTube, Google), un champ de chat (produits d'IA), une étiquette de prix, un titre tiré du premier slogan de la marque.

## Lettres → points → grille (langage des formes)
- **Référence :** les lettres de DECISION deviennent des points rouges une par une, les points s'alignent en une rangée de 8, et la rangée devient une grille plein cadre. Une vague rouge la parcourt, les cercles deviennent des carrés, puis des croix, puis des triangles, et la caméra s'incline et avance.
- **Construction :** une grille de div (par exemple 16x9) avec `border-radius`. La vague est une fonction du temps et de la distance à une origine : dans `onUpdate`, pour chaque cellule, `phase = t*speed - dist`, puis fixe son échelle, son mélange de couleur et son arrondi à partir de `phase`. C'est sûr au retour arrière parce que c'est une pure fonction de `t`. Les transformations de forme sont un `border-radius` de 50 % à 8 % et un polygone `clip-path`. La caméra est un parent avec `perspective` et `rotateX`/`rotateZ`.
- **Équivalents :** une grille de miniatures 16:9 (YouTube) avec de vraies images qui apparaissent dans les cellules, des icônes d'applis, des références produit, une mosaïque de pixels du logo.

## Système de particules
- **Référence :** un iris d'objectif flashe sur le drop du milieu, des particules rouges, blanches et bleues jaillissent sur du bleu marine, tourbillonnent et se condensent en anneau.
- **Construction :** un seul `<canvas>` de 2 000 à 4 000 particules. Précalcule des positions de départ et des cibles à graine (n'importe quelle forme : un anneau, un logo à partir de pixels échantillonnés d'une image, un chiffre). Dessine chaque particule à partir de `lerp(start, target, ease(clamp((t - t0)/d - delay_i)))` plus un décalage en boucle `sin(i*1.7 + t*3)*amp*(1 - progress)`. Redessine dans le `onUpdate` d'une animation proxy pour que l'image soit une pure fonction de `tl.time()`. Utilise un mélange additif (`globalCompositeOperation = 'lighter'`) pour la lueur.
- **Transformation de sortie :** les particules se condensent dans la silhouette de l'objet héros du chapitre suivant, puis le vrai objet apparaît en fondu en 2 à 3 images autour d'un flash.
- **Équivalents :** une explosion de bouton « j'aime » (réseaux sociaux), des confettis aux couleurs des produits, des points de données, des étoiles.

## Lookdev / objet héros
- **Référence :** un tore chromé irisé se transforme par SDF en blobs puis en cube, avec un relevé de paramètres (SDF, SMOOTH UNION, MORPH, IOR, ROUGH), et avance dans l'objectif.
- **Construction :** une image photoréaliste générée (Seedream image vers image à partir du logo) plus un mouvement de caméra Kling, accéléré d'environ 3 fois et réencodé en 60 images/s tout en intra. Pour une deuxième matière, coupe ou fais un fondu vers une autre matière du même objet (laque vers chrome, argent vers or). Mets un relevé sur une ligne de rappel avec des chiffres qui défilent dans `onUpdate`. La poussée de sortie est `scale 1 -> 3` plus `blur 0 -> 20px` sur le dernier demi-temps, avec une coupe franche sur le temps.
- **Équivalents :** une plaque de récompense de créateur (YouTube), une bouteille ou une canette, un appareil, une sculpture du logo.

## Courbe d'accélération
- **Référence :** une courbe cubic-bezier(0.83, 0, 0.17, 1) sur papier, avec une balle qui la parcourt en laissant des images fantômes en pelure d'oignon.
- **Construction :** un tracé SVG qui se dessine avec `stroke-dasharray`. La position de la balle vient de l'évaluation de la courbe de Bézier à `ease(t)`, et les fantômes sont 8 copies à des temps antérieurs avec une opacité décroissante.
- **Équivalents :** une courbe de croissance d'un indicateur de la marque, une courbe de vitesse de lecture.

## Rafale (4 temps, environ 6 coupes)
- **Référence :** Accélération, puis Op Art (rayures + cible), Glitch (« REEL » en séparation RVB), Blocs isométriques, Symétrie (kaléidoscope) et bruit de pixels, coupés sur les temps puis sur les demi-temps, avec l'arrivée du bleu gardé en réserve.
- **Construction :** chaque coupe est un calque plein cadre affiché par `tl.set` sur son temps de grille, avec un seul mouvement interne (une rotation, une glissade, un saut d'échelle ou un bégaiement). Le glitch utilise 3 copies du texte (rouge, cyan et blanc) décalées de quelques px avec `mix-blend-mode: screen`, plus 4 à 6 tranches horizontales (`clip-path: inset()`) qui tremblent une image sur deux. Le bruit est un canvas de gros pixels aux couleurs de la marque, à graine par image.
- **Équivalents :** chaque image de la rafale est un moment d'interface emblématique de la marque en plein cadre (YouTube : clic sur S'abonner, un balayage de Shorts, un badge LIVE, Ignorer l'annonce, un double tap +10 s, un badge 4K/HD).

## Logo final (carte de fin)
- **Référence :** le nom de marque se résout à partir du bruit avec du bloom, une règle se trace dessous, deux sous-titres en monospace se tapent avec un curseur bloc rouge, le motif se pose comme le point final avec un écrasement et une ellipse au sol, et l'accroche apparaît en dernier, à faible opacité.
- **Construction :** le canvas de bruit s'efface pendant que `filter: blur(20px) -> 0` et l'`opacity` du nom de marque montent sur 12 images, et le bloom est un `text-shadow` ou un `drop-shadow`. La règle est un `scaleX 0 -> 1` depuis la gauche. Pour la frappe, révèle les caractères avec une animation `steps()` sur un masque de largeur, ou un `tl.set` par caractère, et un bloc qui clignote avec des `tl.set` qui basculent toutes les 16 images. La chute du motif réutilise les clés de contact du chapitre physique.
- **Équivalents :** le motif devient un élément du logo lui-même (un point de lecture devient le bouton de lecture, un point devient le point du i, une goutte devient le O).

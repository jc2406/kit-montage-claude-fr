---
name: motion-showreel
description: Concevoir et construire un showreel motion design ou un reel de marque de 10 à 30 secondes dans le style du « CLAUDE / MOTION REEL » Opus 5.5 de Nate : un motif de marque transformé à travers des chapitres de savoir-faire étiquetés, un HUD persistant, des coupes calées sur une grille de 120 à 130 BPM, une rafale de moins d'une seconde et un logo final tenu qui répond à l'ouverture. À utiliser quand on demande un showreel, un sizzle reel, un reel de marque, un motion reel, « un reel comme celui d'Opus », « montrer du motion design pour <marque> », un film de marque de 15 secondes monté sur la musique, ou pour étudier pourquoi un reel de référence fonctionne et reconstruire cette énergie pour une autre marque.
---

# Showreel motion design

Un showreel promet que chaque image a été une décision. Ce skill en fait une construction
reproductible : choisir un motif, le faire passer par six ou sept chapitres de savoir-faire qui ne
se ressemblent pas du tout, couper sur le beat et finir sur le motif.

La source du style est [l'analyse de référence](references/reference-breakdown.md), une analyse
mesurée seconde par seconde du reel à partir duquel ce skill a été construit. Lis-la d'abord.
Les techniques par chapitre sont dans [la bibliothèque de chapitres](references/chapter-library.md).

## La grammaire

1. **Un motif, transformé.** Choisis l'élément le plus épuré de la marque (un point, un triangle de
   lecture, une lettre, un coin du logo). Il ouvre le reel, devient la matière de chaque chapitre et
   ferme le reel comme ponctuation du logo final. Presque chaque transition transforme l'objet en
   cours en l'objet suivant. Les coupes franches sont réservées à la rafale.
2. **Des chapitres de savoir-faire étiquetés.** Six ou sept, chacun nommé dans le HUD par la
   discipline qu'il démontre (`01 · ÉCRASEMENT ET ÉTIREMENT`). Utilise les mots de la marque quand
   elle en a (YouTube a des « chapitres » et un « écran de fin »).
3. **Montrer le travail.** Chaque chapitre a une incrustation d'outil : un relevé physique, un cadre
   de sélection avec un curseur, un panneau de paramètres, une courbe de Bézier, ou un équivalent
   propre à la marque (une barre de recherche, un compteur, un menu de réglages).
4. **HUD persistant.** Repères de coupe dans les coins, une ligne de titre en haut à gauche, une
   ligne de caractéristiques en haut à droite (`1920×1080 · 60P · 129 BPM`, point qui clignote),
   timecode en bas à gauche, une règle de progression avec les écarts de chapitres en bas au centre,
   et l'étiquette de chapitre en bas à droite. Capitales monospace, interlettrage de 0,2em, environ
   16 px. Il inverse encre/papier selon le fond. Pars du [modèle de HUD](templates/hud.html).
5. **Encre, papier, un accent et une couleur gardée en réserve.** La couleur en réserve n'apparaît
   que dans la rafale du sommet. Chaque changement de chapitre inverse la valeur (sombre/clair) ou la
   saturation (neutre / accent plein cadre).
6. **Couper sur le beat, animer sur les contretemps.** 120 à 130 BPM. Chaque coupe franche, flash et
   inversion tombe à moins de 2 images d'une ligne de la grille. Un trou avant le drop (musique
   baissée pendant un demi-temps) précède le coup du milieu.
7. **Accélérer, puis tenir.** Pour 15 s à environ 129 BPM (32 temps) : intro physique sur 4 temps,
   chapitre typo sur 8 temps avec une inversion interne, trois chapitres de 4 temps (drop au milieu),
   une rafale d'environ 6 coupes en 4 temps (un temps chacune, puis des demi-temps), puis environ
   4 temps de logo final. En gros 75 % de développement, 13 % de rafale et 12 % de résolution.
8. **La densité respire.** Un objet, puis un mur de texte, une grille de 100, des milliers de
   particules, un objet héros, la rafale, et de nouveau un seul mot.
9. **Trois voix typographiques.** Une police de titre lourde pour les affirmations, une voix d'accent
   contrastée (une serif italique, ou la police d'interface de la marque), et une monospace très
   espacée pour la couche « machine ». Le texte sert aussi de texture : répété en papier peint, en
   bandes, inversé.
10. **Finition physique.** Écrasement et étirement, flou de mouvement sur les mouvements rapides,
    bloom sur la lumière sur fond sombre, légère frange chromatique, grain, vignettage et grille de
    points sur les images sombres. Ça doit avoir l'air photographié, pas exporté.
11. **Fermer la boucle.** Le logo final se résout à partir du bruit, une règle se trace, les
    sous-titres se tapent avec un curseur bloc, le motif se pose comme ponctuation finale avec un
    écrasement, et une accroche discrète arrive en dernier.

## Déroulé

Lance les scripts depuis la racine du kit. Ils demandent Node 22+ et FFmpeg avec ffprobe.

### 1. Étudier la référence (quand il y en a une)

```sh
node .claude/skills/motion-showreel/scripts/analyze-reference.mjs chemin/vers/reference.mp4 video-projects/mon-reel/qa/reference --fps 6 --bpm 128
```

Lis chaque planche contact, puis `report.txt` (coupes, rythme de luminance, RMS, attaques et
décalages des coupes par rapport au beat). Écris la timeline sous la forme de l'analyse de référence.

### 2. Recueil de la marque : `BRAND.md`

Recueille les couleurs exactes (depuis le fichier du logo actuel, pas un article de blog), la
typographie (la police propriétaire plus le substitut gratuit le plus proche), les SVG officiels
du logo, l'interface et les objets emblématiques, et 3 à 5 faits vérifiés et datés pour la
typographie cinétique. Rassemble de vraies images que l'utilisateur possède ou peut utiliser.
Choisis le motif et la couleur du sommet gardée en réserve. N'utilise que des marques que
l'utilisateur a le droit d'utiliser pour l'usage prévu.

### 3. Carte des chapitres : `STORYBOARD.md`

Crée le projet avec `npm run new-video -- mon-reel`, puis remplis
[le modèle de storyboard](templates/storyboard.md). Pour chaque chapitre, note l'étiquette de
discipline, l'objet propre à la marque, l'incrustation d'outil, la transformation d'entrée, la
transformation de sortie, la valeur (sombre/papier/accent) et les bruitages. Avant de construire :

- Fige mentalement n'importe quelle image : se lit-elle comme la marque avec le HUD caché ?
- Chaque transition transforme-t-elle l'objet, à part les coupes de la rafale ?
- La valeur s'inverse-t-elle à chaque changement de chapitre ?

### 4. Musique et grille rythmique

Lis d'abord `docs/TOOLS-AND-API-KEYS.md`. La musique peut être un morceau sous licence de
l'utilisateur ou générée. La génération est un appel payant : demande confirmation avant de la lancer :

```sh
node .claude/skills/motion-showreel/scripts/kie.mjs music --title "Reel" --style "punchy electronic showreel, instrumental, 128 bpm, starts instantly, riser into a big drop" --out video-projects/mon-reel/assets/audio
node .claude/skills/motion-showreel/scripts/music-grid.mjs video-projects/mon-reel/assets/audio/take-0.mp3 --bpm 128 --beats
```

(Le prompt de style reste en anglais : les générateurs de musique le comprennent mieux.)

`music-grid` affiche la période, la **phase de la bande du kick** (c'est elle qu'il faut utiliser) et
l'énergie par mesure et par temps. La phase sur toute la bande peut se caler sur des charlestons en
contretemps et mettre chaque raccord un demi-temps en retard ; le script prévient quand les deux ne
concordent pas. Dans la colonne des graves par temps, repère la montée, le drop (un saut de 10 dB ou
plus), le break et le retour. Puis assemble 32 temps : intro et montée (16, finissant sur le premier
temps du drop), drop (8), break (4, sous la rafale), et le coup du retour plus une queue :

```sh
node .claude/skills/motion-showreel/scripts/splice-music.mjs take-0.mp3 --period 0.4644 --phase 0.085 --segments "4-28,48-56.7" --length 15 --gap 16 --out music-bed.wav
node .claude/skills/motion-showreel/scripts/music-grid.mjs music-bed.wav --bpm 129
node .claude/skills/motion-showreel/scripts/beatgrid.mjs --period 0.4644 --length 15 --chapters "01 Physique:4, 02 Typo:8, 03 Grille:4, 04 Drop:4, 05 Lookdev:4, Rafale:4, 07 Fin:rest"
```

La phase du kick du fond remesuré doit être à environ 25 ms de 0. Mets le BPM mesuré dans le HUD
(129, pas 128). `beatgrid` affiche la feuille d'images pour `STORYBOARD.md`.

### 5. Bruitages et mixage

Génère un kit (payant, demande confirmation d'abord) avec `scripts/sfx.mjs` (pops, clics, whooshes,
glitch, tic-tac, scintillement, boom grave, coup final et sons propres à la marque), ou utilise la
bibliothèque de l'utilisateur. Place les sons sur la feuille des temps dans un `events.json` et prémixe :

```sh
node .claude/skills/motion-showreel/scripts/mix.mjs --bed music-bed.wav --events events.json --out master.wav
```

Utilise `master.wav` comme unique piste `<audio>` de la composition. Il vise −14 LUFS et −1,2 dBTP.

### 6. Médias

- **Objet héros en lookdev.** Lance `kie.mjs image --ref <logo.png>` (l'image vers image de Seedream
  garde la silhouette), puis `kie.mjs video --image <image-fixe>` pour un mouvement de caméra Kling de
  5 s. Les deux sont des appels payants. Kling rend en 24 images/s : accélère et réencode en 60 images/s
  tout en intra (la commande est dans l'en-tête de `kie.mjs`).
- **Polices.** Télécharge-les dans `assets/fonts/` du projet et utilise `@font-face`. Ne compte
  jamais sur les polices système.

### 7. Construire (HyperFrames)

Charge `hyperframes` et `gsap` avant d'écrire du HTML. Lis `MOTION_PHILOSOPHY.md` (le rythme d'un
showreel correspond à son mode « sizzle » rapide) et `video-storytelling` pour les mouvements de
caméra dans un univers persistant. Construis un seul `index.html` avec une seule timeline GSAP en
pause. Les chapitres sont des calques `.clip` temporisés, et le HUD est au-dessus.

- Chaque temps vient de la feuille des temps : `const B = (n) => n * PERIOD`.
- Mets un **pilote image par image** sur la timeline et fais-en une pure fonction du temps :
  `tl.fromTo(drv, {t:0}, {t:END, duration:END, ease:'none', onUpdate:() => frame(drv.t)}, 0)`.
  Dessine-y les effets canvas (particules, bruit, grandes grilles) à partir de valeurs à graine,
  jamais avec `Math.random()` au moment du dessin. Pilote le HUD avec la même fonction.
- N'anime que les transformations et l'opacité. N'anime jamais `left/top/width/height`. Pour
  transformer un point en tuile, dessine la tuile finale et réduis-la en cercle
  (`border-radius: 128px / 72px` sur une tuile de 256x144), puis ramène-la à l'échelle 1.
- Une propriété animée par plusieurs animations au fil du reel (un calque de flash partagé) peut
  rester bloquée lors d'un retour en arrière. Calcule-la plutôt dans le pilote image par image, et
  fais de même pour les changements de classe comme une inversion.
- Mesure la mise en page (`getBoundingClientRect`) une seule fois, au début de la construction,
  avant qu'une animation `immediateRender` n'applique une transformation. Ne mesure jamais dans `onUpdate`.
- Une `<video data-start>` ne doit pas être dans un `.clip` temporisé. Mets les vidéos dans un
  conteneur non temporisé, que tu peux quand même agrandir pour les zooms avant.
- Les phases décalées doivent finir avant leur coupe : fin la plus tardive = début + décalage
  maximal + durée. Vérifie-le sur papier, puis sur une bande de rendu.
- `background-clip: text` devient invisible à la capture. Utilise des remplissages unis et
  `text-shadow` pour le bloom.

### 8. Vérifier avant de dire que c'est fini

- `npx hyperframes lint`, puis l'aperçu Studio, puis un rendu brouillon (`hyperframes-cli`).
- Lance `analyze-reference.mjs` sur ton propre rendu avec `--bpm` et `--phase` : les décalages des
  coupes doivent être à environ 35 ms d'un temps ou d'un demi-temps, la luminance doit alterner par
  chapitre, et l'audio doit montrer le creux avant le drop.
- Extrais des bandes de 10 images autour de chaque transition et regarde-les. Les captures isolées
  ratent les calques bloqués ou fantômes :
  `ffmpeg -i render.mp4 -vf "select='between(n\,440\,449)',scale=384:-1,tile=layout=5x2" -frames:v 1 -fps_mode passthrough strip.png`
- Test de marque : prends 6 images au hasard. Chacune doit se lire comme la marque avec le HUD caché.
- Le volume est autour de −14 LUFS. HyperFrames réencode l'audio un peu plus bas : remultiplexe
  `master.wav` dans le rendu (voir l'en-tête de `mix.mjs`).
- Enregistre les preuves dans `VERIFY.md`.

## Exemple de brief

Le premier test du skill était un reel YouTube de 15 s : le point rouge de la barre de lecture
rebondit sur une barre de progression, se transforme en laser en parcourant la barre, tape
« broadcast yourself » dans une barre de recherche reconstruite, devient huit points, puis un fil de
vraies miniatures, et jaillit d'un bouton « j'aime » en particules qui écrivent un chiffre vérifié.
Il devient un bouton de lecture laqué et un Silver Creator Award, enchaîne une rafale de Subscribe,
Shorts, LIVE, Skip et « +10 secondes », et se pose comme l'icône de lecture du logo. Utilise-le comme
modèle pour associer les chapitres aux objets propres à une marque, pas comme un gabarit à copier.

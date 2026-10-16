# Étape 4 : Écrire le storyboard

**Avant d'écrire quoi que ce soit, relis entièrement ces fichiers :**

- **DESIGN.md** — ta palette, tes règles de polices, tes composants, tes à faire / à éviter. Chaque décision créative doit s'ancrer dans cette identité de marque. S'il dit « fonds blancs avec accent violet », prévois des scènes claires, pas des ambiances sombres.
- **`extracted/asset-descriptions.md`** — lis CHAQUE ligne. C'est ton menu de visuels disponibles. Chaque ligne décrit ce que montre vraiment l'image (par ex. « rubans translucides orange, rose et violet sur fond blanc » ou « un train à grande vitesse sous un ciel étoilé sombre »). Sers-toi de ces descriptions pour décider quels médias vont dans quel temps fort. Pour les médias que tu ne comprends pas d'après la description, regarde-les directement avant de les attribuer.
- **[techniques.md](techniques.md)** — 10 techniques visuelles (tracé de chemins SVG, art en Canvas 2D, 3D en CSS, typographie mot à mot, Lottie, composition vidéo, effet de frappe, polices variables, MotionPath, transitions en vitesse). Choisis-en 2 ou 3 par temps fort et précise-les dans le storyboard.

Le storyboard est le cap créatif. Il dit à l'ingénieur exactement quoi construire pour chaque temps
fort — ambiance, caméra, animations, transitions, médias, son. Écris-le comme si tu briefais un
motion designer qui n'a jamais vu le site.

Enregistre-le sous `STORYBOARD.md` dans le dossier du projet.

---

## Direction générale

Chaque STORYBOARD.md commence par des réglages généraux :

```markdown
**Format :** 1920×1080
**Audio :** voix off [fournisseur de synthèse vocale] + fond musical + bruitages
**Direction de la voix :** [caractère de la voix — par ex. « homme d'âge moyen, débit calme et assuré,
registre keynote Apple — économie de mots, le silence entre les phrases est une qualité »]
**Base du style :** DESIGN.md (couleurs, polices et composants de la marque, tirés du site capturé)
```

**Garde-fous généraux** (à adapter à la marque) :

- Pousse la présence de la couleur. Sourd, c'est acceptable ; plat, non. Chaque temps fort doit avoir au moins une couleur qui attire l'œil.
- Le mouvement doit être visible et voulu. Penche vers plus de mouvement que ce qui paraît prudent — le subtil se lit comme statique à 30 images/s.
- Utilise autant de médias capturés que la vision créative le permet. Disperse des icônes de frameworks autour d'un tableau de bord. Superpose des photos d'entreprise derrière des chiffres. Utilise des captures du produit comme cartes flottantes. Les médias existent — utilise-les généreusement.
- Vise 8 à 10 éléments visuels par temps fort, pas 2 ou 3. Un bon temps fort a : une texture de fond, du contenu au plan moyen, des accents au premier plan, des éléments décoratifs flottants, des icônes animées, des tracés SVG, des effets de particules, des détails typographiques. Il doit paraître DENSE et vivant.
- Utilise au moins 2 ou 3 techniques différentes de techniques.md par temps fort — pas sur toute la vidéo, par temps fort. Ne te contente pas de fondus, d'échelles et d'opacité de base — mélange tracés SVG, transformations 3D en CSS, effets de frappe, compteurs, art procédural en canvas. Chaque temps fort doit être son propre univers visuel.

**Direction du fond musical / de la musique** (le cas échéant) :

- Décris l'ambiance, des artistes de référence, quand ça monte ou retombe
- Exemple : « Électro minimaliste. Une nappe chaude tenue joue déjà quand la vidéo commence. Elle reste sous tout, sans jamais concurrencer la voix off. Monte doucement pendant la partie démonstration, retombe presque à rien pour la comparaison, se résout sur un accord final. »

---

## Audit des médias

Avant d'écrire le moindre temps fort, audite chaque média capturé. Affiche ce tableau :

| Média                          | Type          | Temps fort      | Rôle                                         |
| ------------------------------ | ------------- | --------------- | -------------------------------------------- |
| wave-fallback-desktop.png      | Image d'en-tête | Temps fort 1  | Fond animé plein cadre                       |
| enterprise-accordion-hertz.png | Photo         | Temps fort 3    | Crédibilité entreprise, panoramique Ken Burns |
| stripe-logo.svg                | SVG           | Temps forts 1, 5 | Logo d'ouverture + de fermeture             |
| datavizstatic3x.png            | Visualisation | Temps fort 3    | Visuel d'appui derrière les chiffres          |
| icon-3.svg                     | Icône         | IGNORER         | Décoratif, trop petit                        |

**Utilisation minimale :**

- Au moins 50 % des captures du produit et des images d'en-tête doivent apparaître
- Le logo de la marque apparaît dans le premier ET le dernier temps fort
- Le visuel signature du site (vague en dégradé, illustration d'en-tête, interface clé du produit) doit apparaître — c'est l'élément de marque le plus reconnaissable
- Au maximum 2 temps forts consécutifs en texte seul. Le 3e doit contenir un média visuel
- Le temps fort d'ouverture doit contenir un média visuel, pas seulement du texte

---

## Direction temps fort par temps fort

Chaque temps fort est un UNIVERS, pas une mise en page. Avant d'écrire des specs CSS et des
instructions GSAP, décris ce que le spectateur VIT. La différence entre un excellent storyboard et un
storyboard moyen :

**Moyen :** « Fond bleu marine sombre. "1,9 Md$" en blanc, 280 px. Logo en haut à gauche. Image de vague en bas à droite. »
**Excellent :** « La caméra est déjà en plein vol au-dessus d'une immense toile sombre. La vague en dégradé balaie le cadre comme une aurore boréale — vivante, changeante. "1,9 Md$" S'ÉCRASE avec une telle force que la vague ondule en réponse. Ce n'est pas une diapo — c'est un moment. »

Le premier décrit des pixels. Le second décrit une expérience. Écris le second, puis trouve les pixels.

Chaque temps fort doit avoir :

### Concept

La grande idée de ce temps fort en 2 ou 3 phrases. Dans quel UNIVERS visuel sommes-nous ? Quelle
métaphore le porte ? Que doit RESSENTIR le spectateur ? C'est la partie la plus importante — tout le
reste en découle.

### Repère de voix off

Quelle phrase de la narration joue sur ce temps fort.

### Description visuelle

Ce que voit le spectateur — décrit de façon cinématographique, pas en specs CSS. Utilise le langage
de la caméra (panoramique, zoom, dérive, se pose). Décris au moins 5 éléments visuels, pas seulement
du texte + un fond. Pense en couches — qu'est-ce qui bouge au premier plan, au plan moyen et au fond en même temps ?

### Direction d'ambiance

Des références culturelles et de design, pas des codes hex :

- « Géométrique, rythmé, précis. Pense à Josef Albers ou aux études de couleur du Bauhaus. »
- « Espace de travail chaleureux. Énergie de joli carnet, pas de plan technique. »
- « Générique de film. Le genre d'ouverture où l'on se penche en avant. »

### Médias

Quels fichiers capturés utiliser, cités par leur nom :

- « Fond : `assets/wave-fallback-desktop.png` — plein cadre, zoom lent de 1 à 1,04 sur la durée du temps fort »
- « Logo : `assets/svgs/stripe-logo.svg` — centré, apparaît en fondu à 0,5 s »
- « Photo entreprise : `assets/enterprise-accordion-hertz.png` — panoramique Ken Burns, voile à 70 % d'opacité »

### Chorégraphie des animations

Des verbes de mouvement précis par élément — pas « il s'anime » mais COMMENT :

| Énergie        | Verbes                                              | Exemple                                         |
| -------------- | --------------------------------------------------- | ----------------------------------------------- |
| Fort impact    | S'ÉCRASE, PERCUTE, FRAPPE, TAMPONNE, VOLE EN ÉCLATS | « 1,9 Md$ » S'ÉCRASE depuis la gauche à −5°     |
| Énergie moyenne | CASCADE, GLISSE, TOMBE, SE REMPLIT, SE TRACE        | Trois cartes arrivent EN CASCADE, décalées de 0,3 s |
| Faible énergie  | se tape, FLOTTE, se transforme, DÉFILE, apparaît en fondu | Le compteur DÉFILE de 0 à 135 000         |

Chaque élément reçoit un verbe. Si tu ne peux pas nommer le verbe, l'élément n'est pas encore conçu.

### Transition

Comment ce temps fort passe le relais au suivant. Précise le type et les paramètres.

**Transitions CSS** (à choisir dans `skills/hyperframes/references/transitions/catalog.md`) :

- Montée à vitesse raccordée : sortie `y:-150, blur:30px, 0.33s power2.in` → entrée `y:150→0, blur:30px→0, 1.0s power2.out`
- Panoramique fouetté : sortie `x:-400, blur:24px, 0.3s power3.in` → entrée `x:400→0, blur:24px→0, 0.3s power3.out`
- À travers le flou : sortie `blur:20px, 0.3s` → entrée `blur:20px→0, 0.25s power3.out`
- Zoom à travers : sortie `scale:1→1.2, blur:20px, 0.2s power3.in` → entrée `scale:0.75→1, blur:20px→0, 0.5s expo.out`
- Coupe franche / smash cut (pour les séquences en rafale)

**Transitions en shader** (à choisir dans `skills/hyperframes/references/transitions/shader-transitions.md`) :

- Cross-Warp Morph (organique, polyvalente) — 0,5-0,8 s, power2.inOut
- Cinematic Zoom (élan professionnel) — 0,4-0,6 s, power2.inOut
- Gravitational Lens (d'un autre monde) — 0,6-1,0 s, power2.inOut
- Glitch (agressive, très énergique) — 0,3-0,5 s
- Voir `skills/hyperframes/references/transitions/shader-setup.md` pour le code de base WebGL complet

**Comment fonctionnent les transitions CSS à vitesse raccordée :**
Fais sortir le temps fort sortant avec une courbe qui accélère (power2.in ou power3.in) plus une
montée de flou. Fais entrer le temps fort entrant avec une courbe qui ralentit (power2.out ou
power3.out) plus une disparition du flou. Le point le plus rapide des deux courbes se rejoint sur la
coupe — le spectateur perçoit un mouvement de caméra continu, pas deux animations séparées. Raccorde
la vitesse de sortie à la vitesse d'entrée à environ 5 % près.

### Couches de profondeur

Ce qu'il y a au premier plan, au plan moyen et au fond. Chaque temps fort doit avoir au moins 2 couches :

- « Fond : aplat bleu marine sombre + légère lueur radiale. Plan moyen : cartes de chiffres avec ombre portée. Premier plan : logo de la marque en bas à droite. »

### Repères de bruitages

Quel son à quel moment :

- « Sur l'impulsion de capture — un déclic d'obturateur analogique doux et chaud. »
- « Le côté gauche porte un léger bourdon grave. Au pliage : le bourdon coupe. Silence. Puis une seule note claire. »

---

## Architecture de production

Ajoute cette arborescence en bas du storyboard :

```
projet/
├── index.html                    racine — voix off + fond musical + orchestration des temps forts
├── DESIGN.md                     référence de marque (étape 2)
├── SCRIPT.md                     texte de la narration (étape 3)
├── STORYBOARD.md                 CE FICHIER — le cap créatif
├── transcript.json               horodatages par mot (étape 5)
├── narration.wav                 audio de synthèse vocale (étape 5)
├── captures/<nom>/               données du site capturé
└── compositions/
    ├── beat-1-hook.html
    ├── beat-2-features.html
    ├── ...
    └── captions.html
```

---

## Exemple : format temps fort par temps fort

Voici trois temps forts d'un storyboard de production, qui montrent le niveau de détail attendu.

### TEMPS FORT 1 — OUVERTURE À FROID (0:00–0:05)

**Voix off :** « Ton agent IA sait déjà faire des vidéos. »

**Concept :** Nous sommes déjà en mouvement quand la vidéo commence. Pas de carte de titre, pas de fondu depuis le noir. Nous sommes en plein vol au-dessus d'un espace de création infini — des dizaines de compositions vivantes éparpillées sous nous comme une ville vue d'un drone. Chacune est vivante et joue une animation différente. Le message est clair avant le moindre mot : cet outil fait des vidéos. Beaucoup.

**Visuel :** Lente dérive diagonale fluide au-dessus d'une immense toile (plan de 3600×2200 px). Éparpillées dessus : 25 cartes de composition à des angles naturels (rotation de ±5 à 15°), ombres douces, bordures fines. Chaque carte contient une animation DIFFÉRENTE en cours — typographie cinétique, transformation de dégradé, visualisation de données, système de particules, assemblage de logo, tracé SVG, bruit en shader, objet 3D qui tourne. Profondeur de champ : les cartes proches légèrement floues, le point net à mi-distance, les cartes lointaines plus petites et désaturées.

**Caméra :** Dérive diagonale du haut à gauche vers le bas à droite, légère rotation de 2 à 3° sur 5 s. Courbe power1.inOut. Le zoom accélère dans la dernière seconde à l'approche d'une carte précise.

**Médias :** Captures du produit et logo sur les cartes. Chaque carte est une mini-composition avec sa propre animation.

**Bruitages :** Une nappe chaude d'ambiance joue déjà. Un léger bourdonnement texturé — on entend de loin une activité créative.

---

### TEMPS FORT 5 — LA THÈSE (0:20–0:24)

**Voix off :** « Tout ce qu'un navigateur peut afficher peut devenir une image de ta vidéo. »

**Ambiance :** Grande affirmation. Cette phrase a sa propre toile. Propre, spacieuse, typographique.

**Visuel :** Les mots apparaissent en typographie cinétique décalée. « Tout ce qu'un navigateur peut afficher » — serif distinctive, fondu + montée douce (y: 24px → 0, opacité 0 → 1, 0,4 s, power2.out). Temps tenu — une seconde d'immobilité. « peut devenir une image de ta vidéo. » apparaît en dessous. Quand le dernier mot se pose, tout le texte pulse une fois — un bref flash chaud, une légère montée d'échelle à 101 %.

**Transition de SORTIE :** Panoramique fouetté vers la gauche — x:-400, blur:24px, opacity:0.4, 0.3s power3.in

**Bruitages :** Silence sous la première ligne. Sur l'impulsion de capture — un déclic d'obturateur analogique doux.

---

### TEMPS FORT 7 — LE CONTRASTE (0:38–0:44)

**Voix off :** « Aucun nouveau framework à apprendre pour l'agent. Juste du HTML. »

**Ambiance :** Comparaison propre. Base claire. Deux mondes côte à côte.

**Visuel :** Moitié gauche : du code dense, petit, compressé, écrasant. Il défile lentement vers le haut. Légèrement désaturé. Moitié droite : du HTML aéré, coloration syntaxique, interlignes généreux, accueillant. Sur « Juste du HTML. » — le côté gauche se replie vers son axe central, comme un livre qui se ferme. Le côté droit s'étend pour remplir le cadre. Une lueur chaude monte derrière.

**Transition d'ENTRÉE :** Zoom à travers — scale 0.75→1, blur 20px→0, 0.5s expo.out
**Transition de SORTIE :** Montée à vitesse raccordée — y:-150, blur:30px, 0.33s power2.in

**Médias :** Du vrai code de framework à gauche (contenu réel, pas de lorem ipsum). Du vrai HTML HyperFrames à droite.

**Bruitages :** Le côté gauche porte un léger bourdon grave. Au pliage : le bourdon coupe. Silence. Puis une seule note claire quand le côté droit s'étend.

---
name: video-storytelling
description: Concevoir et construire la couche visuelle d'une vidéo longue face caméra comme un seul univers persistant que la caméra traverse, au lieu d'une suite de graphismes séparés. À utiliser quand on demande de monter une vidéo, d'ajouter des motion graphics, de concevoir les visuels d'un script, de planifier un montage, ou de corriger un montage jugé confus, trop chargé en texte, difficile à suivre ou « clairement fait par une IA ». Couvre l'univers persistant, la grammaire de caméra, la règle du projecteur, les boucles ouvertes spatiales, la discipline des ornements et des tokens, le timing sur la transcription et les contrôles de vérification.
---

# Storytelling vidéo

Comment construire la couche visuelle d'une vidéo longue pour que le spectateur soit encore
orienté à la neuvième minute. S'applique à toute vidéo face caméra avec un script : une réaction à
l'actualité, une plongée dans un sujet, une comparaison, un tutoriel, un top.

L'échec que cette méthode remplace, c'est la pensée par scènes. Un nouveau graphisme toutes les
quelques secondes oblige le spectateur à recommencer à comprendre toutes les quelques secondes, et
aucun graphisme pris seul n'est en faute : c'est pour ça que le retour arrive sous la forme vague
« c'est confus » ou « il se passe trop de choses » plutôt que comme un défaut précis.

Pour une grille d'entraînement neutre, lis `docs/STORYTELLING-WORKBOOK.md` à la racine du dépôt.
Le design system réutilisable est dans `reference/design-system.md` de ce skill ; la géométrie
d'exemple d'une boucle ouverte est dans `reference/patterns/wall-of-slots/`. Aucune vidéo source
privée n'est nécessaire.

Ce n'est pas `hyperframes-video-beats`. Ce skill-là pose des cartes en incrustation sur un face
caméra. Celui-ci conçoit la chose dont la vidéo *parle*.

## 1 · Les quatre principes

### Un seul univers persistant

La vidéo vit dans un seul espace, qui ne se réinitialise jamais. Tout ce que le spectateur a déjà
vu existe encore là où il l'a laissé, et le nouveau contenu s'y ajoute au lieu de le remplacer. Un
élément, une fois dessiné, n'est jamais redessiné, déplacé ni renommé.

Tout le reste de ce skill en dépend. La caméra n'a nulle part où aller si l'espace change sans
cesse, un projecteur ne veut rien dire s'il n'y a rien d'autre à l'écran, et une boucle ouverte ne
peut pas rester ouverte dans un univers qui se réinitialise.

L'univers doit aussi valoir la peine qu'on y reste : décide donc de la grammaire spatiale avant de
construire quoi que ce soit, et tiens-la pendant toute la durée. Dans la construction de
référence : de gauche à droite, on va vers le résultat ; vers le haut, on va vers un humain, et
c'est la seule chose chaude à l'écran ; vers le bas, on entre dans un système d'enregistrement. Un
spectateur qui l'apprend dans les deux premières minutes lit gratuitement le reste de la vidéo.

Casse la grammaire exactement une fois, volontairement, pour le sens. Le seul mouvement de droite à
gauche en dix minutes dans la construction de référence est un ticket résolu qui repart dans la
file sur les mots « taux de réouverture ». Il passe sans un mot parce que la direction avait du
sens depuis trois minutes.

### La caméra, c'est le montage

Couper vers un nouveau graphisme coûte à chaque fois ses repères au spectateur. Se déplacer dans un
espace qui reste en place ne lui coûte rien. Un zoom avant se lit alors comme « regarde de plus
près la partie que tu comprends déjà », et le recul est le moment où le travail paie, parce que
tout ce qui a été construit est encore là.

Travaille sur trois altitudes et passe d'une altitude voisine à l'autre :

| Altitude | Montre | Sert à |
| --- | --- | --- |
| Univers | tout l'espace | s'orienter, les résolutions, « voilà où on en est » |
| Zone | la partie dont on parle | la plus grande partie de la durée |
| Détail | un seul élément | un chiffre, un changement d'état, une décision |

Sauter du détail à l'univers désoriente, sauf si c'est un temps fort de résolution voulu : c'est
alors le meilleur mouvement possible.

Des règles qui ont chacune coûté une reconstruction :

- **Nomme les cadrages comme des fenêtres exactes sur l'univers, pas comme des facteurs d'échelle.**
  Les bords de la fenêtre doivent tomber *entre* les étiquettes. Définir un cadrage par « échelle
  0,6 » coupe des mots en deux au bord du cadre.
- **Réutilise la même fenêtre pour le même usage.** Si le plan d'orientation est une certaine
  fenêtre, utilise toujours exactement celle-là. Des cadrages presque identiques se lisent comme
  une dérive.
- **Varie la durée selon la distance parcourue**, pas un réglage global unique.
- **Caméra et volets plein cadre s'enchaînent, ils ne se chevauchent jamais.** En même temps, ils
  guillotinent le contenu. La caméra d'abord, puis le volet.
- **Une couche de recouvrement devient opaque avant que la caméra bouge dessous.** Dans l'autre
  sens, une partie du mouvement est visible et se lit comme un jump cut.
- **Aucune étiquette à moins de 60 px du bord du cadre.** Un élément peut déborder et se lire comme
  « l'univers continue » ; un mot coupé au milieu d'une lettre se lit comme un bug. Règle-le par le
  placement, pas par un masque, car un fondu ne peut pas rattraper une lame qui file à environ 1800 px/s.
- **Deux mouvements successifs sur le même sujet se lisent comme un bug.** Un recadrage qui se
  termine PUIS un volet qui démarre, c'est un zoom, un arrêt net et un deuxième mouvement — le
  client appelle ça « un bug et une pause ». Fusionne-les en UN seul geste : courbe symétrique
  commune (power2.inOut), arrivée sur la même image, pour que le panneau se lise comme s'il poussait
  les images de côté. Dans le même esprit : les courbes qui partent fort (power3/4.out) sur un
  mouvement d'*images visibles* font environ 90 % du trajet au début puis rampent jusqu'à l'arrêt ;
  réserve-les aux entrées d'éléments, où ce ralenti se lit comme un élément qui se pose. (Ça a coûté
  une révision signalée par le client sur l'intro de l'exemple.)

### L'attention est un projecteur

**Exactement un élément en pleine lumière à chaque instant. Tout ce qui est déjà dessiné reste
discret mais lisible.** Ce n'est pas optionnel. C'est la règle qui permet à un univers d'accumuler
une douzaine d'éléments sans jamais paraître chargé, et c'est ce qui rend le recul lisible plutôt
qu'écrasant.

La hiérarchie vient du RAPPORT entre l'actif et le discret, jamais du fait de tout assombrir. Le
premier prototype de la construction de référence avait un pixel le plus clair à 101/255 et était
illisible en 960x540 ; la correction a été une encre plus claire, pas plus d'assombrissement.

| État | Luminance visée (Y, 16-235) | Opacité dans la référence |
| --- | ---: | ---: |
| Trait + étiquette actifs | 200-235 | 1.0 |
| Contexte, dessiné et encore pertinent | 120-150 | 0.56 |
| Épuisé, a dit ce qu'il avait à dire | 85-105 | 0.33 |
| Toute étiquette, tout état | jamais sous 90 | |

L'implémentation tient en une fonction, appelée à chaque temps fort de la narration avec les ID
dont on parle (`build_s01.py`, `lit()`) :

```python
def lit(t, active, warm=(), dur=0.5, floor=FLOOR):
    active = list(active) + [g + "-l" for g in active if g + "-l" in order]
    for gid in order:
        if gid not in opac:      # jamais dessiné : rien à éclairer
            continue
        tgt = 1.0 if gid in active else (WARM if gid in warm else floor)
        if gid not in active:
            tgt = min(tgt, MUTED.get(gid, 1.0))
        ...
```

Les détails qui portent tout :

- **Une étiquette hérite toujours de l'état de son élément** (l'intégration du suffixe `-l`). Un
  élément éclairé avec une étiquette illisible dessous est exactement le défaut à corriger.
- **Un accessoire qui a fini passe à l'opacité 0**, via un plafond `MUTED`, pas à 0,3. L'atténuer à
  0,3 laisse des confettis inexpliqués à l'écran pour le reste de la section. Règle du générateur :
  émets le `mute()` **avant** tout `lit()` qui commence plus tard, sinon l'atténuation est écrasée
  quand son animation se termine.
- **Les événements d'opacité doivent être émis dans l'ordre de la timeline**, sinon le suivi voit un
  état périmé et calcule la mauvaise cible. Garde une protection `seq()` qui lève une erreur en cas
  d'émission dans le désordre.
- **Une seule autorité d'opacité par élément et par fenêtre.** Deux animations actives en même
  temps qui poussent l'opacité d'un même élément vers des valeurs différentes rendent bien dans une
  section isolée mais clignotent à environ 10 Hz dans le montage assemblé, où l'animation gagnante
  alterne à chaque image. La construction de référence a livré ce défaut à chaque arrimage. Quand
  un balayage comme `lit()` chevauche un éclairage ou une atténuation explicites, l'animation qui
  commence le plus tard est la seule à piloter, et le balayage saute ces ID (`lit(..., skip=(...))`).
  Contrôle-le : cherche dans les rendus assemblés les sauts de luminance aller-retour d'une image
  dans chaque fenêtre de transition (`qa/v4/flicker/qa-flicker.mjs` dans la construction de référence).

### Les boucles ouvertes sont spatiales

Ne dis jamais « on y reviendra ». Laisse quelque chose de visiblement incomplet dans l'univers et
reviens-y. Une promesse que le spectateur voit est une promesse dont il sent qu'elle est en attente.

La mécanique est la même quelle que soit la forme :

1. **Plante-la dans l'accroche**, dans l'espace, sur la phrase qui fait la promesse.
2. **Remontre-la à chaque frontière.** Chaque passage de section est une frontière. Cette remontrée
   coûte environ deux secondes et c'est elle qui retient ; la sauter, c'est comme ça qu'une
   résolution finit par ne rien résoudre.
3. **Fais-la avancer visiblement.** Le spectateur doit voir l'incomplétude diminuer.
4. **Ferme sur l'image d'ouverture.**

Choisis la forme d'après le script :

| Forme du script | L'univers | Ce qui est incomplet |
| --- | --- | --- |
| N éléments parallèles | N emplacements sur une colonne | des emplacements vides (voir `reference/patterns/wall-of-slots/`) |
| Un seul processus, en profondeur | toute la chaîne, déployée | un maillon cassé ou manquant |
| Niveaux ou paliers | une pile qui monte | le haut de la pile est un fantôme |
| Comparaison | deux colonnes sur un même axe | une colonne vide, ou un tableau de scores non rempli |
| Actualité ou annonce | une frise, ou une carte du paysage | la droite, le futur, est vide |
| Tutoriel ou construction en direct | l'architecture finie, en fantôme | chaque nœud pas encore construit |

Ranger un élément dans son emplacement est un mouvement de caméra en direct, environ 1,4 s, jamais
une coupe vers une image toute faite de l'état rempli. Le spectateur regarde ce qu'il vient
d'apprendre devenir la tuile. Si la vidéo a un numéro ou un compteur, fais-le défiler dans ce même
mouvement, comme un compteur kilométrique, avec le même début, la même durée et la même courbe pour
les deux chiffres, sinon ils se fondent en une seule bande en plein défilement.

**Le compteur a besoin d'un nom, pas seulement d'un numéro.** Un numéro dans un coin dit au
spectateur où il en est dans la suite, mais pas ce qu'*est* l'élément en cours ; à la neuvième
minute, « 03 » ne porte rien. Associe le numéro à une étiquette de 1 ou 2 mots qui nomme l'élément
en cours (SUPPORT, IA VOCALE), avec le même traitement de plaque, qui bouge comme un seul bloc
rigide avec le numéro et change dans le même défilement. La revue client de la construction de
référence a demandé exactement ça : les visuels étaient bons et le spectateur perdait quand même le
fil du cas d'usage à l'écran.

## 2 · Discipline

### Si ce n'est pas nommé, ce n'est pas dessiné

Chaque forme est un élément étiqueté, un lien entre éléments étiquetés, le sujet qui voyage ou le
fond d'ambiance. Rien d'autre.

Ça vient d'une revue en test muet qui a noté la compréhension 7/10 et nommé la cause : le schéma
était propre, les décorations non. Une douzaine de formes sans étiquette dessinées avec la même
épaisseur et la même palette que les formes porteuses de sens : un spectateur qui découvre la vidéo
ne distingue pas le signal de la texture et dépense une vraie attention à décoder des choses qui
n'étaient pas faites pour l'être. C'est « il se passe trop de choses » déplacé des mots vers les formes.

Budget : **environ 20 mots à l'écran par section.** Pas de phrases. Les étiquettes font 1 ou 2 mots,
sous leur élément. La section 1 de la référence compte 21 mots en 84 secondes.

**Corollaire : un visuel de contre-exemple ne se superpose jamais à la recommandation.** Passe
d'abord l'univers presque au noir, ou place le contre-exemple là où le bon schéma n'est pas.

### Donner au spectateur une seule chose à suivre

Porte l'histoire sur un seul sujet qui voyage et dont l'état change visiblement : une puce avec des
lignes de données et une barre de score, un document, une requête. Des lignes se remplissent, une
barre bouge, une bordure change de couleur. Le spectateur doit pouvoir suivre toute une section en
regardant ce seul objet, et l'objet ne doit jamais se téléporter : il se déplace le long de liens
dessinés, à vitesse constante.

### Un seul jeu de tokens global

Détail complet dans `reference/design-system.md`.

| Token | Valeurs |
| --- | --- |
| Trait | 1,5 / 2,5 / 4 / 7, et rien d'autre |
| Texte | 22 / 30 / 42 / 60 / 84 |
| Arrondi | 10 / 22 / 40, toujours superellipse(2) |

Cinq couleurs, cinq sens fixes, zéro décoration. Chaud signifie qu'un humain est impliqué, et rien
d'autre n'est jamais chaud. Jamais de blanc pur pour le texte : il bave sur fond sombre.

L'échec que ça évite, d'après la revue d'artisan de la première construction : *« chaque décision a
été prise localement et correctement ; aucune décision n'a été prise globalement. »* 18 épaisseurs
de trait et 9 tailles de texte, la plupart à 0,2 d'écart, invisibles une par une et fatales
ensemble. L'œil reçoit du bruit au lieu d'une hiérarchie. Contrôle-le avec un linter de tokens qui
fait échouer la construction.

### Mouvement

Entrées en `cubic-bezier(0.16,1,0.3,1)`, sorties plus rapides que les entrées, durée qui varie avec
la masse pour qu'un nœud de 290 px et une étiquette de 40 px ne ralentissent pas de la même façon,
et `back.out` **exactement une fois par section**, sur le temps fort qui le mérite.

**Jamais de fondu enchaîné.** Les couches plein cadre entrent et sortent par découpe sur un fond
déjà opaque. À chaque instant, un pixel est soit du graphisme, soit de l'image.

## 3 · Contrat de construction

- **Un générateur par section.** `scripts/build_<id>.py` écrit seulement `compositions/<id>.html`.
  Modifie le générateur, jamais le HTML généré. Les racines de section `index-*.html` sont
  maintenues à la main : les changements de cadrage s'y font.
- **Les modules partagés restent partagés.** Tout ce qui définit une géométrie partagée est importé
  par chaque section. Si des sections sont construites par des agents en parallèle, interdis-leur de
  toucher aux modules partagés ; une géométrie divergente casse en silence chaque passage de relais.
- **Préfixe les defs SVG avant l'assemblage.** Chaque section définit ses propres `gEdge`, `shadow`,
  `edgeFade`. Dans un DOM assemblé, `url(#id)` pointe vers la première correspondance dans l'ordre
  du document : dès qu'une composition antérieure est démontée, chaque graphisme suivant ne peint
  **rien**. Coût dans la construction de référence : 35 secondes d'écran vide avec tous les
  contrôles au vert. Seul le visionnage du rendu assemblé l'a repéré.
- **Cale tout sur les débuts de mots** d'une transcription mot à mot, en entrant 0,15 à 0,25 s
  **avant** le mot d'ancrage. Ne divise jamais une section en temps forts réguliers.
- **Contrôle les trous.** Tout passage de plus d'environ 1,5 s où il ne se passe rien est un écran
  mort ; fais-les afficher par le générateur.
- **Laisse de l'air dans la coupe.** Un plafonnement agressif des pauses produit des écarts presque
  nuls aux fins de phrase, que le client entend comme des « bégaiements » et des jump cuts. Calibre
  sur la norme de l'orateur : signale les écarts de fin de phrase environ 10 fois plus serrés que sa
  médiane (celle de l'orateur de référence était de 470 ms ; les raccords signalés étaient à
  20-40 ms), et répare en insérant 4 à 8 images d'air, sans jamais toucher aux mots. L'air est un
  morceau prélevé du vrai bruit de fond de la pièce dans la piste, avec des fondus de 10 ms, jamais
  `anullsrc` : un silence numérique sur un plancher à −50 dBFS est un trou audible. La vidéo tient
  l'image ; entre deux phrases, un face caméra est presque immobile et 4 à 8 images de tenue sont
  invisibles. Des changements qui ne font qu'insérer décalent la transcription de façon
  déterministe : pas besoin de retranscrire. **Les bords d'un insert doivent respecter l'enveloppe
  de la parole** : coller du bruit de fond contre la fin d'un mot en 1 ms ampute une extinction qui
  prend naturellement 60 à 120 ms, et le client entend la falaise comme un bégaiement. Raccorde avec
  un fondu enchaîné à puissance constante de 40 ms dans l'extinction de la fin du mot, jamais bord à bord.
- **Des temps codés en dur imposent des décalages scriptés.** Les générateurs codent en dur des
  centaines de temps, et les décalages de section, tables de raccords et animations racine contiennent
  tous des temps absolus. Tout changement de timeline une fois les graphismes créés (même une passe
  d'air de 2 s) doit passer par une transformation relue au niveau de l'AST ou de l'analyse, qui
  décale chaque valeur après chaque point de montage, puis une revue des différences — jamais des
  modifications à la main. Déduis chaque décalage de la liste de montage de référence elle-même ;
  la passe de référence a trouvé une erreur de 2 images dans les décalages précalculés de son propre
  audit en les redéduisant.
- `--workers 1` au rendu. Des workers en parallèle font peindre la couche vidéo en noir.

## 4 · Contrôles

Lance-les tous, puis regarde quand même.

```bash
node scripts/qa-tokens.mjs          # 0 trait / taille de texte / arrondi hors système
node scripts/qa-no-crossfade.mjs    # 0 couche plein cadre qui anime l'opacité
node scripts/qa-legibility.mjs <render>
node scripts/qa-seamjump.mjs <render> plan/cover-seams.json --control <cut>
node scripts/qa-deadframe.mjs <render> --control <cut>
node scripts/qa-presence.mjs <render> --every 1      # part de présence de l'orateur à l'écran
node scripts/integrate.mjs --check                   # 0 trou, 0 montage périmé
npx hyperframes lint
```

Ces scripts `qa-*` et `integrate.mjs` viennent de la construction de référence d'origine ; ils ne
sont pas fournis dans ce kit. Écris-les pour ton projet ou fais les mêmes contrôles à la main.

**Les contrôles ne remplacent pas le regard**, et des contrôles qui n'ont jamais échoué ne sont pas
des contrôles.

- **La fluidité du mouvement se vérifie sur des images continues, jamais sur les images des temps
  forts.** Une seule image par temps fort prouve la composition ; chaque défaut de mouvement — un
  saut au début d'un déplacement, une lente approche vers un arrêt net avant un deuxième mouvement,
  un gel, un saut d'une image — vit *entre* les images des temps forts et survit à tous les autres
  contrôles. Avant toute livraison, fais une mosaïque d'une bande continue sur CHAQUE fenêtre de
  transition (mouvement de caméra, volet, recadrage, arrimage, raccord de section) et lis les bandes :

  ```bash
  ffmpeg -i render.mp4 -vf "select='between(n,A,B)',scale=480:270,tile=layout=6x7" \
    -frames:v 1 tile-<fenetre>.png
  ```

  Signatures de défaut à repérer : des tuiles voisines avec un grand saut puis plusieurs tuiles
  presque identiques (courbe qui part fort / arrêt net) ; un mouvement qui s'arrête puis un
  mouvement *différent* qui démarre (deux mouvements qui devraient n'en faire qu'un) ; toute tuile
  isolée différente de ses deux voisines (saut). L'intro de l'exemple a livré un bug de
  zoom-gel qui passait les contrôles de tokens, de fondus, de lisibilité, de trous morts et de
  lecture image par temps fort ; le client l'a vu en un seul visionnage. Cette famille de défauts
  revient — traite cette lecture de bandes comme essentielle, pas optionnelle.
- **La lisibilité ne s'automatise pas.** Des seuils absolus de proportion de pixels mesurent la
  quantité de texte, pas la lisibilité ; une construction bavarde obtient un *meilleur* score qu'une
  construction épurée. Lis à l'œil une réduction en 960x540 de chaque temps fort majeur.
- **Valide chaque contrôle sur un témoin** connu pour le déclencher. Un contrôle de raccord qui
  renvoie zéro sur une construction cassée est pire que pas de contrôle.
- **Vérifie l'objet assemblé**, jamais les prototypes de section. La plupart des bugs qui ont
  survécu aux contrôles de cette construction n'existaient que dans l'assemblage.
- **Contrôle l'audio au niveau acoustique, pas au niveau de la transcription.** Une transcription
  tirée de la source d'avant montage est structurellement aveugle aux artefacts créés par le
  montage, et une recherche dans ce texte dira « propre » pendant que le client entend des
  bégaiements. Ce qui les trouve vraiment, par ordre de rendement dans la construction de référence :
  un scan des zones mortes sur toute la piste (des suites d'échantillons à zéro numérique dans des
  pauses dont le vrai plancher est vers −70 dBFS se lisent comme des trous ; les combler avec du
  bruit de fond), une analyse de l'enveloppe à 1 ms de résolution à chaque bord de raccord (une
  détection de clics par dérivée d'échantillon laisse passer une falaise d'enveloppe que l'oreille
  repère tout de suite), et une nouvelle transcription automatique de l'audio livré comparée au
  texte attendu. L'autocorrélation des phonèmes répétés n'a rien trouvé : ce que les clients
  appellent « bégaiements », ce sont en général des falaises de troncature et des trous, pas des mots doublés.

Présence : vise environ 40 % de présence de l'orateur à l'écran dans une vidéo menée par les
graphismes. De longues absences sont acceptables aux temps forts de résolution qui ont besoin de
toute la largeur ; contrôle-les au lieu de les plafonner.

## 5 · Ordre du travail

1. Fige la coupe et obtiens une transcription mot à mot. Tout est calé dessus.
2. Choisis l'univers, la grammaire spatiale et le sujet qui voyage. Écris-les avant de construire.
3. Choisis la boucle ouverte d'après la forme du script et construis d'abord son module partagé.
   Sa géométrie est utilisée par l'accroche, chaque frontière et la résolution.
4. Construis **une** section de bout en bout et rends-la. Prouve le système sur elle avant de
   toucher aux autres.
5. Revois cette section à l'œil, sans le son, pour les ornements et la lisibilité. Corrige le
   système, pas la section.
6. Construis le reste sur la base de la section prouvée. Puis préfixe, assemble, rends, contrôle et
   lis le rendu assemblé.

Les étapes 4 et 5 sont celles d'où vient la qualité. Tout le système visuel de la construction de
référence est le résultat de trois revues de sa première section.

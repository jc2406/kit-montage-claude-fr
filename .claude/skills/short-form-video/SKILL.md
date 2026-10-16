---
name: short-form-video
description: Maintenir les compositions pédagogiques May Shorts existantes avec leurs anciens motifs de mode visage, d'incrustation de scènes et de sous-titres karaoké. À utiliser seulement pour travailler sur ces exemples ou si on demande explicitement cet ancien échafaudage. Pour les nouveaux reels, Shorts ou publicités courtes, utiliser short-form-edit.
---

# Vidéo verticale courte (HyperFrames)

Format court = vertical 1080x1920, 10 à 30 s, visage face caméra + incrustations de scènes en
motion graphics + sous-titres karaoké. Tout ce skill est tiré de l'autopsie des itérations de
May Shorts 19 (v1 → v4) et sert à maintenir ces exemples. Utilise `short-form-edit` pour les
nouveaux enregistrements.

> Note de la version française : les projets `may-shorts-18` et `may-shorts-19` cités ici ne sont
> pas inclus dans cette traduction (ils montrent Nate Herk et la marque AI Automation Society).
> Ils se trouvent dans le [dépôt d'origine](https://github.com/nateherkai/herk-edit-kit).

**Lance toujours `/hyperframes` d'abord.** Ce skill vient par-dessus — il ne remplace pas les règles
du framework (attributs `data-*`, `window.__timelines`, structure de composition). Elles ne se
négocient pas, quel que soit le format.

## Quand ce skill s'applique

- Maintenir les exemples May Shorts existants.
- Demande explicite de leur ancien échafaudage à quatre couches.

## La méthode (vue d'ensemble)

1. **L'audio fait foi.** Monte l'audio D'ABORD (couper les reprises, les pauses). Enregistre en
   `<nom>-edit.mp4`. Mesure la durée exacte avec `ffprobe` — c'est le `data-duration` de la composition.
2. **Transcris l'audio monté** avec l'outil `scripts/transcribe-elevenlabs.mjs` à la racine
   (ElevenLabs Scribe), une alternative choisie par l'utilisateur et normalisée selon
   `docs/TOOLS-AND-API-KEYS.md`, ou, pour recaler une construction existante avec une fonction
   `shift()` dans les sous-titres, garde les sous-titres existants et décale seulement les débuts de scène.
3. **Écris les limites de scène en temps monté** — ne mélange JAMAIS des ancres en temps d'origine
   et en temps monté dans un même fichier. Voir « Protocole de synchro audio » plus bas.
4. **Construis l'échafaudage de composition** (4 couches : fond d'ambiance, traitement de jonction,
   sous-titres, visage) — voir « Échafaudage de composition » plus bas.
5. **Écris les scènes avec des décalages LOCAUX** relatifs au `data-start` de chaque scène. Chaque
   scène est sa propre sous-composition dans `compositions/scene<N>-<libelle>.html`.
6. **Lint → rendu brouillon → vérification des images au mot près → rendu final.** C'est le
   contrôle de vérification. Ne saute jamais l'étape 3 (vérification des images).

## Échafaudage de composition (les 4 couches toujours présentes)

Chaque vidéo verticale courte a ces quatre sous-compositions dans `compositions/`, chargées sur des pistes partagées :

```
index.html (racine, 1080x1920, data-composition-id="main")
├── ambient-bg.html        track-index="3" — dégradé radial + grille qui dérive + particules + vignettage
├── face-wrapper + <video> track-index="0" — face caméra (voir la chorégraphie des modes visage)
├── seam-treatment.html    track-index="5" — adoucit le bord à y=960 (scènes en moitié basse seulement)
├── scene1-<libelle>.html  track-index="1" — incrustations de scènes (bout à bout, sans trou)
├── scene2-<libelle>.html  track-index="1"
├── …
└── captions.html          track-index="2" — sous-titres karaoké, synchronisés au mot
```

- `data-duration` est identique pour la racine, ambient-bg, seam-treatment, la vidéo du visage, l'audio du visage et les sous-titres. Seules les incrustations de scènes changent dans le temps.
- L'`<audio>` du visage est un élément SÉPARÉ (le mixeur en a besoin) ; n'utilise jamais la piste audio de la vidéo elle-même.
- `class="clip"` va sur les div temporisées — JAMAIS sur `<video>` ni `<audio>`.

## Chorégraphie des modes visage (le geste signature du format court)

Le visage vit dans une div conteneur dimensionnée au format paysage natif de la source (1920x1080).
GSAP anime le CONTENEUR (jamais l'élément vidéo — animer les dimensions de `<video>` fige les images).

Deux modes :

```js
const BOTTOM     = { x: 0,       y: 1136, scale: 0.5625 }; // moitié basse, tout le paysage visible
const FULLSCREEN = { x: -1166.5, y: 0,    scale: 1.7778 }; // recadré en couverture, remplit le 1080x1920
const MODE_DUR = 0.32;
```

`BOTTOM` rend la source 1920x1080 en 1080x607,5, centrée dans les 960 px du bas. `FULLSCREEN`
recadre horizontalement pour remplir le cadre portrait.

**La transition démarre 0,15 s AVANT l'arrivée du contenu de la nouvelle scène**, avec `ease: "expo.inOut"` :

```js
[
  { t: <debut-scene-4>, mode: FULLSCREEN },
  { t: <debut-scene-5>, mode: BOTTOM },
  …
].forEach(({ t, mode }) => {
  mainTl.to("#face-wrapper", { ...mode, duration: MODE_DUR, ease: "expo.inOut" }, t - 0.15);
});
```

Un visage qui change de mode instantanément est l'image la plus brutale d'une vidéo verticale.
Interpole toujours.

### Étalonnage du visage (chaque short, sans exception)

```css
#face-video {
  filter: contrast(1.08) saturate(1.08) brightness(0.97);
}
```

Plus un léger zoom Ken Burns de 1,00 → 1,025 sur toute la durée (`ease: "none"`) et un vignettage
latéral en pseudo-élément `::after`, pour que le visage se fonde dans le bleu marine autour au lieu
de buter contre un bord tranchant.

### Traitement de la jonction (obligatoire pour les scènes en moitié basse)

Une bande en dégradé marine → transparent (60 à 100 px) à y=960, plus une ligne de balayage
d'accent de 2 px avec une lueur douce. Dessine-la APRÈS le visage pour qu'elle soit au-dessus ;
les scènes plein écran la recouvrent quand elles prennent le relais. Une coupe nette à y=960 est
le signe n° 2 d'un contenu monté par IA (après les fonds plats).

## Protocole de synchro audio (à NE PAS sauter)

**Problème :** si l'audio est monté (reprises/pauses retirées), les horodatages de la transcription
source ne correspondent plus à la vidéo montée. Des débuts de scène écrits en temps d'origine se
déclenchent en retard.

**La règle :** TOUT le timing est en temps monté. Ne mélange jamais.

**Procédure de vérification pour tout recalage d'un format court :**

1. Mesure les deux fichiers audio :
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 assets/original.mp4
   ffprobe -v error -show_entries format=duration -of csv=p=0 assets/<nom>-edit.mp4
   ```
   La différence = le temps total coupé.
2. Si tu utilises une fonction `shift()` dans `captions.html` pour faire correspondre les mots de la
   transcription, elle fait foi. La correspondance `shift(tempsOrigine) = tempsMonte` s'applique
   aussi à CHAQUE `data-start` de scène.
3. Les décalages internes des scènes (dans `compositions/sceneN.html`) sont LOCAUX par rapport au
   `data-start` de la scène. Si le `data-start` parent d'une scène est correct en temps monté, les
   décalages internes restent corrects SANS modification — SAUF si une scène chevauche une coupe :
   alors la durée parente ET les décalages internes changent.
4. Les temps du tableau des transitions de mode visage DOIVENT être en temps monté. Ils ne sont
   PAS décalés automatiquement.

**Format du plan pour les recalages** (utilise cette structure de tableau à chaque fois) :

| Scène | Début actuel | Durée actuelle | Nouveau début | Nouvelle durée | Justification |
|-------|--------------|----------------|---------------|----------------|---------------|
| ...   | ...          | ...            | ...           | ...            | ...           |

Puis le tableau des modes visage, puis les changements de décalages internes, puis la liste des
images à vérifier.

## Écrire les scènes

Une scène = un fichier de sous-composition. Les scènes sont sur le même `data-track-index`, bout à
bout (sans trou). Dans chaque scène :

- `data-duration` correspond exactement au créneau du parent
- Toutes les ancres GSAP sont LOCALES (à partir de 0 au début de la scène)
- Utilise `tl.set({}, {}, <data-duration>)` pour compléter la timeline afin que `tl.duration()` de GSAP corresponde à `data-duration`

### Règles de rythme des scènes (tirées des 10 principes)

- **Aucune image morte.** Chaque tranche de 100 ms a au moins 1 élément animé. Décale la première entrée de 0,1 à 0,3 s, pas à t=0.
- **La résolution tient ≥ 1 s.** La « grande révélation » de la scène (tampon, chiffre qui se fige, chute) doit rester au moins 1 s à l'écran, idéalement 1,5 s. Budgète les scènes selon le moment de la révélation, pas selon la durée totale.
- **Du mouvement sur toute la durée.** Si toutes les animations d'entrée sont arrivées à 2 s en local sur une scène de 4 s, ajoute du mouvement secondaire : balayage de soulignement, coches qui apparaissent, dérive d'ambiance sur les cartes, petites lueurs qui oscillent sur les pastilles. Un rythme mort = on swipe.
- **Varie les courbes.** Au moins 3 courbes différentes par scène dans les entrées.
- **Un moment « waouh » toutes les 5 s.** Claque typographique, révélation glitch/chromatique, panoramique en fouet, claque synchronisée sur le son. Sans eux, la vidéo se lit comme « un face caméra avec des étiquettes » — correct mais oubliable.

## Sous-titres (style karaoké)

- Montserrat 900, 46 à 58 px (pour une largeur de 1080), base 100 % blanche
- Mot actif : agrandissement à 1,08 + passage à la couleur d'accent (`#37bdf8` chez AIS, à adapter à la marque)
- Contour par `text-shadow` en couches, JAMAIS `-webkit-text-stroke` (rendu incohérent dans le rendu Chromium)
- Retire la pastille de fond rgba — laisse le contour assurer la lisibilité. Les sous-titres doivent ressembler à du graffiti sur l'image, pas à une piste de sous-titres.
- Pour les recalages, utilise une fonction `shift()` dans `captions.html` pour faire correspondre les horodatages des mots de la transcription au temps monté. Le JSON de transcription reste intact et les recalages deviennent mécaniques.

Voir `references/captions.md` dans `/hyperframes` pour l'implémentation karaoké complète. En bref :
des `<span>` par mot avec `data-word-start`, des animations GSAP limitées à chaque span, des
apparitions serrées de 0,08 à 0,12 s.

## Fond d'ambiance (jamais de bleu marine plat)

Pile minimale viable :

1. **Base en dégradé radial** (centre plus clair que les bords de 15 à 20 %)
2. **Grain ou bruit animé** à 8 à 12 % d'opacité
3. **4 à 8 points de particules qui dérivent** ou traces de grille
4. **Léger vignettage**

`background: #07121c` seul est un remplissage provisoire, pas un design. Pour une esthétique
technique « salle de contrôle », utilise la pile à 6 couches de `feedback_techy_background_layers.md`
(grille HUD masquée au vignettage + traces de circuit + nœuds qui pulsent + faisceau de balayage +
défilant de télémétrie + étiquettes monospace dans les coins).

## Réactivité audio

- Les titres pulsent de 3 à 6 % sur le beat. Les fonds peuvent aller de 10 à 30 % sur les basses.
- Garde une réactivité du texte discrète (3 à 6 %) pour que les sous-titres restent lisibles ; les fonds peuvent pousser plus fort.
- Utilise un analyseur hors ligne avec graine (précalcule la piste de caractéristiques audio) pour que les rendus soient déterministes. N'utilise PAS `AnalyserNode` dans le chemin de rendu — `Math.random()` et les nœuds audio en temps réel cassent le déterminisme.

## Transitions

- **Fais tourner les saveurs.** Jamais deux transitions consécutives du même type. Six coupes franches d'affilée sont le signe n° 1 d'un montage par IA.
- Les transitions de mode visage (`BOTTOM ↔ FULLSCREEN`) servent aussi de transitions de scène quand le mode change entre deux scènes.
- Pour un passage de scène à scène en pure incrustation, installe depuis le catalogue : `push-up`, `flash-through-white`, `sdf-iris`, ou le pack complet de transitions en shader. `npx hyperframes catalog --type block` pour parcourir.

## Le contrôle de vérification (obligatoire — NE livre PAS sans)

Un lint réussi ≠ un design qui marche. Ne déclare jamais un rendu de format court terminé avant
d'avoir extrait des images aux horodatages exacts des mots et LU chaque PNG.

### Étape 1 — rendu brouillon

```bash
cd video-projects/<slug>
npx hyperframes lint
npx hyperframes render --quality draft --output renders/<slug>-vN-draft.mp4
```

### Étape 2 — extraction des images au mot près

Choisis 8 à 15 horodatages qui correspondent chacun à un MOT PRONONCÉ où un visuel précis doit être
à l'écran. Pas des chiffres ronds. Pas le milieu d'une scène. Le mot exact.

```bash
mkdir -p renders/frames-vN
for pair in "<t>:<libelle>" "<t>:<libelle>" ...; do
  t="${pair%%:*}"; label="${pair##*:}"
  ffmpeg -y -ss "$t" -i renders/<slug>-vN-draft.mp4 \
    -frames:v 1 -q:v 2 "renders/frames-vN/t${t}-${label}.png"
done
```

### Étape 3 — lire chaque PNG

Appelle `Read` sur chaque PNG pour charger l'image dans le contexte. Ne te contente PAS de lister
les noms de fichiers. Pour chaque image, confirme :

- Le visuel attendu est à l'écran au moment attendu (pas 1 s en retard, pas en avance)
- Le visage de l'orateur n'est coupé dans aucune scène en moitié basse
- Le mode visage plein écran ou moitié basse est le bon pour cette scène
- Les sous-titres respectent la marque, sont lisibles et ne débordent pas
- Aucune image vide, aucun chevauchement involontaire, aucun texte hors du cadre

### Étape 4 — si quelque chose échoue, corrige et revérifie. Ne livre jamais cassé.

### Étape 5 — rendu final

```bash
npx hyperframes render --quality standard --output renders/<slug>-vN.mp4
```

Vérifie 3 ou 4 images du rendu final (mêmes horodatages, autre dossier `frames-vN-final/`) pour
confirmer que l'encodage en qualité standard n'a rien changé.

## Les 10 règles (liste qualité — à passer AVANT le premier brouillon)

Chaque construction de format court. Passe cette liste pendant l'écriture, pas après.

1. **Aucune image morte.** Chaque tranche de 100 ms a un élément animé.
2. **La résolution d'une scène tient ≥ 1 s.** Budgète selon le moment de la révélation, pas la durée totale.
3. **Le visage est un personnage.** Étalonnage + Ken Burns + vignettage latéral.
4. **Pas de jonction dure.** Adoucir y=960 avec un dégradé + une ligne de balayage.
5. **Un moment « waouh » toutes les 5 s.** Claque typographique, glitch, panoramique en fouet, claque sonore.
6. **La réactivité audio n'est pas négociable.** 3 à 6 % pour le texte, 10 à 30 % pour le fond.
7. **Fais tourner les saveurs de transition.** Jamais deux consécutives identiques.
8. **Les sous-titres claquent, ils n'étiquettent pas poliment.** Contour plutôt que pastille. Agrandissement + couleur sur le mot actif.
9. **Du mouvement sur toute la durée de la scène.** Mouvement secondaire si les entrées arrivent tôt.
10. **Le fond est une couche, pas une couleur.** Au minimum radial + bruit + particules + vignettage.
11. **Les tampons / claques arrivent APRÈS que le texte visé est entièrement visible.** La logique de révélation prime sur la synchro au mot. Le `t` du tampon ≥ le `t` où la cible est visible + 0,10 à 0,25 s. Sinon la chute arrive avant la mise en place.

## Structure de projet (chaque projet de format court)

```
video-projects/<slug>/
├── hyperframes.json
├── meta.json                    (id, nom, dimensions 1080x1920, fps 30)
├── index.html                   (composition racine, l'échafaudage à 4 couches)
├── compositions/
│   ├── ambient-bg.html
│   ├── seam-treatment.html
│   ├── captions.html            (avec une fonction shift() en cas de recalage)
│   ├── scene1-<libelle>.html
│   ├── scene2-<libelle>.html
│   └── ...
├── assets/
│   ├── <nom>.mp4                (enregistrement d'origine)
│   ├── <nom>-edit.mp4           (monté — coupes retirées — c'est lui que la composition utilise)
│   ├── transcript.json          (sortie de la transcription)
│   └── éléments de marque (logo, brand-tokens.css, musique de fond)
└── renders/
    ├── <slug>-v1-draft.mp4
    ├── frames-v1/
    ├── <slug>-v1.mp4
    └── ...
```

## Protocole de recalage (quand l'audio est remonté ou que les horodatages dérivent)

1. Mesure les durées de l'ancien et du nouvel audio monté avec `ffprobe`. Écart = temps total coupé.
2. Repère la ou les fenêtres de coupe : quelles secondes ont été retirées, et où.
3. Écris le tableau du plan : chaque `data-start` et `data-duration` de scène, chaque `t` de transition de mode visage, toute scène dont les décalages internes chevauchent une coupe.
4. Pour chaque scène qui chevauche une coupe, sa durée parente ET ses décalages internes changent. Les scènes entièrement d'un seul côté de la coupe n'ont besoin que d'un décalage du `data-start` parent.
5. Lint → rendu brouillon → vérification des images au mot près → rendu final. Pas de raccourci.

## Ce qu'il ne faut PAS faire en format court

- N'anime pas les dimensions de l'élément `<video>` — ça fige les images. Anime la div conteneur.
- N'utilise pas `repeat: -1` sur une timeline — ça casse le moteur de capture. Nombres finis seulement.
- N'utilise pas `Math.random()` ni `Date.now()` — ça casse le déterminisme. Un générateur à graine si tu as besoin de pseudo-aléatoire.
- N'utilise pas `<br>` dans les sous-titres — le retour à la ligne naturel + `<br>` produit des sauts de ligne en trop.
- Ne saute pas le contrôle de vérification des images. Le code de sortie du lint n'est pas une vérité visuelle.
- N'écris pas en temps d'origine si l'audio est monté. Temps monté ou rien.
- Ne laisse pas `background: #07121c` plat. Superpose des couches.
- Ne coupe pas franchement entre les scènes. Fais tourner les saveurs de transition.
- Ne fais pas de sous-titres polis. Fais-les claquer.
- Ne laisse pas le visage immobile. Étalonnage + Ken Burns, toujours.

## Leçons de may-shorts-18 (v1 → v2)

Tirées des 4 problèmes concrets du rendu v1 et de ce qui les a corrigés en v2. Applique-les à chaque nouveau short.

### 1. Timing des tampons / claques — la logique de révélation bat la synchro au mot

Une incrustation CLAQUE/TAMPON (KILLED, DEAD, STOP, etc.) arrive APRÈS que son texte cible est
entièrement visible, **pas** pendant le mot prononcé. Dans la scène 1 de may-shorts-18 v1, CLAUDE
et CHATGPT étaient présentés comme adversaires — KILLED se déclenchait à 0,46 s en local alors que
CHATGPT n'apparaissait qu'à 0,66 s, donc les spectateurs voyaient « Claude … KILLED » sans cible
visible. La blague tombait à plat.

**Règle :** `t_tampon ≥ t_cible_visible + 0,10 à 0,25 s`. Le moment « visible » est la FIN de
l'animation d'entrée de la cible, pas son début. La synchro au mot est un repère ; l'ordre de
révélation visuelle est la contrainte.

### 2. Échelle du mode visage BOTTOM — ne livre pas la valeur par défaut

La valeur par défaut `BOTTOM = { x: 0, y: 1136, scale: 0.5625 }` (ajustement horizontal exact pour
une source 1920×1080) laisse un fond de studio vide de chaque côté de l'orateur s'il occupe moins de
70 % du cadre source. C'est la valeur par défaut de may-shorts-19, copiée dans may-shorts-18 v1 —
les deux vidéos avaient un espace mort visible à gauche et à droite de l'orateur dans chaque scène BOTTOM.

**Règle :** préfère `BOTTOM = { x: -180, y: 1110, scale: 0.75 }` — recadre 180 px de chaque côté,
ancré en bas à y=1920. Prévisualise UNE image du mode BOTTOM sur la vraie vidéo source avant de
figer la constante. Si l'orateur est déjà cadré serré dans la source, une échelle de 0,65 peut
suffire ; si la source est un cadrage large de studio, monte à 0,80 et ajuste x de nouveau.

Garde toujours les `x`, `y`, `scale` de HIDDEN identiques à BOTTOM — ils ne diffèrent que par
l'`opacity` — pour que les scènes qui jouent sur l'opacité ne dérivent pas géométriquement en plein fondu.

### 3. Transitions de mode visage — trois choses à la fois, pas une

Quand le visage change de mode entre deux scènes voisines, une simple avance de 0,15 s + une durée de
0,32 s en `expo.inOut` sur le seul conteneur du visage paraît rigide — les panneaux de la scène
sortante sont encore entièrement opaques derrière le visage qui se transforme, donc l'œil voit deux
choses qui se battent au lieu d'un fondu enchaîné.

**Règle :** pour tout changement de mode visage « héros » d'une scène à l'autre (surtout BOTTOM ↔ FULLSCREEN), fais les trois :
1. Allonge la durée de cette transition précise à 0,45 à 0,55 s (au lieu de 0,32 s par défaut)
2. Démarre-la 0,25 à 0,30 s avant le `data-start` de la nouvelle scène (au lieu de 0,15 s par défaut)
3. Fais disparaître et flouter le conteneur de panneaux de la scène sortante vers `opacity: 0, filter: blur(6px)` en 0,20 à 0,25 s, en démarrant 0,25 s avant la fin de la scène

Côté implémentation, donne à chaque entrée du tableau des transitions de mode visage sa propre `dur`
pour qu'une transition puisse être plus longue que les autres :
```js
[ { t: 2.06, mode: FULLSCREEN, dur: 0.50 }, { t: 3.71, mode: HIDDEN, dur: 0.32 }, ... ]
  .forEach(({ t, mode, dur }) => mainTl.to("#face-wrapper", { ...mode, duration: dur, ease: "expo.inOut" }, t));
```

Trois changements simultanés = « un vrai monteur a monté ça ». Un seul = rigide.

### 4. Au milieu de la vidéo, les scènes « données » battent les scènes décoratives

Pour les scènes 3 à 5 d'un short de 15 à 20 s (le « milieu » où l'attention baisse le plus),
appuie-toi sur des visuels qui se lisent comme de l'information — courses de barres, grilles de
chiffres qui défilent, cartes de chaleur, mini-courbes, organigrammes, habillage de tableau de bord
avec télémétrie qui défile, grilles de points de douleur qui s'allument en rouge à la suite. La
scène 4 de may-shorts-18 v1 combinait anneaux radar + puce de terminal + étincelles — fonctionnel
mais décoratif, et Nate l'a trouvée « fade ». La v2 l'a remplacée par une grille 3×3 de points de
douleur qui s'allument en rouge-orangé à la suite + une mini-courbe qui se trace avec un repère
VOUS-ÊTES-ICI + la claque de résolution — même budget de temps, engagement bien plus fort.

**Règle :** des scènes purement typographie + icône font diapositive. Des scènes « données » font
preuve. Quand une scène du milieu paraît fade, remplace la décoration par quelque chose qui se lit
comme de l'*information* : un petit chiffre qui monte, une barre qui se remplit, un graphique qui se
trace, une grille qui s'allume à la suite.

## Compositions de référence

Dans le dépôt d'origine (non inclus dans cette traduction) :

- `video-projects/may-shorts-19/` — l'exemple de référence du format court (18,84 s, 1080x1920, 7 scènes, chorégraphie des modes visage, sous-titres karaoké avec shift(), fond d'ambiance + traitement de jonction). Lis `index.html` et les `compositions/scene*.html` avant d'écrire un nouveau short.
- `video-projects/may-shorts-18/` — référence secondaire avec les 4 leçons ci-dessus intégrées : BOTTOM scale=0.75, tampon KILLED calé après la révélation de CHATGPT, fondu fluide de la scène 1 à 2, grille de tableau de bord « THE PATTERN » en scène 4.

## Skills associés (à lancer en plus)

- `/hyperframes` — règles du framework (toujours en premier)
- `/hyperframes-cli` — commandes CLI (init, lint, preview, render)
- `/gsap` — référence de la bibliothèque d'animation
- `/hyperframes-registry` — installer des blocs de transition
- `/seedance-loop-prompt` — si le short a besoin d'une vidéo de fond en boucle générée par IA (skill non fourni dans ce kit)

## Repères de mémoire (entrées de retours pertinentes)

Ces fichiers venaient de la mémoire de l'espace de travail d'origine et ne sont pas fournis :

- `feedback_short_form_principles.md` — les 10 règles, justification complète
- `feedback_contrast_technique.md` — localisation des lueurs + halos en text-shadow + éclaircissement des textes ternes
- `feedback_techy_background_layers.md` — pile de fond « salle de contrôle » à 6 couches
- `feedback_visual_verification.md` — le contrôle de vérification
- `project_ais_brand_specs.md` — si le short est aux couleurs d'AIS (codes hex, polices, lueur du logo)

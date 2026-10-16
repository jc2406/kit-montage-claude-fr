---
name: hyperframes
description: Créer des compositions vidéo, animations, cartes de titre, incrustations, sous-titres, voix off, visuels réactifs à l'audio et transitions de scène en HTML HyperFrames. À utiliser quand on demande de construire tout contenu vidéo en HTML, d'ajouter des sous-titres synchronisés sur l'audio, de générer une narration en synthèse vocale, de créer une animation réactive à l'audio (synchro sur le beat, lueur, pulsation pilotées par la musique), d'ajouter une mise en avant animée du texte (balayage au surligneur, cercles dessinés à la main, éclats, gribouillis, rature) ou des transitions entre scènes (fondus enchaînés, volets, révélations, transitions en shader). Couvre l'écriture des compositions, le timing, les médias et tout le déroulé de production vidéo. Pour les commandes CLI (init, lint, preview, render, transcribe, tts), voir le skill hyperframes-cli.
---

# HyperFrames

Le HTML fait foi pour la vidéo. Une composition est un fichier HTML avec des attributs `data-*` pour
le timing, une timeline GSAP pour l'animation et du CSS pour l'apparence. Le framework gère la
visibilité des clips, la lecture des médias et la synchro de la timeline.

> Traduction française du skill HyperFrames (Apache-2.0). Voir `NOTICE.txt`.

## Approche

Avant d'écrire du HTML, pense à haut niveau :

1. **Quoi** — que doit vivre le spectateur ? Repère l'arc narratif, les moments clés et les temps forts émotionnels.
2. **Structure** — combien de compositions, lesquelles sont des sous-compositions ou en ligne, quelles pistes portent quoi (vidéo, audio, incrustations, sous-titres).
3. **Timing** — quels clips dictent la durée, où tombent les transitions, quel rythme.
4. **Mise en page** — construis d'abord l'état final. Voir « La mise en page avant l'animation » plus bas.
5. **Animation** — puis ajoute le mouvement selon les règles ci-dessous.

Pour les petites modifications (corriger une couleur, ajuster un timing, ajouter un élément), passe directement aux règles.

### Contrôle de l'identité visuelle

<HARD-GATE>
Avant d'écrire le MOINDRE HTML de composition, tu DOIS avoir une identité visuelle définie. N'écris PAS de compositions avec des couleurs par défaut ou génériques.

Vérifie dans cet ordre :

1. **Un DESIGN.md existe dans le projet ?** → Lis-le. Utilise ses couleurs, polices, règles de mouvement et contraintes « What NOT to Do » (à ne pas faire) exactes.
2. **Un visual-style.md existe ?** → Lis-le. Applique son `style_prompt_full` et ses champs structurés. (Note : `visual-style.md` est un fichier propre au projet. `visual-styles.md` est la bibliothèque de styles avec 8 préréglages nommés — ce sont des fichiers différents.)
3. **L'utilisateur a nommé un style** (par ex. « Swiss Pulse », « sombre et technique », « marque de luxe ») ? → Lis [visual-styles.md](./visual-styles.md) pour les 8 préréglages nommés. Génère un DESIGN.md minimal avec : `## Style Prompt` (un paragraphe), `## Colors` (3 à 5 valeurs hex avec leurs rôles), `## Typography` (1 ou 2 familles de polices), `## What NOT to Do` (3 à 5 anti-motifs).
4. **Rien de tout ça ?** → Pose 3 questions avant d'écrire le moindre HTML :
   - Quelle ambiance ? (explosive / cinématographique / fluide / technique / chaotique / chaleureuse)
   - Toile claire ou sombre ?
   - Des couleurs de marque, polices ou références visuelles précises ?
     Puis génère un DESIGN.md minimal à partir des réponses.

Chaque composition doit pouvoir justifier sa palette et sa typographie par un DESIGN.md, un visual-style.md ou une direction explicite de l'utilisateur. Si tu tends la main vers `#333`, `#3b82f6` ou `Roboto` — tu as sauté cette étape.
</HARD-GATE>

Pour les valeurs par défaut de mouvement, de taille, de motifs d'entrée et de courbes, suis
[house-style.md](./house-style.md). Le style maison gère COMMENT les choses bougent. Le DESIGN.md
gère À QUOI elles ressemblent.

## La mise en page avant l'animation

Place chaque élément là où il doit être à son **moment le plus visible** — l'image où il est
entièrement entré, bien placé et pas encore en train de sortir. Écris-le d'abord en HTML+CSS statique. Pas encore de GSAP.

**Pourquoi c'est important :** si tu places les éléments dans leur état de départ animé (hors écran,
à l'échelle 0, opacité 0) et que tu les animes vers l'endroit où tu penses qu'ils doivent arriver,
tu devines la mise en page finale. Les chevauchements restent invisibles jusqu'au rendu. En
construisant d'abord l'état final, tu vois et corriges les problèmes de mise en page avant d'ajouter le moindre mouvement.

### Le processus

1. **Repère l'image héros** de chaque scène — le moment où le plus d'éléments sont visibles en même temps. C'est la mise en page que tu construis.
2. **Écris le CSS statique** de cette image. Le conteneur `.scene-content` DOIT remplir toute la scène avec `width: 100%; height: 100%; padding: Npx;` et `display: flex; flex-direction: column; gap: Npx; box-sizing: border-box`. Utilise le padding pour pousser le contenu vers l'intérieur — JAMAIS `position: absolute; top: Npx` sur un conteneur de contenu. Les conteneurs de contenu en position absolue débordent quand le contenu est plus haut que l'espace restant. Réserve `position: absolute` aux éléments décoratifs.
3. **Ajoute les entrées avec `gsap.from()`** — anime DEPUIS hors écran/invisible VERS la position CSS. La position CSS fait foi ; l'animation décrit le chemin pour y arriver.
4. **Ajoute les sorties avec `gsap.to()`** — anime VERS hors écran/invisible DEPUIS la position CSS.

### Exemple

```css
/* scene-content remplit la scène, le padding place le contenu */
.scene-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 120px 160px;
  gap: 24px;
  box-sizing: border-box;
}
.title {
  font-size: 120px;
}
.subtitle {
  font-size: 42px;
}
/* Le conteneur remplit n'importe quelle taille de scène (1920x1080, 1080x1920, etc.).
   Le padding place le contenu. Flex + gap gèrent l'espacement. */
```

**FAUX — dimensions codées en dur et position absolue :**

```css
.scene-content {
  position: absolute;
  top: 200px;
  left: 160px;
  width: 1920px;
  height: 1080px;
  display: flex; /* ... */
}
```

```js
// Étape 3 : animer VERS ces positions
tl.from(".title", { y: 60, opacity: 0, duration: 0.6, ease: "power3.out" }, 0);
tl.from(".subtitle", { y: 40, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.2);
tl.from(".logo", { scale: 0.8, opacity: 0, duration: 0.4, ease: "power2.out" }, 0.3);

// Étape 4 : animer la SORTIE depuis ces positions
tl.to(".title", { y: -40, opacity: 0, duration: 0.4, ease: "power2.in" }, 3);
tl.to(".subtitle", { y: -30, opacity: 0, duration: 0.3, ease: "power2.in" }, 3.1);
tl.to(".logo", { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" }, 3.2);
```

### Quand des éléments partagent un espace dans le temps

Si l'élément A sort avant que l'élément B entre dans la même zone, les deux doivent avoir des
positions CSS correctes pour leurs images héros respectives. L'ordre de la timeline garantit qu'ils
ne coexistent jamais visuellement — mais si tu sautes l'étape de mise en page, tu ne verras pas le
cas où ils se chevauchent par erreur à cause d'un problème de timing.

### Ce qui compte comme chevauchement voulu

Les effets en couches (lueur derrière un texte, éléments d'ombre, motifs de fond) et les designs
empilés en z (piles de cartes, couches de profondeur) sont voulus. L'étape de mise en page sert à
attraper les chevauchements **involontaires** — deux titres qui atterrissent l'un sur l'autre, un
chiffre qui couvre une étiquette, du contenu qui déborde du cadre.

## Attributs data

### Tous les clips

| Attribut           | Obligatoire                           | Valeurs                                                    |
| ------------------ | ------------------------------------- | ---------------------------------------------------------- |
| `id`               | Oui                                   | Identifiant unique                                         |
| `data-start`       | Oui                                   | Secondes ou référence à l'ID d'un clip (`"el-1"`, `"intro + 2"`) |
| `data-duration`    | Obligatoire pour img/div/compositions | Secondes. Pour vidéo/audio, durée du média par défaut.     |
| `data-track-index` | Oui                                   | Entier. Deux clips d'une même piste ne peuvent pas se chevaucher. |
| `data-media-start` | Non                                   | Décalage de découpe dans la source (secondes)              |
| `data-volume`      | Non                                   | 0-1 (1 par défaut)                                         |

`data-track-index` n'affecte **pas** l'empilement visuel — utilise le CSS `z-index`.

### Clips de composition

| Attribut                     | Obligatoire | Valeurs                                          |
| ---------------------------- | ----------- | ------------------------------------------------ |
| `data-composition-id`        | Oui         | ID de composition unique                         |
| `data-start`                 | Oui         | Temps de début (composition racine : `"0"`)      |
| `data-duration`              | Oui         | Prime sur la durée de la timeline GSAP           |
| `data-width` / `data-height` | Oui         | Dimensions en pixels (1920x1080 ou 1080x1920)    |
| `data-composition-src`       | Non         | Chemin vers un fichier HTML externe              |

## Structure d'une composition

Les sous-compositions chargées via `data-composition-src` utilisent une enveloppe `<template>`. **Les
compositions autonomes (l'index.html principal) n'utilisent PAS `<template>`** — elles mettent la
div `data-composition-id` directement dans le `<body>`. Utiliser `<template>` sur un fichier autonome
cache tout le contenu au navigateur et casse le rendu.

Structure d'une sous-composition :

```html
<template id="my-comp-template">
  <div data-composition-id="my-comp" data-width="1920" data-height="1080">
    <!-- contenu -->
    <style>
      [data-composition-id="my-comp"] {
        /* styles limités à la composition */
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      // animations...
      window.__timelines["my-comp"] = tl;
    </script>
  </div>
</template>
```

Chargement dans la racine : `<div id="el-1" data-composition-id="my-comp" data-composition-src="compositions/my-comp.html" data-start="0" data-duration="10" data-track-index="1"></div>`

## Vidéo et audio

La vidéo doit être `muted playsinline`. L'audio est toujours un élément `<audio>` séparé :

```html
<video
  id="el-v"
  data-start="0"
  data-duration="30"
  data-track-index="0"
  src="video.mp4"
  muted
  playsinline
></video>
<audio
  id="el-a"
  data-start="0"
  data-duration="30"
  data-track-index="2"
  src="video.mp4"
  data-volume="1"
></audio>
```

## Contrat de timeline

- Toutes les timelines démarrent `{ paused: true }` — le lecteur contrôle la lecture
- Enregistre chaque timeline : `window.__timelines["<composition-id>"] = tl`
- Le framework imbrique automatiquement les sous-timelines — ne les ajoute PAS à la main
- La durée vient de `data-duration`, pas de la longueur de la timeline GSAP
- Ne crée jamais d'animations vides pour fixer la durée

## Règles (non négociables)

**Déterministe :** pas de `Math.random()`, `Date.now()` ni de logique basée sur l'heure. Utilise un
générateur pseudo-aléatoire à graine si tu as besoin de valeurs pseudo-aléatoires (par ex. mulberry32).

**GSAP :** n'anime que des propriétés visuelles (`opacity`, `x`, `y`, `scale`, `rotation`, `color`,
`backgroundColor`, `borderRadius`, transformations). N'anime PAS `visibility` ni `display`, et
n'appelle pas `video.play()`/`audio.play()`.

**Conflits d'animation :** n'anime jamais la même propriété du même élément depuis plusieurs timelines en même temps.

**Pas de `repeat: -1` :** les timelines à répétition infinie cassent le moteur de capture. Calcule le
nombre exact de répétitions à partir de la durée de la composition : `repeat: Math.ceil(duration / cycleDuration) - 1`.

**Construction synchrone de la timeline :** ne construis jamais de timelines dans `async`/`await`,
`setTimeout` ou des Promises. Le moteur de capture lit `window.__timelines` de façon synchrone après
le chargement de la page. Les polices sont intégrées par le compilateur, donc disponibles tout de
suite — pas besoin d'attendre leur chargement.

**À ne jamais faire :**

1. Oublier l'enregistrement dans `window.__timelines`
2. Utiliser la vidéo pour l'audio — toujours une vidéo muette + un `<audio>` séparé
3. Imbriquer une vidéo dans une div temporisée — utiliser un conteneur non temporisé
4. Utiliser `data-layer` (utiliser `data-track-index`) ou `data-end` (utiliser `data-duration`)
5. Animer les dimensions de l'élément vidéo — animer une div conteneur
6. Appeler play/pause/seek sur un média — le framework gère la lecture
7. Créer un conteneur de premier niveau sans `data-composition-id`
8. Utiliser `repeat: -1` sur une timeline ou une animation — toujours des répétitions finies
9. Construire des timelines de façon asynchrone (dans `async`, `setTimeout`, `Promise`)
10. Utiliser `gsap.set()` sur des éléments de clips de scènes ultérieures — ils n'existent pas dans le DOM au chargement de la page. Utilise plutôt `tl.set(selector, vars, timePosition)` dans la timeline, au temps `data-start` du clip ou après.
11. Utiliser `<br>` dans un texte de contenu — un retour à la ligne forcé ne tient pas compte de la largeur réelle de la police rendue. Un texte qui revient à la ligne naturellement + un `<br>` produit un saut en trop qui crée un chevauchement. Laisse le texte revenir à la ligne grâce à `max-width`. Exception : les titres d'affichage courts où chaque mot est volontairement sur sa propre ligne (par ex. « THE\nIMMORTAL\nGAME » à 130 px).

## Transitions de scène (non négociables)

Chaque composition à plusieurs scènes DOIT respecter TOUTES ces règles. En enfreindre une seule donne une composition cassée.

1. **TOUJOURS utiliser des transitions entre les scènes.** Pas de jump cuts. Sans exception.
2. **TOUJOURS utiliser des animations d'entrée sur chaque scène.** Chaque élément entre avec `gsap.from()`. Aucun élément ne doit apparaître déjà formé. Si une scène a 5 éléments, il lui faut 5 animations d'entrée.
3. **NE JAMAIS utiliser d'animations de sortie** sauf sur la dernière scène. Donc : AUCUN `gsap.to()` qui anime l'opacité à 0, y hors écran, l'échelle à 0 ou toute autre animation de « sortie » avant qu'une transition ne se déclenche. La transition EST la sortie. Le contenu de la scène sortante DOIT être entièrement visible au moment où la transition commence.
4. **Dernière scène seulement :** la dernière scène peut faire disparaître des éléments en fondu (par ex. fondu au noir). C'est la SEULE scène où `gsap.to(..., { opacity: 0 })` est autorisé.

**FAUX — animation de sortie avant la transition :**

```js
// INTERDIT — ça vide la scène avant que la transition puisse l'utiliser
tl.to("#s1-title", { opacity: 0, y: -40, duration: 0.4 }, 6.5);
tl.to("#s1-subtitle", { opacity: 0, duration: 0.3 }, 6.7);
// la transition se déclenche sur une image vide
```

**JUSTE — entrées seulement, la transition gère la sortie :**

```js
// Animations d'entrée de la scène 1
tl.from("#s1-title", { y: 50, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.3);
tl.from("#s1-subtitle", { y: 30, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.6);
// AUCUNE animation de sortie — la transition à 7,2 s gère le changement de scène
// Animations d'entrée de la scène 2
tl.from("#s2-heading", { x: -40, opacity: 0, duration: 0.6, ease: "expo.out" }, 8.0);
```

## Garde-fous d'animation

- Décale la première animation de 0,1 à 0,3 s (pas à t=0)
- Varie les courbes des animations d'entrée — au moins 3 courbes différentes par scène
- Ne répète pas un motif d'entrée dans une même scène
- Évite les dégradés linéaires plein écran sur fond sombre (escaliers en H.264 — utilise un radial ou un aplat + une lueur localisée)
- Titres de 60 px et plus, texte de 20 px et plus, étiquettes de données de 16 px et plus pour une vidéo rendue
- `font-variant-numeric: tabular-nums` sur les colonnes de chiffres
- En français, prévois 15 à 30 % de texte en plus qu'en anglais : vérifie que les titres tiennent

Quand aucun `visual-style.md` ni direction d'animation n'est fourni, suis [house-style.md](./house-style.md) pour les valeurs esthétiques par défaut.

## Typographie et médias

- **Polices :** écris simplement la `font-family` voulue en CSS — le compilateur intègre automatiquement les polices prises en charge. Si une police n'est pas prise en charge, le compilateur prévient.
- Ajoute `crossorigin="anonymous"` aux médias externes
- Pour un texte dynamique qui déborde, utilise `window.__hyperframes.fitTextFontSize(text, { maxWidth, fontFamily, fontWeight })`
- Tous les fichiers vivent à la racine du projet à côté d'`index.html` ; les sous-compositions utilisent `../`

## Modifier des compositions existantes

- Lis d'abord toute la composition — reprends les polices, couleurs et motifs d'animation existants
- Ne change que ce qui est demandé
- Préserve le timing des clips non concernés

## Liste de sortie

- [ ] `npx hyperframes lint` et `npx hyperframes validate` passent tous les deux
- [ ] Avertissements de contraste traités (voir Contrôles qualité plus bas)
- [ ] Chorégraphie des animations vérifiée (voir Contrôles qualité plus bas)

## Contrôles qualité

### Contraste

`hyperframes validate` lance par défaut un audit de contraste WCAG. Il se place à 5 moments, fait une
capture de la page, échantillonne les pixels de fond derrière chaque texte et calcule les rapports
de contraste. Les échecs apparaissent en avertissements :

```
⚠ WCAG AA contrast warnings (3):
  · .subtitle "secondary text" — 2.67:1 (need 4.5:1, t=5.3s)
```

Si des avertissements apparaissent :

- Sur fond sombre : éclaircis la couleur en échec jusqu'à dépasser 4,5:1 (texte normal) ou 3:1 (grand texte, 24 px et plus ou 19 px et plus en gras)
- Sur fond clair : assombris-la
- Reste dans la famille de la palette — n'invente pas une nouvelle couleur, ajuste l'existante
- Relance `hyperframes validate` jusqu'à ce que ce soit propre

Utilise `--no-contrast` pour sauter cette étape si tu itères vite et que tu vérifieras plus tard.

### Carte des animations

Après avoir écrit les animations, lance la carte des animations pour vérifier la chorégraphie :

```bash
node skills/hyperframes/scripts/animation-map.mjs <dossier-composition> \
  --out <dossier-composition>/.hyperframes/anim-map
```

Produit un seul `animation-map.json` avec :

- **Des résumés par animation** : `"#card1 anime opacity+y sur 0.50 s. se déplace de 23 px vers le haut. apparaît en fondu. finit en (120, 200)"`
- **Une timeline en ASCII** : diagramme de Gantt de toutes les animations sur la durée de la composition
- **La détection des décalages** : intervalles réels (`"3 éléments décalés à intervalles de 120 ms"`)
- **Les zones mortes** : périodes de plus d'1 s sans animation — tenue voulue ou entrée manquante ?
- **Le cycle de vie des éléments** : première/dernière animation, visibilité finale
- **Des instantanés de scène** : état des éléments visibles à 5 moments clés
- **Des alertes** : `offscreen` (hors écran), `collision`, `invisible`, `paced-fast` (moins de 0,2 s), `paced-slow` (plus de 2 s)

Lis le JSON. Parcours les résumés pour repérer l'inattendu. Vérifie chaque alerte — corrige ou
justifie. Vérifie que la timeline montre le rythme de chorégraphie voulu. Relance après les corrections.

À sauter pour les petites modifications (corriger une couleur, ajuster une durée). À lancer pour les
nouvelles compositions et les changements d'animation importants.

---

## Références (chargées à la demande)

- **[references/captions.md](references/captions.md)** — Sous-titres, paroles, karaoké synchronisés sur l'audio. Détection du style selon le ton, style par mot, prévention du débordement de texte, garanties de sortie des sous-titres, regroupement des mots. À lire pour tout texte synchronisé sur le timing audio.
- **[references/tts.md](references/tts.md)** — Synthèse vocale avec Kokoro-82M. Choix de la voix, réglage de la vitesse, déroulé synthèse vocale + sous-titres. À lire pour générer une narration ou une voix off.
- **[references/audio-reactive.md](references/audio-reactive.md)** — Animation réactive à l'audio : associer bandes de fréquence et amplitude à des propriétés GSAP. À lire quand les visuels doivent réagir à la musique, à la voix ou au son.
- **[references/css-patterns.md](references/css-patterns.md)** — Mise en avant au surligneur en CSS+GSAP : surlignage, cercle, éclat, gribouillis, rature. Déterministe, entièrement navigable. À lire pour ajouter une insistance visuelle sur du texte.
- **[references/typography.md](references/typography.md)** — Typographie : associations de polices, fonctions OpenType, ajustements sur fond sombre, script de découverte de polices. **À lire à chaque fois** — chaque composition a du texte.
- **[references/motion-principles.md](references/motion-principles.md)** — Principes de motion design : la courbe comme émotion, le timing comme poids, la chorégraphie comme hiérarchie, le rythme des scènes, le mouvement d'ambiance, les anti-motifs. À lire pour chorégraphier des animations GSAP.
- **[visual-styles.md](visual-styles.md)** — 8 styles visuels nommés (Swiss Pulse, Velvet Standard, Deconstructed, Maximalist Type, Data Drift, Soft Signal, Folk Frequency, Shadow Cut) avec palettes hex, signatures de courbes GSAP et associations de shaders. À lire quand l'utilisateur nomme un style ou pour générer un DESIGN.md.
- **[house-style.md](house-style.md)** — Mouvement, tailles et palettes par défaut quand aucun style n'est précisé.
- **[patterns.md](patterns.md)** — Motifs d'incrustation (PiP), cartes de titre, diaporama.
- **[data-in-motion.md](data-in-motion.md)** — Motifs de données, chiffres et infographies.
- **[references/transcript-guide.md](references/transcript-guide.md)** — Commandes de transcription, modèles Whisper, API externes, dépannage.
- **[references/dynamic-techniques.md](references/dynamic-techniques.md)** — Techniques d'animation dynamique des sous-titres (karaoké, clip-path, claque, dispersion, élastique, 3D).

- **[references/transitions.md](references/transitions.md)** — Transitions de scène : fondus enchaînés, volets, révélations, transitions en shader. Choix selon l'énergie et l'ambiance, CSS ou WebGL. **À lire à chaque fois pour les compositions à plusieurs scènes** — des scènes sans transitions font l'effet de jump cuts.
  - [transitions/catalog.md](references/transitions/catalog.md) — Règles dures, modèle de scène et renvoi vers le code d'implémentation par type.
  - Les transitions en shader sont dans `@hyperframes/shader-transitions` (`packages/shader-transitions/`) — lis le code du paquet, pas les fichiers du skill.

Les motifs et effets GSAP sont dans le skill `/gsap`.

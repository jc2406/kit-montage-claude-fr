# Effets GSAP pour HyperFrames

Motifs d'animation prêts à l'emploi pour les compositions HyperFrames. Chaque effet est autonome, avec HTML, CSS et code.

Tous les effets suivent les règles de composition HyperFrames — déterministes, sans aléatoire, timelines enregistrées via `window.__timelines`.

## Sommaire

- [Machine à écrire](#machine-à-écrire)
- [Visualiseur audio](#visualiseur-audio)

---

## Machine à écrire

Révèle le texte caractère par caractère avec le TextPlugin de GSAP.

### Plugin requis

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/TextPlugin.min.js"></script>
<script>
  gsap.registerPlugin(TextPlugin);
</script>
```

### Machine à écrire simple

```js
const text = "Bonjour tout le monde !";
const cps = 10; // caractères par seconde : 3-5 dramatique, 8-12 conversation, 15-20 énergique
tl.to(
  "#typed-text",
  { text: { value: text }, duration: text.length / cps, ease: "none" },
  startTime,
);
```

### Avec curseur clignotant

Trois règles :

1. **Un seul curseur visible à la fois** — cache le précédent avant d'afficher le suivant.
2. **Le curseur doit clignoter au repos** — après la frappe, pendant les pauses.
3. **Aucun espace entre le texte et le curseur** — les éléments doivent être collés dans le HTML.

```html
<span id="typed-text"></span><span id="cursor" class="cursor-blink">|</span>
```

```css
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.cursor-blink {
  animation: blink 0.8s step-end infinite;
}
.cursor-solid {
  animation: none;
  opacity: 1;
}
.cursor-hide {
  animation: none;
  opacity: 0;
}
```

Motif : clignote → fixe (la frappe commence) → frappe → fixe → clignote (frappe terminée).

```js
tl.call(() => cursor.classList.replace("cursor-blink", "cursor-solid"), [], startTime);
tl.to("#typed-text", { text: { value: text }, duration: dur, ease: "none" }, startTime);
tl.call(() => cursor.classList.replace("cursor-solid", "cursor-blink"), [], startTime + dur);
```

### Effacement (retour arrière)

TextPlugin retire par le début — faux pour un retour arrière. Retire les caractères à la main avec une sous-chaîne :

```js
function backspace(tl, selector, word, startTime, cps) {
  const el = document.querySelector(selector);
  const interval = 1 / cps;
  for (let i = word.length - 1; i >= 0; i--) {
    tl.call(
      () => {
        el.textContent = word.slice(0, i);
      },
      [],
      startTime + (word.length - i) * interval,
    );
  }
  return word.length * interval;
}
```

### Espacement avec un texte fixe

Quand un mot tapé à la machine est à côté d'un texte fixe, utilise `margin-left` sur un span englobant. N'utilise pas le gap de flex (il éloigne le curseur du texte) ni un espace final dans le texte fixe (il disparaît quand la partie dynamique est vide).

```html
<div style="display:flex; align-items:baseline;">
  <span style="font-size:40px; color:#555;">Livre quelque chose</span>
  <span style="margin-left:14px;"><span id="word"></span><span id="cursor">|</span></span>
</div>
```

### Rotation de mots

Frappe → pause → effacement → mot suivant. Le curseur clignote à chaque moment de repos (pauses, après l'effacement).

```js
words.forEach((word, i) => {
  const typeDur = word.length / 10;
  // Fixe pendant la frappe
  tl.call(() => cursor.classList.replace("cursor-blink", "cursor-solid"), [], offset);
  tl.to("#typed-text", { text: { value: word }, duration: typeDur, ease: "none" }, offset);
  // Clignote pendant la pause
  tl.call(() => cursor.classList.replace("cursor-solid", "cursor-blink"), [], offset + typeDur);
  offset += typeDur + 1.5; // pause

  if (i < words.length - 1) {
    tl.call(() => cursor.classList.replace("cursor-blink", "cursor-solid"), [], offset);
    const clearDur = backspace(tl, el, word, offset, 20);
    tl.call(() => cursor.classList.replace("cursor-solid", "cursor-blink"), [], offset + clearDur);
    offset += clearDur + 0.3;
  }
});
```

### Ajout de mots

Construis une phrase mot par mot dans le même élément :

```js
let accumulated = "";
words.forEach((word) => {
  const target = accumulated + (accumulated ? " " : "") + word;
  const newChars = target.length - accumulated.length;
  tl.to("#typed-text", { text: { value: target }, duration: newChars / 10, ease: "none" }, offset);
  accumulated = target;
  offset += newChars / 10 + 0.3;
});
```

### Passage du curseur entre plusieurs lignes

Quand le curseur passe d'une ligne à l'autre : cacher le précédent → faire clignoter le nouveau → pause → fixe pendant la frappe. Ne passe jamais directement de caché à fixe (ça saute l'état de repos).

```js
tl.call(
  () => {
    prevCursor.classList.replace("cursor-blink", "cursor-hide");
    nextCursor.classList.replace("cursor-hide", "cursor-blink");
  },
  [],
  handoffTime,
);

const typeStart = handoffTime + 0.5; // courte pause en clignotant
tl.call(() => nextCursor.classList.replace("cursor-blink", "cursor-solid"), [], typeStart);
tl.to("#next-text", { text: { value: text }, duration: dur, ease: "none" }, typeStart);
tl.call(() => nextCursor.classList.replace("cursor-solid", "cursor-blink"), [], typeStart + dur);
```

### Guide de rythme

| Car./s | Ressenti          | Idéal pour                         |
| ------ | ----------------- | ---------------------------------- |
| 3-5    | Lent, appuyé      | Révélations dramatiques, suspense  |
| 8-12   | Frappe naturelle  | Dialogue, narration                |
| 15-20  | Rapide, énergique | Démos tech, code                   |
| 30+    | Quasi instantané  | Remplir de longs blocs             |

---

## Visualiseur audio

Extrais les données audio à l'avance, puis pilote le rendu canvas/DOM depuis la timeline GSAP.

### Extraire les données audio

```bash
python scripts/extract-audio-data.py audio.mp3 -o audio-data.json
python scripts/extract-audio-data.py video.mp4 --fps 30 --bands 16 -o audio-data.json
```

Nécessite ffmpeg et numpy.

### Format des données

```json
{
  "fps": 30, "totalFrames": 5415,
  "frames": [{ "time": 0.0, "rms": 0.42, "bands": [0.8, 0.6, 0.3, ...] }]
}
```

- **rms** (0-1) : volume global, normalisé sur toute la piste
- **bands[]** (0-1) : amplitudes par fréquence. Indice 0 = graves, plus haut = aigus. Chaque bande est normalisée indépendamment.

### Charger les données

```js
// Option A : en ligne (petits fichiers, moins de ~500 Ko)
var AUDIO_DATA = {
  /* coller le contenu d'audio-data.json */
};

// Option B : XHR synchrone (gros fichiers — doit être synchrone pour construire la timeline de façon déterministe)
var xhr = new XMLHttpRequest();
xhr.open("GET", "audio-data.json", false);
xhr.send();
var AUDIO_DATA = JSON.parse(xhr.responseText);
```

**N'utilise PAS `fetch()` asynchrone pour charger les données audio.** HyperFrames exige une construction synchrone de la timeline — le moteur de capture lit `window.__timelines` de façon synchrone après le chargement de la page. Construire les timelines dans des rappels `.then()` veut dire que la timeline n'est pas prête quand la capture commence.

### Approches de rendu

**Canvas 2D** (le plus courant — barres, formes d'onde, cercles, dégradés) :

```js
for (let f = 0; f < AUDIO_DATA.totalFrames; f++) {
  tl.call(
    () => {
      const frame = AUDIO_DATA.frames[f];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // dessiner avec frame.rms et frame.bands
    },
    [],
    f / AUDIO_DATA.fps,
  );
}
```

**WebGL / Three.js** — HyperFrames modifie `THREE.Clock` pour un temps déterministe. Mets à jour les uniforms à partir des données audio à chaque image.

**Éléments DOM** — bien pour moins de 20 éléments, moins performant que Canvas au-delà.

### Répartition spatiale

- **Horizontale** : graves à gauche, aigus à droite (parcourir les bandes de gauche à droite)
- **Verticale** : graves en bas, aigus en haut
- **Circulaire** : graves à midi, puis dans le sens horaire ; en miroir pour un cercle complet

### Lissage

```js
let prev = null;
const smoothing = 0.25; // 0.1-0.2 nerveux, 0.3-0.5 fluide
function smooth(f) {
  const raw = AUDIO_DATA.frames[f];
  if (!prev) {
    prev = { rms: raw.rms, bands: [...raw.bands] };
    return prev;
  }
  prev = {
    rms: prev.rms * smoothing + raw.rms * (1 - smoothing),
    bands: raw.bands.map((b, i) => prev.bands[i] * smoothing + b * (1 - smoothing)),
  };
  return prev;
}
```

### Principes de mouvement

- **Les graves pilotent les grands mouvements** — échelle, lueur, déplacements
- **Les aigus pilotent les détails** — scintillement, clignotement, effets de bord
- **Le RMS pilote le global** — luminosité du fond, énergie d'ensemble
- Choisis 2 ou 3 propriétés à animer. Au-delà, ça fait brouillon.
- Garde des minimums au-dessus de zéro — les passages calmes ont besoin de vie.

### Nombre de bandes

| Bandes | Détail     | Idéal pour                        |
| ------ | ---------- | --------------------------------- |
| 4      | Faible     | Lueur de fond, pulsation          |
| 8      | Moyen      | Histogrammes, spectre simple      |
| 16     | Élevé      | Égaliseur détaillé (par défaut)   |
| 32     | Très élevé | Mises en page radiales denses     |

### Superposition

Superpose plusieurs canvas avec le z-index CSS pour créer de la profondeur — une couche de fond pilotée par les graves/le RMS et une couche de premier plan pilotée par les bandes individuelles donnent de la profondeur sans complexité.

```html
<canvas id="bg-layer" style="position:absolute;top:0;left:0;z-index:1;"></canvas>
<canvas id="main-layer" style="position:absolute;top:0;left:0;z-index:2;"></canvas>
```

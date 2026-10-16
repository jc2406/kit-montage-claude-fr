# Motifs CSS de surlignage au marqueur

Implémentations en pur CSS + GSAP des cinq modes de dessin de MarkerHighlight.js. À utiliser pour un rendu déterministe dans les compositions HyperFrames — aucune dépendance à une bibliothèque externe, contrôle total par la timeline GSAP.

## Sommaire

- [1. Mode surlignage](#1-mode-surlignage) — Balayage de surligneur jaune derrière le texte
- [2. Mode cercle](#2-mode-cercle) — Ellipse dessinée à la main autour du texte
- [3. Mode éclat](#3-mode-éclat) — Lignes qui rayonnent depuis le texte
- [4. Mode gribouillis](#4-mode-gribouillis) — Gribouillis chaotique sur le texte
- [5. Mode rature](#5-mode-rature) — Contour rectangulaire approximatif

## 1. Mode surlignage

Balayage de surligneur jaune derrière le texte. Le mode le plus courant.

```html
<span class="mh-highlight-wrap">
  <span class="mh-highlight-bar" id="hl-1"></span>
  <span class="mh-highlight-text">texte surligné</span>
</span>
```

```css
.mh-highlight-wrap {
  position: relative;
  display: inline;
}
.mh-highlight-bar {
  position: absolute;
  top: 0;
  left: -6px;
  right: -6px;
  bottom: 0;
  background: #fdd835;
  opacity: 0.35;
  transform: scaleX(0);
  transform-origin: left center;
  border-radius: 3px;
  z-index: 0;
}
.mh-highlight-text {
  position: relative;
  z-index: 1;
}
```

```js
// Balayage depuis la gauche
tl.to("#hl-1", { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.6);

// Optionnel : inclinaison pour un effet fait main
// gsap.set("#hl-1", { skewX: -2 });
```

### Surlignage sur plusieurs lignes

Décale les barres sur plusieurs lignes :

```js
tl.to(
  ".mh-highlight-bar",
  {
    scaleX: 1,
    duration: 0.5,
    ease: "power2.out",
    stagger: 0.3,
  },
  0.6,
);
```

## 2. Mode cercle

Cercle dessiné à la main autour du texte. Utilise `border-radius: 50%` avec une légère rotation pour un effet organique.

```html
<span class="mh-circle-wrap">
  <span class="mh-circle-text" id="circle-word">ESSENTIEL</span>
  <span class="mh-circle-ring" id="circle-1"></span>
</span>
```

```css
.mh-circle-wrap {
  position: relative;
  display: inline;
}
.mh-circle-text {
  position: relative;
  z-index: 1;
}
.mh-circle-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 130%;
  height: 160%;
  transform: translate(-50%, -50%) rotate(-3deg) scale(0);
  border: 3px solid #e53935;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
```

```js
// Le cercle apparaît en grandissant avec une oscillation
tl.to(
  "#circle-1",
  {
    scale: 1,
    rotation: -3,
    duration: 0.6,
    ease: "back.out(1.7)",
    transformOrigin: "center center",
  },
  0.7,
);
```

### Variations

```css
/* Cercle plus serré (pour les mots courts) */
.mh-circle-ring.tight {
  width: 150%;
  height: 180%;
}

/* Cercle carré (rectangle arrondi) */
.mh-circle-ring.rounded {
  border-radius: 30%;
  width: 120%;
  height: 140%;
}

/* Ellipse (plus large que haute) */
.mh-circle-ring.ellipse {
  width: 150%;
  height: 130%;
  border-radius: 50%;
}
```

## 3. Mode éclat

Des lignes qui rayonnent depuis le centre du texte. Chaque ligne est une div positionnée et tournée selon son angle.

```html
<span class="mh-burst-wrap">
  <span class="mh-burst-text">WAOUH</span>
  <span class="mh-burst-container" id="burst-1">
    <span class="mh-burst-line" style="--angle: 0deg; --len: 70px;"></span>
    <span class="mh-burst-line" style="--angle: 30deg; --len: 55px;"></span>
    <span class="mh-burst-line" style="--angle: 60deg; --len: 80px;"></span>
    <span class="mh-burst-line" style="--angle: 90deg; --len: 45px;"></span>
    <span class="mh-burst-line" style="--angle: 120deg; --len: 65px;"></span>
    <span class="mh-burst-line" style="--angle: 150deg; --len: 75px;"></span>
    <span class="mh-burst-line" style="--angle: 180deg; --len: 50px;"></span>
    <span class="mh-burst-line" style="--angle: 210deg; --len: 60px;"></span>
    <span class="mh-burst-line" style="--angle: 240deg; --len: 80px;"></span>
    <span class="mh-burst-line" style="--angle: 270deg; --len: 40px;"></span>
    <span class="mh-burst-line" style="--angle: 300deg; --len: 70px;"></span>
    <span class="mh-burst-line" style="--angle: 330deg; --len: 55px;"></span>
  </span>
</span>
```

```css
.mh-burst-wrap {
  position: relative;
  display: inline;
}
.mh-burst-text {
  position: relative;
  z-index: 2;
}
.mh-burst-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  z-index: 1;
}
.mh-burst-line {
  position: absolute;
  display: block;
  width: 3px;
  height: var(--len);
  background: #1e88e5;
  left: -1.5px;
  top: calc(-1 * var(--len));
  transform: rotate(var(--angle));
  transform-origin: bottom center;
  opacity: 0;
}
```

```js
// Toutes les lignes jaillissent vers l'extérieur en même temps, avec un léger décalage
tl.fromTo(
  "#burst-1 .mh-burst-line",
  { scaleY: 0, opacity: 0 },
  { scaleY: 1, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.03 },
  0.7,
);
```

**Varie la longueur des lignes** (entre 40 et 80 px) pour un effet organique, fait main. Des longueurs égales font mécanique.

## 4. Mode gribouillis

Des soulignements et barrés ondulés en SVG qui se dessinent tout seuls via `stroke-dashoffset`.

```html
<span class="mh-scribble-wrap">
  <span class="mh-scribble-text">texte souligné</span>
  <svg class="mh-scribble-svg" viewBox="0 0 500 24" preserveAspectRatio="none">
    <path
      id="scribble-1"
      d="M0,12 Q31,0 62,12 Q93,24 125,12 Q156,0 187,12 Q218,24 250,12 Q281,0 312,12 Q343,24 375,12 Q406,0 437,12 Q468,24 500,12"
      fill="none"
      stroke="#FDD835"
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>
</div>
```

```css
.mh-scribble-wrap {
  position: relative;
  display: inline;
}
.mh-scribble-text {
  position: relative;
  z-index: 1;
}
.mh-scribble-svg {
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 24px;
  z-index: 0;
}
```

```js
// Mesurer la longueur du tracé et définir l'état initial des tirets
var path = document.querySelector("#scribble-1");
var len = path.getTotalLength();
gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

// Tracer la ligne
tl.to(
  "#scribble-1",
  {
    strokeDashoffset: 0,
    duration: 0.8,
    ease: "power1.inOut",
  },
  0.7,
);
```

### Variante barrée

Place le SVG à `top: 50%; transform: translateY(-50%)` au lieu de `bottom: -6px`.

### Générateur de tracé ondulé

Adapte la largeur du viewBox du tracé à la largeur du texte. Le motif d'onde `Q x1,y1 x2,y2` alterne entre `y=0` et `y=24` pour une oscillation naturelle. Ajuste les points de contrôle pour des vagues plus serrées ou plus lâches :

- **Vagues serrées** : de plus petits pas en x (25 px par demi-vague)
- **Vagues lâches** : de plus grands pas en x (50 px par demi-vague)
- **Amplitude** : change la plage en y (0-24 en standard, 0-16 pour un effet subtil)

## 5. Mode rature

Des hachures croisées sur un texte qu'on veut minimiser. Plusieurs lignes en biais créent un effet « barré ».

```html
<span class="mh-sketchout-wrap">
  <span class="mh-sketchout-text">ancien prix</span>
  <span class="mh-sketchout-lines" id="sketchout-1">
    <span class="mh-sketchout-line mh-sketchout-fwd"></span>
    <span class="mh-sketchout-line mh-sketchout-bwd"></span>
  </span>
</span>
```

```css
.mh-sketchout-wrap {
  position: relative;
  display: inline;
}
.mh-sketchout-text {
  position: relative;
  z-index: 0;
}
.mh-sketchout-lines {
  position: absolute;
  top: 0;
  left: -4px;
  right: -4px;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}
.mh-sketchout-line {
  position: absolute;
  display: block;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: #e53935;
  transform-origin: left center;
  transform: scaleX(0);
}
.mh-sketchout-fwd {
  transform: scaleX(0) rotate(-12deg);
}
.mh-sketchout-bwd {
  transform: scaleX(0) rotate(12deg);
}
```

```js
// La barre oblique se trace en premier
tl.to(
  "#sketchout-1 .mh-sketchout-fwd",
  {
    scaleX: 1,
    duration: 0.3,
    ease: "power2.out",
  },
  1.0,
);

// La barre oblique inverse suit
tl.to(
  "#sketchout-1 .mh-sketchout-bwd",
  {
    scaleX: 1,
    duration: 0.3,
    ease: "power2.out",
  },
  1.15,
);
```

## Combiner les modes dans les sous-titres

Fais tourner les modes pour varier visuellement les groupes de sous-titres :

```js
var MODES = ["highlight", "circle", "burst", "scribble"];

GROUPS.forEach(function (group, gi) {
  var mode = MODES[gi % MODES.length];
  // Appliquer le motif CSS du mode aux mots mis en avant de ce groupe
  group.emphasisWords.forEach(function (word) {
    applyMode(word.el, mode, tl, word.start);
  });
});
```

Change de mode tous les 2 ou 3 groupes pour une forte énergie, tous les 3 ou 4 pour une énergie moyenne, tous les 4 ou 5 pour une faible énergie.

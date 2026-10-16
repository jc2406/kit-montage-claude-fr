# Échafaudage de composition — styles limités + motif GSAP en IIFE

Utilisé par l'étape 6 de `/make-a-video`. Chaque sous-composition suit ce motif.

## Pourquoi ce motif

- **Les styles limités** (`[data-composition-id="..."] { ... }`) évitent que le CSS déborde d'une composition à l'autre ou depuis les blocs du catalogue.
- **L'IIFE** garde les variables GSAP hors de l'espace global — plusieurs sous-compositions ne se télescopent pas.
- **L'animation d'ancrage** (`tl.to({}, { duration: SLOT_DURATION }, 0)`) garantit `timeline.duration() ≥ data-duration`, ce qui évite le flash noir qu'HyperFrames produit quand une timeline se termine trop tôt. MOTION_PHILOSOPHY loi 11.

---

## Code de base — un fichier de sous-composition

```html
<div data-composition-id="scene-01-hook" data-start="0" data-duration="1.5">
  <!-- Styles limités — chaque sélecteur sous [data-composition-id] -->
  <style>
    [data-composition-id="scene-01-hook"] {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }
    [data-composition-id="scene-01-hook"] .word {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 96px;
      background: linear-gradient(180deg, #fff 0%, #999 100%);
      -webkit-background-clip: text;
      color: transparent;
    }
  </style>

  <!-- DOM — les éléments temporisés reçoivent class="clip" + data-start/duration/track -->
  <span class="word w1 clip" data-start="0.0" data-duration="0.8" data-track-index="2">Pourquoi</span>
  <span class="word w2 clip" data-start="0.2" data-duration="0.8" data-track-index="2">c'est</span>
  <span class="word w3 clip" data-start="0.4" data-duration="0.8" data-track-index="2">encore</span>
  <span class="word w4 clip" data-start="0.6" data-duration="0.8" data-track-index="2">si</span>
  <span class="word w5 clip" data-start="0.8" data-duration="0.7" data-track-index="2">compliqué ?</span>

  <!-- IIFE + animation d'ancrage -->
  <script>
    (function(){
      const SLOT_DURATION = 1.5;
      const tl = gsap.timeline({ paused: true });

      // Apparition décalée mot par mot
      tl.from('[data-composition-id="scene-01-hook"] .w1',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0);
      tl.from('[data-composition-id="scene-01-hook"] .w2',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0.2);
      tl.from('[data-composition-id="scene-01-hook"] .w3',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0.4);
      tl.from('[data-composition-id="scene-01-hook"] .w4',
        { y: 30, opacity: 0, scale: 0.9, duration: 0.5, ease: 'power3.out' }, 0.6);
      tl.fromTo('[data-composition-id="scene-01-hook"] .w5',
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, 0.8);
      // Travelling à travers le mot héros
      tl.to('[data-composition-id="scene-01-hook"] .w5',
        { scale: 8, opacity: 0, duration: 0.4, ease: 'power2.in' }, 1.1);

      // ANCRE — garde timeline.duration() >= SLOT_DURATION. Non négociable.
      tl.to({}, { duration: SLOT_DURATION }, 0);

      // Enregistrement — la clé DOIT correspondre exactement à data-composition-id
      window.__timelines['scene-01-hook'] = tl;
    })();
  </script>
</div>
```

---

## Les règles dures que l'échafaudage impose

1. **La `<div>` de composition racine dans `index.html`** a `id`, `data-composition-id`, `data-start="0"`, `data-width`, `data-height`. Les racines de sous-composition ont `data-composition-id`, `data-start`, `data-duration` — pas de largeur/hauteur.
2. **Chaque élément temporisé visible** a `class="clip"`, `data-start`, `data-duration`, `data-track-index`. **Exceptions :** `<video>` et `<audio>` NE reçoivent PAS `class="clip"` — ça les casse.
3. **Le CSS est limité.** Aucune règle de premier niveau dans un fichier de sous-composition. Chaque sélecteur vit sous `[data-composition-id="..."]`.
4. **Timeline enregistrée** dans `window.__timelines['<id>']` avec une clé identique à `data-composition-id`.
5. **Animation d'ancrage** à la fin de chaque timeline : `tl.to({}, { duration: SLOT_DURATION }, 0)`.
6. **Jamais** `masterTL.add(child)` — HyperFrames relie automatiquement les timelines des sous-compositions au parent.
7. **Jamais** d'appel à `.play()` / `.pause()` ni de réglage de `.currentTime` sur un média. Le framework gère la lecture.
8. **N'anime jamais** `width` · `height` · `top` · `left` directement sur une `<video>` — les navigateurs figent les images. Enveloppe-la dans une `<div>` et anime le conteneur.
9. **Les clips d'une même piste ne se chevauchent jamais** (même `data-track-index`). Utilise des pistes différentes pour les éléments qui se chevauchent.

---

## Motif du fond d'ambiance

Une composition persistante, couche du bas, sur toute la durée de la vidéo.

Dans `index.html` :
```html
<template
  data-composition-src="compositions/ambient-bg.html"
  data-start="0"
  data-duration="<total-secondes>"
  data-track-index="0"></template>
```

`compositions/ambient-bg.html` est sa propre sous-composition : grille + vignettage + grain + dérives
lentes (vignettage qui respire, grille en parallaxe). Elle suit le même motif d'échafaudage — styles
limités, IIFE, animation d'ancrage.

---

## Motif des sous-titres (éléments voisins au niveau du body)

Les sous-titres vont EN DEHORS de la `<div>` de la composition principale dans `index.html`, chacun
avec `data-track-index ≥ 20` :

```html
<div class="cap clip"
     data-start="0.5" data-duration="1.8" data-track-index="30">
  Pourquoi c'est encore si compliqué ?
</div>
<div class="cap clip"
     data-start="2.4" data-duration="2.2" data-track-index="31">
  Livrez plus vite avec ACME.
</div>

<style>
  .cap {
    position: absolute;
    bottom: 72px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 22px;
    border-radius: 14px;
    background: rgba(10, 8, 5, 0.55);
    backdrop-filter: blur(8px);
    font: 500 28px/1.3 Inter, sans-serif;
    color: #fff;
  }
</style>
```

Contrôle centralisé, aucun couplage avec les timelines des scènes. MOTION_PHILOSOPHY §3.8.

---

## Références de temps par alias

Le `data-start` d'un clip peut faire référence à un autre clip par son id :

```html
<span id="intro" data-start="0" data-duration="2">...</span>
<span data-start="intro + 1.5" data-duration="2">...</span>
<span data-start="intro - 0.3" data-duration="2">...</span>
```

Pratique pour de petits décalages autour d'un temps fort nommé sans coder les secondes en dur.

---

## Diagnostic — chaque timeline remplit son créneau

Avant de livrer, ouvre les outils de développement du Studio et lance :

```js
const p = document.querySelector('hyperframes-player');
const iw = p.shadowRoot.querySelector('iframe').contentWindow;
Object.fromEntries(Object.entries(iw.__timelines).map(([k, v]) =>
  [k, +v.duration().toFixed(4)]));
```

Compare chaque valeur au `data-duration` correspondant. Tout écart où
`timeline.duration() < data-duration` est un risque de flash noir. Corrige en ajustant la durée de
l'animation d'ancrage.

---

## Calage sur les images

Les fins d'animation doivent tomber sur des multiples de `1 / fps` :
- 30 images/s : 0.0333, 0.0667, 0.1, 0.1333, 0.1667, 0.2, …
- 60 images/s : 0.0167, 0.0333, 0.05, 0.0667, …

Les courbes à fin raide (`expo.in`, `power4.in`) crénellent visiblement entre deux images.
MOTION_PHILOSOPHY §4.

---

## Déterminisme

N'utilise jamais `Math.random()` ni `Date.now()` dans la logique de rendu. Utilise des hachages à graine :

```js
// Pseudo-aléatoire déterministe par indice
const noise = i => 80 + 220 * Math.abs(Math.sin(i * 0.7 + 0.3) * Math.cos(i * 1.3 + 0.7));
```

Les rendus doivent être identiques image par image d'une exécution à l'autre.

## Distorsion

### Glitch

Des superpositions teintées RVB (PAS en mélange multiply — utilise un mélange normal à 35 % d'opacité) tremblent avec de grands décalages. La scène elle-même tremble aussi.

```js
tl.set("#glitch-r", { opacity: 1, x: 40, y: -8 }, T);
tl.set("#glitch-g", { opacity: 1, x: -30, y: 12 }, T);
tl.set("#glitch-b", { opacity: 1, x: 15, y: -20 }, T);
tl.set(old, { x: -15 }, T);
// 6 images de tremblement à 0,03 s d'intervalle avec de grands décalages (±30-60 px)
// ... échanger et nettoyer à T + 0.2
```

### Aberration chromatique

Les superpositions RVB démarrent alignées puis s'écartent (±80 px), la scène disparaît en fondu, puis elles convergent sur la nouvelle scène.

```js
tl.set("#glitch-r", { opacity: 0.6, x: 0 }, T);
tl.set("#glitch-g", { opacity: 0.6, x: 0 }, T);
tl.set("#glitch-b", { opacity: 0.6, x: 0 }, T);
tl.to("#glitch-r", { x: -80, opacity: 0.8, duration: 0.3, ease: "power2.in" }, T);
tl.to("#glitch-b", { x: 80, opacity: 0.8, duration: 0.3, ease: "power2.in" }, T);
tl.to("#glitch-g", { y: 30, duration: 0.3, ease: "power2.in" }, T);
// Échanger à T + 0.3, reconverger à partir de T + 0.3
```

### Ondulation

Oscillation rapide (±30 px) + distorsion d'échelle (0,97-1,03) + flou croissant. Échange au pic de distorsion.

```js
tl.to(old, { x: 30, scale: 1.02, duration: 0.04, ease: "none" }, T);
tl.to(old, { x: -25, scale: 0.98, filter: "blur(4px)", duration: 0.04, ease: "none" }, T + 0.04);
// ... d'autres oscillations avec un flou croissant
// Échanger au pic, la scène entrante se stabilise avec une oscillation décroissante
```

### Bande VHS

Clone la scène en 20 bandes horizontales (de 54 px chacune, découpées par clip-path). Chaque bande se décale en x indépendamment, avec des décalages pseudo-aléatoires à graine, à des intervalles aléatoires propres à chaque barre. Ajoute des copies décalées chromatiques rouge + bleu sur chaque bande (z-index au-dessus de la principale, 35 % d'opacité). Rends les bandes plus larges que le cadre (2020 px à left:-50px) pour que les bords ne se voient jamais.

Voir catalog.md (« Bande VHS ») pour le motif d'implémentation par clonage.

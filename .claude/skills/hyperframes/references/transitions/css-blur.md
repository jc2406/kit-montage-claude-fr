## Flou

Toutes les transitions floues s'adaptent à l'énergie. Voir la section « Intensité du flou selon l'énergie » de transitions.md pour le tableau complet.

### Flou traversant

Le contenu devient complètement abstrait avant de se résoudre. La transition floue la plus lourde.

**Calme (par défaut pour ce type — il est lourd par nature) :**

```js
tl.to(old, { filter: "blur(30px)", scale: 1.08, duration: 0.5, ease: "power1.in" }, T);
tl.to(old, { opacity: 0, duration: 0.3, ease: "power1.in" }, T + 0.3);
// Tenue : les deux scènes dans un état de flou abstrait
tl.fromTo(new,
  { filter: "blur(30px)", scale: 0.92, opacity: 0 },
  { filter: "blur(30px)", scale: 0.92, opacity: 1, duration: 0.2, ease: "none" }, T + 0.5);
// Résolution lente
tl.to(new, { filter: "blur(0px)", scale: 1, duration: 0.7, ease: "power1.out" }, T + 0.7);
```

**Moyenne :**

```js
tl.to(old, { filter: "blur(15px)", scale: 1.05, opacity: 0, duration: 0.4, ease: "power2.in" }, T);
tl.fromTo(new,
  { filter: "blur(15px)", scale: 0.95, opacity: 0 },
  { filter: "blur(0px)", scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }, T + 0.2);
```

### Flou directionnel

Flou + inclinaison qui simulent un mouvement dans une direction. Adapte le flou et l'inclinaison à l'énergie.

**Moyenne (par défaut) :**

```js
tl.to(old, { filter: "blur(12px)", skewX: -8, x: -200, opacity: 0, duration: 0.4, ease: "power3.in" }, T);
tl.fromTo(new,
  { filter: "blur(12px)", skewX: 8, x: 200, opacity: 0 },
  { filter: "blur(0px)", skewX: 0, x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, T + 0.15);
```

**Calme (flou plus fort, mouvement plus doux) :**

```js
tl.to(old, { filter: "blur(20px)", skewX: -4, x: -100, opacity: 0, duration: 0.6, ease: "power1.in" }, T);
tl.fromTo(new,
  { filter: "blur(20px)", skewX: 4, x: 100, opacity: 0 },
  { filter: "blur(0px)", skewX: 0, x: 0, opacity: 1, duration: 0.6, ease: "power1.out" }, T + 0.3);
```

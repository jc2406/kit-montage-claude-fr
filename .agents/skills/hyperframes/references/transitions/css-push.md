## Linéaire / poussée

### Poussée latérale

Les deux scènes bougent ensemble — la nouvelle pousse l'ancienne dehors.

```js
tl.to(old, { x: -1920, duration: 0.5, ease: "power3.inOut" }, T);
tl.fromTo(new, { x: 1920, opacity: 1 }, { x: 0, duration: 0.5, ease: "power3.inOut" }, T);
```

### Poussée verticale

Comme la poussée latérale, mais à la verticale.

```js
tl.to(old, { y: -1080, duration: 0.5, ease: "power3.inOut" }, T);
tl.fromTo(new, { y: 1080, opacity: 1 }, { y: 0, duration: 0.5, ease: "power3.inOut" }, T);
```

### Poussée élastique

Poussée avec un rebond de dépassement sur la scène entrante.

```js
tl.to(old, { x: -1920, duration: 0.5, ease: "power3.in" }, T);
tl.fromTo(new, { x: 1920, opacity: 1 }, { x: 30, duration: 0.4, ease: "power4.out" }, T + 0.1);
tl.to(new, { x: -15, duration: 0.15, ease: "sine.inOut" }, T + 0.5);
tl.to(new, { x: 0, duration: 0.1, ease: "sine.out" }, T + 0.65);
```

### Compression

L'ancienne scène se comprime, la nouvelle s'étend depuis le côté opposé.

```js
tl.to(old, { scaleX: 0, transformOrigin: "left center", duration: 0.4, ease: "power3.inOut" }, T);
tl.fromTo(new, { scaleX: 0, transformOrigin: "right center", opacity: 1 },
  { scaleX: 1, duration: 0.4, ease: "power3.inOut" }, T + 0.1);
tl.set(old, { opacity: 0 }, T + 0.5);
```

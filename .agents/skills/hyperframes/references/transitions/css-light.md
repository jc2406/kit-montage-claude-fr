## Lumière

### Fuite de lumière

Plusieurs superpositions aux couleurs chaudes balaient le cadre. Il faut : une couche de teinte chaude à plat + 2 ou 3 div en dégradé radial lumineux, toutes plus grandes que le cadre pour que leurs bords ne se voient jamais.

```js
// Une teinte chaude couvre tout le cadre
tl.to("#leak-warm", { opacity: 0.4, duration: 0.3, ease: "power1.in" }, T);
// Les éléments lumineux de la fuite arrivent en dérivant
tl.to("#leak-1", { opacity: 0.9, x: 300, duration: 0.5, ease: "sine.inOut" }, T + 0.05);
tl.to("#leak-2", { opacity: 0.8, x: 200, duration: 0.6, ease: "sine.inOut" }, T + 0.1);
// Pic de chaleur puis échange
tl.to("#leak-warm", { opacity: 0.6, duration: 0.15, ease: "power2.in" }, T + 0.35);
tl.set(old, { opacity: 0 }, T + 0.45);
tl.set(new, { opacity: 1 }, T + 0.45);
// La fuite s'estompe
tl.to("#leak-warm", { opacity: 0, duration: 0.4, ease: "power2.out" }, T + 0.5);
tl.to("#leak-1", { opacity: 0, x: 600, duration: 0.35, ease: "power1.out" }, T + 0.5);
```

### Brûlure par surexposition

La scène se surexpose progressivement jusqu'au blanc avec le CSS `filter: brightness()`, puis une superposition blanche apparaît en fondu. Échange au pic de blanc. Le blanc se retire pour révéler la nouvelle scène.

```js
tl.to(old, { filter: "brightness(1.5)", scale: 1.03, duration: 0.2, ease: "power1.in" }, T);
tl.to(old, { filter: "brightness(3)", scale: 1.06, duration: 0.2, ease: "power2.in" }, T + 0.2);
tl.to("#flash-overlay", { opacity: 0.5, duration: 0.25, ease: "power1.in" }, T + 0.15);
tl.to("#flash-overlay", { opacity: 1, duration: 0.15, ease: "power2.in" }, T + 0.4);
tl.set(old, { opacity: 0, filter: "brightness(1)", scale: 1 }, T + 0.55);
tl.set(new, { opacity: 1 }, T + 0.55);
tl.to("#flash-overlay", { opacity: 0, duration: 0.35, ease: "power2.out" }, T + 0.55);
```

### Brûlure de pellicule

Des superpositions chaudes décalées (ambre, orange, rouge) bavent depuis un bord. Chaque superposition est une grande div en dégradé radial avec un z-index élevé.

```js
tl.to("#burn-a", { opacity: 1, x: -300, duration: 0.4, ease: "power1.in" }, T);
tl.to("#burn-b", { opacity: 1, x: -500, duration: 0.5, ease: "power1.in" }, T + 0.05);
tl.to("#burn-c", { opacity: 1, x: -200, duration: 0.45, ease: "power1.in" }, T + 0.1);
tl.set(old, { opacity: 0 }, T + 0.35);
tl.set(new, { opacity: 1 }, T + 0.35);
tl.to("#burn-a", { opacity: 0, duration: 0.3, ease: "power2.out" }, T + 0.45);
tl.to("#burn-b", { opacity: 0, duration: 0.3, ease: "power2.out" }, T + 0.5);
tl.to("#burn-c", { opacity: 0, duration: 0.3, ease: "power2.out" }, T + 0.55);
```

## Recouvrement

### Blocs de couleur décalés

Des div colorées plein écran (1920x1080) traversent le cadre en décalé. Les scènes s'échangent pendant qu'elles sont couvertes.

**2 blocs** (standard) :

```js
tl.set("#wipe-a", { x: -1920 }, T - 0.01);
tl.set("#wipe-b", { x: -1920 }, T - 0.01);
tl.to("#wipe-a", { x: 0, duration: 0.25, ease: "power3.inOut" }, T);
tl.to("#wipe-b", { x: 0, duration: 0.25, ease: "power3.inOut" }, T + 0.06);
tl.set(old, { opacity: 0 }, T + 0.2);
tl.set(new, { opacity: 1 }, T + 0.2);
tl.to("#wipe-a", { x: 1920, duration: 0.25, ease: "power3.inOut" }, T + 0.28);
tl.to("#wipe-b", { x: 1920, duration: 0.25, ease: "power3.inOut" }, T + 0.34);
```

**5 blocs** (variante dense) : même motif avec 5 blocs décalés de 0,04 s. Utilise les couleurs de la palette de la composition.

### Stores horizontaux

Des bandes pleine largeur traversent le cadre en décalé. Chaque bande : `width: 1920px; height: Xpx`.

**6 bandes** (180 px chacune) : décalage de `0.03s`
**12 bandes** (90 px chacune) : décalage de `0.018s`

```js
for (var i = 0; i < N; i++) {
  tl.set("#blind-h-" + i, { x: -1920 }, T - 0.01);
  tl.fromTo("#blind-h-" + i, { x: -1920 }, { x: 0, duration: 0.2, ease: "power3.inOut" }, T + i * stagger);
}
tl.set(old, { opacity: 0 }, T + coverTime);
tl.set(new, { opacity: 1 }, T + coverTime);
for (var i = 0; i < N; i++) {
  tl.to("#blind-h-" + i, { x: 1920, duration: 0.2, ease: "power3.inOut" }, T + exitStart + i * stagger);
}
```

### Stores verticaux

Comme les stores horizontaux, mais les bandes sont hautes et étroites et se déplacent sur l'axe Y.

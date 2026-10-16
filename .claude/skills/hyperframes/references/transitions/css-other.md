## Autres

### Chute par gravité

L'ancienne scène tombe vers le bas avec une légère rotation. La nouvelle scène était derrière. Demande une gestion du z-index.

```js
tl.set(new, { opacity: 1, zIndex: 1 }, T);
tl.set(old, { zIndex: 10 }, T);
tl.to(old, { y: 1200, rotation: 4, duration: 0.5, ease: "power3.in" }, T);
tl.set(old, { opacity: 0, zIndex: "auto" }, T + 0.5);
tl.set(new, { zIndex: "auto" }, T + 0.5);
```

### Cercle qui se transforme

Un cercle grandit depuis le centre jusqu'à remplir le cadre (il devient la couleur de fond de la nouvelle scène). Le contenu de la nouvelle scène apparaît en fondu par-dessus.

```js
tl.set("#morph-circle", { background: newBgColor, opacity: 1, scale: 0 }, T);
tl.to("#morph-circle", { scale: 30, duration: 0.5, ease: "power3.in" }, T);
tl.set(old, { opacity: 0 }, T + 0.4);
tl.set(new, { opacity: 1 }, T + 0.4);
tl.to("#morph-circle", { opacity: 0, duration: 0.15, ease: "power2.out" }, T + 0.5);
```

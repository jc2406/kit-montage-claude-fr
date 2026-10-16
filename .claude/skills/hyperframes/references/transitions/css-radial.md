## Radiale / forme

### Iris circulaire

Un cercle qui s'agrandit depuis le centre révèle la nouvelle scène.

```js
tl.set(new, { opacity: 1 }, T);
tl.fromTo(new,
  { clipPath: "circle(0% at 50% 50%)" },
  { clipPath: "circle(75% at 50% 50%)", duration: 0.5, ease: "power2.out" }, T);
tl.set(old, { opacity: 0 }, T + 0.5);
```

### Iris en losange

Une forme de losange qui s'agrandit depuis le centre.

```js
tl.set(new, { opacity: 1 }, T);
tl.fromTo(new,
  { clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" },
  { clipPath: "polygon(50% -20%, 120% 50%, 50% 120%, -20% 50%)", duration: 0.5, ease: "power2.out" }, T);
tl.set(old, { opacity: 0 }, T + 0.5);
```

### Découpe en diagonale

L'ancienne scène se réduit en un triangle dans un coin.

```js
tl.set(new, { opacity: 1, zIndex: 1 }, T);
tl.set(old, { zIndex: 10, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, T);
tl.to(old, { clipPath: "polygon(60% 0%, 100% 0%, 100% 40%, 60% 0%)", duration: 0.5, ease: "power3.inOut" }, T);
tl.set(old, { opacity: 0, zIndex: "auto", clipPath: "none" }, T + 0.5);
tl.set(new, { zIndex: "auto" }, T + 0.5);
```

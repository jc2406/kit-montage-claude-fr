## Dissolution

### Fondu enchaîné

Simple échange d'opacité. La base.

```js
tl.to(old, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, T);
tl.fromTo(new, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.inOut" }, T);
```

### Fondu flou

Dissolution avec flou + changement d'échelle. **Adapte la quantité de flou à l'énergie** — voir la section « Intensité du flou selon l'énergie » de transitions.md. Les exemples ci-dessous montrent la version moyenne (par défaut). Pour une composition calme, monte à 20-30 px avec une tenue de 0,3 à 0,5 s au pic de flou. Pour une forte énergie, descends à 3-6 px sans tenue.

**Moyenne (par défaut) :**

```js
tl.to(old, { filter: "blur(10px)", scale: 1.03, opacity: 0, duration: 0.5, ease: "power2.inOut" }, T);
tl.fromTo(new,
  { filter: "blur(10px)", scale: 0.97, opacity: 0 },
  { filter: "blur(0px)", scale: 1, opacity: 1, duration: 0.5, ease: "power2.inOut" }, T + 0.1);
```

**Calme (bien-être, luxe) — flou fort, tenue sur une couleur abstraite :**

```js
tl.to(old, { filter: "blur(25px)", scale: 1.05, duration: 0.6, ease: "power1.in" }, T);
tl.to(old, { opacity: 0, duration: 0.4, ease: "power1.in" }, T + 0.4);
tl.fromTo(new,
  { filter: "blur(25px)", scale: 0.95, opacity: 0 },
  { filter: "blur(25px)", scale: 0.95, opacity: 1, duration: 0.3, ease: "power1.inOut" }, T + 0.5);
tl.to(new, { filter: "blur(0px)", scale: 1, duration: 0.6, ease: "power1.out" }, T + 0.8);
```

### Bascule de mise au point

La scène sortante devient lentement floue pendant que l'entrante apparaît nette en fondu. Une sensation de profondeur de champ. **Adapte la quantité de flou et la durée de tenue à l'énergie.**

**Moyenne :**

```js
tl.to(old, { filter: "blur(15px)", duration: 0.5, ease: "power1.in" }, T);
tl.to(old, { opacity: 0, duration: 0.3, ease: "power2.in" }, T + 0.25);
tl.fromTo(new, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" }, T + 0.25);
```

**Calme — bascule lente avec une longue tenue au pic du flou :**

```js
tl.to(old, { filter: "blur(30px)", duration: 0.8, ease: "power1.in" }, T);
tl.to(old, { opacity: 0, duration: 0.5, ease: "power1.in" }, T + 0.6);
tl.fromTo(new, { opacity: 0, filter: "blur(20px)" },
  { opacity: 1, filter: "blur(20px)", duration: 0.3, ease: "power1.inOut" }, T + 0.7);
tl.to(new, { filter: "blur(0px)", duration: 0.6, ease: "power1.out" }, T + 1.0);
```

### Plongée de couleur

Fondu vers une couleur unie, tenue, puis apparition en fondu de la nouvelle scène.

```js
tl.to(old, { opacity: 0, duration: 0.2, ease: "power2.in" }, T);
// La couleur de fond apparaît au travers
tl.fromTo(new, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" }, T + 0.25);
```

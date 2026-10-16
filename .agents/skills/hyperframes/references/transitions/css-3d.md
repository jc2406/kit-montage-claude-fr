## 3D

### Retournement de carte en 3D

Rotation de 180° sur l'axe Y. Demande en CSS : `backface-visibility: hidden; transform-style: preserve-3d;` sur les deux conteneurs intérieurs de scène. Le parent a besoin de `perspective: 1200px`.

```js
tl.set(new, { rotationY: -180, opacity: 1 }, T);
tl.to(old, { rotationY: 180, duration: 0.6, ease: "power2.inOut" }, T);
tl.to(new, { rotationY: 0, duration: 0.6, ease: "power2.inOut" }, T);
tl.set(old, { opacity: 0 }, T + 0.6);
```

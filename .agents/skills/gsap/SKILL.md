---
name: gsap
description: Référence d'animation GSAP pour HyperFrames. Couvre gsap.to(), from(), fromTo(), les courbes (easing), stagger, defaults, les timelines (gsap.timeline(), paramètre de position, labels, imbrication, lecture) et la performance (transformations, will-change, quickTo). À utiliser pour écrire des animations GSAP dans les compositions HyperFrames.
---

# GSAP

## Méthodes d'animation de base

- **gsap.to(targets, vars)** — anime de l'état actuel vers `vars`. Le plus courant.
- **gsap.from(targets, vars)** — anime de `vars` vers l'état actuel (entrées).
- **gsap.fromTo(targets, fromVars, toVars)** — début et fin explicites.
- **gsap.set(targets, vars)** — applique immédiatement (durée 0).

Utilise toujours des noms de propriétés en **camelCase** (par ex. `backgroundColor`, `rotationX`).

## vars courantes

- **duration** — en secondes (0,5 par défaut).
- **delay** — secondes avant le départ.
- **ease** — `"power1.out"` (par défaut), `"power3.inOut"`, `"back.out(1.7)"`, `"elastic.out(1, 0.3)"`, `"none"`.
- **stagger** — un nombre `0.1` ou un objet : `{ amount: 0.3, from: "center" }`, `{ each: 0.1, from: "random" }`.
- **overwrite** — `false` (par défaut), `true` ou `"auto"`.
- **repeat** — un nombre ou `-1` pour l'infini. **yoyo** — alterne le sens avec repeat.
- **onComplete**, **onStart**, **onUpdate** — rappels.
- **immediateRender** — `true` par défaut pour from()/fromTo(). Mets `false` sur les animations suivantes qui ciblent la même propriété et le même élément pour éviter l'écrasement.

## Transformations et CSS

Préfère les **alias de transformation** de GSAP à une chaîne `transform` brute :

| Propriété GSAP              | Équivalent          |
| --------------------------- | ------------------- |
| `x`, `y`, `z`               | translateX/Y/Z (px) |
| `xPercent`, `yPercent`      | translateX/Y en %   |
| `scale`, `scaleX`, `scaleY` | scale               |
| `rotation`                  | rotate (degrés)     |
| `rotationX`, `rotationY`    | rotation 3D         |
| `skewX`, `skewY`            | skew                |
| `transformOrigin`           | transform-origin    |

- **autoAlpha** — à préférer à `opacity`. À 0, met aussi `visibility: hidden`.
- **Variables CSS** — `"--hue": 180`.
- **svgOrigin** _(SVG seulement)_ — origine dans l'espace de coordonnées global du SVG. Ne pas combiner avec `transformOrigin`.
- **Rotation directionnelle** — `"360_cw"`, `"-170_short"`, `"90_ccw"`.
- **clearProps** — `"all"` ou une liste séparée par des virgules ; retire les styles en ligne à la fin.
- **Valeurs relatives** — `"+=20"`, `"-=10"`, `"*=2"`.

## Valeurs calculées par fonction

```javascript
gsap.to(".item", {
  x: (i, target, targets) => i * 50,
  stagger: 0.1,
});
```

## Courbes

Courbes intégrées : `power1`–`power4`, `back`, `bounce`, `circ`, `elastic`, `expo`, `sine`. Chacune a `.in`, `.out`, `.inOut`.

## Valeurs par défaut

```javascript
gsap.defaults({ duration: 0.6, ease: "power2.out" });
```

## Contrôler les animations

```javascript
const tween = gsap.to(".box", { x: 100 });
tween.pause();
tween.play();
tween.reverse();
tween.kill();
tween.progress(0.5);
tween.time(0.2);
```

## gsap.matchMedia() (responsive + accessibilité)

N'exécute la mise en place que quand une media query correspond ; annule automatiquement quand elle ne correspond plus.

```javascript
let mm = gsap.matchMedia();
mm.add(
  {
    isDesktop: "(min-width: 800px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions;
    gsap.to(".box", {
      rotation: isDesktop ? 360 : 180,
      duration: reduceMotion ? 0 : 2,
    });
  },
);
```

---

## Timelines

### Créer une timeline

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100 }).to(".b", { y: 50 }).to(".c", { opacity: 0 });
```

### Paramètre de position

Le troisième argument contrôle le placement :

- **Absolu** : `1` — à 1 s
- **Relatif** : `"+=0.5"` — après la fin ; `"-=0.2"` — avant la fin
- **Label** : `"intro"`, `"intro+=0.3"`
- **Alignement** : `"<"` — même début que la précédente ; `">"` — après la fin de la précédente ; `"<0.2"` — 0,2 s après le début de la précédente

```javascript
tl.to(".a", { x: 100 }, 0);
tl.to(".b", { y: 50 }, "<"); // même début que .a
tl.to(".c", { opacity: 0 }, "<0.2"); // 0,2 s après le début de .b
```

### Labels

```javascript
tl.addLabel("intro", 0);
tl.to(".a", { x: 100 }, "intro");
tl.addLabel("outro", "+=0.5");
tl.play("outro");
tl.tweenFromTo("intro", "outro");
```

### Options de timeline

- **paused: true** — créée en pause ; appelle `.play()` pour démarrer.
- **repeat**, **yoyo** — s'appliquent à toute la timeline.
- **defaults** — vars fusionnées dans chaque animation enfant.

### Imbriquer des timelines

```javascript
const master = gsap.timeline();
const child = gsap.timeline();
child.to(".a", { x: 100 }).to(".b", { y: 50 });
master.add(child, 0);
```

### Contrôle de lecture

`tl.play()`, `tl.pause()`, `tl.reverse()`, `tl.restart()`, `tl.time(2)`, `tl.progress(0.5)`, `tl.kill()`.

---

## Performance

### Préférer transform et opacity

Animer `x`, `y`, `scale`, `rotation`, `opacity` reste sur le compositeur. Évite `width`, `height`, `top`, `left` quand des transformations donnent le même effet.

### will-change

```css
will-change: transform;
```

Seulement sur les éléments qui s'animent vraiment.

### gsap.quickTo() pour les mises à jour fréquentes

```javascript
let xTo = gsap.quickTo("#id", "x", { duration: 0.4, ease: "power3" }),
  yTo = gsap.quickTo("#id", "y", { duration: 0.4, ease: "power3" });
container.addEventListener("mousemove", (e) => {
  xTo(e.pageX);
  yTo(e.pageY);
});
```

### Stagger plutôt que beaucoup d'animations

Utilise `stagger` plutôt que des animations séparées avec des délais manuels.

### Nettoyage

Mets en pause ou supprime les animations hors écran.

---

## Références (chargées à la demande)

- **[references/effects.md](references/effects.md)** — Effets prêts à l'emploi : texte machine à écrire, visualiseur audio. À lire quand il te faut des motifs d'effets tout faits pour HyperFrames.

## Bonnes pratiques

- Noms de propriétés en camelCase ; préfère les alias de transformation et autoAlpha.
- Préfère les timelines aux enchaînements avec delay ; utilise le paramètre de position.
- Ajoute des labels avec `addLabel()` pour un séquencement lisible.
- Passe les valeurs par défaut au constructeur de la timeline.
- Garde la valeur de retour de l'animation ou de la timeline quand tu contrôles la lecture.

## À ne pas faire

- Animer des propriétés de mise en page (width/height/top/left) quand des transformations suffisent.
- Utiliser à la fois svgOrigin et transformOrigin sur le même élément SVG.
- Enchaîner des animations avec delay quand une timeline peut les séquencer.
- Créer des animations avant que le DOM n'existe.
- Sauter le nettoyage — supprime toujours les animations qui ne servent plus.

## Destruction

### Page qui brûle

La scène sortante brûle littéralement à partir d'un coin. Un front de feu s'étend avec des bords irréguliers basés sur du bruit, un canvas dessine la ligne carbonisée à la limite de la brûlure, et des caractères ou éléments de texte se détachent et tombent avec la gravité quand le feu les atteint. La scène entrante se révèle derrière la brûlure.

Cette transition fait travailler trois systèmes ensemble :

1. **Géométrie du feu** — un front radial qui s'étend à partir d'un coin (par ex. en bas à droite) avec une irrégularité basée sur du bruit pour des bords organiques
2. **Découpe de la scène** — la scène sortante utilise un clip-path SVG (avec `fill-rule: evenodd`) qui creuse un trou de la forme du front de feu. À mesure que le feu s'étend, une plus grande partie de la scène est découpée. Tout le contenu (texte, images, lignes) brûle avec la page — pas de débris séparés.
3. **Bord carbonisé** — un `<canvas>` superposé dessine une frange en dégradé radial à la limite du feu pour simuler la carbonisation

**Quand l'utiliser :** révélations dramatiques, ambiance nerveuse ou destructrice, jeux vidéo, cyberpunk. C'est la transition la plus spectaculaire du catalogue — réserve-la aux moments héros.

**Prérequis :**

- Un élément `<canvas>` pour la superposition du bord de brûlure
- Une fonction de bruit pour la géométrie organique du bord du feu
- Un clip-path SVG avec fill-rule evenodd pour la découpe inversée

**Géométrie du feu (bruit déterministe) :**

```js
function noise(x) {
  var ix = Math.floor(x),
    fx = x - ix;
  var a = Math.sin(ix * 127.1 + 311.7) * 43758.5453;
  var b = Math.sin((ix + 1) * 127.1 + 311.7) * 43758.5453;
  var t = fx * fx * (3 - 2 * fx);
  return a - Math.floor(a) + (b - Math.floor(b) - (a - Math.floor(a))) * t;
}

function fireRadiusAtAngle(angle, progress) {
  var base = progress * maxRadius;
  return (
    base +
    noise(angle * 3 + progress * 4) * 50 +
    noise(angle * 8 + progress * 9) * 20 +
    noise(angle * 15 + progress * 15) * 8
  );
}
```

**Timing de la scène entrante :** la scène entrante ne doit PAS être visible pendant la brûlure. À mesure que le feu consume la scène sortante, **du noir apparaît par les trous** — c'est la partie spectaculaire. Le spectateur regarde le contenu se détruire sur fond noir.

À environ 90 % de la brûlure, la scène entrante sort LENTEMENT du noir en fondu — d'abord le fond, puis le contenu en décalé. Utilise des fondus longs et doux (`power1.out`, durées de 0,8 à 1,2 s) pour que la nouvelle scène semble se matérialiser à partir de l'obscurité, pas un échange brutal.

```js
// La scène 2 reste à opacity: 0 pendant la brûlure — du noir derrière le feu
tl.set("#s2-title", { opacity: 0 }, T);
tl.set("#s2-subtitle", { opacity: 0 }, T);

// À 90 %, le fond de la scène sort lentement du noir
var contentReveal = T + BURN_DURATION * 0.9;
tl.to("#scene2", { opacity: 1, duration: 1.2, ease: "power1.out" }, contentReveal);

// Le contenu apparaît en décalé par-dessus, encore plus lentement
tl.to("#s2-title", { opacity: 1, duration: 1.0, ease: "power1.out" }, contentReveal + 0.5);
tl.to("#s2-subtitle", { opacity: 1, duration: 0.8, ease: "power1.out" }, contentReveal + 0.7);
```

**Le contenu brûle avec la page — pas de débris qui tombent.** Le clip-path sur scene1 EST l'effet — à mesure que la forme du feu s'étend, tout ce qui est derrière le bord du feu (texte, images, lignes) disparaît naturellement. Ne clone pas d'éléments, ne crée pas de débris qui tombent. Le contenu fait partie de la page consumée. Le bord carbonisé du canvas fournit la ligne visuelle de carbonisation à la limite de la brûlure.

**Cache scene1 via `tl.set` à la fin de la brûlure — JAMAIS dans `onComplete`.** Utiliser `onComplete` pour cacher scene1 n'est pas réversible quand on navigue dans la timeline. Utilise plutôt un `tl.set` au moment exact de la fin de la brûlure :

```js
tl.to(
  burnState,
  {
    progress: 1,
    duration: BURN_DURATION,
    ease: "none",
    onUpdate: function () {
      var wp = burnState.progress;
      var scene1 = document.getElementById("scene1");
      if (wp <= 0) {
        scene1.style.clipPath = "none"; // entièrement visible après un retour en arrière
      } else if (wp < 1) {
        scene1.style.clipPath = buildClipPath(wp);
      }
      drawEdge(wp);
    },
    // PAS d'onComplete — utiliser tl.set à la place
  },
  T,
);

// Cacher scene1 à la fin exacte de la brûlure — réversible via la timeline
tl.set("#scene1", { opacity: 0 }, T + BURN_DURATION);
tl.set("#scene1", { clipPath: "none" }, T + BURN_DURATION);
```

`onUpdate` gère le clip-path et le bord du canvas image par image. Le `tl.set` gère la disparition finale — et GSAP l'inverse automatiquement quand on navigue en arrière, en remettant scene1 à `opacity: 1`.

Le rappel `onUpdate` est la clé — il tourne à chaque image pour faire avancer le clip-path et le bord du canvas en synchro avec la timeline.

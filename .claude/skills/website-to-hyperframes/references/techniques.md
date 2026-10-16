# Référence des techniques visuelles

10 techniques éprouvées issues de vraies vidéos HyperFrames. Utilise-les dans ton storyboard et tes
compositions pour un résultat riche et professionnel. Chaque technique a un motif de code minimal à adapter.

Elles ne sont PAS avancées — ce sont des motifs standard de motion design dont chaque composition
devrait utiliser au moins 2 ou 3.

---

## 1. Tracé de chemin SVG

Un chemin se dessine en temps réel, comme si quelqu'un le traçait au stylo. Pour révéler des
schémas, des flèches, des lignes de liaison ou des marques.

```html
<svg viewBox="0 0 400 200">
  <path
    class="draw-path"
    d="M 50 100 L 200 50 L 350 100"
    stroke="#c84f1c"
    stroke-width="4"
    fill="none"
    stroke-linecap="round"
  />
</svg>
<style>
  .draw-path {
    stroke-dasharray: 280;
    stroke-dashoffset: 280;
  }
</style>
<script>
  tl.to(".draw-path", { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 0.5);
</script>
```

Utilise `path.getTotalLength()` pour calculer dynamiquement la valeur de dasharray.

---

## 2. Art procédural en Canvas 2D

Bruit animé, champs de particules, visualisations de données — tout ce qui évolue image par image.
Pilote-le avec un proxy GSAP.

```html
<canvas id="proc-canvas" width="1920" height="1080"></canvas>
<script>
  var canvas = document.getElementById("proc-canvas");
  var ctx = canvas.getContext("2d");

  function hash(x, y) {
    var n = x * 374761393 + y * 668265263;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) & 0x7fffffff) / 0x7fffffff;
  }

  function drawFrame(t) {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 1920, 1080);
    for (var i = 0; i < 200; i++) {
      var x = hash(i, 0) * 1920;
      var y = hash(i, 1) * 1080;
      var brightness = hash(i, Math.floor(t * 10)) * 255;
      ctx.fillStyle = "rgba(255, 255, 255, " + brightness / 255 + ")";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var proxy = { time: 0 };
  tl.to(
    proxy,
    {
      time: 5,
      duration: 5,
      ease: "none",
      onUpdate: function () {
        drawFrame(proxy.time);
      },
    },
    0,
  );
</script>
```

La fonction `hash()` est déterministe — la même image se rend identiquement à chaque fois.

---

## 3. Transformations 3D en CSS

Des rotations en perspective créent de la profondeur. Pour les vitrines de produit, les cartes qui
se retournent, les révélations architecturales.

```html
<div class="stage" style="perspective: 900px;">
  <div class="card-3d" style="transform-style: preserve-3d;">
    <div class="face front">Produit</div>
    <div class="face back" style="transform: rotateY(180deg);">Détails</div>
  </div>
</div>
<script>
  tl.to(".card-3d", { rotationY: 360, rotationX: 15, duration: 1.2, ease: "sine.inOut" }, 0);
</script>
```

Mets toujours `perspective` sur le parent et `transform-style: preserve-3d` sur l'élément animé.

---

## 4. Typographie cinétique mot à mot

Les mots apparaissent un par un, synchronisés sur les horodatages de transcript.json. La technique
de base des vidéos menées par la narration.

```html
<div class="headline">
  <span class="word w-0">Tout</span>
  <span class="word w-1">ce</span>
  <span class="word w-2">qu'un</span>
  <span class="word w-3">navigateur</span>
  <span class="word w-4">affiche</span>
</div>
<style>
  .word {
    display: inline-block;
    opacity: 0;
    margin: 0 0.12em;
  }
</style>
<script>
  // Débuts des mots tirés de transcript.json (secondes relatives au début du temps fort)
  var timings = [0.0, 0.23, 0.28, 0.63, 0.78];
  var slides = [80, 60, 50, 25, 12]; // décroissance de la glissade horizontale (px)

  document.querySelectorAll(".word").forEach(function (word, i) {
    tl.from(
      word,
      {
        x: slides[i],
        y: 14,
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      },
      timings[i],
    );
  });
</script>
```

La distance de glissade DÉCROÎT d'un mot à l'autre (de 80 à 12 px) — comme une caméra qui se pose.

---

## 5. Animation Lottie

Des animations vectorielles qui jouent dans une composition. Pour les logos, les personnages, les icônes.

```html
<script src="https://cdn.jsdelivr.net/npm/@dotlottie/player-component@2.7.12/dist/dotlottie-player.js"></script>
<dotlottie-player
  class="lottie"
  src="../assets/lottie/animation-0.json"
  autoplay
  loop
  speed="1.5"
  style="width:500px;height:500px;"
>
</dotlottie-player>
<script>
  gsap.set(".lottie", { scale: 0.3, opacity: 0 });
  tl.to(".lottie", { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }, 0.2);
</script>
```

Ou utilise lottie-web pour plus de contrôle :

```javascript
var anim = lottie.loadAnimation({
  container: document.getElementById("anim"),
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "../assets/lottie/animation-0.json",
});
```

---

## 6. Composition vidéo

Intègre de vraies images vidéo dans les compositions. Les vidéos doivent être `muted` avec `playsinline`.

```html
<div class="video-frame" style="width:680px;height:840px;border-radius:16px;overflow:hidden;">
  <video
    id="footage"
    src="../assets/videos/clip.mp4"
    muted
    playsinline
    style="width:100%;height:100%;object-fit:cover;"
  ></video>
</div>
<script>
  // La lecture vidéo est gérée par le framework — n'appelle pas play() à la main
  tl.from(".video-frame", { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.out" }, 0);
</script>
```

Le runtime HyperFrames gère la recherche et la lecture des vidéos.

---

## 7. Frappe caractère par caractère

Effet de frappe de terminal avec `tl.call()` qui met à jour le texte caractère par caractère.

```html
<div class="terminal-line">
  <span class="prompt">❯</span>
  <span class="typed" id="typed-text"></span>
  <span class="cursor" style="width:11px;height:22px;background:#333;display:inline-block;"></span>
</div>
<script>
  var CMD = "npx hyperframes init";
  var typed = document.getElementById("typed-text");

  // Le curseur clignote
  tl.to(".cursor", { opacity: 0, duration: 0.12, yoyo: true, repeat: 20, ease: "steps(1)" }, 0);

  // Taper chaque caractère
  for (var i = 0; i < CMD.length; i++) {
    (function (idx) {
      tl.call(
        function () {
          typed.textContent = CMD.substring(0, idx + 1);
        },
        null,
        (idx / CMD.length) * 0.9,
      );
    })(i);
  }
</script>
```

Utilise `ease: "steps(1)"` pour le clignotement du curseur — ça crée un allumé/éteint net.

---

## 8. Animation des axes de police variable

Anime font-variation-settings pour remodeler les lettres en temps réel. Fonctionne avec les polices
variables qui ont des axes comme la taille optique (opsz), la graisse (wght), la douceur (SOFT).

```html
<style>
  @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900&display=block");
  .wordmark {
    --opsz: 144;
    --wght: 440;
    font-family: "Fraunces", serif;
    font-variation-settings:
      "opsz" var(--opsz),
      "wght" var(--wght);
    font-size: 200px;
  }
</style>
<script>
  tl.to(".wordmark", { "--opsz": 72, "--wght": 300, duration: 0.45, ease: "power2.out" }, 0);
</script>
```

La lettre se remodèle subtilement pendant que les axes s'animent — la taille optique ajuste les
détails, la graisse change l'épaisseur.

---

## 9. MotionPathPlugin de GSAP

Anime un élément le long d'un chemin SVG quelconque. Pour des curseurs qui suivent des courbes, des
particules sur des trajectoires, des révélations guidées.

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/MotionPathPlugin.min.js"></script>
<div class="dot" style="width:20px;height:20px;background:#2a8a7c;border-radius:50%;"></div>
<script>
  gsap.registerPlugin(MotionPathPlugin);
  tl.to(
    ".dot",
    {
      motionPath: { path: "M 12 300 C 280 280 520 80 820 50 S 1200 48 1308 38" },
      duration: 1.5,
      ease: "power2.out",
    },
    0,
  );
</script>
```

---

## 10. Transitions à vitesse raccordée

Sortir d'un temps fort et entrer dans le suivant avec des vitesses raccordées — crée l'impression
d'un mouvement continu.

```javascript
// SORTIE (dans la composition sortante) : accélère avec du flou
tl.to(
  ".content",
  {
    y: -150,
    filter: "blur(30px)",
    opacity: 0,
    duration: 0.33,
    ease: "power2.in", // accélère
  },
  beatDuration - 0.33,
);

// ENTRÉE (dans la composition entrante) : ralentit en sortant du flou
gsap.set(".content", { y: 150, filter: "blur(30px)" });
tl.to(
  ".content",
  {
    y: 0,
    filter: "blur(0px)",
    duration: 1.0,
    ease: "power2.out", // ralentit
  },
  0,
);
```

Le point le plus rapide des deux courbes se rejoint sur la coupe — le spectateur perçoit un mouvement
de caméra fluide. Associe les familles de courbes : `.in` pour les sorties, `.out` pour les entrées.

---

## Quoi utiliser quand

| Énergie de la vidéo                    | Techniques à combiner                                                 |
| -------------------------------------- | --------------------------------------------------------------------- |
| Fort impact (lancements, promos)       | Typographie mot à mot + transitions en vitesse + compteurs             |
| Cinématographique (visites, histoires) | Tracé SVG + composition vidéo + transformations 3D                     |
| Technique (outils dev, API)            | Frappe caractère par caractère + Canvas 2D procédural + MotionPath     |
| Premium (luxe, entreprise)             | Animation de police variable + Lottie + transitions lentes en vitesse  |
| Données (chiffres, indicateurs)        | Canvas 2D procédural + compteurs + tracé SVG                           |

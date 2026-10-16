# PHILOSOPHIE DU MOUVEMENT — La référence

> Décorticage du spot de 30 s **Infinite — Global Payments**. La référence à laquelle aspire chaque construction motion avec HyperFrames. Relisez les §0 et §4 avant et pendant chaque session créative.

---

## 0 · Les 11 lois (à connaître par cœur)

1. **Une idée par temps fort. Couper vite.** Scène moyenne ≈ **1,5 s**. Chaque visuel porte UN concept. Si une scène dit deux choses, la scinder.
2. **Le noir est la toile.** Environ 90 % de chaque image est noire ou presque. L'espace vide est le design.
3. **La lumière est la marque, pas la couleur.** Dégradés chromés, halos, vignettages, faisceaux. L'œuvre est *éclairée*, pas *colorée*.
4. **La caméra ne dort jamais.** La grille recule, la pièce tourne, les particules dérivent, le vignettage respire. Statique = mort.
5. **Le flou de mouvement est une qualité.** Chaque transition suit une traînée de flou : elle cache la coupe ET transmet l'énergie.
6. **Les métaphores d'objets portent le sens.** Carte rouge = cassé. Pièce bleu-vert = ça marche. La même pièce revient 3 fois.
7. **La palette est symbolique, pas décorative.** Chaque couleur possède un concept. Si vous ne pouvez pas nommer son sens, elle n'a pas mérité sa place.
8. **Le texte est un personnage.** Les mots s'AGRANDISSENT ×8, se TRANSFORMENT, BRILLENT. La typographie porte environ 60 % du récit.
9. **Tenir le plan héros.** Révélation du logo ≈ 2 s. Carte de fin 5 s et plus. Chaos cinétique → calme = catharsis.
10. **Une seule texture unificatrice.** La grille en perspective et les repères en croix (+) sont la colonne vertébrale de toute l'œuvre.
11. **Les timelines doivent remplir leur créneau.** HyperFrames masque une sous-composition dès que `timeline.duration()` < `data-duration` → flash noir. Chaque timeline se termine par `tl.to({}, { duration: SLOT_DURATION }, 0)`. Non négociable. (Recette §3.5 ; diagnostic §4.)

**Structure en trois actes / règle de trois :** problème → marque · bénéfices → surfaces → produits · fondation → appel à l'action → silence. 3 bénéfices, 3 surfaces, 3 noms de produits, 3 pièces.

---

## 2 · Vocabulaire visuel

### 2.1 Fonds de base

- **Sol en grille perspective** — toujours. Une `<div>` avec `transform: perspective(900px) rotateX(60deg)` + deux axes `repeating-linear-gradient` à `rgba(255,255,255,.05) 0 1px, transparent 1px 80px`. GSAP anime `background-position-y` pour la parallaxe.
- **Vignettage** — toujours au-dessus. `radial-gradient(ellipse at center, transparent 30%, #000 95%)`, `pointer-events: none`.
- **Grain** — toujours. `npx hyperframes add grain-overlay`.
- **Particules scintillantes** (scènes en grille) — 20 à 40 formes `+` en position absolue sur des intersections aléatoires, opacité animée par GSAP `stagger.from('random')`, `repeat: -1, yoyo: true`.
- **Scène en dégradé irisé** (scènes de roue) — conic-gradient doux ou `<video muted loop>` pré-rendue pour un vrai miroitement chromatique.
- **Faisceau de lumière conique** (finales) — `conic-gradient(from 180deg at 50% 0%, transparent, rgba(0,255,200,.15) 50%, transparent)`, flouté.
- **Carte en verre liquide** — dégradé diagonal à 4 arrêts `rgba(255,255,255,.075/.025/.010/.055)` + `backdrop-filter: blur(14px) saturate(1.12)` + reflet intérieur `inset 0 1px 0 rgba(255,255,255,.22)` + bordure de 1 px. Le reflet intérieur est la signature iOS 26.

### 2.2 Système typographique

- **Une seule sans-serif.** Géométrique, interlettrage généreux (Inter, Suisse Int'l, SF Pro).
- **Dégradé chromé sur tous les titres :** `background: linear-gradient(180deg, #fff 0%, #999 60%, #ccc 100%); -webkit-background-clip: text; color: transparent;`
- **Halo lumineux sur l'insistance :** `text-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.3)`
- **Apparition mot par mot** (pas lettre par lettre) :
  ```html
  <span class="clip word" data-start="0.0">Paiements</span>
  <span class="clip word" data-start="0.4">mondiaux</span>
  ```
  `tl.from('.word', { y: 30, opacity: 0, scale: 0.85, duration: 0.6, ease: 'power3.out', stagger: 0.35 })`
- **Le texte change d'échelle de façon spectaculaire.** Libellés à 48 px. Typographie cinétique héros à 480 px et plus. Animer avec `scale`.
- **Majuscules en début de mots pour l'insistance** (style titre), pas seulement en début de phrase. (En français, préférez souvent les capitales complètes : la casse « titre » anglaise y est peu naturelle.)
- **Balayage en dégradé chromé.** Dégradé à 8 arrêts avec des EXTRÉMITÉS SOMBRES (évite la déchirure aux bords) :
  ```css
  background: linear-gradient(90deg,
    #14110a 0%, #14110a 15%,
    #5a3215 25%, #c84f1c 40%, #e2b53f 55%, #2a8a7c 70%,
    #14110a 85%, #14110a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% 100%;
  background-position: 100% 0;
  ```
  Animer `backgroundPosition` de `100% 0` à `0% 0` sur `0.6s` en `power2.out`, `stagger: 0.04`.
- **Le mot porteur.** Le premier mot porte l'élan avec une glissade de 360 px ; les mots suivants décroissent : `360 → 120 → 60 → 25 → 12px`. Porteur en `expo.out 0.33s` ; suite en `power2.out 0.20s`. Ancrer sur les débuts de mots de la transcription. Sur les chutes, faire arriver le VISUEL 0,2 s avant l'audio : ça paraît inévitable.
- **Discipline des polices par temps fort.** Chaque temps fort utilise une famille Google Fonts DIFFÉRENTE ; le contraste vend des « univers différents ». Liste : Instrument Serif · Space Grotesk · Bebas Neue · Inter · EB Garamond italique · Cormorant Garamond italique · Azeret Mono · Geist · JetBrains Mono / SF Mono.

### 2.3 Discipline des couleurs

Pour chaque nouvelle scène, nommez la couleur qui porte le temps fort. Si vous ne pouvez pas, vous ne l'avez pas méritée.

Palette de référence (propre au spot Infinite — le brief de votre marque l'emporte) : blanc chromé → gris `#fff → #999` (premium / voix de la marque) · Rouge `#e10b1f` (problème / cassé) · Bleu-vert `#33d4c8`/`#5ee2d9` (solution / cœur) · Magenta / violet `#a155ff`/`#7e42d8` (vitesse / énergie / API) · Bleu `#3b82f6`/`#5db4ff` (connexion / monde) · Orange / jaune néon `#ff9430`/`#ffd84a` (valeur / prix accessible).

**Plafond de palette : 5 teintes actives, chacune avec un sens.** Au-delà, vous décorez.

### 2.4 Vocabulaire du mouvement

| Mouvement | Recette GSAP |
|------|-------------|
| **Travelling caméra à travers le texte** | `tl.fromTo(text, { scale: 1, opacity: 1 }, { scale: 8, opacity: 0, duration: 1.5, ease: 'power2.in' })` |
| **Coup de fouet en traînée lumineuse** | `gsap.fromTo(streak, { xPercent: -150 }, { xPercent: 250, duration: 0.4, ease: 'power3.in' })` — à déclencher PILE sur la coupe |
| **Apparition fantôme des mots** | `stagger: 0.35` avec sorties à `+= 0.5` → 0,15 s de chevauchement |
| **Glissement de transformation d'objet** | `vers A : { x: 200, scale: 0.5, opacity: 0 }`, `depuis B : { x: -200, scale: 0.5, opacity: 0 }`, les deux en 0,5 s. La traînée lumineuse cache l'échange. |
| **Révélation d'une pièce qui tourne** | `tl.from(coin, { rotateY: 90, duration: 0.8, ease: 'back.out(1.4)' })` — demande `transform-style: preserve-3d` |
| **Cristallisation → logo** | Deux timelines alignées : la pièce passe de 1 à 0,3 et rejoint la position du logo, le logo passe de 0 à 1 d'opacité, les deux finissent aux mêmes X/Y |
| **Impulsion d'énergie le long d'un tracé** | SVG `stroke-dasharray + stroke-dashoffset` de 1 à 0 ; animation de `boxShadow` sur le nœud au bout du tracé |
| **Recoloration (sans coupe)** | `tl.to(':root', { '--accent': '#ff9430', duration: 0.6 })` — variables CSS |
| **Apparition d'un téléphone par le bas** | `tl.from(phone, { y: '100%', duration: 1, ease: 'power3.out' }).from(headline, { y: 30, opacity: 0, duration: 0.6 }, 0.3)` |
| **Roue + panneau latéral** | `tl.to(wheel, { rotation: 120, duration: 1.5 }).from(panel, { x: -100, opacity: 0, duration: 0.6 }, '<0.3')` |
| **Dérive d'un groupe flottant** | `gsap.to(coins, { y: '-=15', duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: { each: 0.4, from: 'random' } })` |
| **Respiration du vignettage** | `gsap.to(vignette, { opacity: 0.9, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' })` |
| **Fouet vertical « couper la courbe »** (transition par défaut entre temps forts voisins) | **Sortie :** `tl.to(wrap, { y: -150, filter: "blur(30px)", duration: 0.33, ease: "power2.in" })` · **Entrée :** `gsap.set(wrap, { y: 150, filter: "blur(30px)" })` puis `tl.to(wrap, { y: 0, filter: "blur(0px)", duration: 1.0, ease: "power2.out" }, 0)` — même direction des deux côtés, vitesse raccordée sur la coupe |

**Menu des transitions :** fouet en traînée lumineuse (par défaut) · transformation croisée (objet → objet) · recoloration (idées liées dans la même composition) · glissade par le bas (maquettes produit) · flash blanc (changement d'acte) · tourbillon (rotation d'une gamme de produits). Des blocs du catalogue existent pour la plupart : `whip-pan`, `cross-warp-morph`, `flash-through-white`, `swirl-vortex`, `cinematic-zoom`, `chromatic-radial-split`.

### 2.5 Rythme

- **Durée d'une scène :** 1,0 à 2,0 s. Plus long seulement pour les moments héros ou la fin.
- **Cadence des apparitions :** un nouvel élément toutes les 0,3 à 0,6 s dans une scène. Aucun temps mort de plus d'1 s au milieu.
- **Décalage des mots :** 0,3 à 0,4 s en narratif, 0,5 à 0,6 s en dramatique.
- **Transition en fouet :** 0,3 à 0,4 s.
- **Tenues :** cristallisation du logo 1,5 à 2 s · carte d'appel à l'action 4 à 6 s · titres de section 1 à 1,5 s après leur apparition complète.
- **Règle de respiration :** toutes les 7 à 8 s environ de densité cinétique, accorder 1 s de repos.

### 2.6 Mix audio

Chaque scène audio fixe `data-volume` explicitement. Par défaut, une nappe chaude à 0,15, pas un morceau de musique.

| Couche | `data-volume` | Rôle |
|------|---------------|------|
| Voix off | `1.0` | Principale, dicte le timing |
| Fond (nappe chaude) | `0.15` | À peine présente |
| Bruitages (clics, whooshes) | `0.2` | Leurs queues débordent sur le temps fort suivant |

Brancher en éléments `<audio>` voisins à la racine, jamais dans un `<video>`.

---

## 3 · Recettes HyperFrames

### 3.1 Fond en grille (à réutiliser partout)

```html
<div class="stage" data-composition-id="...">
  <div class="grid-floor clip" data-start="0" data-duration="30" data-track-index="0"></div>
  <svg class="crosshairs clip" data-start="0" data-duration="30" data-track-index="1">
    <!-- 16 repères + aux intersections de la grille -->
  </svg>
  <div class="vignette clip" data-start="0" data-duration="30" data-track-index="9"></div>
  <div class="grain    clip" data-start="0" data-duration="30" data-track-index="10"></div>
  <!-- Contenu sur les pistes 2 à 8 -->
</div>

<style>
.grid-floor {
  position: absolute; inset: 0;
  transform: perspective(900px) rotateX(60deg) translateY(20%);
  background:
    repeating-linear-gradient(0deg,  rgba(255,255,255,.05) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 80px);
  background-color: #000;
}
.vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 30%, #000 95%);
}
</style>
```

### 3.2 Transition en fouet lumineux

```html
<div class="whip-streak clip" data-start="3.6" data-duration="0.4" data-track-index="8"></div>

<style>
.whip-streak {
  position: absolute; top: 50%; left: 0;
  width: 40%; height: 8px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  filter: blur(6px); transform: translateY(-50%);
}
</style>

<script>
gsap.fromTo('.whip-streak',
  { xPercent: -100, scaleX: 0.5 },
  { xPercent: 250, scaleX: 1.5, duration: 0.4, ease: 'power3.in' }
);
</script>
```

Le `data-start` de la scène suivante tombe au pic de la traînée (vers la moitié) pour que la coupe se cache dans la lumière.

### 3.3 Astuce de recoloration (sans coupe)

```html
<div class="flowchart" style="--edge: #5db4ff; --node-glow: rgba(91,180,255,.6);">
  <!-- les nœuds utilisent var(--edge) pour les bordures, var(--node-glow) pour l'ombre -->
</div>

<script>
tl.to('.flowchart', {
  '--edge': '#ffd84a',
  '--node-glow': 'rgba(255,148,48,0.7)',
  duration: 0.6, ease: 'power2.inOut'
}, 2.5);
</script>
```

Même DOM, le sens change (Mondial → Accessible). Facile à construire, coûteux à l'œil.

### 3.4 Objets 3D — pré-rendu ou CSS ?

- Chrome irisé / réfraction chromatique → **MP4 pré-rendu** (avec alpha ou en boucle). WebGL serait excessif.
- Mouvement plan, textures plates qui tournent → **CSS 3D + GSAP**.
- Carte avec flou de mouvement → PNG + image clé `filter: blur()` au pic.

### 3.5 Règle de remplissage de la timeline (critique pour le framework)

Chaque sous-composition termine sa timeline par une ancre sans effet :

```js
const tl = gsap.timeline({ paused: true });
// … animations …
tl.to({}, { duration: SLOT_DURATION }, 0);  // force timeline.duration() >= SLOT_DURATION
window.__timelines['my-comp'] = tl;
```

HyperFrames applique `visibility: hidden` quand `timeline.duration() < data-duration` : flash noir à la fin du temps fort. L'ancre ne coûte rien en animation mais garde la composition vivante pendant tout son créneau.

### 3.6 Motif proxy GSAP (Canvas 2D / shaders dans une timeline)

Piloter un rendu procédural avec une seule animation qui fait avancer une valeur de temps proxy :

```js
const proxy = { time: 0 };
tl.to(proxy, {
  time: DURATION, duration: DURATION, ease: "none",
  onUpdate: () => renderAtTime(proxy.time)
}, 0);
```

Règles :
1. **Canvas 2D fonctionne sans interface ; un WebGL en direct peut bloquer le rendu.** Prévoir une alternative Canvas 2D selon `renderOptions.headless`.
2. **Pas de `Math.random()` ni de `Date.now()`.** Utiliser des générateurs pseudo-aléatoires à graine ou des hachages en sinus harmoniques : les rendus doivent être déterministes.

### 3.7 Encadrer `<video>` avec une image d'affiche et une dernière image

Les balises `<video>` clignotent au démarrage et affichent du noir après la fin de la source. Les encadrer avec des JPG fixes :

```html
<img id="beat-poster"    src="assets/beat4-poster.jpg">
<video id="beat-video"   src="assets/beat4-clip.mp4"
       data-start="7.1" data-duration="8.94" data-track-index="5" muted></video>
<img id="beat-lastframe" src="assets/beat4-lastframe.jpg">
```

```js
tl.set("#beat-poster",    { display: "none" }, 7.1);   // relais au début de la vidéo
tl.set("#beat-lastframe", { opacity: 1 },      16.04); // couvre de la fin de la vidéo à la fin du temps fort
```

```bash
ffmpeg -y -ss 0        -i clip.mp4 -frames:v 1 -q:v 2 poster.jpg
ffmpeg -y -sseof -0.04 -i clip.mp4 -frames:v 1 -q:v 2 lastframe.jpg
```

### 3.8 Les sous-titres comme éléments voisins au niveau du body

Gardez les sous-titres HORS des timelines des sous-compositions. Placez-les dans `index.html`, en dehors de la `<div>` de la composition principale, chacun avec un `data-track-index ≥ 20` unique :

```html
<div class="cap clip" data-start="7.29"  data-duration="1.86" data-track-index="30">HyperFrames par HeyGen.</div>
<div class="cap clip" data-start="9.10"  data-duration="3.44" data-track-index="31">Les agents écrivent du HTML et rendent des MP4.</div>

<style>
.cap {
  position: absolute; bottom: 72px; left: 50%; transform: translateX(-50%);
  padding: 12px 22px; border-radius: 14px;
  background: rgba(10, 8, 5, 0.55);
  backdrop-filter: blur(8px);
  font: 500 28px/1.3 Inter, sans-serif; color: #fff;
}
</style>
```

### 3.9 Convention de commentaire des animations

Le commentaire de chaque animation d'entrée ou de sortie nomme l'animation correspondante du temps fort voisin :

```js
// ENTRÉE — le flou redescend de 22 px pour raccorder avec la sortie à 22 px du temps fort « cercle ».
gsap.set(wrap, { filter: "blur(22px)" });
tl.to(wrap, { filter: "blur(0px)", duration: 0.33, ease: "power2.out" }, 0);

// SORTIE — raccorde avec l'entrée à 150 px en y + 30 px de flou du temps fort « moteur ».
tl.to(wrap, { y: -150, filter: "blur(30px)", duration: 0.33, ease: "power2.in" }, 1.89);
```

Si vous ne pouvez pas nommer l'animation correspondante, vous n'avez pas conçu le raccord.

---

## 4 · Liste de contrôle préalable (avant de dire « terminé »)

- [ ] **Durée moyenne des scènes ≤ 2 s** dans la partie centrale
- [ ] **Aucun temps mort > 1 s** hors tenues volontaires
- [ ] **Chaque transition utilise du mouvement** (pas de fondus secs)
- [ ] **Palette ≤ 5 teintes actives**, chacune avec un sens
- [ ] **Chaque bloc de texte utilise dégradé chromé + halo** — pas de blanc plat
- [ ] **Grille + repères en croix dans ≥ 60 % des scènes**
- [ ] **Vignettage + grain sur chaque scène**
- [ ] **Au moins un rappel** — un visuel qui revient plus tard
- [ ] **La fin tient 4 secondes ou plus**
- [ ] **Vérification visuelle faite** — images extraites, lues, confirmées : pas de visage coupé, pas de texte qui déborde, pas de temps fort sur le mauvais mot, pas de transition cassée
- [ ] **Chaque timeline se termine par `tl.to({}, { duration: SLOT_DURATION }, 0)`** (loi n° 11)
- [ ] **Toutes les fins d'animation tombent sur des multiples de `1/fps`** — les courbes à fin raide (`expo.in`, `power4.in`) crénellent entre deux images
- [ ] **Diagnostic de durée des timelines lancé :**
  ```js
  const p = document.querySelector('hyperframes-player');
  const iw = p.shadowRoot.querySelector('iframe').contentWindow;
  Object.fromEntries(Object.entries(iw.__timelines).map(([k, v]) =>
    [k, +v.duration().toFixed(4)]));
  ```
  Tout écart où `timeline.duration() < data-duration` est un risque de flash noir.

### 4.1 Dictionnaire de code GSAP

| Usage | Courbe | Durée |
|---|---|---|
| Apparition de mot (glissade) | `expo.out` | 0,20 à 0,33 s |
| Entrée générique | `power2.out` | 0,2 à 0,5 s |
| Sortie générique | `power2.in` | 0,2 à 0,33 s |
| SORTIE en fouet d'un temps fort | `expo.in` / `power2.in` | 0,2 à 0,33 s |
| ENTRÉE en fouet d'un temps fort | `expo.out` / `power2.out` | 0,5 à 1,0 s |
| Panoramique entre deux arrêts | `power2.inOut` | 1,2 à 2,3 s |
| Tenue linéaire (après l'entrée) | `"none"` | 0,4 à 0,65 s |
| Carte qui se pose en rebondissant | `back.out(1.2–1.5)` | 0,3 à 0,5 s |
| Dépassement d'interface | `elastic.out(1, 0.3–0.4)` | 0,20 s |
| Respiration / dérive | `sine.inOut` en yoyo | 2 à 4 s, `repeat: -1` |

**Décalages :** balayage chromé sur les mots `0.04` · ondulation d'une grille de points par colonne `0.019`, dans une colonne `0.004` · lignes d'un flux de code `0.06`.

**Pas de `gsap.defaults()`** — déclarer la courbe et la durée à chaque animation. Les bugs d'héritage sont plus difficiles à diagnostiquer que des animations verbeuses.

**Squelette de timeline :**
```js
(() => {
  const tl = gsap.timeline({ paused: true });
  // … animations …
  tl.to({}, { duration: SLOT_DURATION }, 0);  // ancre de la loi n° 11
  window.__timelines['<data-composition-id>'] = tl;
})();
```
La clé doit correspondre exactement à `data-composition-id`.

---

## 5 · Anti-motifs (au-delà des lois inversées)

- ❌ **`Math.random()` / `Date.now()` / générateurs sans graine dans une boucle de rendu.** Utiliser des hachages harmoniques : `80 + 220 * Math.abs(Math.sin(i*0.7 + 0.3) * Math.cos(i*1.3 + 0.7))`.
- ❌ **S'appuyer sur `npx hyperframes add <bloc>` pour les pièces de référence.** La vidéo de lancement d'HyperFrames n'installe AUCUN bloc du catalogue. Le catalogue = la vitesse ; le fait main = la qualité de référence.
- ❌ **Livrer sans regarder les images.** Un lint réussi ≠ un design qui marche. **REGARDEZ LES IMAGES.**
- ❌ **Grain ou vignettage décoratifs.** Ce n'est pas de la décoration, c'est une *texture* unificatrice. Chaque scène, à chaque fois.

---

## 6 · En bref

> **Une idée par temps fort, éclairé et non coloré, cinétique et non statique, des rappels plutôt que de la nouveauté, tenir le plan héros, laisser respirer la fin — la grille est toujours sous tout, chaque timeline remplit son créneau, chaque sortie tombe sur une limite d'image, et chaque coupe se cache dans un fouet flou.**

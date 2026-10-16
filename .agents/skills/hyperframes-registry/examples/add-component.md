# Exemple détaillé : ajouter un composant

## Situation

L'utilisateur veut ajouter un effet de balayage lumineux sur le texte de son titre.

## Étapes

### 1. Installer le composant

```bash
hyperframes add shimmer-sweep
```

### 2. Lire l'extrait

Ouvre `compositions/components/shimmer-sweep.html` et lis l'en-tête en commentaire.

### 3. Le brancher dans ta composition

**HTML** — enveloppe les éléments cibles :

```html
<div class="shimmer-sweep-target" style="--shimmer-color: rgba(255, 255, 255, 0.5)">
  <h1 class="title">La vidéo propulsée par l'IA</h1>
</div>
```

**CSS** — colle les règles `.shimmer-sweep-target` et `.shimmer-mask` de l'extrait.

**JS** — colle le script d'injection automatique (avant le code de timeline) :

```js
document.querySelectorAll(".shimmer-sweep-target").forEach((el) => {
  if (!el.querySelector(".shimmer-mask")) {
    const mask = document.createElement("div");
    mask.className = "shimmer-mask";
    el.appendChild(mask);
  }
});
```

**Timeline** — ajoute le balayage :

```js
tl.fromTo(
  ".shimmer-sweep-target",
  {
    "--shimmer-pos": "-20%",
  },
  {
    "--shimmer-pos": "120%",
    duration: 1.2,
    ease: "power2.inOut",
    stagger: 0.15,
  },
  1.5,
);
```

### 4. Lint et aperçu

```bash
hyperframes lint
hyperframes preview
```

### 5. Personnaliser

- `--shimmer-color` : couleur du reflet par élément
- `--shimmer-width` : largeur de la bande lumineuse (20 % par défaut)
- `--shimmer-angle` : direction du balayage (120deg par défaut)
- `duration`, `ease`, `stagger` de la timeline : règlent la vitesse et la sensation

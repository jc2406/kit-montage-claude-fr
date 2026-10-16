# Brancher les composants

Les composants sont des extraits d'effets — du HTML, du CSS et parfois du JS que tu fusionnes directement dans une composition existante. Contrairement aux blocs, les composants n'ont pas de timeline autonome ; ils participent à la timeline de la composition hôte.

## Processus général

1. Lance `hyperframes add <nom-du-composant>`
2. Ouvre le fichier installé (par ex. `compositions/components/grain-overlay.html`)
3. Lis l'en-tête en commentaire pour les instructions d'utilisation
4. Copie les parties dans ta composition hôte :
   - **Éléments HTML** — dans ton `<div data-composition-id="...">`
   - **Styles CSS** — dans le bloc `<style>` de ta composition
   - **Initialisation JS** — dans le `<script>` de ta composition, avant ton code de timeline
   - **Appels de timeline** — dans ta timeline GSAP (si le composant en expose)

## Exemple : grain-overlay (CSS seul, sans intégration à la timeline)

```html
<!-- Colle la div de superposition dans ta composition -->
<div
  id="grain-overlay"
  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100;"
>
  <div class="grain-texture"></div>
</div>
```

Puis colle les keyframes CSS et la règle `.grain-texture` dans tes styles. Aucun appel de timeline GSAP n'est nécessaire — le grain s'anime via des `@keyframes` CSS.

## Exemple : shimmer-sweep (demande une intégration à la timeline)

Enveloppe les éléments cibles, colle le CSS et le JS, puis pilote le balayage depuis ta timeline :

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
  2.0,
);
```

## Exemple : grid-pixelate-wipe (transition de scène)

Colle le HTML et le CSS de la superposition, puis pilote l'échelle de `.grid-cell` dans ta timeline :

```js
// Couvrir l'écran
tl.to(
  ".grid-cell",
  { scale: 1, duration: 0.6, stagger: { amount: 0.6, from: "center" }, ease: "power2.inOut" },
  5.0,
);
// Échanger les scènes
tl.set("#scene-a", { opacity: 0 }, 5.6);
tl.set("#scene-b", { opacity: 1 }, 5.6);
// Révéler
tl.to(
  ".grid-cell",
  { scale: 0, duration: 0.6, stagger: { amount: 0.6, from: "edges" }, ease: "power2.inOut" },
  5.6,
);
```

## Principes clés

- Les composants héritent des dimensions et de la durée de la composition hôte
- Place le HTML du composant au bon z-index par rapport à ton contenu
- Lis l'en-tête en commentaire de chaque extrait pour les valeurs personnalisables
- Lance `hyperframes lint` après le branchement pour repérer les problèmes de structure

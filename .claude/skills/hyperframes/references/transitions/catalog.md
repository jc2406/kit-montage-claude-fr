# Catalogue des transitions

Règles dures, modèle de scène et renvoi vers le code d'implémentation. Lis le fichier de référence du type de transition dont tu as besoin — ne les charge pas tous.

## Règles dures (CSS)

Les enfreindre provoque de vrais bugs.

**Visibilité des scènes :** la scène 1 est visible par défaut (pas d'`opacity: 0`). Les scènes 2 et suivantes ont `opacity: 0` sur la div CONTENEUR. GSAP les révèle. Pas de cale de visibilité (`timedEls`).

**Polices :** écris simplement la `font-family` voulue — le compilateur intègre automatiquement les polices prises en charge via `@font-face` avec des data URI en ligne. Pas besoin de balises `<link>` ni d'`@import`. Fonctionne dans tous les contextes, y compris les iframes en bac à sable.

**Structure des éléments :** pas de `class="clip"` sur les div de scène dans les compositions autonomes. Seule la div racine reçoit `data-composition-id`/`data-start`/`data-duration`.

**Éléments de superposition :** blocs décalés = plein écran 1920x1080, PAS de fines bandes. Superpositions RVB de glitch = mélange normal à 35 % d'opacité, PAS `mix-blend-mode: multiply` (invisible sur fond sombre). Superpositions de fuite de lumière = plus grandes que le cadre (2400 px et plus), jamais une forme visible. Surexposition = utiliser `filter: brightness()` sur la scène, pas seulement une superposition blanche.

**Bande VHS :** cloner le vrai contenu de la scène avec `cloneNode(true)`, PAS des barres de couleur. Chaque bande : plus large que le cadre (2020 px à left:-50px). Copies chromatiques rouge + bleu avec un z-index au-dessus de la bande principale. Générateur pseudo-aléatoire à graine pour des décalages aléatoires déterministes.

**Z-index :** la chute par gravité, le zoom arrière et la découpe en diagonale demandent que la scène sortante soit AU-DESSUS (`zIndex: 10`) pour qu'elle sorte en révélant la nouvelle scène derrière (`zIndex: 1`).

**Page qui brûle :** le contenu brûle avec la page — pas de débris qui tombent. Cacher scene1 via `tl.set` à la fin de la brûlure, JAMAIS `onComplete` (non réversible). `onUpdate` doit rétablir `clipPath: "none"` quand `wp <= 0` pour permettre le retour en arrière. La scène entrante sort du noir en fondu à 90 % de la brûlure.

**Volet d'horloge :** polygone à 9 points avec des positions de bord intermédiaires. Avancer à travers les 4 quadrants avec des animations séparées.

**Dissolution en grille :** faire tourner 5 couleurs de la palette par cellule, pas en monochrome.

**Nombre de stores selon l'énergie :** calme : 4 h / 6 v. Moyenne : 6-8 h / 8 v. Forte : 12-16 h / 16 v.

**À ne pas utiliser :** iris en étoile (interpolation de polygone cassée), tilt-shift (pas de flou CSS sélectif), reflet d'objectif (forme visible, pas optique), charnière/porte (déforme trop vite).

## Transitions en shader

La mise en place des shaders, l'initialisation WebGL, la capture et les fragment shaders sont gérés par `@hyperframes/shader-transitions` (`packages/shader-transitions/`). Lis le code du paquet pour les détails de l'API. Les compositions qui utilisent des shaders doivent suivre les règles CSS de [transitions.md](../transitions.md), section « Règles CSS compatibles avec les shaders ».

## Modèle de scène

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      body {
        margin: 0;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: #000;
        font-family: "YOUR FONT", sans-serif; /* le compilateur intègre automatiquement les polices prises en charge */
      }
      .scene {
        position: absolute;
        top: 0;
        left: 0;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
      }
      #scene1 {
        z-index: 1;
        background: #color;
      }
      #scene2 {
        z-index: 2;
        background: #color;
        opacity: 0;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-width="1920"
      data-height="1080"
      data-start="0"
      data-duration="TOTAL"
    >
      <div id="scene1" class="scene"><!-- visible --></div>
      <div id="scene2" class="scene"><!-- cachée --></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      var tl = gsap.timeline({ paused: true });
      // Code de la transition ici
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
```

Chaque transition suit : placer la nouvelle scène → animer la sortante → échanger → animer l'entrante → nettoyer les superpositions.

## Transitions CSS

Tous les exemples de code utilisent `old` pour le sélecteur intérieur de la scène sortante et `new` pour l'entrante, avec `T` comme temps de début de la transition. Lis le fichier de référence du type dont tu as besoin.

| Type                | Transitions                                                          | Référence                                  |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| Poussée             | Poussée latérale, poussée verticale, poussée élastique, compression  | [css-push.md](./css-push.md)               |
| Radiale / forme     | Iris circulaire, iris en losange, découpe en diagonale              | [css-radial.md](./css-radial.md)           |
| 3D                  | Retournement de carte en 3D                                          | [css-3d.md](./css-3d.md)                   |
| Échelle / zoom      | Zoom à travers, zoom arrière                                         | [css-scale.md](./css-scale.md)             |
| Dissolution         | Fondu enchaîné, fondu flou, bascule de mise au point, plongée de couleur | [css-dissolve.md](./css-dissolve.md)   |
| Recouvrement        | Blocs décalés, stores horizontaux, stores verticaux                  | [css-cover.md](./css-cover.md)             |
| Lumière             | Fuite de lumière, brûlure par surexposition, brûlure de pellicule    | [css-light.md](./css-light.md)             |
| Distorsion          | Glitch, aberration chromatique, ondulation, bande VHS                | [css-distortion.md](./css-distortion.md)   |
| Mécanique           | Obturateur, volet d'horloge                                          | [css-mechanical.md](./css-mechanical.md)   |
| Grille              | Dissolution en grille                                                | [css-grid.md](./css-grid.md)               |
| Autres              | Chute par gravité, cercle qui se transforme                          | [css-other.md](./css-other.md)             |
| Flou                | Flou traversant, flou directionnel                                   | [css-blur.md](./css-blur.md)               |
| Destruction         | Page qui brûle                                                       | [css-destruction.md](./css-destruction.md) |

## Transitions en shader

Les transitions en shader WebGL sont fournies par `@hyperframes/shader-transitions` (`packages/shader-transitions/`). Le paquet gère la mise en place, la capture, l'initialisation WebGL, la boucle de rendu et l'intégration GSAP. Lis le code du paquet pour les shaders et l'API disponibles — ne recopie pas du GLSL brut à la main.

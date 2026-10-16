# Brancher les blocs

Les blocs sont des compositions autonomes avec leurs propres `data-composition-id`, dimensions, durée et timeline GSAP. Inclus-les dans une composition hôte avec `data-composition-src` sur une `<div>`.

## Branchement de base

Après `hyperframes add data-chart`, branche-le dans ton `index.html` :

```html
<div id="stage" data-composition-id="main" data-width="1920" data-height="1080" data-duration="20">
  <video id="a-roll" src="video.mp4" data-start="0" data-duration="20" data-track-index="0"></video>

  <!-- Bloc : apparaît à 2 s, joue pendant 15 s, sur le calque 1 -->
  <div
    data-composition-id="data-chart"
    data-composition-src="compositions/data-chart.html"
    data-start="2"
    data-duration="15"
    data-track-index="1"
    data-width="1920"
    data-height="1080"
  ></div>
</div>
```

## Attributs obligatoires

| Attribut               | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `data-composition-src` | Chemin du fichier HTML du bloc (relatif à index.html)                               |
| `data-composition-id`  | ID unique qui correspond à l'ID de composition interne du bloc                      |
| `data-start`           | Moment où le bloc apparaît dans la timeline hôte (secondes)                         |
| `data-duration`        | Durée de lecture du bloc (secondes, au plus la durée propre du bloc)                |
| `data-track-index`     | Ordre des calques — les nombres plus grands sont rendus devant                      |
| `data-width`           | Largeur du canevas du bloc (identique aux dimensions du bloc)                       |
| `data-height`          | Hauteur du canevas du bloc (identique aux dimensions du bloc)                       |

## Coordination des timelines

La timeline GSAP interne du bloc tourne indépendamment de la timeline hôte. Le runtime HyperFrames charge la sous-composition, trouve son enregistrement dans `window.__timelines` et positionne le bloc en synchro avec l'hôte, décalé de `data-start`. Tu n'as PAS besoin de référencer la timeline du bloc dans le code GSAP de ton hôte.

## Positionner les blocs

Pour placer un bloc dans une zone précise de l'écran, ajoute du CSS :

```html
<div
  data-composition-id="data-chart"
  data-composition-src="compositions/data-chart.html"
  data-start="2"
  data-duration="15"
  data-track-index="1"
  data-width="1920"
  data-height="1080"
  style="position: absolute; right: 0; top: 0; width: 40%; height: 100%;"
></div>
```

## Plusieurs blocs

Inclus plusieurs blocs à la suite ou qui se chevauchent :

```html
<div
  data-composition-id="data-chart"
  data-composition-src="compositions/data-chart.html"
  data-start="0"
  data-duration="15"
  data-track-index="1"
  data-width="1920"
  data-height="1080"
></div>
<div
  data-composition-id="flowchart"
  data-composition-src="compositions/flowchart.html"
  data-start="15"
  data-duration="12"
  data-track-index="1"
  data-width="1920"
  data-height="1080"
></div>
<div
  data-composition-id="logo-outro"
  data-composition-src="compositions/logo-outro.html"
  data-start="27"
  data-duration="6"
  data-track-index="1"
  data-width="1920"
  data-height="1080"
></div>
```

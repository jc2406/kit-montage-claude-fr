# Exemple détaillé : ajouter un bloc

## Situation

L'utilisateur a un projet HyperFrames existant et veut ajouter un graphique animé à côté de sa vidéo.

## Étapes

### 1. Installer le bloc

```bash
hyperframes add data-chart
```

### 2. Le brancher dans index.html

```html
<div id="stage" data-composition-id="main" data-width="1920" data-height="1080" data-duration="30">
  <video
    id="speaker"
    src="speaker.mp4"
    data-start="0"
    data-duration="30"
    data-track-index="0"
    style="position: absolute; width: 60%; height: 100%; left: 0; top: 0; object-fit: cover;"
  ></video>

  <!-- Le graphique apparaît à 5 s dans les 40 % de droite de l'écran -->
  <div
    data-composition-id="data-chart"
    data-composition-src="compositions/data-chart.html"
    data-start="5"
    data-duration="15"
    data-track-index="1"
    data-width="1920"
    data-height="1080"
    style="position: absolute; right: 0; top: 0; width: 40%; height: 100%;"
  ></div>
</div>
```

### 3. Lint et aperçu

```bash
hyperframes lint
hyperframes preview
```

### 4. Personnaliser (optionnel)

Modifie `compositions/data-chart.html` — les tableaux de données sont en haut du script, les couleurs dans les règles CSS limitées sous `[data-composition-id="data-chart"]`. Traduis aussi les libellés d'exemple en français.

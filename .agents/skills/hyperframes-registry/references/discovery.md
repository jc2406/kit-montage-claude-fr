# Découverte du catalogue

## Lire le manifeste du catalogue

Le `registry.json` de premier niveau liste tous les éléments disponibles :

```bash
curl -s https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry/registry.json
```

Chaque entrée a un `name` et un `type` (`hyperframes:example`, `hyperframes:block` ou `hyperframes:component`).

## Lire le manifeste d'un élément

Chaque élément a un `registry-item.json` avec toutes ses métadonnées :

```
<base>/<type-dir>/<name>/registry-item.json
```

Où `<type-dir>` vaut `examples`, `blocks` ou `components`.

## Champs du manifeste d'un élément

| Champ                  | Type     | Obligatoire | Description                                        |
| ---------------------- | -------- | ----------- | -------------------------------------------------- |
| `name`                 | string   | oui         | Identifiant en kebab-case                          |
| `type`                 | string   | oui         | `hyperframes:block` ou `hyperframes:component`     |
| `title`                | string   | oui         | Titre lisible                                      |
| `description`          | string   | oui         | Description en une ligne                           |
| `tags`                 | string[] | non         | Tags de filtrage (par ex. `["data", "chart"]`)     |
| `dimensions`           | object   | blocs       | `{ width, height }` — blocs seulement              |
| `duration`             | number   | blocs       | Durée en secondes — blocs seulement                |
| `files`                | array    | oui         | Fichiers à installer (`path`, `target`, `type`)    |
| `registryDependencies` | string[] | non         | Autres éléments du catalogue dont il dépend        |

## Éléments disponibles

### Blocs

| Nom          | Description                                                   | Tags                            |
| ------------ | ------------------------------------------------------------- | ------------------------------- |
| `data-chart` | Graphique animé en barres + courbe avec révélation décalée   | data, chart, statistics         |
| `flowchart`  | Arbre de décision avec liaisons SVG et curseur                | diagram, flowchart, interactive |
| `logo-outro` | Révélation cinématographique du logo avec accroche            | branding, outro, logo           |

### Composants

| Nom                  | Description                                           | Tags                             |
| -------------------- | ----------------------------------------------------- | -------------------------------- |
| `grain-overlay`      | Superposition animée de grain film                    | texture, grain, overlay, film    |
| `shimmer-sweep`      | Balayage lumineux en dégradé CSS pour des accents IA  | text, shimmer, highlight, effect |
| `grid-pixelate-wipe` | Transition par dissolution en grille entre les scènes | transition, wipe, grid, pixelate |

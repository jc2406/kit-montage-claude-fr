# Emplacements d'installation

## Chemins par défaut

| Type d'élément | Chemin d'installation par défaut       | Réglé par                           |
| -------------- | -------------------------------------- | ----------------------------------- |
| Bloc           | `compositions/<nom>.html`              | `hyperframes.json#paths.blocks`     |
| Composant      | `compositions/components/<nom>.html`   | `hyperframes.json#paths.components` |

## Comment fonctionne le remappage des chemins

Le champ `target` du `registry-item.json` de chaque élément indique un chemin d'installation par défaut. La commande `add` remappe le préfixe selon `hyperframes.json#paths` :

- Les cibles de bloc qui commencent par `compositions/` sont remappées vers `<paths.blocks>/`
- Les cibles de composant qui commencent par `compositions/components/` sont remappées vers `<paths.components>/`

## hyperframes.json

Créé automatiquement par `hyperframes init`. S'il n'existe pas quand tu lances `add`, la CLI le crée avec les valeurs par défaut :

```json
{
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  }
}
```

## Organisations personnalisées

Pour installer les blocs dans un dossier `scenes/` au lieu de `compositions/` :

```json
{
  "paths": {
    "blocks": "scenes"
  }
}
```

Alors `hyperframes add data-chart` écrit dans `scenes/data-chart.html` au lieu de `compositions/data-chart.html`. L'extrait affiché reflète le chemin remappé.

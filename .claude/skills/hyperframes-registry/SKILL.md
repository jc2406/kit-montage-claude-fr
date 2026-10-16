---
name: hyperframes-registry
description: Installer et brancher des blocs et composants du catalogue dans les compositions HyperFrames. À utiliser pour lancer hyperframes add, installer un bloc ou un composant, brancher un élément installé dans index.html, ou travailler avec hyperframes.json. Couvre la commande add, les emplacements d'installation, le branchement des blocs en sous-composition, la fusion des extraits de composants et la découverte du catalogue.
---

# Catalogue HyperFrames

Le catalogue fournit des blocs et des composants réutilisables, installables via `hyperframes add <nom>`.

- **Blocs** — des sous-compositions autonomes (leurs propres dimensions, durée, timeline). Inclus via `data-composition-src` dans une composition hôte.
- **Composants** — des extraits d'effets (sans dimensions propres). Collés directement dans le HTML d'une composition hôte.

## Quand utiliser ce skill

- L'utilisateur parle de `hyperframes add`, de « bloc », de « composant » ou de `hyperframes.json`
- La sortie de `hyperframes add` apparaît dans la session (chemins de fichiers, extrait dans le presse-papiers)
- Tu dois brancher un élément installé dans une composition existante
- Tu veux découvrir ce qui est disponible dans le catalogue

## Référence rapide

```bash
hyperframes add data-chart              # installer un bloc
hyperframes add grain-overlay           # installer un composant
hyperframes add shimmer-sweep --dir .   # cibler un projet précis
hyperframes add data-chart --json       # sortie lisible par une machine
hyperframes add data-chart --no-clipboard  # sans presse-papiers (CI/sans interface)
```

Après l'installation, la CLI affiche les fichiers écrits et un extrait à coller dans ta composition
hôte. L'extrait est un point de départ — tu devras ajouter les attributs `data-composition-id` (qui
doit correspondre à l'ID de composition interne du bloc), `data-start` et `data-track-index` pour
brancher les blocs.

Note : `hyperframes add` ne fonctionne que pour les blocs et les composants. Pour les exemples,
utilise plutôt `hyperframes init <dossier> --example <nom>`.

Les blocs contiennent souvent des textes d'exemple en anglais : traduis-les dans le fichier installé.

## Emplacements d'installation

Les blocs s'installent par défaut dans `compositions/<nom>.html`.
Les composants s'installent par défaut dans `compositions/components/<nom>.html`.

Ces chemins se règlent dans `hyperframes.json` :

```json
{
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  }
}
```

Voir [install-locations.md](./references/install-locations.md) pour tous les détails.

## Brancher les blocs

Les blocs sont des compositions autonomes — inclus-les via `data-composition-src` dans ton `index.html` hôte :

```html
<div
  data-composition-id="data-chart"
  data-composition-src="compositions/data-chart.html"
  data-start="2"
  data-duration="15"
  data-track-index="1"
  data-width="1920"
  data-height="1080"
></div>
```

Attributs clés :

- `data-composition-src` — chemin du fichier HTML du bloc
- `data-composition-id` — doit correspondre à l'ID interne du bloc
- `data-start` — moment où le bloc apparaît dans la timeline hôte (secondes)
- `data-duration` — durée de lecture du bloc
- `data-width` / `data-height` — dimensions du canevas du bloc
- `data-track-index` — ordre des calques (plus haut = devant)

Voir [wiring-blocks.md](./references/wiring-blocks.md) pour tous les détails.

## Brancher les composants

Les composants sont des extraits — colle leur HTML dans le balisage de ta composition, leur CSS dans ton bloc de style et leur JS dans ton script (s'il y en a) :

1. Lis le fichier installé (par ex. `compositions/components/grain-overlay.html`)
2. Copie les éléments HTML dans le `<div data-composition-id="...">` de ta composition
3. Copie le bloc `<style>` dans les styles de ta composition
4. Copie le contenu des `<script>` dans le script de ta composition (avant ton code de timeline)
5. Si le composant expose une intégration à la timeline GSAP (voir le bloc de commentaire de l'extrait), ajoute ces appels à ta timeline

Voir [wiring-components.md](./references/wiring-components.md) pour tous les détails.

## Découverte

Parcourir les éléments disponibles :

```bash
# Lire le manifeste du catalogue
curl -s https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry/registry.json
```

Le `registry-item.json` de chaque élément contient : nom, type, titre, description, tags, dimensions (blocs seulement), durée (blocs seulement) et liste des fichiers.

Voir [discovery.md](./references/discovery.md) pour filtrer par type et par tags.

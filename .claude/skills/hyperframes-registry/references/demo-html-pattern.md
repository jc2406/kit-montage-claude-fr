# La convention demo.html

## Pourquoi les composants sont livrés avec un demo.html

Chaque composant du catalogue est livré avec un fichier `demo.html` à côté de son extrait. La démo sert à deux choses :

1. **Support d'aperçu** — la chaîne d'aperçu de la CI rend la démo pour générer les miniatures et les vidéos d'aperçu de la page de documentation du catalogue.

2. **Exemple d'utilisation** — la démo montre l'effet du composant appliqué à un contenu représentatif, et sert de référence fonctionnelle.

## Structure d'une démo

Une démo est une composition HTML complète et autonome :

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Nom du composant — Démo</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      /* réinitialisation + taille du canevas */
    </style>
  </head>
  <body>
    <div data-composition-id="<nom>-demo" data-width="1920" data-height="1080" data-duration="N">
      <!-- Contenu de démo qui montre l'effet -->
      <!-- Extrait du composant intégré ici -->
    </div>
    <script>
      // Timeline GSAP qui démontre l'effet
      window.__timelines = window.__timelines || {};
      window.__timelines["<nom>-demo"] = tl;
    </script>
  </body>
</html>
```

Conventions clés :

- `data-composition-id` vaut `<nom-du-composant>-demo` pour éviter les collisions
- La démo est autonome — tout le CSS et le JS de l'extrait sont intégrés
- La timeline GSAP est enregistrée dans `window.__timelines`
- La durée doit être assez longue pour montrer l'effet (en général 5 à 8 secondes)

## Les blocs n'ont pas besoin de demo.html

Les blocs sont déjà des compositions autonomes qui peuvent être rendues directement. Seuls les composants ont besoin de l'enveloppe de démo.

## Les démos ne sont pas installées

Le `demo.html` n'est PAS installé par `hyperframes add` — il n'existe que dans le catalogue, pour générer les aperçus et servir de référence.

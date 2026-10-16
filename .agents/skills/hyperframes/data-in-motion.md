# Les données en mouvement

Conseils légers pour les données et les chiffres dans les compositions vidéo. Le
[style maison](./house-style.md) gère l'esthétique — ceci traite seulement les pièges propres aux données.

## Continuité visuelle

Quand des chiffres successifs appartiennent au même concept (T1 → T2 → T3 → T4, ou trois indicateurs
d'un même produit), garde-les dans le même espace visuel avec la même esthétique. Seule la VALEUR
change. Un changement d'esthétique doit signaler un nouveau concept, pas juste un nouveau chiffre.

## Les chiffres ont besoin de poids visuel

Un chiffre seul flotte dans le vide. Associe chaque indicateur à un élément visuel qui lui donne de
la présence — une barre de remplissage proportionnelle, un changement de couleur de fond, une forme
qui représente la valeur, un anneau de progression. Le visuel n'a pas besoin d'être un graphique — il
doit juste remplir le cadre et rendre la donnée tangible plutôt qu'un texte sur un fond.

## Éviter les motifs du web

- **Pas de camemberts** — difficiles à comparer, ça fait PowerPoint
- **Pas de graphiques à plusieurs axes** — le spectateur ne peut pas étudier les intersections en 3 secondes
- **Pas de tableaux de bord à 6 panneaux** — 2 ou 3 indicateurs liés côte à côte, ça va ; 6 et plus, c'est un motif du web
- **Pas de quadrillages, graduations ni légendes** — du bruit visuel qui n'apporte rien en mouvement
- **Pas de sortie de bibliothèque de graphiques** — construis avec GSAP + SVG/CSS, pas avec D3 ou Chart.js
- **Format des nombres en français** — virgule décimale (3,5), espace fine pour les milliers (135 000), symbole après le nombre (12 %, 40 €)

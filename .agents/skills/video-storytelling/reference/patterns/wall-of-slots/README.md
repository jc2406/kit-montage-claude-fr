# Motif : le mur d'emplacements

La forme de boucle ouverte pour un script avec **N éléments parallèles** (« cinq automatisations »,
« sept outils »). Un exemple concret de la boucle ouverte spatiale décrite dans SKILL.md §1. Voir le
cahier neutre à la racine du dépôt, `docs/STORYTELLING-WORKBOOK.md`.

`wall.py` et `geom.py` sont ici les modules de travail, copiés tels quels (seuls leurs commentaires
sont traduits). Importe `wall` dans chaque constructeur de section pour que la cible d'arrimage, la
matière des emplacements et la ligne de résolution soient identiques partout.

## La forme

N emplacements sont posés sur une même colonne, avec des accolades qui les regroupent par domaine.
Ils s'ouvrent dans l'accroche, sur la phrase qui promet la liste. Chaque élément terminé s'arrime
dans son propre emplacement en sortant de sa section. Le récapitulatif remplit le mur avec les N
éléments terminés et trace une ligne qui les traverse.

## Pourquoi les détails comptent

- **Les emplacements vides sont des logements, pas des maquettes en fil de fer.** Une plaque de verre
  avec une lumière de bord directionnelle, qui contient un creux dont l'éclairage est *inversé* :
  ligne sombre en haut de la cavité, ligne claire au fond. Ça se lit comme un support qui attend
  d'être rempli. Un emplacement en pointillés se lit comme un fichier manquant.
- **L'arrimage est un mouvement de caméra en direct**, environ 1,4 s, qui fait voler le vrai
  graphisme terminé de la section jusque dans le rectangle de l'emplacement. Jamais une coupe vers
  une image toute faite de la tuile.
- **Le mur apparaît derrière le graphisme terminé avant que la caméra bouge**, pour que chaque
  passage de relais remontre les N emplacements avec ceux déjà remplis toujours remplis. Ce rappel,
  N fois, c'est la mécanique de rétention.
- **Le numéro défile dans le même mouvement**, comme un compteur kilométrique. Même début, même durée,
  même courbe pour les deux chiffres, sinon l'espacement des lignes s'effondre en plein défilement et
  les chiffres se fondent en une seule bande.
- **La résolution ferme sur l'image d'ouverture.** Une ligne traverse les N emplacements, entre par
  la source la plus à gauche et sort par le résultat le plus à droite, et porte la seule pointe de
  flèche du mur.

## La géométrie des emplacements est un état partagé

Choisis-la une fois, ne la bouge jamais. L'emplacement 1 de `wall.py` est à (320, 540) dans un
univers de 1920x1080, avec le commentaire « NE DOIT PAS BOUGER », parce que `build_s01.py` code en
dur son cadrage d'arrimage par rapport à lui. Tout constructeur de section qui redéfinit la
géométrie des emplacements casse en silence l'arrimage de toutes les autres sections, et aucun
contrôle ne le détecte.

## API

```python
import wall

CAM["DOCK"] = wall.dock_cam(1)           # transformation caméra qui pose la carte dans l'emplacement 1
lines, ids  = wall.wall_markup()         # les N emplacements
lines, ids  = wall.spine_markup()        # colonne, amorces, accolades de domaine, impulsion de flux
lines, ids  = wall.payoff_markup()       # la ligne unique qui traverse les N

wall.wall_reveal_js(t)                   # faire apparaître le mur derrière une carte terminée
wall.slot_dock_js(i, t)                  # confier l'emplacement i à une carte qui arrive en direct
wall.slot_fill_js(i, t)                  # récap : remplacer le logement par une miniature figée
wall.payoff_js(t)                        # tracer la ligne, poser la pointe de flèche
```

`slot_content_transform(i)` est le jumeau statique de `dock_cam(i)` : il fige un graphisme terminé
dans un emplacement comme enfant, déjà mis à l'échelle et placé, pour que le récap montre N cartes
terminées en miniature au lieu de N plaques vides.

## Limite connue

Les emplacements 01 et 02 du récap sont conçus à l'échelle 1:1. Les traits de l'emplacement 03
viennent encore d'une échelle de caméra de 0,143, donc ses filets sont plus fins que ceux de ses
voisins à taille apparente égale. Le corriger proprement demande un contrat de marquage entre
sections dans `wall.py`. Reporté, pas résolu.

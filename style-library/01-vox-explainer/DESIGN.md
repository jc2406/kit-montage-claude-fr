# Vox Explainer — Spec de design

> Source de vérité : les images de référence dans `references/`. Tout ce qui suit en est dérivé.

## Prompt de style

Collage de documentaire animé dans le style maison de Vox. Le cadre est une feuille de papier chaud, légèrement vieilli — fibres de papier journal, grille de plan à peine visible, un soupçon de grain sur tout. On y colle des **découpes** : vieilles gravures et photos en trame, détourées et cerclées d'un épais contour d'autocollant coloré (bleu ou orange), comme découpées aux ciseaux dans une archive puis collées. Une typo à empattements très contrastée porte le propos, ancrée par le geste signature — une **forme bleu vif** (cercle ou encadré marqueur) sur laquelle l'œil se fixe. Des flèches et des gribouillis dessinés à la main relient les idées comme les notes en marge d'un éditeur.

Le mouvement en est l'âme : **saccadé, à faible obturation, en stop-motion**. Rien ne glisse en douceur. Les éléments claquent et hoquettent en place sur un timing par paliers, comme filmés « en deux ». La caméra vit dans un **espace 3D** peu profond — elle pousse et bascule la mise au point pour montrer au spectateur exactement où regarder, en floutant les couches d'arrière-plan pour que le sujet ressorte. Ça doit paraître artisanal et éditorial, jamais lisse ni corporate. La relation à l'orateur : les cartes tier-1 prennent tout le papier (l'orateur disparaît, on est dans l'histoire) ; les cartes tier-2 collent une découpe ou un libellé au marqueur à côté de l'orateur sans couvrir son visage.

## Couleurs

- Fond (papier) : `#efe9dc` — papier journal chaud. Variante kraft : `#e6dcc4`
- Premier plan / encre : `#17130e` — encre d'imprimerie presque noire et chaude (texte + gravures)
- Accent (bleu signature) : `#37BDF8` — la signature ; cercles + encadrés de surlignage au marqueur
- Rouge éditorial : `#e23b2e` — cercles, gribouillis, alerte
- Orange de découpe : `#f26a1b` — contour d'autocollant / accent secondaire

5 couleurs symboliques, pas plus. Le bleu est sacré — une seule forme bleue dominante par temps fort, jamais deux en concurrence. Elles correspondent exactement à `tokens.css`.

> Pour l'adapter à votre marque, changez `--yellow` (le nom du token est historique, sa valeur est le bleu d'accent) dans `tokens.css`.

## Typographie

- Titre / affichage : **Fraunces** — `300` pour les lignes éditoriales légères, `900` (+ italique) pour la voix façon logo Vox et la mise en avant. Contraste de graisse extrême. Rendu Didone très contrasté aux grandes tailles. Approche `-0.03em`.
- Métadonnées / surtitre / libellé : **Archivo** — `700` en capitales, approche large (`0.16em`). La voix qui se fond dans la page : étiquettes de chapitre, caractéristiques techniques, dates, crédits.
- Accent manuscrit : **Caveat** — libellés de flèches et gribouillis en marge UNIQUEMENT. Jamais pour le texte courant.

Logique d'association : Fraunces (affirmation) + Archivo (métadonnées) traversent la frontière empattements / sans empattements. Caveat est une troisième voix, volontairement discrète — le stylo de l'éditeur, utilisé avec parcimonie. Playfair Display est volontairement évitée (la Didone par défaut des IA ; bannie par le guide typo).

## Mouvement

- Ressenti d'entrée : **claquement + hoquet**. Les éléments découpés surgissent avec `back.out(2.2)` ; les mouvements saccadés tournent sur `steps(6)` pour simuler une faible obturation / une cadence « en deux ».
- Ressenti de sortie : rapide — une glissade en `steps()` ou un balayage, jamais un fondu lent.
- Ambiance : **grain de papier** permanent (qui scintille légèrement par paliers), une lente **poussée de caméra** en tier-1, et une **bascule de mise au point** (couches d'arrière-plan floutées pour que le sujet se lise).
- Révélation du surlignage : l'encadré marqueur / le cercle bleu apparaît via `scaleX`/`scale` depuis 0 derrière le texte — le temps fort qui aimante le regard.
- Rythme : tier-1 ≈ 5–8 s avec une tenue qui respire ; tier-2 ≈ 6–14 s. Décalage entre sous-éléments 0,08–0,14 s. L'ordre est la hiérarchie — ce qui arrive en premier est le plus important.

## Types de cartes dans ce style

- **Cartes plein écran tier1 :** `section` (plein écran de chapitre/titre), `stat` (un seul gros chiffre), `overview` (une chronologie de 3 cartes photo avec dates).
- **Cartes tier2 :** `lower-third` (nom + rôle au marqueur à côté de l'orateur), `label` (encadré annoté avec une flèche dessinée à la main qui pointe le sujet).
- **Innovations :** le système d'emplacements découpés — les slots d'image s'affichent comme des cadres en papier découpé volontaires (remplissage en trame + contour d'autocollant coloré), pour qu'une carte fasse « Vox » avant même que l'agent y dépose une vraie image d'archive.

## À NE PAS faire

- Pas de fond blanc pur (`#fff`) ni noir pur (`#000`) — toujours papier chaud + encre chaude. Vox n'a jamais l'air numérique et propre.
- Pas de courbes douces, lentes et symétriques. Si ça glisse, c'est faux. Claquer, hoqueter, dépasser.
- Pas deux formes bleues focales qui se battent dans le même cadre. Un seul aimant à regard par temps fort.
- Pas de mise en page centrée et parfaitement droite. Les éléments sont légèrement de travers / hors grille, collés à la main.
- Pas de dégradés décoratifs, pas de lueurs, pas d'ombres floues pour la « profondeur » — la profondeur vient de l'échelle, du chevauchement et de la bascule de mise au point, pas d'ombres douces.
- Pas de titres sans empattements. La voix d'affirmation est toujours à empattements (Fraunces).

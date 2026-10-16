# Storyboard : showreel <Marque> <durée> s

Grille : temps de <période> s (<bpm> BPM mesurés), <fps> images/s. `B(n) = n * <période>`. Feuille d'images : `qa/beatsheet.txt` (générée par `scripts/beatgrid.mjs`).
Motif : <l'élément le plus épuré de la marque>. Couleur du sommet gardée en réserve : <couleur, rafale seulement>.

| Temps | Durée | Étiquette du HUD | Valeur | Image | Incrustation d'outil | Transformation d'entrée | Transformation de sortie | Bruitages |
|---|---|---|---|---|---|---|---|---|
| 0-4 | | 01 · <physique> | encre | le motif entre et obéit à la physique | relevé en direct | (ouverture) | le motif devient <laser / ligne / flash> | pops aux contacts |
| 4-12 | | 02 · <typo> | papier, inversion à B10 | phrase de la marque en typographie cinétique, 3 voix typographiques, papier peint | champ propre à la marque (barre de recherche, boîte de chat) ou cadre de sélection | le flash devient le papier | les lettres deviennent des copies du motif | frappe, clic, coup de l'inversion |
| 12-16 | | 03 · <grille> | encre | les copies du motif deviennent une grille de vraies images de la marque, vague, inclinaison de caméra | relevé de grille | les points deviennent des tuiles | poussée dans une tuile ; trou avant le drop | swishes, whoosh |
| 16-20 | | 04 · <particules> | encre + lueur d'accent | le drop : explosion en particules qui forment un chiffre vérifié | relevé des particules | la tuile devient une explosion | les particules deviennent la silhouette du héros | boom, pop, tic-tac |
| 20-24 | | 05 · <lookdev> | encre | objet héros photoréaliste, deux matières | relevé de matière, compteur | la silhouette devient l'objet | poussée à travers l'objectif, coupe franche | scintillement, whoosh |
| 24-28 | | 06 · <rafale> | alternée, la couleur en réserve arrive | 5 à 6 moments d'interface emblématiques, 1 temps puis des demi-temps | l'interface propre à chaque moment | coupes franches | bruit | clics, glitch, arrêt de bande |
| 28-fin | | 07 · <fin> | encre | le logo se résout, la règle se trace, les sous-titres se tapent, le motif se pose comme élément du logo, l'accroche en dernier | curseur de frappe | le bruit se résout | tenue | coup final, pop |

Vérifications avant de construire :
- [ ] Fige n'importe quelle image : elle se lit comme la marque sans le HUD.
- [ ] Chaque transition transforme l'objet (sauf les coupes de la rafale).
- [ ] La valeur s'inverse à chaque changement de chapitre.
- [ ] Chaque fait à l'écran est vérifié et daté dans BRAND.md.

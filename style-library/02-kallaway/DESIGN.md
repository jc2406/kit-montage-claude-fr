# Kallaway — Spec de design

> Source de vérité : les images de référence dans `references/` (vidéo explicative de créateur, sombre et haut de gamme, façon Kallaway). Tout ce qui suit en est dérivé. Le bleu de la palette est la lueur principale, là où les références utilisaient du violet. En interne, ce look s'appelle « aurora glass » : fond sombre + halo d'aurore + glassmorphism.

## Prompt de style

Motion design sombre haut de gamme, dans le style maison des vidéos explicatives de créateurs modernes. Le cadre est un fond froid, profond, presque noir (`#0A0E14`) avec un seul **halo d'aurore** de lumière bleue qui monte du bas, au centre — l'ambiance signature, comme un lever de soleil aux couleurs de la marque derrière tout le reste. Une grille de points discrète et un grain de film fin gardent le noir vivant et sans effet de bandes. On y fait flotter des surfaces en **glassmorphism** : cartes et pastilles dépolies, floutées par derrière, avec un fin reflet en haut et une ombre extérieure douce, comme des vitres éclairées suspendues dans un espace 3D. Les objets clés sont **éclairés par la tranche** — cadres de téléphone cerclés de néon, icônes au contour lumineux dans des tuiles arrondies blanches ou en verre, lignes de liaison en tirets qui se dessinent entre les nœuds.

Le texte porte le message et il **brille** : les titres se détachent du fond avec un halo doux blanc et bleu, les grands chiffres et les mots en dégradé aimantent le regard. La caméra vit dans un **empilement de mise au point** peu profond et cinématographique — les couches d'arrière-plan restent floues et lumineuses pendant que le sujet devient net, et les éléments dérivent, changent d'échelle et font de la parallaxe avec de longues courbes douces façon After Effects. Rien ne claque ni ne hoquette (ça, c'est Vox) ; ici tout **glisse et respire**. La relation à l'orateur : les cartes tier-1 sont en plein écran (on est dans l'idée) ; les cartes tier-2 font flotter une carte en verre ou un élément éclairé à côté de l'orateur sans couvrir son visage.

## Couleurs

- Fond : `#0A0E14` — presque noir, froid. Puits profond / vignette : `#07121C` bleu marine.
- Texte : `#F0EEE9` en principal sur fond sombre ; atténué `rgba(240,238,233,.62)` ; discret `rgba(240,238,233,.34)`. `#FFFFFF` pur pour le texte lumineux le plus appuyé.
- **Accent (bleu signature) : `#37BDF8`** — la vedette. Le halo d'aurore, les éclairages de tranche, les halos lumineux, le mot qui ressort. Il *remplace* le violet des références.
- Secondaire : `#F5D82A` jaune — chiffres mis en avant, la rare deuxième touche.
- Alerte : `#FF3B30` rouge — alarme, écart négatif, « le mensonge ». Chaud : `#FF8A5C` orange.
- Surface claire : `#F0EEE9` / `#FFFFFF` pour les tuiles et pastilles en verre blanc (avec du texte à l'encre `#2A251F` dessus).

Le bleu est sacré — une seule lueur dominante par temps fort, jamais deux couleurs saturées qui se battent. Elles correspondent exactement à `tokens.css`.

> Pour l'adapter à votre marque, changez `--accent` dans `tokens.css`.

## Typographie

- Titre / affichage / grands chiffres : **Plus Jakarta Sans** — `600`–`800`. Géométrique et haut de gamme ; ses rondeurs s'accordent aux arrondis du verre. C'est la voix lumineuse. Remplissage en dégradé (blanc→accent) pour les mots vedettes.
- Corps / libellés / légendes : **Inter** — `400`–`600`. Le cheval de trait propre et neutre, dans l'esprit Apple. Il s'efface sous le titre.
- Données / interface : **Space Mono** — horodatages (« il y a 1 min »), pourcentages, valeurs de téléscripteur, libellés de pastilles. La voix « c'est une vraie interface ». Avec parcimonie.

Logique d'association : Plus Jakarta (affirmation géométrique chaleureuse) + Inter (corps neutre) + Space Mono (données). Aucun empattement nulle part — les empattements sont la voix de Vox, pas la nôtre.

## Mouvement

- Ressenti d'entrée : **glisse + halo**. Les éléments montent en fondu avec un long `power4.out`/`expo.out`, souvent avec un `filter: blur()` qui se résout en net (mise au point). Les cartes en verre arrivent avec un léger rebond `back.out(1.4)` et une dérive en y de parallaxe.
- Lueur : le texte et les éclairages de tranche **pulsent** doucement (`repeat` fini, `yoyo`) — un halo qui respire lentement, jamais un stroboscope. Le halo d'aurore dérive et change d'échelle subtilement sous le contenu.
- Ressenti de sortie : une réduction douce + sortie floue ou un balayage léger — jamais de coupe sèche, jamais de glissade par paliers.
- Ambiance : grain discret + grille de points permanents ; lente poussée de caméra / parallaxe en tier-1 ; couches d'arrière-plan floutées pour que le sujet se lise (empilement de mise au point).
- Rythme : tier-1 ≈ 6–8 s avec une tenue qui respire ; tier-2 ≈ 5–10 s. Décalage entre sous-éléments 0,10–0,18 s (plus lent que Vox). L'ordre est la hiérarchie — ce qui arrive en premier est le plus important. Le temps fort moyen est plus lent et plus calme que chez Vox.

## Types de cartes dans ce style

- **Cartes plein écran tier1 :** `section` (plein écran de chapitre/titre lumineux, souvent sur un orbe qui monte), `stat` (un seul grand chiffre lumineux / en dégradé), `overview` (paquets de tuiles en verre, listes numérotées, piles de phases, chronologies qui se construisent).
- **Cartes tier2 :** `lower-third` (carte nom/rôle en verre ou élément éclairé à côté de l'orateur), `label` (encadré / annotation en verre flottant, relié au sujet par une ligne en tirets).
- **Innovations :** le **système de surfaces en verre** (carte dépolie avec fin reflet + ombre extérieure + liseré néon optionnel) et le fond **halo d'aurore** — tous deux en tokens pour que n'importe quelle carte se lise tout de suite comme « Aurora Glass ». Des cadres de téléphone / portrait éclairés par la tranche pour mettre en valeur l'orateur ou un extrait.

## À NE PAS faire

- Pas de papier, pas de papier journal chaud, pas d'encre, pas d'empattements — ça, c'est Vox. Ce style est numérique, sombre, éclairé.
- Pas de mouvement saccadé / par paliers / qui hoquette. Si ça claque « en deux », c'est faux. Tout glisse, s'illumine, respire.
- Pas deux couleurs de lueur saturées qui se battent dans le même cadre. Un seul aimant à regard bleu par temps fort ; jaune/rouge/orange sont une ponctuation rare.
- Pas d'aplats durs là où du verre ou une lueur porterait le côté haut de gamme — mais n'en faites pas trop non plus ; la lueur est pour les éléments focaux, pas pour chaque boîte.
- Pas de lueur stroboscopique / en boucle infinie (`repeat: -1`) — le scintillement / la pulsation est fini (`repeat: N, yoyo: true`) pour un rendu déterministe.
- Pas de flèches dessinées à la main, de gribouillis, de cercles au marqueur (motifs Vox). Ici, les liaisons sont des lignes nettes, pleines ou en tirets, qui se dessinent, et des points/nœuds qui s'allument.

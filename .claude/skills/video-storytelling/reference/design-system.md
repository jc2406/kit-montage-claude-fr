# Design system (référence)

Design system réutilisable tiré d'un ancien exemple. Garde la STRUCTURE (un seul jeu de tokens
figé, cinq couleurs aux sens fixes, lisibilité mesurée en luminance) ; règle de nouveau les valeurs
pour chaque projet, puis fige-les avant de construire.

---

# Le système figé

Prouvé sur la section 1. Chaque section suivante en hérite exactement. Rien ici n'est une
suggestion ; `scripts/qa-tokens.mjs` fait échouer la construction en cas de violation.

## Tokens — la règle la plus importante

La revue d'artisan a trouvé la vraie signature « machine » : **18 épaisseurs de trait, 9 tailles de
texte, 7 variantes de pointes de flèche, 3 philosophies d'angles.** Des valeurs à 0,2 d'écart sont
invisibles une par une et fatales ensemble — tout se lit comme une épaisseur *presque* identique,
donc l'œil reçoit du bruit au lieu d'une hiérarchie. Le verdict :
*« chaque décision a été prise localement et correctement ; aucune décision n'a été prise globalement. »*

| Token | Valeurs | Rôle |
| --- | --- | --- |
| Trait | **1,5 / 2,5 / 4 / 7** | filet · liens · contours des nœuds · mise en avant, arcs de jauge, marque humaine |
| Texte | **22 / 30 / 42 / 60 / 84** | légende · étiquette · nœud · affirmation · héros |
| Arrondi | **10 / 22 / 40** | tous les angles, toujours `superellipse(2)` |

Aucun attribut `rx=` nulle part — les ellipses sont des tracés (`ell()`), les angles sont des
tracés en superellipse (`sq()`). Une seule `arrow()` d'une seule taille, avec la pointe qui se
termine **sur** un bord, jamais à l'intérieur. Un seul langage de lien : des courbes.

## Palette — cinq sens, aucune décoration

| Token | Hex | Signifie, et seulement ça |
| --- | --- | --- |
| Fond | bleu marine | la toile |
| Encre froide | `#BFC9DA` | structure, bords, état discret |
| Signal bleu | `#8FC0FF` | le chemin actif, le système qui fonctionne |
| Chaud | `#FFB454` / `#FFD98F` | **un humain est impliqué.** Rien d'autre n'est jamais chaud |
| Blanc cassé | `#E9ECF2` / `#CBD3E0` | le texte. **Jamais `#FFFFFF`** (il bave sur fond sombre) |

Zéro violet. Zéro cyan. Zéro texte en dégradé. L'axe chaud porte sa propre flaque de lumière
`radialGradient` qui déborde sur la géométrie voisine — jugée la chose la plus « designée » de
l'œuvre. Garde ce débordement.

## Matière

- Une **pile** d'ombres, jamais un seul flou : contact (`dy2/sd2`) + principale (`dy12/sd11`) +
  ambiante (`dy30/sd26`). L'habillage HTML utilise le `box-shadow` à 6 couches avec une lumière de
  bord intérieure *et* un assombrissement intérieur en bas.
- Lumière de bord directionnelle `gEdge` : blanc `.97 → .84 → .70` de haut en bas. Le bord du haut
  est visiblement plus clair que celui du bas.
- `corner-shape: superellipse(2)` (vérifié fonctionnel dans ce moteur de rendu).
- La **carte vidéo obéit au même système** — angles en superellipse, pile d'ombres, lumière de bord.
  Trois philosophies de bord différentes dans une même image était un défaut identifié.

## Lisibilité — mesurée, pas estimée à l'œil

La hiérarchie vient du RAPPORT entre l'actif et le discret, jamais du fait de tout assombrir. Le
pixel le plus clair du premier prototype était à 101/255 et il était illisible en 960x540.

| État | Luminance visée |
| --- | --- |
| Trait + étiquette actifs | 200-235 |
| Contexte (dessiné, encore pertinent) | 120-150 |
| Épuisé (a dit ce qu'il avait à dire) | 85-105 |
| Toute étiquette, tout état | jamais sous 90 |

**Juger la lisibilité se fait à la main.** Lis une réduction en 960x540. Des seuils absolus de
proportion de pixels mesurent la quantité de texte, pas la lisibilité — voir `qa-legibility.mjs`.

## Mouvement

- Entrées en `cubic-bezier(0.16,1,0.3,1)` ; sorties plus rapides que les entrées.
- La courbe des volets est mesurée et validée — réutilise-la, ne la règle pas de nouveau.
- Varie la durée avec la masse. Un nœud de 290 px et une étiquette de 40 px ne doivent pas ralentir
  de la même façon ; ce réglage global unique était un défaut identifié.
- **`back.out` exactement une fois par section**, sur le temps fort qui le mérite.
- **Jamais de fondu enchaîné.** Les couches plein cadre entrent et sortent par découpe sur un fond
  déjà opaque. À chaque instant, un pixel est soit du graphisme, soit de l'image.
- Caméra et volet sont **enchaînés, jamais simultanés** — la caméra d'abord, puis le volet. Les
  lancer ensemble guillotine le contenu (LEAD et CRM étaient coupés ; « ENRICH » est devenu « N »).

## Règles de mise en page

- **Aucune étiquette à moins de 60 px du bord du panneau.** Les nœuds peuvent déborder et se lire
  comme « la carte continue » ; un mot coupé au milieu d'une lettre se lit comme un bug. Un fondu de
  44 px ne peut pas rattraper une lame qui file à environ 1800 px/s : règle-le par le placement, pas
  par un masque.
- Chaque étiquette porte un halo de 4 px pour que la géométrie qui la croise ne touche jamais le texte.
- Lignes de base communes pour les éléments voisins liés.
- Rien ne passe à moins d'environ 40 px du bas du cadre (risque de débordement).

## Règles de contenu

- **Si ce n'est pas nommé, ce n'est pas dessiné.** Chaque forme est un nœud étiqueté, un lien entre
  nœuds étiquetés, l'élément qui voyage ou le fond d'ambiance.
- **Un accessoire passe à l'opacité 0 quand son temps fort se termine.** L'atténuer à 0,3 laisse
  des confettis inexpliqués à l'écran pour le reste de la section.
  Règle du générateur : émets un `mute()` **avant** tout `lit()` qui commence plus tard, sinon
  l'atténuation est écrasée quand son animation se termine.
- **Un visuel de contre-exemple ne se superpose jamais à la recommandation.** Passe d'abord la carte
  presque au noir.
- Environ 20 mots par section. Pas de phrases. Étiquettes de 1 ou 2 mots, sous leur nœud.
- L'état de l'élément est l'histoire : des lignes se remplissent, la barre de score bouge, la
  bordure change de couleur. Le spectateur suit la section en regardant une seule puce.

## Contrôles de vérification — tous doivent passer

```bash
node scripts/qa-tokens.mjs                       # 0 hors système
node scripts/qa-no-crossfade.mjs                 # 0 violation
node scripts/qa-legibility.mjs renders/x.mp4     # aucun « NOTHING IS LIT »
node scripts/qa-exposure.mjs renders/x.mp4 assets/edit-master.mp4 plan/cover-seams.json
"../../node_modules/.bin/hyperframes" lint       # 0 erreur, 0 avertissement
ffmpeg -hide_banner -i renders/x.mp4 -vf blackdetect=d=0.03:pix_th=0.06 -f null -   # 0
```
En plus : lis une réduction en 960x540 de chaque temps fort majeur. Les contrôles ne remplacent pas le regard.
(Les scripts `qa-*` viennent de la construction de référence et ne sont pas fournis dans ce kit.)

## Résultat de la section 1 (la référence)

21 mots · 1 coupe de scène en 84 s · 4 épaisseurs de trait · 5 tailles de texte · 0 fondu enchaîné ·
0 image noire · pixel le plus clair à 246 · compréhension en test muet 7/10 avant les corrections
d'ornements, et les ornements étaient la cause identifiée.

## Présence à l'écran — mesurée, et la décision

Le risque n° 4 de l'ARCHITECTURE prévenait que l'orateur pouvait disparaître. Mesuré avec
`scripts/qa-presence.mjs` (validé : des images brutes donnent 100,0 %) :

| Section | Orateur à l'écran |
| --- | ---: |
| s01 lead | 51,3 % |
| f02 processus | 46,3 % |
| s02 support | 43,9 % |
| s04 documents | 42,0 % |
| s05 onboarding | 37,7 % |
| f01 accroche | 37,5 % |
| f03 spécialiste | 28,4 % |

Total ≈ **42 %** — bien au-dessus des 27 à 31 % que plusieurs sections déclaraient elles-mêmes, et
un rapport normal pour une vidéo explicative menée par les graphismes.

Plus longues absences continues (temps du master) :

| Fenêtre | Durée | Ce qui est à l'écran |
| --- | ---: | --- |
| 307-341 s | 34 s | chiffre Zapier + désaturation « l'ennuyeux, c'est beau » |
| 498-528 s | 30 s | la boucle ouverte qui se ferme sur l'emplacement 04 + 30 contre 1 |
| 245-268 s | 23 s | test de résistance de la voix |
| 418-439 s | 21 s | résultat de l'onboarding |
| 437-458 s | 21 s | découverte du processus |

**Décision : accepté, pas corrigé.** Les deux fenêtres de plus de 30 s sont des temps forts de
résolution qui ont besoin de toute la largeur — la boucle qui se ferme sur l'emplacement 04 est le
sommet structurel de la vidéo, et la désaturation est tout l'argument de la section 4. La plainte du
brief portait sur la *confusion*, pas sur l'absence, et du temps de visage n'achète pas de clarté.
Ajouter des fenêtres de panneau dans ces temps forts risquerait aussi d'exposer les raccords de
montage qu'ils recouvrent.

Si une future passe veut plus de présence, les récupérations faciles déjà repérées par les
constructeurs sont : s05, une fenêtre de panneau d'environ 3,5 s à 63,0-66,5 (proto), et f03 qui
cède un temps fort aux images. Ne la prends pas sur les deux fenêtres de résolution.

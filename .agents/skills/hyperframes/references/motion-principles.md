# Principes du mouvement

## Garde-fous

Tu connais ces règles mais tu les enfreins. Arrête.

- **N'utilise pas la même courbe sur chaque animation.** Par défaut, tu mets `power2.out` partout. Varie les courbes comme tu varies les graisses de police — pas plus de 2 animations indépendantes avec la même courbe dans une scène.
- **N'utilise pas la même vitesse partout.** Par défaut, tu mets 0,4-0,5 s partout. La scène la plus lente doit être 3 fois plus lente que la plus rapide. Varie la durée délibérément.
- **Ne fais pas tout entrer de la même direction.** Par défaut, tu mets `y: 30, opacity: 0` sur chaque élément. Varie : depuis la gauche, depuis la droite, par l'échelle, l'opacité seule, l'interlettrage.
- **N'utilise pas le même décalage sur chaque scène.** Chaque scène a besoin de son propre rythme.
- **N'utilise pas de zoom d'ambiance sur chaque scène.** Choisis un mouvement d'ambiance différent par scène : panoramique lent, légère rotation, poussée d'échelle, changement de couleur, ou rien. L'immobilité après le mouvement est puissante.
- **Ne commence pas à t=0.** Décale la première animation de 0,1 à 0,3 s. Un départ sans délai fait l'effet d'un jump cut.

## Ce que tu ne fais pas sans qu'on te le dise

### La courbe est une émotion, pas une technique

La transition est le verbe. La courbe est l'adverbe. Une glissade d'entrée en `expo.out` = assurée.
En `sine.inOut` = rêveuse. En `elastic.out` = joueuse. Même mouvement, sens différent. Choisis l'adverbe délibérément.

**Règles de direction — elles ne sont pas optionnelles :**

- `.out` pour les éléments qui entrent. Démarre vite, ralentit. Paraît réactif. C'est ton choix par défaut.
- `.in` pour les éléments qui sortent. Démarre lentement, accélère en partant. Les éjecte.
- `.inOut` pour les éléments qui se déplacent d'une position à une autre.

Tu te trompes de sens en permanence. Une courbe `.in` à l'entrée paraît molle. Une courbe `.out` à la sortie paraît réticente.

### La vitesse communique le poids

- Rapide (0,15-0,3 s) — énergie, urgence, assurance
- Moyenne (0,3-0,5 s) — professionnel, la plupart des contenus
- Lente (0,5-0,8 s) — gravité, luxe, contemplation
- Très lente (0,8-2,0 s) — cinématographique, émotionnel, atmosphérique

### Structure d'une scène : construire / respirer / résoudre

Chaque scène a trois phases. Tu déverses tout dans la construction et ne laisses rien pour la respiration ni la résolution.

- **Construire (0-30 %)** — les éléments entrent, décalés. Ne déverse pas tout d'un coup.
- **Respirer (30-70 %)** — le contenu est visible, vivant grâce à UN seul mouvement d'ambiance.
- **Résoudre (70-100 %)** — sortie ou fin nette. Les sorties sont plus rapides que les entrées.

### Les transitions ont un sens

- **Fondu enchaîné** = « ça continue »
- **Coupe franche** = « réveille-toi » / rupture
- **Fondu lent** = « laisse-toi porter »

Tu fais des fondus enchaînés partout. Utilise les coupes franches pour les ruptures et les changements de registre.

### La chorégraphie est une hiérarchie

L'élément qui bouge en premier est perçu comme le plus important. Décale par ordre d'importance, pas
dans l'ordre du DOM. N'attends pas la fin d'une animation — fais se chevaucher les entrées. Toute la
séquence décalée doit tenir en moins de 500 ms, quel que soit le nombre d'éléments.

### L'asymétrie

Les entrées demandent plus de temps que les sorties. Une carte met 0,4 s à apparaître mais 0,25 s à disparaître.

## Composition visuelle

Tu construis pour le web. Les images d'une vidéo ne sont pas des pages.

- **Au moins deux points focaux par scène.** L'œil a besoin d'un endroit où voyager. Jamais un seul bloc de texte flottant dans le vide.
- **Remplis le cadre.** Texte héros : 60 à 80 % de la largeur. Tu vas essayer d'utiliser des éléments à la taille du web. Ne le fais pas.
- **Au moins trois couches par scène.** Traitement du fond (lueur, texte géant estompé, panneau de couleur). Contenu au premier plan. Éléments d'accent (séparateurs, étiquettes, barres de données).
- **Le fond n'est pas vide.** Lueurs radiales, texte géant estompé qui déborde du cadre, panneaux à bordure discrète, filets fins. Un `#000` uni pur se lit comme « rien n'a chargé ».
- **Ancre aux bords.** Accroche le contenu en haut à gauche ou en bas à droite. Centré et flottant, c'est un motif du web.
- **Divise le cadre.** Panneau de données à gauche, contenu à droite. Barre du haut avec des métadonnées, pleine largeur en dessous. Des mises en page par zones, pas des piles centrées.
- **Utilise des éléments structurels.** Filets, séparateurs, panneaux à bordure. Ils créent des chemins pour l'œil et s'animent bien (scaleX depuis 0).

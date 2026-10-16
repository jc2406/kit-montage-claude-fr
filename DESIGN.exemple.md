# [Votre marque] — Identité visuelle (modèle)

Modèle de DESIGN.md à copier dans chaque projet (`video-projects/<slug>/DESIGN.md`) et à remplir
avec votre marque. Il remplace l'exemple AI Automation Society du kit d'origine, retiré de cette
traduction parce que la marque n'est pas sous licence. Chaque composition du projet DOIT pouvoir
justifier sa palette, sa typographie et ses choix de mouvement à partir de ce fichier.

## Prompt de style

Décrivez la marque en 3 à 5 phrases : sa personnalité, son ambiance, ce qu'elle n'est pas.
Exemple de forme : « [Marque] est une marque technique, sûre d'elle, orientée action. Les
compositions doivent donner l'impression de [image concrète]. Pas [à éviter]. L'ambiance est
[trois mots]. »

## Couleurs

| Token | Hex | Rôle |
|---|---|---|
| `--brand-bg` | `#______` | Fond principal |
| `--brand-surface` | `#______` | Cartes, panneaux, surfaces |
| `--brand-border` | `#______` | Bordures, séparateurs, filets |
| `--brand-accent` | `#______` | Accent principal : mises en avant, chiffres, appels à l'action |
| `--brand-accent-2` | `#______` | Accent secondaire, à utiliser avec parcimonie pour le contraste |
| `--brand-text` | `#______` | Texte principal |
| `--brand-text-dim` | `#______` | Texte secondaire, métadonnées |

Pas plus de 5 teintes actives, chacune avec un sens (voir `MOTION_PHILOSOPHY.md`, §2.3).

## Typographie

- **[Police de titre] ([graisses])** — pour : titres, accroches, chiffres héros.
- **[Police de texte ou monospace] ([graisses])** — pour : libellés, chiffres, lignes de terminal, URL, appels à l'action.

Indiquez comment les associer (par exemple : libellé monospace au-dessus d'un titre sans-serif).

## Logo

- Fichier : `assets/logo.png` (ou `.svg`) — décrivez-le (couleur, fond transparent ou non).
- Effet autorisé sur fond sombre, s'il y en a un.
- Zone de protection : par exemple une demi-hauteur de logo de marge de chaque côté.
- Ne jamais recolorer, déformer ou ajouter d'effet hors de cette fiche.

## Règles de mouvement

- **Entrées seulement** (règle du skill HyperFrames) : chaque élément entre avec `gsap.from()`. Les transitions entre scènes gèrent les sorties.
- **Palette de courbes :** par exemple `power3.out`, `expo.out`, `back.out(1.4)` pour les entrées ; `power2.in` pour les passages vers une transition ; `sine.inOut` pour les boucles d'ambiance.
- **Au moins 3 courbes différentes par scène.** Variez la sensation.
- **Plages de durée :** entrées vives 0,3 à 0,5 s, entrées de titre 0,5 à 0,8 s, dérives d'ambiance 2 à 4 s.
- **Décaler la première animation** de 0,1 à 0,3 s après le début de la scène.
- **Décalage du texte :** 0,04 à 0,08 s par lettre pour les grands titres, 0,12 à 0,18 s par mot pour les titres.
- **Chiffres :** compteur GSAP `{innerText: N, snap: {innerText: 1}}` et `font-variant-numeric: tabular-nums`.

## Transitions

| Changement de scène | Transition | Durée | Courbe |
|---|---|---|---|
| 1 → 2 | [ex. zoom à travers] | 0,35 s | `power4.inOut` |
| 2 → 3 | [ex. poussée vers la gauche] | 0,35 s | `power2.inOut` |
| … | | | |

Indiquez la transition principale et les accents (ouverture, fin).

## Boutons

Décrivez la forme (pilule, rectangle), le remplissage, la bordure, la police et la casse, les marges.
Exemple : `[ REJOINS-NOUS → ]`

## Iconographie

Épaisseur du trait, couleur, remplissage ou non, types d'icônes autorisés.

## À ne pas faire

1. **Pas de dégradés linéaires plein écran** sur fond sombre : effet d'escalier en H.264. Utilisez un fond uni + une lueur radiale locale derrière les éléments importants.
2. **Pas de couleurs hors palette.**
3. **Pas de polices hors de la liste ci-dessus.**
4. **Pas de mot-clé `transparent` dans les dégradés** (règle CSS compatible shaders) : utilisez `rgba(…, 0)`.
5. **Pas de `Math.random()` ni de `Date.now()`** : le rendu doit être déterministe. Utilisez un générateur à graine si besoin.
6. **Pas d'animation de sortie** sauf sur la dernière scène : les transitions gèrent les sorties.
7. **Ne jamais déformer le logo.** Garder les proportions et la zone de protection.

## Fichiers de référence

- `assets/logo.png` — logo officiel
- `assets/charte.jpg` ou `.pdf` — la charte d'où viennent ces règles
- `assets/brand-tokens.css` — les variables CSS `:root` importées par chaque composition

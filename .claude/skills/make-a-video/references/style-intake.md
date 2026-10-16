# Recueil du style — interroger sans imposer de marque

Utilisé par l'étape 3 de `/make-a-video`. Le but : extraire l'identité visuelle de l'utilisateur (ou
se rabattre proprement quand il n'en a pas) sans jamais choisir une marque *à sa place*.

## L'arbre de décision

```
L'utilisateur a-t-il une charte, un document de marque ou une palette explicite ?
├── Oui → Extraire les valeurs → Utiliser exactement ce qu'il a fourni
├── En partie (quelques réponses, pas toutes) → Compléter avec les valeurs par défaut de MOTION_PHILOSOPHY, signaler les manques dans BRIEF.md
└── Non → Proposer les valeurs par défaut de MOTION_PHILOSOPHY ET demander des vidéos de référence en solution de repli
```

## Valeurs par défaut MOTION_PHILOSOPHY (le repli, seulement si l'utilisateur refuse de fournir un style)

### Palette

| Rôle | Valeur |
|---|---|
| Fond | `#000` (noir pur) ou `#0a0a0a` (presque noir) |
| Dégradé chromé du texte | `linear-gradient(180deg, #ffffff 0%, #999999 60%, #cccccc 100%)` avec `-webkit-background-clip: text; color: transparent;` |
| Lignes de grille | `rgba(255, 255, 255, 0.05)` |
| Vignettage | `radial-gradient(ellipse at center, transparent 30%, black 100%)` |
| Accent | UN seul hex choisi pour son sens symbolique — demande à l'utilisateur « quelle est LA seule émotion de cette vidéo ? » et fais la correspondance |

Garde une discipline stricte de l'accent. MOTION_PHILOSOPHY §0 loi 7 : ≤ 5 couleurs symboliques
dans toute la vidéo, chacune avec un sens nommé.

### Polices

- **Titres / typographie cinétique :** Inter (Google Fonts), graisse 700
- **Monospace (code, chiffres, terminal) :** JetBrains Mono, graisse 500
- Chargement via `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@500&display=swap">`

Variantes autorisées : Space Grotesk ou Geist pour un style tech, Instrument Serif pour un style
éditorial, Bebas Neue pour l'impact. **Une famille de titre plus une monospace.** Deux sans-serif
dans la même pièce, c'est presque toujours raté.

### Textures (toujours présentes, même avec une palette sur mesure)

- Sol en grille perspective (lignes à faible opacité)
- Couche de vignettage par-dessus
- Grain film : `npx hyperframes add grain-overlay` installé comme composant
- Repères en croix `+` aux intersections de la grille (optionnel mais recommandé)

---

## Quand l'utilisateur fournit des codes hex

1. **Demande au moins trois rôles :**
   - Fond
   - Texte principal / accent principal
   - Accent secondaire (la couleur de l'« émotion »)
   - (Optionnel : surface · bordure · alerte)

2. **Fais respecter la règle des ≤ 5 couleurs symboliques.** S'il donne 8 couleurs, demande lesquelles portent le récit et lesquelles sont décoratives — retire les décoratives.

3. **Donne un sens à chaque couleur.** Une phrase par couleur, par ex. « cyan = action, orange = alerte, blanc = voix de la marque ». Enregistre la correspondance dans le `style-profile.md` du projet.

4. **Vérifie le contraste.** Si l'accent sur le fond est sous 4,5:1 pour des éléments de taille texte, signale-le à l'utilisateur. Un texte sur fond sombre a souvent besoin d'un halo en `text-shadow` pour bien se lire — MOTION_PHILOSOPHY §2.2 donne la recette.

## Quand l'utilisateur fournit des polices

1. Transforme les noms Google Fonts en balises `<link>`. Si une police est personnalisée, note le chemin du fichier et prévois une déclaration `@font-face`.
2. Confirme les graisses : par défaut Regular (400) + Bold (700) + une graisse de titre si précisée.
3. Règle d'association : une famille de titre + une monospace. Évite d'empiler deux sans-serif.

## Quand l'utilisateur fournit un logo

1. Demande : chemin du fichier · préférence de zone de protection · éventuelle spécification de lueur ou d'effet
2. Dans `style-profile.md`, note : chemin · dimensions · recette de filtre CSS (par ex. `drop-shadow(0 0 40px rgba(accent, 0.6))` s'il veut une lueur)
3. Ne recolore ni ne déforme jamais le logo dans les compositions.

## Quand l'utilisateur fournit des vidéos de référence

1. Regarde / lis les références. Si ce sont des URL, récupère-les.
2. Extrais :
   - La palette dominante (2 à 4 codes hex)
   - Le style typographique (serif · sans · mono · display)
   - Le rythme (cinétique · équilibré · posé)
   - Le vocabulaire de mouvement principal (panoramiques fouettés · transformations · fondus · glitchs · révélations 3D)
3. Propose une palette + paire de polices + rythme dérivés. **Confirme avec l'utilisateur** avant de construire.

---

## `<dossier-projet>/assets/style-profile.md` — ce qu'il contient

```markdown
# Profil de style — <slug-projet>

## Palette
- bg: #...              (rôle : fond)
- text: #...            (rôle : texte principal)
- accent: #...          (rôle : <sens nommé>)
- warn: #...            (optionnel, rôle : ...)
- surface: #...         (optionnel)

## Polices
- Titre : <Nom de famille> (graisse(s), chargée depuis Google Fonts ou un fichier)
- Mono : <Nom de famille> (graisse, chargée depuis ...)

## Logo
- Chemin : assets/<fichier-logo>
- Zone de protection : <par ex. une demi-hauteur de logo de chaque côté>
- Filtre CSS (s'il y en a un) : filter: drop-shadow(0 0 40px rgba(..., 0.6));

## Origine du profil
- [ ] Fourni par l'utilisateur (charte / document de marque)
- [ ] Déduit de vidéos de référence (confirmé par l'utilisateur)
- [ ] Valeurs par défaut MOTION_PHILOSOPHY (l'utilisateur a refusé d'en fournir)

## Sens (≤ 5 couleurs)
- <couleur> = <sens>
- ...
```

Chaque composition de l'étape 6 puise dans ce fichier. C'est la référence unique du projet.

---

## La discipline qui s'applique quelle que soit la palette

Même quand l'utilisateur choisit une palette entièrement sur mesure, garde ces principes de
MOTION_PHILOSOPHY. Ils sont indépendants de l'esthétique :

- Scènes de 1 à 2 secondes dans le corps de la vidéo
- Une idée par temps fort
- ≤ 5 couleurs symboliques, chacune avec un sens nommé
- Texture grille / vignettage / grain sur chaque scène
- Transitions avec flou de mouvement (panoramiques fouettés, transformations) — jamais de coupes franches
- Tenir la fin 4 à 6 secondes
- Au moins un rappel visuel (un élément qui revient plus tard)

La marque change. La discipline, non.

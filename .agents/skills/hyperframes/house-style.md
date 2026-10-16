# Style maison

Direction créative des compositions quand aucun `visual-style.md` n'est fourni. Ce sont des points de
départ — remplace tout ce qui ne sert pas le contenu.

## Avant d'écrire du HTML

1. **Interprète le prompt.** Génère du vrai contenu. Une recette liste de vrais ingrédients. Un HUD a de vrais relevés.
2. **Choisis une palette.** Clair ou sombre ? Déclare le fond, le premier plan et l'accent avant d'écrire du code.
3. **Choisis des polices.** Lance le script de découverte de polices de [references/typography.md](references/typography.md) — ou prends une police que tu connais déjà et qui colle au thème. Le script élargit tes options ; ce n'est pas la seule source.

## Les facilités à remettre en question

Ces motifs sont des signes de design par IA — la première chose que tout LLM attrape. Si tu
t'apprêtes à en utiliser un, arrête-toi et demande-toi : est-ce un choix délibéré pour CE contenu,
ou une habitude par défaut ?

- Texte en dégradé (`background-clip: text` + dégradé)
- Bandes d'accent sur le bord gauche des cartes et encarts
- Cyan sur fond sombre / dégradés du violet au bleu / accents néon
- `#000` ou `#fff` purs (teinte plutôt vers ta couleur d'accent)
- Grilles de cartes identiques (cartes de même taille répétées)
- Tout centré avec le même poids (guide l'œil quelque part)
- Polices interdites (voir [references/typography.md](references/typography.md) pour la liste complète)

Si le contenu appelle vraiment l'un d'eux — une mise en page centrée pour une conclusion solennelle,
des cartes pour une vraie maquette d'interface produit, une police interdite parce qu'elle colle
parfaitement au thème — utilise-le. Le but est l'intention, pas l'évitement.

## Couleur

- Accorde clair/sombre au contenu : cuisine, bien-être, enfants → clair. Tech, cinéma, finance → sombre.
- Une seule teinte d'accent. Le même fond sur toutes les scènes.
- Teinte les neutres vers ton accent (même une légère chaleur ou fraîcheur vaut mieux qu'un gris mort).
- **Contraste :** imposé par `hyperframes validate` (WCAG AA). Le texte doit rester lisible une fois les éléments décoratifs retirés.
- Déclare la palette dès le départ. N'invente pas de couleurs élément par élément.

## Couche de fond

Chaque scène a besoin de profondeur visuelle — des éléments décoratifs persistants qui restent
visibles pendant que le contenu entre. Sans eux, les scènes paraissent vides pendant les entrées décalées.

Idées (à mélanger, 2 à 5 par scène) :

- Lueurs radiales (teintées de l'accent, faible opacité, échelle qui respire)
- Texte fantôme (mots du thème à 3-8 % d'opacité, très grand, dérive lente)
- Lignes d'accent (filets fins, légère pulsation)
- Grain/bruit, formes géométriques, motifs de grille
- Éléments décoratifs thématiques (anneaux d'orbite pour l'espace, sillons de vinyle pour la musique, lignes de grille pour les données)

Tous les éléments décoratifs doivent avoir une animation GSAP d'ambiance lente — respiration, dérive,
pulsation. Des éléments décoratifs statiques paraissent morts.

## Mouvement

Voir [references/motion-principles.md](references/motion-principles.md) pour les règles complètes.
En bref : 0,3 à 0,6 s, varier les courbes, combiner les transformations à l'entrée, faire se chevaucher les entrées.

## Typographie

Voir [references/typography.md](references/typography.md) pour les règles complètes. En bref : 700-900
pour les titres / 300-400 pour le texte, serif + sans (pas deux sans), titres de 60 px et plus / texte de 20 px et plus.

## Palettes

Déclare un fond, un premier plan et un accent avant d'écrire du HTML.

| Catégorie           | Pour                                              | Fichier                                                    |
| ------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| Audacieuse / énergique | Lancements de produit, réseaux sociaux, annonces | [palettes/bold-energetic.md](palettes/bold-energetic.md)   |
| Chaude / éditoriale | Récits, documentaires, études de cas              | [palettes/warm-editorial.md](palettes/warm-editorial.md)   |
| Sombre / premium    | Tech, finance, luxe, cinéma                       | [palettes/dark-premium.md](palettes/dark-premium.md)       |
| Épurée / corporate  | Vidéos explicatives, tutoriels, présentations     | [palettes/clean-corporate.md](palettes/clean-corporate.md) |
| Nature / terre      | Développement durable, plein air, bio             | [palettes/nature-earth.md](palettes/nature-earth.md)       |
| Néon / électrique   | Jeux vidéo, tech, vie nocturne                    | [palettes/neon-electric.md](palettes/neon-electric.md)     |
| Pastel / douce      | Mode, beauté, lifestyle, bien-être                | [palettes/pastel-soft.md](palettes/pastel-soft.md)         |
| Joyau / riche       | Luxe, événements, raffinement                     | [palettes/jewel-rich.md](palettes/jewel-rich.md)           |
| Monochrome          | Dramatique, centré sur la typographie             | [palettes/monochrome.md](palettes/monochrome.md)           |

Ou dérive-la en OKLCH — choisis une teinte, construis fond/premier plan/accent à différentes
luminosités, et teinte tout vers cette teinte.

# Modèle de storyboard — temps fort par temps fort

Utilisé par l'étape 5 de `/make-a-video`. Génère `<dossier-projet>/STORYBOARD.md` — le plan de construction.

## En-tête

```markdown
# STORYBOARD — <slug-projet>

**Durée totale :** <durée> s · <fps> images/s · <largeur>×<hauteur>
**Profil de style :** voir `assets/style-profile.md`
**Script / brief :** voir `BRIEF.md`

## Structure en actes

- **Acte 1 (0 → ≈ 20 %) :** accroche — capter l'attention dans les 1 à 2 premières secondes
- **Acte 2 (≈ 20 % → ≈ 75 %) :** corps — une idée par temps fort, scènes de 1 à 2 secondes
- **Acte 3 (≈ 75 % → fin) :** résolution + fin tenue 4 à 6 secondes

## Tableau de timing

| # | Début | Durée | Fichier de scène | Concept |
|---|-------|-------|------------------|---------|
| 0 | 0.0 | <total> | `ambient-bg.html` | Fond persistant |
| 1 | 0.0 | 1.5 | `01-opener.html` | Accroche |
| 2 | 1.5 | 1.2 | `02-...` | ... |
| N | ... | 4.5 | `N-cta-outro.html` | Tenue de l'appel à l'action |
```

---

## Format par temps fort (un bloc par temps fort)

```markdown
## Temps fort N — <TITRE> (<début> s–<fin> s, <durée> s) — <concept en une phrase>

**Éléments visuels :**
- <élément 1> — position, taille, animation, timing
- <élément 2> — ...

**Langage de mouvement :** <1 ou 2 phrases : quel type de mouvement porte ce temps fort ?>

**Courbes utilisées :**
- Entrée : `<courbe>` (par ex. `power3.out`)
- Tenue : `<courbe>` (ou `none` pour linéaire)
- Sortie : `<courbe>`

**Transition de sortie :** <comment ce temps fort passe le relais — traînée en fouet · transformation · fondu flou · recoloration · coupe franche alignée sur le pic de la traînée>

**Audio :** <phrase de voix off s'il y en a · bruitage · notes sur la couche musicale>
```

---

## Exemple détaillé — promo produit de 15 secondes

```markdown
# STORYBOARD — acme-promo-15s

**Durée totale :** 15 s · 30 images/s · 1920×1080
**Profil de style :** voir `assets/style-profile.md`

## Structure en actes

- Acte 1 (0–3 s) : accroche — « Pourquoi c'est encore si compliqué ? »
- Acte 2 (3–11 s) : corps — trois bénéfices en typographie cinétique + plan produit
- Acte 3 (11–15 s) : appel à l'action — logo + URL, tenue de 4 s

## Tableau de timing

| # | Début | Durée | Fichier de scène | Concept |
|---|-------|-------|------------------|---------|
| 0 | 0.0 | 15.0 | `ambient-bg.html` | Fond en grille perspective |
| 1 | 0.0 | 1.5 | `01-hook.html` | « Pourquoi c'est encore si compliqué ? » en typographie cinétique |
| 2 | 1.4 | 0.4 | `02-whip.html` | Transition en fouet lumineux |
| 3 | 1.5 | 2.0 | `03-benefit-fast.html` | « Rapide » + traînée de comète |
| 4 | 3.5 | 2.0 | `04-benefit-simple.html` | « Simple » + transformation d'objet |
| 5 | 5.5 | 2.0 | `05-benefit-reliable.html` | « Fiable » + organigramme |
| 6 | 7.5 | 2.5 | `06-product-shot.html` | Bloc vitrine d'application |
| 7 | 10.0 | 1.0 | `07-logo-crystallize.html` | Le logo se cristallise |
| 8 | 11.0 | 4.0 | `08-cta-outro.html` | Tenue du nom de marque + URL |

## Temps fort 1 — Accroche (0,0–1,5 s, 1,5 s) — « Pourquoi c'est encore si compliqué ? »

**Éléments visuels :**
- Sol en grille perspective (ambiance, déjà présent)
- Six mots, dégradé chromé, Inter 96 px, centrés
- Le mot héros « compliqué ? » passe de 1× à 8× en travelling à travers entre 1,0 et 1,5 s

**Langage de mouvement :** typographie cinétique, décalage par mot, travelling à travers le dernier mot

**Courbes utilisées :**
- Entrée de chaque mot : `power3.out`, durée 0,5 s, décalage 0,08 s
- Disparition de chaque mot : `power2.in`, durée 0,4 s, chevauche le suivant de 0,15 s
- Travelling sur « compliqué ? » : `power2.in`, durée 1,0 s, échelle 1 → 8, opacité 1 → 0

**Transition de sortie :** le fouet lumineux (temps fort 2) part à t=1,4 s, traverse la grille, coupe franche au pic de la traînée à t=1,6 s

**Audio :** voix off « Pourquoi c'est encore si compliqué ? » · nappe d'ambiance `data-volume="0.15"`

## Temps fort 2 — Fouet (1,4–1,8 s, 0,4 s) — Transition avec flou de mouvement

**Éléments visuels :**
- Une seule traînée horizontale : `linear-gradient(90deg, transparent, #fff, transparent)`, 40 % de large, 8 px de haut, flou de 6 px
- Cache la coupe entre le temps fort 1 et le temps fort 3

**Langage de mouvement :** ligne de vitesse, sans contenu

**Courbes utilisées :**
- `xPercent: -100` → `xPercent: 250`, durée 0,4 s, `power3.in`

**Transition de sortie :** sans objet (c'est elle-même la transition)

**Audio :** bruitage whoosh à un volume de 0,2

## Temps fort 3 — Rapide (1,5–3,5 s, 2,0 s) — Bénéfice « rapide »

... (et ainsi de suite)
```

---

## Les règles que le storyboard fait respecter

1. **Chaque temps fort ≤ 2 secondes**, sauf le moment héros ou la fin.
2. **Chaque transition a un nom et une durée** — pas de « et ensuite on coupe vers la scène suivante » approximatif.
3. **Chaque temps fort nomme ses courbes** (au moins entrée + sortie). Ne laisse pas tous les temps forts en `power2.out` par défaut.
4. **La fin tient 4 à 6 secondes.** Sans exception.
5. **Au moins un rappel visuel** apparaît dans l'acte 2 ou 3 — un élément qui fait écho à quelque chose de posé plus tôt (MOTION_PHILOSOPHY §0 loi 6).
6. **La règle de trois** quand c'est possible — 3 bénéfices · 3 surfaces produit · 3 icônes. Le spot de référence Infinite l'utilise partout.
7. **La composition de fond d'ambiance** est toujours présente sur `data-track-index="0"` pendant toute la durée.

---

## Après l'écriture

Montre le storyboard + le tableau de timing à l'utilisateur. Souvent, il va :
- Couper un temps fort (« je n'ai pas besoin de "Fiable", fusionne-le avec "Simple" »)
- Déplacer une insistance (« l'accroche devrait être plus longue pour qu'elle porte »)
- Demander une autre sensation de transition (« ça devrait faire plus cinéma, moins énergique »)

Itère. Ne construis pas avant son accord.

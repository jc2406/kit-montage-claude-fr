# Étape 6 : Construire les compositions

**Avant de construire, relis entièrement ces fichiers :**

- **DESIGN.md** — ta palette, tes polices, tes composants et tes à faire / à éviter. Chaque composition doit utiliser les couleurs hex et les familles de polices EXACTES de ce fichier. S'il dit « fonds blancs », utilise du blanc, pas du sombre.
- **STORYBOARD.md** — le plan temps fort par temps fort que tu exécutes. Chaque temps fort précise les médias, les animations, les transitions et les techniques à utiliser.
- **`extracted/asset-descriptions.md`** — quand le storyboard attribue un média à un temps fort, relis sa description pour comprendre ce qu'il montre et comment le placer et le styliser correctement.
- **[techniques.md](techniques.md)** — les motifs de code des 10 techniques visuelles. Quand le storyboard dit « tracé de chemin SVG » ou « typographie cinétique mot à mot », lis le motif de code dans ce fichier et adapte-le.
- **transcript.json** — les horodatages par mot qui dictent les durées des scènes.

**Découpe le travail : lance un sous-agent par temps fort.** À cette étape, ton contexte est rempli
des données capturées, de DESIGN.md, du SCRIPT, du STORYBOARD et de la transcription. Construire les
compositions par-dessus tout ça met les règles détaillées ci-dessous en concurrence avec des milliers
de tokens de travail antérieur. Chaque sous-agent reçoit un contexte neuf, centré sur un temps fort —
le résultat est bien meilleur. (Demande-le à l'utilisateur si sa configuration demande une
autorisation pour les sous-agents.)

**Comment lancer chaque sous-agent :**

Passe des CHEMINS de fichiers, pas leur contenu. L'échec n° 1 est de lire un fichier de média et de
coller ses données SVG/image dans le prompt du sous-agent. Le sous-agent utilise alors ce contenu en
ligne au lieu de référencer le fichier sur le disque. Pareil pour les polices — passe le chemin local
du woff2, ne remplace pas par Google Fonts.

```
Construis la composition du temps fort 1. Enregistre-la dans compositions/beat-1-hook.html.

STORYBOARD de ce temps fort :
[coller la section du temps fort tirée de STORYBOARD.md]

MÉDIAS — à référencer par leur chemin, NE PAS lire ni intégrer le contenu des fichiers :
- Logo : <img src="../assets/favicon.svg"> (en haut à gauche, 40x40px)
- Image d'en-tête : <img src="../assets/hero-bg.png"> (fond plein cadre)
- Texture de bruit : ../assets/noise.png (superposition plein cadre, 3 % d'opacité)

POLICES — utiliser @font-face avec les fichiers de polices capturés, PAS Google Fonts :
@font-face { font-family: 'BrandFont'; src: url('../assets/fonts/BrandFont-Regular.woff2'); }

Lis DESIGN.md pour les couleurs exactes et les à faire / à éviter.
Lis techniques.md pour les motifs de code d'animation.
Lance /hyperframes pour les règles de structure des compositions.
```

Quand chaque sous-agent a fini, vérifie que la composition référence `../assets/` — s'il a utilisé
des SVG en ligne ou Google Fonts au lieu des fichiers capturés, corrige avant de continuer.

Lance d'abord le skill `/hyperframes` — il contient les règles des attributs data, des contrats de
timeline, du rendu déterministe et de la mise en page. Tout ce qui suit complète ces règles, ne les remplace pas.

---

## Processus par composition

Pour chaque temps fort du storyboard :

### 1. Lire la section du storyboard pour ce temps fort

Connais l'ambiance, la description visuelle, les médias, la chorégraphie des animations, la
transition et les bruitages avant d'écrire le moindre HTML.

### 2. Construire d'abord l'état final statique

Place chaque élément là où il doit être à son **moment le plus visible** — l'image où tout est
entré et bien placé. Écris-le en HTML+CSS statique. Pas encore de GSAP.

C'est le principe « la mise en page avant l'animation » du skill de composition. La position CSS
fait foi. Les animations décrivent le chemin pour y arriver et en repartir.

### 3. Vérifier la mise en page statique

Regarde-la. Vérifie :

- Les éléments sont-ils là où le storyboard le dit ?
- Les couches de profondeur sont-elles présentes (premier plan / plan moyen / fond) ?
- Des éléments se chevauchent-ils sans le vouloir ?
- Les médias sont-ils bien dimensionnés ? (une image d'en-tête doit remplir 50 à 70 % du cadre, pas faire 100x100 px)

### 4. Ajouter les animations d'entrée

Utilise `gsap.from()` — anime DEPUIS hors écran/invisible VERS la position CSS. La position CSS est
là où l'élément finit.

### 5. Ajouter de l'activité en cours de scène

Chaque élément visible doit avoir un mouvement continu. Une image fixe sur un fond fixe, c'est un
JPEG avec une barre de progression.

| Type d'élément            | Activité en cours de scène                            |
| ------------------------- | ----------------------------------------------------- |
| Image / capture d'écran   | Zoom lent (scale 1→1.03), panoramique lent ou Ken Burns |
| Chiffre / nombre          | Un compteur défile de 0 à la valeur cible              |
| Grille de logos           | Léger reflet qui balaie, ou légère pulsation d'échelle |
| Tout élément persistant   | Légère flottaison (y ±4-6px, sine.inOut, yoyo)        |

### 6. Ajouter la sortie / la transition

Regarde la spécification de transition du storyboard pour ce temps fort :

- **Transition CSS** : implémente l'animation de sortie (par ex. `y:-150, blur:30px, 0.33s power2.in`). La composition suivante gère sa propre entrée.
- **Transition en shader** : pas besoin d'animation de sortie — le shader gère le mélange. Lis `skills/hyperframes/references/transitions/shader-setup.md` pour le code de base WebGL complet et `skills/hyperframes/references/transitions/shader-transitions.md` pour le fragment shader. Copie le code de base COMPLET — une version simplifiée produit des écrans noirs.
- **Coupe franche** : pas d'animation de sortie. La scène se termine simplement.

Pour tous les types de transitions CSS et leur implémentation GSAP, lis
`skills/hyperframes/references/transitions/catalog.md`.

### 7. Vérification croisée des médias

Avant l'auto-revue, vérifie que tu as bien utilisé les médias prévus :

1. Ouvre STORYBOARD.md et trouve les médias attribués à ce temps fort
2. Liste chaque média attribué à ce temps fort
3. Cherche chaque nom de fichier dans le HTML de la composition (par ex. grep sur « wave-fallback-desktop »)
4. Si un média attribué manque dans le HTML, ajoute-le maintenant
5. Vérifie l'anti-motif « en ligne » : si le HTML contient `<svg xmlns=` ou `data:image/` mais aucune référence à `../assets/`, les médias ont été intégrés au lieu d'être référencés. Remplace le contenu en ligne par `<img src="../assets/fichier.svg">`
6. Vérifie les polices : si le HTML utilise `fonts.googleapis.com` alors qu'il y a des polices capturées dans `assets/fonts/`, remplace par un `@font-face` qui pointe vers les fichiers locaux

Cette étape attrape les deux échecs les plus courants : des compositions qui finissent en texte
seul, et des médias intégrés au lieu d'être référencés.

### 8. Auto-revue

Après avoir construit la composition, vérifie AVEC LE VRAI CODE :

- [ ] La vérification croisée des médias est passée (étape 7 — chaque média attribué est dans le HTML)
- [ ] Les éléments sont là où le storyboard le dit (pas de mauvais placement)
- [ ] Aucun texte qui en chevauche un autre (du texte sur du texte, c'est toujours laid)
- [ ] Couches de profondeur présentes (2 couches minimum)
- [ ] Chaque élément visible a une activité en cours de scène (pas seulement une entrée et une sortie)
- [ ] Tailles de police au-dessus du minimum (20 px pour le texte, 16 px pour les étiquettes — sous 14 px, c'est illisible après encodage)
- [ ] Pas de dégradés linéaires sombres plein écran (le H.264 crée des escaliers visibles — utilise un aplat + des lueurs radiales localisées)
- [ ] Timeline enregistrée : `window.__timelines["comp-id"] = tl`
- [ ] Les couleurs correspondent exactement à DESIGN.md (colle la valeur HEX, n'approxime pas)

**Si `skills/hyperframes-animation-map/` est installé**, lance-le :

```bash
node skills/hyperframes-animation-map/scripts/animation-map.mjs <dossier-composition>
```

Lis les résumés. Corrige chaque alerte : hors écran, collision, invisible, problèmes de rythme.

### 9. Passer à la composition suivante

---

## Présentation des médias

N'intègre jamais une image brute à plat. Chaque image doit avoir un traitement en mouvement :

- **Inclinaison en perspective** : utilise `gsap.set(el, { transformPerspective: 1200, rotationY: -8 })` + `box-shadow` — crée de la profondeur. N'utilise PAS le CSS `transform: perspective(...)`, GSAP l'écraserait.
- **Zoom lent (Ken Burns)** : GSAP `scale: 1` → `1.04` sur la durée du temps fort — rend les photos cinématographiques
- **Cadre d'appareil** : enveloppe dans une forme d'ordinateur portable ou de téléphone avec `border-radius` et `box-shadow`
- **Interface flottante** : extrais un élément clé et anime-le à une autre profondeur pour une parallaxe
- **Révélation au défilement** : découpe l'image dans une fenêtre et anime sa position `y`

---

## Branchement audio

Dans le `index.html` racine :

- **Narration** : `<audio id="narration" src="narration.wav" data-start="0" data-duration="..." data-track-index="0" data-volume="1">`
- **Fond musical** (si le storyboard le prévoit) : `<audio id="underscore" src="underscore.mp3" data-start="0" data-duration="..." data-track-index="3" data-volume="0.15">`
- **Bruitages** (si le storyboard le prévoit) : des éléments `<audio>` individuels à des `data-start` précis
- **Sous-titres** (optionnels — seulement si l'utilisateur le demande) : une sous-composition sur une piste parallèle. À sauter sauf demande explicite.

---

## Règles critiques

Elles existent parce que le moteur de capture est déterministe. Les enfreindre produit une sortie cassée.

- **Pas de `repeat: -1`** — calcule le nombre exact de répétitions à partir de la durée du temps fort
- **Pas de `Math.random()`** — utilise un générateur à graine (mulberry32)
- **Enregistre chaque timeline** : `window.__timelines["comp-id"] = tl`
- **Construction synchrone de la timeline** — pas d'async/await autour du code de timeline
- **N'utilise JAMAIS de `transform` CSS pour centrer** — ni `translate(-50%, -50%)`, ni `translateX(-50%)`, ni `translateY(-50%)`. GSAP anime la propriété `transform`, ce qui écrase TOUTES les transformations CSS, y compris le centrage. L'élément s'envole hors écran. Centre plutôt avec flexbox : `display:flex; align-items:center; justify-content:center` sur une div conteneur. Le linter le repère (`gsap_css_transform_conflict`), mais seulement si tu le lances.
- **Tailles de police minimales** : 20 px pour le texte, 16 px pour les étiquettes
- **Pas de dégradés linéaires sombres plein écran** — escaliers en H.264

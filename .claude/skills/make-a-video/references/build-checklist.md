# Liste de construction — contrôles préalables + avant livraison

Utilisée par les étapes 7 et 8 de `/make-a-video`. À passer avant tout rendu et avant de dire à
l'utilisateur « c'est terminé ».

---

## Contrôles préalables — structure (avant le CONTRÔLE D'APERÇU 1)

- [ ] La `<div>` racine de `index.html` a `id`, `data-composition-id`, `data-start="0"`, `data-width`, `data-height`
- [ ] Chaque `.html` de sous-composition a une `<div>` racine avec `data-composition-id`, `data-start`, `data-duration`
- [ ] Chaque élément temporisé visible a `class="clip"`, `data-start`, `data-duration`, `data-track-index`
- [ ] AUCUN `class="clip"` sur les balises `<video>`
- [ ] Les éléments `<video>` sont `muted` ; l'audio vit dans des éléments `<audio>` voisins
- [ ] Les clips d'une même piste ne se chevauchent jamais (`data-track-index` différent pour les éléments qui se chevauchent)
- [ ] Chaque timeline GSAP se termine par `tl.to({}, { duration: SLOT_DURATION }, 0)`
- [ ] Chaque timeline est enregistrée dans `window.__timelines['<id>']` avec une clé identique à `data-composition-id`
- [ ] Les sous-titres sont des éléments voisins au niveau du body dans `index.html` (pas dans les sous-compositions), chacun avec `data-track-index ≥ 20`
- [ ] Pas de `Math.random()`, pas de `Date.now()`, pas de `fetch()` au moment du rendu
- [ ] Le CSS des blocs du catalogue est limité sous `[data-composition-id="..."]` (pas de règle `html, body { ... }` qui déborde)
- [ ] `npx hyperframes lint` — toutes les erreurs corrigées, avertissements triés

---

## Contrôles préalables — esthétique

- [ ] Palette conforme au brief — pas de couleur intruse, ≤ 5 teintes symboliques
- [ ] Typographie conforme au brief — seulement les polices déclarées dans `assets/style-profile.md`
- [ ] Texture grille / vignettage / grain présente sur chaque scène (ou sur le fond de toute la composition)
- [ ] Composition de fond d'ambiance sur `data-track-index="0"` pendant toute la durée
- [ ] Chaque transition de scène est une transition *en mouvement* (fouet · transformation · flou · recoloration), pas un fondu sec
- [ ] La fin tient 4 à 6 secondes
- [ ] Au moins un rappel visuel (un élément qui revient plus tard)
- [ ] Les durées de scène suivent le niveau de rythme du brief (cinétique 1-2 s · équilibré 2-3 s · posé 3-5 s)

---

## CONTRÔLE D'APERÇU 1 — Studio

- [ ] `npx hyperframes preview` lancé (en arrière-plan)
- [ ] `http://localhost:3002` donné à l'utilisateur
- [ ] Si le projet a des blocs avec shaders, l'utilisateur a aussi reçu les URL de chaque composition (`http://localhost:3002/?comp=<id>`)
- [ ] Les modifications en rechargement à chaud s'affichent correctement
- [ ] **« C'est bon, fais un brouillon » explicite obtenu** — le silence n'est pas un accord

---

## Rendu brouillon

- [ ] `npx hyperframes render --quality draft --output renders/<slug>-draft.mp4` terminé
- [ ] Aucune erreur ni avertissement de rendu
- [ ] Le fichier de sortie existe et se lit dans un lecteur vidéo standard

---

## Vérification visuelle (NON NÉGOCIABLE)

- [ ] `mkdir -p renders/frames`
- [ ] Image extraite à chaque moment héros d'un temps fort :
      ```bash
      ffmpeg -y -ss <t> -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 renders/frames/t<t>.png
      ```
- [ ] Image extraite à chaque moment de transition (milieu de la traînée / de la transformation)
- [ ] **Chaque PNG ouvert avec l'outil `Read`** — pas seulement listé par nom
- [ ] Pour chaque image, confirmé :
  - [ ] Pas de visage coupé
  - [ ] Mode visage correct pour chaque scène (plein écran ou coin, comme dans le storyboard)
  - [ ] Texte lisible, dans la palette, sans débordement
  - [ ] La transition tombe sur le mot / temps fort voulu
  - [ ] Pas d'image vide, pas de flash noir
- [ ] Toute régression → corrigée → rendu refait → revérifiée

---

## CONTRÔLE D'APERÇU 2 — MP4 rendu

- [ ] `npx serve renders -p 8080 -n` lancé (PAS `http.server` de Python — sans support Range, la navigation casse)
- [ ] `http://localhost:8080/<slug>-draft.mp4` donné à l'utilisateur
- [ ] La lecture se parcourt proprement du début à la fin
- [ ] L'audio est synchronisé avec l'image (voix off · bruitages · fond musical)
- [ ] **Validation explicite obtenue**

---

## Rendu final

- [ ] `npx hyperframes render --quality standard --output renders/<slug>-final.mp4`
- [ ] Le fichier existe, taille raisonnable pour la durée (environ 3 à 10 Mo par tranche de 10 secondes en 1080p)
- [ ] Le fichier final se lit proprement dans un lecteur standard
- [ ] Chemin de sortie indiqué à l'utilisateur

---

## Après la livraison

- [ ] Mettre à jour `BRIEF.md` avec une section `## Livraison` : chemin du rendu final, commande de rendu utilisée, notes éventuelles
- [ ] Proposer une passe de révisions — l'utilisateur en a presque toujours une
- [ ] Si l'utilisateur veut un autre format (par ex. un recadrage 1:1 d'un 16:9), le prévoir comme un nouveau passage par les étapes 1 à 8 en partant du `BRIEF.md` d'origine

---

## Échecs courants et leur apparence

| Symptôme dans le rendu | Cause probable | Correction |
|---|---|---|
| Flash noir à la fin d'une scène | Timeline plus courte que `data-duration` | Ajouter / allonger l'animation d'ancrage dans cette sous-composition |
| `<video>` figée sur une image | Animation de `width`/`height` directement sur l'élément vidéo | L'envelopper dans une `<div>` et animer le conteneur |
| Texte coupé / rogné | `overflow: visible` manquant sur le conteneur dans le style limité | L'ajouter |
| Le fond d'un bloc du catalogue couvre toute la scène | La règle `html, body { ... }` du bloc a débordé | La limiter sous `[data-composition-id="..."]` |
| La transition tombe au milieu d'un mot | Le `data-start` de la scène entrante est décalé | L'aligner sur l'image de pic de la transition (en général au milieu de sa durée) |
| Le grain scintille / paraît aléatoire | `Math.random()` dans le script du grain | Le remplacer par un hachage à graine |

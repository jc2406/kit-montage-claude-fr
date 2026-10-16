---
name: make-a-video
description: Créateur de vidéo de bout en bout, accessible aux débutants, pour HyperFrames. À utiliser quand l'utilisateur dit « fais une vidéo », « crée une vidéo », « nouvelle vidéo », « construis une vidéo », « vidéo de zéro », « je veux faire une vidéo », « aide-moi à créer une vidéo » (ou « make a video », « create a video »), ou quand quelqu'un qui n'a jamais utilisé HyperFrames arrive avec un concept, un script ou une idée et veut un MP4 fini. Interroge l'utilisateur en une seule passe, puis construit toute la vidéo avec des étapes obligatoires d'aperçu et de vérification visuelle.
---

# Faire une vidéo — du débutant au MP4 fini

Deux phases, huit étapes successives. Chaque étape produit un fichier concret que l'étape suivante
utilise. Ne saute aucune étape.

## Quand utiliser ce skill — et quand passer la main

**Utilise ce skill quand :**
- L'utilisateur découvre HyperFrames et part d'un concept, d'un script ou d'un plan
- Il veut un accompagnement de bout en bout, pas une référence technique du framework
- Il n'a pas encore choisi de format

**Passe la main quand :**
- L'utilisateur colle une URL et veut une vidéo à partir de ce site → lance `/website-to-hyperframes`
- L'utilisateur veut explicitement un face caméra vertical 9:16 avec incrustations de scènes → fais les étapes 1 à 4 ici, puis lance `/short-form-edit` à partir de l'étape 5
- L'utilisateur demande les règles du framework, pas une vidéo → lance `/hyperframes`

## Les deux phases

- **Phase 1 — ENTRETIEN (étapes 1 à 4) :** une seule passe de conversation pour tout recueillir *avant* de toucher au code. Intention, format, script, voix, style, médias, rythme. Synthétise dans un `BRIEF.md` et attends un accord explicite.
- **Phase 2 — CONSTRUCTION (étapes 5 à 8) :** échafaudage → storyboard → compositions → lint → aperçu Studio → rendu brouillon → vérification visuelle → aperçu du MP4 → rendu final.

---

## Étape 1 · Intention et format

Pose une question à la fois avec `AskUserQuestion`, à choix multiples quand c'est possible.

1. À quoi sert cette vidéo ? (promo · pub réseaux sociaux · teaser de lancement · démo produit · tutoriel · vidéo explicative · carte d'intro/outro · autre)
2. Quel est le public ? (question ouverte)
3. Durée visée ? (10-20 s court · 20-45 s promo · 45-90 s explicatif · 1,5-3 min leçon · sur mesure)
4. Format ? (16:9 1920×1080 · 9:16 1080×1920 · 1:1 1080×1080)
5. Cadence d'images ? (30 par défaut · 60 pour une interface nette · 24 cinéma)
6. Contraintes de plateforme / de livraison ? (taille de fichier · échéance · où elle sera diffusée)

**Validation :** les six réponses recueillies. Si c'est du 9:16 avec face caméra, prévois de passer
la main à `/short-form-edit` à l'étape 5.

Banque de questions complète : `Read: references/interview-questions.md`

---

## Étape 2 · Script et voix

1. Source du script ? (collé · plan → je rédige · je vais enregistrer · synthèse vocale à partir du texte · sans narration)
2. Si synthèse vocale : préférence de voix. Propose les choix de `npx hyperframes tts --help`. Note aussi le débit.
3. Si face caméra : chemin de l'enregistrement · plein écran ou dans un coin · besoin d'une transcription ? (`npx hyperframes transcribe <fichier> --model small --json` pour le français ; `small.en` ne gère que l'anglais)
4. Sous-titres ? (aucun · énergiques · corporate · karaoké mot à mot · minimal)

**Validation :** script recueilli (ou rédigé), plan audio et plan de sous-titres recueillis.

---

## Étape 3 · Recueil du style

**Avant de demander quoi que ce soit, fais l'inventaire des médias existants.** Regarde
`<racine-espace-de-travail>/assets/` et tout dossier `assets/` de projet. Ne demande pas ce qui est déjà là.

Puis pose les questions progressivement — l'utilisateur n'a pas besoin de répondre à toutes :

1. Charte graphique ou document de marque ? (coller/chemin · non)
2. Palette de couleurs ? (codes hex · aucune — utiliser les valeurs par défaut de MOTION_PHILOSOPHY)
3. Polices ? (nom(s) Google Fonts · chemins de fichiers · aucune — Inter + JetBrains Mono par défaut)
4. Fichier de logo ? (chemin · aucun — utiliser un nom en texte)
5. Vidéos de référence pour l'ambiance ? (URL/chemins · aucune)
6. Autres médias ? (captures d'écran · photos produit · B-roll · musique — lister les chemins)
7. Esthétique MOTION_PHILOSOPHY (toile noire · texte chromé · grille en perspective · transitions en fouet) ou une autre sensation ?
8. Rythme ? (cinétique 1-2 s · équilibré 2-3 s · posé 3-5 s)
9. Musique ? (aucune · nappe d'ambiance 0,15 · fond musical 0,4 · pleine 0,8 — chemin du fichier s'il en a un)
10. Texte de fin / d'appel à l'action ?

**N'impose jamais une marque à l'utilisateur.** Ne te rabats sur les valeurs par défaut de
MOTION_PHILOSOPHY *que* s'il refuse explicitement de fournir un style.

Déroulé complet du style + valeurs par défaut MOTION_PHILOSOPHY : `Read: references/style-intake.md`

---

## Étape 4 · Synthèse du brief (VALIDATION OBLIGATOIRE avant de construire)

1. **Lis `MOTION_PHILOSOPHY.md`** s'il existe à la racine de l'espace de travail — obligatoire s'il est présent. S'il manque, continue avec les valeurs par défaut de `references/style-intake.md` et note son absence dans le brief.
2. **Demande où vivent les projets** si ce n'est pas évident :
   - Si `video-projects/` existe → utilise `video-projects/<slug>/`
   - Sinon → demande à l'utilisateur
3. **Écris `<dossier-projet>/BRIEF.md`** :
   - slug · intention · public · dimensions · fps · durée
   - script (complet ou plan)
   - choix de voix · plan de sous-titres · plan face caméra
   - profil de style : palette (hex), polices, chemin du logo, vidéos de référence
   - rythme
   - inventaire des médias avec leurs chemins
   - texte de fin / appel à l'action
4. **Montre le brief. ATTENDS un accord explicite.** Ne passe pas à l'étape 5 sans un « oui, construis-la » clair.

---

## Étape 5 · Échafaudage et storyboard

### Vérifier d'abord le passage de main

Si le brief décrit un face caméra vertical 9:16 avec incrustations de scènes, lance `/short-form-edit`
MAINTENANT et transmets-lui le brief. Son déroulé piloté par la transcription couvre les accroches,
les coupes, les sous-titres, les images et le son.

Sinon, continue :

### Échafaudage

1. `mkdir <dossier-projet>`
2. Si un projet voisin au format similaire existe, propose de copier son `hyperframes.json` + `meta.json` comme modèle. Sinon, depuis le dossier : `npx hyperframes init`
3. Modifie `meta.json` avec le slug, les dimensions et le fps de l'utilisateur.
4. Copie les médias fournis dans `<dossier-projet>/assets/`.
5. Crée `<dossier-projet>/assets/style-profile.md` à partir de l'étape 3 — la référence unique pour la palette, les polices et le logo.

### Storyboard

Génère `<dossier-projet>/STORYBOARD.md` avec le modèle de `references/storyboard-template.md`. Chaque temps fort reçoit :

```
Temps fort N — TITRE (début–fin, durée) — Concept en une phrase
Éléments visuels : [chaque élément, taille, animation, timing]
Langage de mouvement : [type de mouvement]
Courbes utilisées : [3 à 4 courbes GSAP distinctes]
Sortie : [transition vers le temps fort suivant]
Audio : [phrase de voix off / bruitage / couche musicale]
```

En haut du fichier : un tableau de timing avec scène · début · durée · fichier de composition.

**Propose une structure en trois actes :**
- Acte 1 (accroche) ≈ 20 % de la durée
- Acte 2 (corps) ≈ 55 %
- Acte 3 (résolution + fin tenue 4 à 6 secondes) ≈ 25 %

(MOTION_PHILOSOPHY §0 loi 9.)

**Associer les intentions de l'utilisateur aux blocs du catalogue :** `Read: references/catalog-intent-map.md`

**Validation :** montre le storyboard + le tableau de timing. Itère jusqu'à l'accord de l'utilisateur.

---

## Étape 6 · Construire les compositions

Lance `/hyperframes` pour les règles du framework. Ce skill gère l'échafaudage et la discipline ;
`/hyperframes` fait respecter les règles.

### Échafauder chaque sous-composition

```html
<div data-composition-id="nom-scene" data-start="..." data-duration="...">
  <style>[data-composition-id="nom-scene"] { /* limité à la scène */ }</style>
  <!-- DOM -->
  <script>
    (function(){
      const SLOT_DURATION = ...;
      const tl = gsap.timeline({ paused: true });
      // ... animations ...
      tl.to({}, { duration: SLOT_DURATION }, 0);   // ancre — MOTION_PHILOSOPHY loi 11
      window.__timelines["nom-scene"] = tl;
    })();
  </script>
</div>
```

Code de base complet + modèle de sous-titres + modèle de fond d'ambiance : `Read: references/composition-scaffold.md`

### Règles de construction

- **Fond d'ambiance** sur `data-track-index="0"` pendant toute la durée de la composition.
- **Ouvertures en typographie cinétique :** décalage par mot de 0,06 à 0,10 s.
- **Sous-titres** comme éléments voisins de la composition racine au niveau du body dans `index.html`, chacun avec `data-track-index ≥ 20`. Jamais dans les timelines de scène (MOTION_PHILOSOPHY §3.8).
- **Blocs du catalogue** installés avec `npx hyperframes add <nom>`. **Limite tout de suite le CSS du bloc** à `[data-composition-id="..."]` — les blocs du catalogue arrivent avec des règles `html, body { ... }` qui débordent sur le document parent quand ils sont chargés comme sous-compositions.
- **Vertical + face caméra :** enveloppe le visage natif 1920×1080 dans une transformation (`translate` + `scale`) pour le mode moitié basse ou plein écran. (Si tu arrives ici au lieu de `/short-form-edit`, envisage sérieusement le passage de main.)
- **Applique SEULEMENT ce que l'utilisateur a fourni.** Sa palette, ses polices, son logo. N'injecte rien d'autre. S'il a choisi les valeurs par défaut de MOTION_PHILOSOPHY, prends la palette et la paire de polices dans `references/style-intake.md`.

### Déterminisme

Pas de `Math.random()`, pas de `Date.now()`, pas de `fetch()` au moment du rendu. Utilise des
générateurs à graine ou des hachages en sinus harmoniques (MOTION_PHILOSOPHY §3.6).

---

## Étape 7 · Lint → aperçu Studio (CONTRÔLE D'APERÇU 1 — OBLIGATOIRE)

1. `npx hyperframes lint` — corrige toutes les erreurs, trie les avertissements.
2. `npx hyperframes preview` en arrière-plan.
3. Attends « Studio running » sur `http://localhost:3002`.
4. Donne l'URL à l'utilisateur **plus** les URL de chaque composition (`http://localhost:3002/?comp=<id>`). Si le projet a des blocs avec shaders WebGL, commence par les URL individuelles — le WebGL logiciel de secours peut bloquer la composition principale.
5. **ATTENDS un « c'est bon, fais un brouillon » explicite** avant de continuer. Le silence n'est pas un accord.

Le rechargement à chaud est activé — les modifications apparaissent en direct.

---

## Étape 8 · Rendu brouillon → vérification visuelle → aperçu du MP4 → final

### Rendu brouillon

```bash
npx hyperframes render --quality draft --output renders/<slug>-draft.mp4
```

### Vérification visuelle (OBLIGATOIRE avant livraison)

Un lint réussi ≠ un design qui marche. Extrais des images et **regarde-les**.

1. `mkdir -p renders/frames`
2. Pour chaque moment héros d'un temps fort ET chaque transition :
   ```bash
   ffmpeg -y -ss <t> -i renders/<slug>-draft.mp4 -frames:v 1 -q:v 2 renders/frames/t<t>.png
   ```
3. **Appelle l'outil `Read` sur chaque PNG.** L'outil Read charge l'image dans le contexte — ne te contente pas de lister les noms de fichiers.
4. Confirme pour chaque image : pas de visage coupé, bon mode visage pour chaque scène, texte lisible et dans la palette, pas de débordement, transitions qui tombent sur les mots voulus, pas d'image vide.
5. Si quelque chose ne va pas : corrige → refais le rendu → revérifie. Ne livre jamais un brouillon cassé.

### Aperçu du MP4 (CONTRÔLE D'APERÇU 2 — OBLIGATOIRE)

```bash
npx serve renders -p 8080 -n
```

N'utilise PAS `http.server` de Python — il ne gère pas les requêtes HTTP Range, donc la navigation dans la vidéo ne marche pas.

Donne à l'utilisateur `http://localhost:8080/<slug>-draft.mp4`. **ATTENDS une validation explicite**
de la lecture et de la synchro audio.

### Rendu final

```bash
npx hyperframes render --quality standard --output renders/<slug>-final.mp4
```

Indique le chemin de sortie. Terminé.

Vérifications préalables complètes + contrôles avant livraison : `Read: references/build-checklist.md`

---

## Non négociable (porte tout — ne pas assouplir)

- **NE saute PAS le CONTRÔLE D'APERÇU 1 (Studio) ni le CONTRÔLE D'APERÇU 2 (MP4 rendu).** Deux contrôles par construction, toujours.
- **N'affirme PAS qu'un rendu est terminé** avant d'avoir extrait des images ET de les avoir lues avec l'outil Read.
- **NE construis nulle part ailleurs que dans un dossier de projet dédié.** Ne mets jamais `index.html` à la racine de l'espace de travail.
- **NE demande PAS de médias** à l'utilisateur avant d'avoir fait l'inventaire de son espace de travail.
- **NE saute PAS l'animation d'ancrage `tl.to({}, { duration: SLOT_DURATION }, 0)`** à la fin de chaque timeline de sous-composition. MOTION_PHILOSOPHY loi 11.
- **N'utilise PAS `Math.random()` / `Date.now()`** dans la logique de rendu. Hachages à graine seulement.
- **N'ajoute PAS `class="clip"` aux balises `<video>`.** Ça les casse.
- **N'impose PAS une marque à l'utilisateur.** Demande d'abord ; ne te rabats sur les valeurs par défaut de MOTION_PHILOSOPHY que s'il refuse explicitement.

---

## Références

- `references/interview-questions.md` — banque de questions complète par étape
- `references/style-intake.md` — entretien sur le style + valeurs par défaut MOTION_PHILOSOPHY
- `references/catalog-intent-map.md` — « l'utilisateur dit X → installer Y »
- `references/storyboard-template.md` — modèle temps fort par temps fort + exemple détaillé
- `references/composition-scaffold.md` — styles limités + code de base GSAP en IIFE
- `references/build-checklist.md` — contrôles préalables + contrôles avant livraison

Externe (au niveau de l'espace de travail) :
- `MOTION_PHILOSOPHY.md` — la seule référence externe que ce skill suppose. Base esthétique. Une solution de repli se trouve dans `references/style-intake.md` si le fichier manque.

## Skills associés

- `/hyperframes` — règles du framework, à lancer à l'étape 6
- `/hyperframes-cli` — init · lint · preview · render · transcribe · tts
- `/hyperframes-registry` — installer des blocs du catalogue
- `/gsap` — référence d'animation GSAP
- `/short-form-edit` — passer la main à l'étape 5 pour le format face caméra 9:16
- `/website-to-hyperframes` — passer la main à l'étape 1 si le point de départ est une URL

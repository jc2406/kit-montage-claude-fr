---
name: website-to-hyperframes
description: |
  Capturer un site web et en faire une vidéo HyperFrames. À utiliser quand : (1) un utilisateur donne une URL et veut une vidéo, (2) quelqu'un dit « capture ce site », « transforme ça en vidéo », « fais une promo à partir de mon site », (3) l'utilisateur veut une pub réseaux sociaux, une visite produit ou toute vidéo basée sur un site existant, (4) l'utilisateur partage un lien et demande n'importe quel contenu vidéo. Même si l'utilisateur colle seulement une URL — c'est ce skill qu'il faut utiliser.
---

# Du site web à HyperFrames

Capturer un site web, puis en produire une vidéo professionnelle.

Les utilisateurs disent par exemple :

- « Capture https://... et fais-moi une vidéo de lancement produit de 25 secondes »
- « Transforme ce site en pub Instagram de 15 secondes »
- « Crée une visite produit de 30 secondes à partir de https://... »

Le déroulé a 7 étapes. Chacune produit un fichier qui conditionne la suivante.

---

## Étape 1 : Capturer et comprendre

**Lire :** [references/step-1-capture.md](references/step-1-capture.md)

Lance la capture, lis les données extraites et construis un résumé de travail avec la méthode
« écrire puis oublier ».

**Validation :** affiche ton résumé du site (nom, couleurs principales, polices, médias clés, ambiance en une phrase).

---

## Étape 2 : Écrire DESIGN.md

**Lire :** [references/step-2-design.md](references/step-2-design.md)

Écris une référence de marque simple pour le site capturé. 6 sections, environ 90 lignes. C'est un
aide-mémoire, pas le plan créatif — celui-ci vient à l'étape 4.

**Validation :** `DESIGN.md` existe dans le dossier du projet.

---

## Étape 3 : Écrire le SCRIPT

**Lire :** [references/step-3-script.md](references/step-3-script.md)

Écris le script de narration. C'est la colonne vertébrale de l'histoire. Les durées des scènes
viennent de la narration, pas de suppositions.

**Validation :** `SCRIPT.md` existe dans le dossier du projet.

---

## Étape 4 : Écrire le STORYBOARD

**Lire :** [references/step-4-storyboard.md](references/step-4-storyboard.md)

Écris la direction créative temps fort par temps fort : ambiance, caméra, animations, transitions,
médias, couches de profondeur, bruitages. C'est le cap créatif — le document que l'ingénieur suit
pour construire chaque composition.

**Validation :** `STORYBOARD.md` existe avec une direction temps fort par temps fort et un tableau d'audit des médias.

---

## Étape 5 : Générer la voix off + caler le timing

**Lire :** [references/step-5-vo.md](references/step-5-vo.md)

Génère l'audio de synthèse vocale, transcris-le pour obtenir les horodatages par mot et associe-les
aux temps forts. Mets à jour STORYBOARD.md avec les vraies durées.

**Validation :** `narration.wav` (ou .mp3) + `transcript.json` existent. Les timings des temps forts de STORYBOARD.md sont mis à jour.

---

## Étape 6 : Construire les compositions

**Lire :** le skill `/hyperframes` (lance-le — chaque règle compte)
**Lire :** [references/step-6-build.md](references/step-6-build.md)

Construis chaque composition en suivant le storyboard. Après chacune : auto-revue de la mise en
page, du placement des médias et de la qualité des animations.

**Validation :** chaque composition a été auto-revue. Aucun élément qui se chevauche, aucun média mal placé, aucune image statique sans mouvement.

---

## Étape 7 : Valider et livrer

**Lire :** [references/step-7-validate.md](references/step-7-validate.md)

Lint, validation, aperçu. Crée un HANDOFF.md pour la continuité entre sessions.

**Validation :** `npx hyperframes lint` et `npx hyperframes validate` passent sans erreur.

---

## Référence rapide

### Types de vidéo

| Type                        | Durée    | Temps forts | Narration                       |
| --------------------------- | -------- | ----------- | ------------------------------- |
| Pub réseaux (IG/TikTok)     | 10-15 s  | 3-4         | Phrase d'accroche optionnelle   |
| Démo produit                | 30-60 s  | 5-8         | Narration complète              |
| Annonce de fonctionnalité   | 15-30 s  | 3-5         | Narration complète              |
| Reel de marque              | 20-45 s  | 4-6         | Optionnelle, priorité musique   |
| Teaser de lancement         | 10-20 s  | 2-4         | Minimale, très énergique        |

### Format

- **Paysage** : 1920x1080 (par défaut)
- **Portrait** : 1080x1920 (Stories Instagram, TikTok)
- **Carré** : 1080x1080 (fil Instagram)

### Fichiers de référence

| Fichier                                                 | Quand le lire                                                                                                                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [step-1-capture.md](references/step-1-capture.md)       | Étape 1 — lire les données capturées                                                                                                                             |
| [step-2-design.md](references/step-2-design.md)         | Étape 2 — écrire DESIGN.md                                                                                                                                       |
| [step-3-script.md](references/step-3-script.md)         | Étape 3 — écrire le script de narration                                                                                                                          |
| [step-4-storyboard.md](references/step-4-storyboard.md) | Étape 4 — direction créative par temps fort                                                                                                                      |
| [step-5-vo.md](references/step-5-vo.md)                 | Étape 5 — synthèse vocale, transcription, timing                                                                                                                 |
| [step-6-build.md](references/step-6-build.md)           | Étape 6 — construire les compositions avec auto-revue                                                                                                            |
| [step-7-validate.md](references/step-7-validate.md)     | Étape 7 — lint, validation, aperçu, passation                                                                                                                    |
| [techniques.md](references/techniques.md)               | Étapes 4 et 6 — 10 techniques visuelles avec motifs de code (tracé SVG, Canvas 2D, 3D, typographie, Lottie, vidéo, frappe, polices variables, MotionPath, transitions) |

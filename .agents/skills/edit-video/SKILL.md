---
name: edit-video
description: Monter une vidéo brute face caméra de bout en bout — transcription, suppression des silences, revue des erreurs, storytelling visuel, motion graphics et rendu HyperFrames vérifié. À utiliser pour un montage complet (« monte ma vidéo », « fais le montage de cet enregistrement ») ; pour une seule opération demandée, passer directement au skill spécialisé.
---

# Monter une vidéo

Garde chaque projet dans `video-projects/<slug>/`, en préservant l'enregistrement source.
Lis le guide de l'espace de travail et le brief ou le DESIGN.md du projet. Si une direction
manque, propose un style de `style-library/registry.json` en fonction des images.

1. Inspecte la durée, les pistes et la résolution de la source avec ffprobe. Copie la source
   dans les médias du projet ou utilise un chemin local fourni explicitement.
2. Lis `docs/TOOLS-AND-API-KEYS.md` avant de configurer un service. Réutilise une transcription
   mot à mot qui correspond. Sinon, utilise le fournisseur choisi par l'utilisateur ; par défaut
   : `node scripts/transcribe-elevenlabs.mjs <source>`. OpenAI Whisper et Whisper en
   local sont des alternatives prises en charge, après normalisation de la transcription.
   Vérifie les identifiants disponibles ou les dépendances locales. Explique les envois et les
   coûts avant tout appel à un service dont l'autorisation manque encore.
3. Lis `../cut-silences/SKILL.md`. Produis une EDL et une transcription recalée, et rends la
   passe de silences quand le montage est autorisé.
4. Lis `../cut-mistakes/SKILL.md`. Examine les candidats dans leur contexte et garde les
   insistances voulues. Note les coupes validées. S'il n'y a aucune erreur à couper, reprends la
   sortie de la passe de silences. Fais correspondre chaque transcription à sa vraie vidéo.
5. Lis `../video-storytelling/SKILL.md` pour l'arc visuel et
   `../hyperframes-video-beats/SKILL.md` pour les incrustations. Écris une grille des temps forts
   avec des ancres dans la transcription, une idée visuelle par temps fort et des rappels voulus.
6. Lis `MOTION_PHILOSOPHY.md`, `../hyperframes/SKILL.md` et les références GSAP utiles avant de
   construire. Utilise `../style-library/SKILL.md` pour choisir ou adapter une carte. Rapatrie en
   local chaque fichier utilisé par la composition.
7. Lance la vérification préalable et le lint HyperFrames depuis le projet, plus le validateur de
   synchro avec la transcription pour les sous-compositions ancrées. Vérifie dans le Studio avant
   le brouillon.
8. Rends un brouillon, inspecte les images encodées et les transitions, et écoute les raccords de
   coupe. Vérifie le cadrage des visages, la lisibilité des textes, les images noires et la synchro
   image/son. Règle les problèmes avant le rendu final. Respecte les validations déjà données ; ne
   redemande pas l'accord pour une même action déjà autorisée.

Livre le chemin du MP4 final, les décisions de montage, la transcription recalée, la composition
et un `VERIFY.md` qui décrit ce qui a été vérifié et les limites restantes.
Un détecteur automatique propose des coupes ; le jugement éditorial reste nécessaire.

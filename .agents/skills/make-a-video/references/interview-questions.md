# Questions d'entretien — banque complète

Utilisée par les étapes 1 à 3 de `/make-a-video`. Pose une question à la fois avec `AskUserQuestion`,
à choix multiples quand c'est possible.

## Avant de demander quoi que ce soit — faire l'inventaire

Lance ces commandes pour voir ce qui existe déjà et ne pas demander des médias déjà fournis :

```bash
ls "<racine-espace-de-travail>/assets" 2>/dev/null
ls "<dossier-projet>/assets" 2>/dev/null
```

Cite par son chemin tout ce que tu trouves dans le futur `BRIEF.md`.

---

## Étape 1 · Intention et format

**Q1. À quoi sert cette vidéo ?**
- Vidéo promo / marketing
- Pub réseaux sociaux (TikTok · Reels · Shorts · X)
- Teaser de lancement
- Démo produit
- Tutoriel
- Vidéo explicative
- Carte d'intro / d'outro
- Autre (décrire)

**Q2. Quel est le public ?** (question ouverte)
À creuser : secteur · niveau d'expertise · plateforme de visionnage · ce qu'il doit ressentir

**Q3. Durée visée ?**
- Court — 10 à 20 s
- Promo — 20 à 45 s
- Explicatif — 45 à 90 s
- Leçon — 1,5 à 3 min
- Sur mesure — demander un chiffre

**Q4. Format ?**
- 16:9 paysage — 1920×1080
- 9:16 vertical — 1080×1920
- 1:1 carré — 1080×1080

**Q5. Cadence d'images ?**
- 30 images/s (par défaut, convient à tout)
- 60 images/s (interface nette, démos produit, images de jeu)
- 24 images/s (cinéma)

**Q6. Contraintes de plateforme / de livraison ?**
- Où sera-t-elle diffusée ? (en-tête de site · TikTok · LinkedIn · YouTube · présentation interne · autre)
- Taille de fichier maximale ?
- Échéance ?

---

## Étape 2 · Script et voix

**Q7. Source du script ?**
- Coller le script complet maintenant
- J'ai un plan — rédige-moi le script complet
- Je vais l'enregistrer moi-même (il faut le chemin du fichier de voix off ou de face caméra)
- Générer une narration en synthèse vocale à partir du texte
- Sans narration — visuels + musique seulement

**Q8. Si synthèse vocale :**
- Choix de voix (proposer celles de `npx hyperframes tts --help`). Courantes : `am_adam`, `am_michael` (homme, US) · `af_bella`, `bf_emma` (femme, US/UK). Ces voix Kokoro sont anglophones : pour une narration en français, propose plutôt une voix française (ElevenLabs, HeyGen ou autre) si l'utilisateur y a accès.
- Débit (normal · un peu plus rapide · un peu plus lent)

**Q9. Si face caméra ou voix off enregistrée :**
- Chemin du fichier
- Plein écran ou dans un coin ? (bas-droite · bas-gauche · haut-droite · haut-gauche)
- Besoin d'une transcription ? Si oui : `npx hyperframes transcribe <fichier> --model small --json` (le modèle `small.en` ne gère que l'anglais)

**Q10. Sous-titres ?**
- Non
- Oui — énergiques (gras, percutants, mots d'accent en couleur)
- Oui — corporate (propres, une ligne, sans insistance)
- Oui — karaoké (synchro mot à mot, révélés au fil de la parole)
- Oui — minimal (une seule ligne, faible contraste)

---

## Étape 3 · Recueil du style

**Q11. Charte graphique ou document de marque ?**
- Oui — coller ou donner le chemin (chercher codes hex, polices, règles du logo, règles d'espacement)
- Non

**Q12. Palette de couleurs ?**
- Coller des codes hex. Demander au moins : fond · texte/principal · accent (la couleur de l'« émotion »). En option : surface · bordure · alerte.
- Aucune — utiliser les valeurs par défaut de MOTION_PHILOSOPHY (voir `style-intake.md`)

**Q13. Polices ?**
- Noms Google Fonts (par ex. Inter · Montserrat · JetBrains Mono · Bebas Neue · Space Grotesk)
- Chemins de fichiers de polices
- Aucune — Inter + JetBrains Mono par défaut

**Q14. Fichier de logo ?**
- Chemin du fichier
- Aucun — un nom en texte à la place ? Demander le texte, la graisse et le style

**Q15. Vidéos de référence ?**
- URL ou chemins de fichiers — « l'ambiance que je veux »
- Aucune

**Q16. Autres médias ?**
- Captures d'écran (chemins)
- Photos produit (chemins)
- Clips de B-roll (chemins)
- Morceaux de musique (chemins)
- SVG / icônes / illustrations (chemins)

**Q17. Esthétique MOTION_PHILOSOPHY ou autre sensation ?**
- MOTION_PHILOSOPHY : toile noire · texte en dégradé chromé · grille en perspective · transitions en panoramique fouetté · fin tenue 4 à 6 s
- Autre — décrire ou donner des références

**Q18. Rythme ?**
- Cinétique — scènes de 1 à 2 s, énergique (motion graphics de qualité référence)
- Équilibré — scènes de 2 à 3 s (la plupart des promos)
- Posé — scènes de 3 à 5 s (explicatifs · leçons · ambiance luxe)

**Q19. Musique ?**
- Aucune (silence)
- Nappe d'ambiance — `data-volume="0.15"` (premium, à peine présente)
- Fond musical — `data-volume="0.4"` (couche promo standard)
- Musique pleine — `data-volume="0.8"` (montage mené par la musique)
- Chemin du fichier s'il en a un

**Q20. Texte de fin / d'appel à l'action ?**
- Phrase d'appel à l'action (par ex. « Commencez sur example.com »)
- Durée de tenue (4 à 6 s recommandées — le plan le plus long de toute la vidéo)

---

## Règles d'enchaînement

- **Une question par appel à `AskUserQuestion`.** Ne les regroupe pas. L'utilisateur ne peut pas se concentrer sur trois questions à la fois.
- **Choix multiples plutôt que questions ouvertes** quand la réponse a des formes valides distinctes.
- **Les relances se font au fil de l'eau.** Si Q7 = « je l'enregistre moi-même », la question suivante est Q9 (pas Q8).
- **Note chaque réponse pour le brief au fur et à mesure** — de courtes expressions, pas des phrases complètes. Le `BRIEF.md` de l'étape 4 est une synthèse, pas un compte rendu.
- **Si une réponse surprend** (par ex. « je veux une pub TikTok de 4 heures »), confirme avant de continuer. Ne suppose rien.
- **Ne demande jamais ce qui est déjà connu.** Si l'utilisateur a cité un chemin de fichier plus tôt ou s'il est dans `assets/`, saute la question et confirme seulement l'interprétation.

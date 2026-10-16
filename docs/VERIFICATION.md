# Vérification de publication

## Traduction française

Cette version traduit les textes, retire les médias exclus (voir [le périmètre](EXPORT-SCOPE.md))
et garde le code à l'identique, à l'exception des commentaires, des messages affichés et des
chemins vers les fichiers retirés. Les résultats ci-dessous sont ceux du dépôt d'origine ; les
vérifications de la traduction sont listées dans le message du commit et peuvent être relancées
avec les commandes en bas de page.

## Herk Edit Kit consolidé, version 2

- Les 14 skills de référence ont passé la validation de leur en-tête, et les 94 ressources des
  skills correspondent aux copies pour Codex. La vérification de la distribution ne signale aucune
  erreur sur les 406 cartes et les deux arborescences de skills.
- Un `npm ci` propre a réussi. Les 11 tests de comportement ont réussi, dont les nouvelles
  vérifications de dérive des sous-titres, de mauvaise correspondance avec la source, de couverture
  des scènes, de réutilisation des plans, de lignes manquantes dans le registre et d'empreintes de
  plans modifiées.
- Le projet de départ a passé la vérification préalable et le lint HyperFrames sans erreur ni avertissement.
- Le test média synthétique a de nouveau réussi : sortie après silences 3,960 secondes,
  sortie nettoyée 3,673 secondes pour une transcription de 3,660 secondes.
- Tous les fichiers d'origine de `video-projects/` et d'`assets/` ont été conservés sans modification.
  Ils n'ont pas tous été rendus de nouveau. Aucun vrai reel ni aucune génération payante n'a été
  lancé pour cette migration ; la vérification du format court couvre ses validateurs et ses ressources.

## Preuves de la publication d'origine du pipeline

Les preuves de rendu suivantes viennent de la publication du pipeline avant la fusion. Son projet
de départ et son implémentation du montage sont conservés.

Vérifié en local sous Windows le 8 septembre 2026, avec Node 24.15.0, FFmpeg 8.1.1 et HyperFrames 0.7.109.

- L'installation propre des dépendances a réussi ; npm n'a signalé aucune vulnérabilité connue.
- AGENTS.md et CLAUDE.md à la racine sont identiques. Dix paquets de skills et toutes leurs
  ressources correspondent à leurs copies générées pour Codex.
- La vérification du kit contrôle la syntaxe JavaScript, l'en-tête et les ressources liées des
  skills, le nombre de cartes du registre, l'unicité des ID, les emplacements déclarés et les
  dépendances locales des cartes. Les 406 fichiers de cartes sont trouvés. Deux cartes créent
  certains emplacements en JavaScript ; leurs déclarations sources sont vérifiées, pas le DOM exécuté.
- Cinq tests de comportement réussissent : recalage après silences, suppression validée d'un
  bégaiement, comportement à l'identique avec une liste de coupes vide, bornes de coupe invalides
  et timing trop tôt ou trop tard d'un temps fort. La CLI accepte des chemins de projet explicites
  et un ordre d'attributs indépendant des anciens exemples.
- `npm run test:media` a généré une mire de huit secondes avec un son sinusoïdal, rendu les deux
  étapes de montage et construit la page HTML de revue de l'EDL. La sortie après silences faisait
  3,960 secondes ; la sortie nettoyée 3,673 secondes pour une transcription de 3,660 secondes.
  Les durées audio et vidéo diffèrent de moins de 0,04 seconde.
- Le projet de départ a passé la vérification préalable et le lint HyperFrames sans erreur ni
  avertissement. Le Studio l'a chargé et lu jusqu'à huit secondes. Le rendu brouillon a produit
  240 images H.264 en 1920x1080 à 30 images/s. Les images extraites ont été inspectées visuellement
  sur toute la séquence de huit secondes. Aucun passage noir de 0,1 seconde ou plus n'a été détecté.

## Périmètre et limites

C'est une boîte à outils fonctionnelle, pas une promesse de jugement éditorial entièrement automatique.
Les 406 cartes de la bibliothèque restent des brouillons ; cette publication ne les a pas toutes
rendues et validées visuellement une par une. Testez chaque carte choisie avec votre texte.
Le projet de départ contient seulement des motion graphics, sans parole. Le test média vérifie le
timing et l'intégrité des pistes avec un son, pas la qualité subjective des coupes dans la parole.
La transcription payante Scribe n'a pas été appelée pendant le contrôle qualité. Les modèles
demandent une adaptation ; l'encart vitré a besoin des rushs de l'utilisateur. HyperFrames peut
télécharger des polices de remplacement au premier rendu. Les vérifications multiplateformes
tournent dans la CI GitHub ; le contrôle des médias et du rendu en local a été fait sous Windows.

Pour refaire ces vérifications : `npm ci`, `npm run check`, `npm test`, `npm run test:media`, puis
créez un nouveau projet de départ, lancez le lint, l'aperçu et le rendu, et inspectez la sortie.

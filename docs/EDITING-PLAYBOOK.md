# Méthode de montage : comment les vidéos de Nate sont montées avec l'IA

Les reels, Shorts et vidéos explicatives de Nate sont désormais montés par un agent IA (Claude Code ou Codex) qui utilise des skills comme ceux de ce kit. Nate se filme en train de parler, transmet le fichier, et l'agent le coupe, le sous-titre, trouve le B-roll, construit les motion graphics, mixe la musique et les bruitages, et vérifie son propre travail.

Cette page explique comment ça marche et ce que nous avons appris en le construisant. Les chiffres viennent de l'étude image par image des meilleurs reels de Nate et de dizaines de passes de montage où il a donné ses remarques.

> Note de traduction : les exemples de phrases citées viennent d'enregistrements en anglais. Ils sont traduits ici ; le principe s'applique de la même façon en français.

- [La boucle qui fait marcher le tout](#la-boucle-qui-fait-marcher-le-tout)
- [Le montage, étape par étape](#le-montage-étape-par-étape)
- [Le style maison des reels (les chiffres)](#le-style-maison-des-reels-les-chiffres)
- [B-roll](#b-roll)
- [Sous-titres](#sous-titres)
- [Musique et bruitages](#musique-et-bruitages)
- [Autres formats](#autres-formats)
- [Vérifier le montage](#vérifier-le-montage)
- [Les leçons qui nous ont coûté du temps](#les-leçons-qui-nous-ont-coûté-du-temps)

## La boucle qui fait marcher le tout

Les montages sont devenus bons parce que chaque remarque de Nate est devenue une règle permanente dans un skill. Il n'a jamais eu à donner deux fois la même remarque.

1. **Enregistrer et transmettre le fichier.** Aucune application de montage.
2. **L'agent monte et rend un brouillon.**
3. **Vous le regardez et dites ce qui ne vous plaît pas, avec des mots simples.** « Je n'arrive pas à lire ce sous-titre. » « Ce plan ne bouge pas. » « Ces bruitages font cheap. »
4. **L'agent corrige le montage ET écrit la correction dans le skill**, sous forme de règle, de vérification ou de modification de script. Demandez-le explicitement : « Corrige, puis ajoute-le au skill pour que ça n'arrive plus jamais. »
5. **Le montage suivant part du skill amélioré.**

Des exemples réels de remarques devenues des règles :

| Remarque de Nate | Ce que fait le skill maintenant |
|---|---|
| « Des sous-titres blancs sur un site clair, c'est illisible. » | Chaque sous-titre est dans la même boîte sombre, et une vérification de contraste mesure les pixels derrière chacun. |
| « Une vidéo générée par IA bat toujours une image générée par IA. » | Une image fixe générée utilisée comme B-roll est une erreur de construction. Les images fixes ne servent que de première image pour une vidéo IA. |
| « Chaque plan doit bouger. » | Chaque plan est une vraie vidéo, un enregistrement d'écran, une interface animée ou une vidéo IA, avec un léger zoom avant. Aucune image figée. |
| « Ces bruitages laser font cheap. » | La palette sonore est passée à des tapotements doux, des clics secs, du papier et de l'air. Plus de « plop » qui descend dans les graves ni de zap. |
| « À la fin, les lèvres sont en retard sur la voix. » | Les coupes sélectionnent les images exactes en une seule passe, et une vérification de synchro compare chaque image coupée au brut. |
| « Les sous-titres ne doivent jamais disparaître. » | Sur les plans pleins de texte à lire, les sous-titres passent dans une zone libre au lieu de disparaître. |
| « Tu as coupé ma pause naturelle après "d'abord", ça va trop vite. » Puis, après une correction qui a ajouté du silence à cet endroit : « Tu as étouffé le mot "d'abord". » | La parole est coupée entre les phrases, dans un vrai silence, jamais au milieu d'une phrase. Un mot de remplissage qui s'enchaîne directement avec le mot suivant reste, car le couper abîme les mots autour. |
| « Le sous-titre me cache la bouche dans la première seconde. » | Un sous-titre qui traverse une coupe se déplace avec elle, et les 2,5 premières secondes sont vérifiées image par image pour que rien ne passe sur la bouche. |

Le savoir-faire du montage vit dans les fichiers des skills : vous pouvez le lire, le modifier et le partager.

## Le montage, étape par étape

C'est l'ordre que suivent les skills `short-form-edit` et `edit-video`.

1. **Transcrire** avec des horodatages par mot (ElevenLabs Scribe est le choix par défaut de Nate ; Whisper fonctionne).
2. **Couper les reprises.** Garder la dernière prise propre de chaque phrase. Joindre deux prises seulement là où les deux côtés sont silencieux ; si les prises s'enchaînent, jouer une prise en entier.
3. **Couper entre les phrases, jamais au milieu.** Une phrase, c'est ce que vous dites d'un seul souffle. Supprimer les blancs entre les phrases et garder vos respirations naturelles (après une virgule, après « D'abord, »). Ne supprimer un mot de remplissage que s'il y a du silence des deux côtés : « D'abord, ce qu'il fait, c'est qu'il transcrit » est une seule phrase, et couper « ce qu'il fait, c'est qu' » abîme le mot « D'abord ». Ne jamais accélérer la voix.
4. **Planifier l'histoire avant tout visuel :** accroche, preuve, les éléments, la chute, l'appel à l'action. L'écrire.
5. **Trouver le B-roll**, un visuel par groupe nominal, dans l'ordre de préférence ci-dessous.
6. **Construire la composition** dans HyperFrames, chaque plan ancré sur le mot prononcé qu'il illustre.
7. **Mixer** la voix, la musique et les bruitages.
8. **Rendre un brouillon, le vérifier** (images, synchro, son, sous-titres), corriger, puis rendre la version finale.

## Le style maison des reels (les chiffres)

Mesuré sur les 27 meilleurs Reels Instagram de Nate (mars à septembre 2026). Servez-vous-en comme point de départ pour votre propre style, pas comme d'une loi.

**Rythme**
- La parole commence dans les 0,1 premières secondes. Le fichier se termine juste après le dernier mot. Pas de carte d'intro ni d'outro.
- Aucun blanc : les pauses entre les phrases restent sous environ 0,2 s. Les respirations naturelles après une virgule ou un marqueur de liste (« D'abord, ») durent de 0,2 à 0,4 s et restent. L'écart typique entre deux mots est de 0,04 s (médiane) et 0,1 s (90e centile), à 4,0 à 4,7 mots par seconde. Le rythme serré vient de la suppression des blancs entre les phrases.
- Les plans durent en moyenne 1,1 à 1,4 s, aucun au-delà d'environ 2,8 s. La première coupe tombe entre 0,6 et 1,0 s, sur le premier mot fort.
- Chaque élément d'une liste énoncée a son propre plan.

**Mises en page** (1080x1920 ; chaque changement est une coupe franche)
- **Split :** B-roll en haut (y de 0 à 880), orateur en dessous. 30 à 42 % du reel.
- **B-roll plein cadre :** les images remplissent le cadre. 50 à 55 %.
- **Plan serré :** un plan rapproché de l'orateur pour les virages, l'insistance et l'appel à l'action. 5 à 15 %.
- L'orateur est à l'écran environ 45 % du temps et ne disparaît jamais plus d'environ 3,5 s.
- La première image est un split avec l'outil ou la marque du sujet en haut.

**Histoire**
1. Accroche dans les 3 premières secondes : une affirmation ou un ordre qui nomme l'outil ou la personne.
2. Une ligne de crédibilité ou de contexte.
3. S'il y a une liste, montrer tous les éléments tôt, floutés, comme une boucle ouverte.
4. Chaque élément : une carte de section, une définition en une ligne, deux ou trois visuels littéraux, un plan serré sur la phrase clé.
5. Une résolution qui rappelle le visuel de l'accroche.
6. Appel à l'action : montrer d'abord la ressource, puis un plan serré avec le mot-clé à commenter.

## B-roll

**La vidéo bat l'image, à chaque fois.** Le reel doit tenir l'attention de la première à la dernière image, donc chaque plan bouge. Ordre de préférence :

1. De vraies images de ce qui est nommé : la conférence de la personne, la démo du produit, votre propre vidéo longue.
2. Un vrai enregistrement d'écran du site ou de l'application, zoomé sur la partie dont on parle, avec un curseur visible.
3. Une maquette d'interface animée : saisie de texte, lignes qui défilent, compteur qui monte. Signalez les maquettes comme des exemples.
4. Une vidéo IA. Les métaphores concrètes marchent (« brûler son argent » = un billet qui brûle, « espérer que ça marche » = une machine à sous). Les plans génériques « personne devant un ordinateur » font banque d'images.
5. De courts recadrages en surbrillance d'une vraie page (moins d'1 s) sur des noms d'outils, des prix, des badges.

Les règles nées des erreurs :
- Ne jamais inventer de chiffres, de résultats ou de test réussi pour illustrer une affirmation.
- Une page web entière réduite à la taille d'un téléphone est illisible. Recadrer sur la phrase et la surligner sur le mot prononcé.
- Une petite interface qui flotte dans le vide est le signe le plus rapide d'un « montage IA ». Zoomer l'interface pour qu'elle remplisse le panneau.
- Ne jamais cliquer sur « Accepter » dans les fenêtres de cookies ou de conditions pendant un enregistrement. Les fermer ou utiliser une autre page.
- Les modèles de vidéo IA passent souvent à un deuxième angle de caméra vers 2,5 à 3 s, et le texte sur les écrans générés devient du charabia. Utiliser les premières secondes continues et garder les écrans petits dans le cadre.
- Des plans IA consécutifs de la même personne doivent concorder (même tenue, même pièce). Passer l'image précédente en référence.
- Utiliser chaque scène de B-roll une seule fois par reel.

## Sous-titres

- 1 à 3 mots par bloc, découpés aux limites de groupes de mots. Ils changent d'un coup, sans animation de « pop », et apparaissent 2 images avant le premier mot.
- Montserrat ExtraBold, tout en majuscules, environ 62 à 64 px, avec un accent à empattements très gras (Abril Fatface) sur 5 à 20 % des blocs pour les mots doux. Jamais deux blocs à empattements d'affilée.
- De la couleur sur 25 à 45 % des blocs, sur le bloc entier seulement : rouge pour la mauvaise façon de faire ou une perte, bleu-vert pour le concept ou le mot-clé, vert pour l'action ou le résultat.
- **Un seul style pour tout le reel :** chaque sous-titre dans la même boîte sombre avec un fin liseré clair, pour qu'il se lise aussi bien sur du noir, du blanc ou des images. Mélanger sous-titres encadrés et nus faisait cheap.
- **Jamais de blanc sur fond clair.** Mesurer les pixels derrière chaque sous-titre.
- Position : sur la jonction dans un split, sur le t-shirt dans un plan serré (pas sur la mâchoire), et dans une zone libre quand le plan est un texte à lire.
- **Jamais sur la bouche ou le menton,** surtout pas dans la première seconde, quand le spectateur décide si la personne à l'écran est réelle. Un sous-titre qui traverse une coupe passe à l'emplacement du nouveau plan sur l'image de la coupe.

## Musique et bruitages

- **Choisir la musique selon l'ambiance :** un beat plus sombre et assuré pour les affirmations et l'actualité, du lo-fi ou un groove calme pour les méthodes.
- Le fond musical se place environ 11 dB sous la voix (plage de travail de 9 à 14 dB). Le baisser sous la parole. Les 1 à 2 premières secondes sont souvent plus calmes, et le beat arrive sur la deuxième phrase.
- **Les bruitages suivent des actions visibles,** pas chaque coupe : un souffle doux sur un vrai déplacement dans l'espace, un tapotement amorti quand un logo se pose, un clic sec pour une petite interface, du papier pour les documents, une courte note chaude pour une coche, un arrêt sec pour une croix.
- Éviter les zaps laser, les « plops » qui descendent, les gazouillis de science-fiction et un whoosh sur chaque coupe.
- Varier les fichiers sonores pour les éléments répétés (clic, tapotement, contact de céramique) pour qu'une liste ne sonne pas comme une boucle de percussions.
- Master autour de −14 LUFS avec une crête vraie à −1,5 dBTP ou moins. **Mesurer le fichier final encodé,** pas seulement le WAV.
- Ne jamais faire de fondu sur le dernier mot prononcé.

## Autres formats

**Reel brut (style plus léger) :** pas de B-roll ni de musique. Couper seulement les reprises, les bégaiements et les blancs, en gardant la dernière prise propre. Un mot à l'écran à la fois, petit, au milieu en bas, synchronisé sur le mot exact. Quand l'orateur pointe du doigt en nommant un outil, faire apparaître le vrai logo de l'outil là où il pointe, avec un tapotement discret. Couper seulement après l'extinction complète d'un mot ; les transcriptions terminent les mots 40 à 80 ms avant que la consonne s'éteigne.

**YouTube Short tiré d'une vidéo longue :** enregistrement d'écran en haut, face caméra en bas, sous-titres avec mot surligné sur la jonction. Mettre la valeur ou l'affirmation dans les 3 premières secondes, puis les preuves dans l'ordre de la vidéo longue, et finir sur un enseignement complet. Chaque chiffre à l'écran doit pouvoir s'expliquer par ce que le Short a montré. Nommer les choses avant de s'en servir. Garder les textes sous les 130 premiers pixels. Ne jamais assembler un appel à l'action que l'orateur n'a pas dit.

**Vidéo explicative narrée (voix IA) :**
- Mettre toute la timeline sur une seule horloge (une grille rythmique) pour que l'image, la musique et les bruitages bougent ensemble quand une phrase change. Ne jamais coder en dur le moment où un mot doit tomber.
- Mettre chaque phrase de voix au même niveau sonore et limiter seulement les crêtes. Réduire toute une phrase pour l'ajuster à sa crête la plus forte a rendu une phrase 5 dB plus faible.
- Retranscrire toute la narration et la comparer au script avant chaque rendu.
- Ne pas faire parler le narrateur sur les images d'une vraie personne qui parle. Les spectateurs croient que cette personne parle avec la voix IA.
- Finir sur la phrase-thèse, dite pendant l'extinction du dernier coup de musique, puis le logo.
- Des panneaux d'interface et des formes d'onde ternes font décrocher les spectateurs. Mettre de vraies images dans ces scènes.

## Vérifier le montage

L'agent vérifie son propre travail avant que vous le voyiez :
- **Synchro des lèvres :** comparer les images coupées au brut. Un nombre d'images identique ne prouve pas que les bonnes images ont été choisies.
- **Bandes d'images** autour de chaque coupe (10 images de chaque côté). Elles repèrent les panneaux vides d'une image et les sous-titres qui clignotent sur le mauvais plan, que les captures isolées ratent.
- **Contraste** derrière chaque sous-titre.
- **Chaque mot entier :** transcrire le rendu final et comparer les mots à chaque coupe avec l'enregistrement brut. Une transcription seule n'est pas une preuve : la reconnaissance vocale devine correctement un mot écourté alors qu'un auditeur l'entend cassé.
- **La première seconde :** lire les 2,5 premières secondes image par image, et la première image de chaque plan sur le visage. Rien ne couvre la bouche.
- **Volume et crête vraie** sur le fichier livré.
- **Tests de visionnage par IA** (un modèle vidéo qui regarde le rendu) : utiles pour repérer des problèmes possibles, mais bruités, et ils inventent des effets. Vérifier chaque reproche sur de vraies images avant d'agir. Un panel de profils (« ce spectateur irait-il au bout ? où s'est-il arrêté ? ») est plus utile qu'une note de 1 à 10.
- **Votre revue est le dernier filtre.** Nate a repéré un décalage de synchro des lèvres qu'aucune vérification automatique n'avait vu.

## Les leçons qui nous ont coûté du temps

- Encoder chaque segment séparément puis les concaténer décale la synchro des lèvres d'environ une image à la moitié des raccords. Sélectionner les numéros d'image exacts en une seule passe.
- Télécharger le flux vidéo complet et couper en local ; chercher un extrait de 3 s par HTTP a pris plus de 10 minutes.
- Les enregistreurs d'écran du navigateur capturent des pixels CSS, donc les enregistrements à haute densité sortent petits. Capturer plutôt image par image.
- Certains sites de documentation font défiler un conteneur interne ; faire défiler avec la molette, pas avec `window.scrollTo`.
- Une boîte de sous-titre sombre disparaît sur un fond sombre si elle n'a pas un fin liseré clair.
- Animer des transformations (x, y, scale), pas `top` ou `left`.
- Couper un mot de remplissage au milieu d'une phrase abîme les mots autour, et y mettre une pause donne l'impression que le mot abîmé est étouffé. La version qui a marché avait moins de coupes, toutes entre les phrases, et durait 5 s de plus.
- Mesurer le volume sur la version stéréo livrée. Un fichier mono affiche 3 dB de moins, et un reel est parti trop fort à cause de ça.
- Un enregistrement brut plafonne le montage. Un extrait sans accroche ni appel à l'action fait de faibles résultats, aussi bien coupé soit-il. Écrivez l'accroche avant d'enregistrer.

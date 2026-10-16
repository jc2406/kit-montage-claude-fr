---
name: short-form-edit
description: Transformer des images face caméra en reel, YouTube Short ou publicité courte finis, avec une ouverture qui pique la curiosité, une chute méritée, des coupes au service de l'histoire, des motion graphics synchronisés sur la transcription, du B-roll en mouvement, des sous-titres, une musique discrète et des bruitages synchronisés. À utiliser pour le montage court (« fais-en un reel », « monte un Short ») ; utiliser edit-video pour les vidéos longues et cut-silences pour supprimer seulement les pauses.
---

# Montage court

Entrée : le chemin d'une vidéo source et, en option, celui d'un reel de référence.

Livre les formats demandés et le projet modifiable. Par défaut 1080x1920 ; si demandé, compose
aussi un 1920x1080 avec son propre cadrage et son propre placement des textes. Vérifie chaque
format séparément, y compris son ouverture et son appel à l'action. Le montage doit raconter
l'histoire de l'orateur par l'image, le timing et le son. La viralité est une aspiration, pas un
résultat que le montage peut garantir. Travaille en local sauf si une délégation est demandée.

## Priorité

Le premier filtre créatif est : **« Dans les 3 premières secondes, quelqu'un est-il convaincu qu'il
doit regarder jusqu'à la fin ? »** Établis une raison précise de rester et mérite sa résolution
dans la vidéo. Les effets, la quantité de médias et la finition viennent après ce test. Traite la
réponse comme un jugement éditorial tant qu'il n'existe pas de données d'audience.

## Style maison et remarques

Lis `docs/EDITING-PLAYBOOK.md` avant de planifier. Il contient le style de reel mesuré
(rythme, mises en page, sous-titres, ordre de préférence du B-roll, palette sonore), les variantes
reel brut, vidéo longue vers Short et vidéo explicative narrée, et les leçons qui ont coûté du
temps. Utilise-le par défaut quand l'utilisateur ne donne pas de style ; le brief de
l'utilisateur l'emporte.

Quand l'utilisateur fait une remarque sur un brouillon, corrige le montage, puis propose d'écrire
la remarque dans le skill ou la référence concernés sous forme de règle, de vérification ou de
modification de script, pour que le montage suivant en parte. Note la remarque et la règle qui en
résulte ensemble.

## Poser le montage

1. Lis le guide de l'espace de travail, `MOTION_PHILOSOPHY.md` et les skills HyperFrames et
   video-storytelling avant de composer. Le brief de l'utilisateur prime sur les choix esthétiques
   par défaut. Garde tous les fichiers dans `video-projects/<slug>/`.
2. Sonde la source et la référence fournies : durée, dimensions, cadence d'images, audio et
   identité d'une éventuelle transcription existante. Préserve les originaux. Transcris avec le
   fournisseur choisi par l'utilisateur ; ElevenLabs Scribe est le choix par défaut. Lis
   `docs/TOOLS-AND-API-KEYS.md` pour les alternatives Whisper, la normalisation des horodatages
   par mot, les identifiants et les coûts. Ne remplace jamais par une prise plus ancienne.
3. Quand une référence est fournie, inspecte tout le reel avec des planches contact, des images
   isolées en pleine taille et des bandes d'images continues sur des transitions représentatives.
   Écoute son son quand un outil de revue audio est disponible. Enregistre `REFERENCE-ANALYSIS.md`
   avec des observations horodatées, les principes déduits et les limites explicites. Ne laisse
   pas entendre que tu as écouté l'audio en te basant sur une forme d'onde.
   Lis [reference-analysis.md](references/reference-analysis.md) pour la fiche réutilisable et les
   questions d'analyse. Emprunte des mécanismes éditoriaux, pas des textes de marque.
4. Avant de figer le concept, inspecte les rushs fournis, les éléments de marque et les démos
   sources utiles. Enregistre une présélection de médias avec les intervalles exploitables exacts,
   l'action visible, sa conséquence, la provenance et un rôle possible dans l'histoire. Laisse un
   moment source marquant façonner l'idée. Choisis ce qui se lit d'un coup d'œil ; fais entrer
   l'action et son résultat en entier avant d'envisager un recadrage plus serré. Un cadre rempli
   ne sert à rien si le spectateur ne voit pas ce qui se passe.
5. Lis chaque phrase prononcée. Lance les outils de silences et d'erreurs, puis relis à la main
   toute la transcription : un rapport sans candidat peut rater une reprise évidente.
   Retire les prises abandonnées, garde les nuances importantes et la chute, et garde une
   respiration naturelle autour des raccords. Enregistre les raisons des coupes en temps source.
   Rends la coupe propre une seule fois et déduis le timing des mots de l'EDL réelle calée à
   l'image. Fige la coupe après l'animatique brute, avant la finition des graphismes. Tout
   changement de timing ultérieur reconstruit les sous-titres, graphismes et sons qui en
   dépendent à partir de la même table de correspondance.

L'autorisation de l'utilisateur est durable. Une instruction de faire une vidéo finie et
d'itérer autorise le montage et le rendu locaux ordinaires. Une demande explicite de B-roll Kie
autorise ces générations. Règle les étapes de validation avec l'autorisation en cours ; ne
demande que l'accord qui manque, pas à chaque brouillon. Ne publie jamais le reel et ne contacte
personne sans autorisation explicite.

## Concevoir le parcours émotionnel

Écris `DESIGN.md` et un plan des temps forts avant le HTML. Identifie l'accroche, la boucle ouverte,
la montée, la preuve, la chute et l'appel à l'action. Donne à chaque plan une raison d'exister.

Lis [curiosity-and-entertainment.md](references/curiosity-and-entertainment.md).
Crée `OPEN-LOOPS.json` avec chaque question honnête du spectateur, l'objet planté, le moment de
mise en place, les rappels ou réponses partielles, le moment de fermeture et la preuve orale qui
mérite cette fermeture. Par défaut, une boucle principale et au plus une boucle secondaire
ouvertes en même temps. Ferme la leçon promise avant l'appel à l'action ; une demande de
commentaire ne doit pas être la seule réponse. Un objet récurrent seul n'est pas une boucle
ouverte : établis ce qui manque ou n'est pas résolu, puis change visiblement cet état.

Construis trois ouvertures brutes vraiment différentes avec la même parole source, fidèle.
Compare les trois premières secondes pour la clarté du sujet, la curiosité, la compréhension sans
le son et la suite. Choisis et note la raison ; ne choisis pas seulement l'effet le plus fort.
Rends une animatique en mouvement basse résolution, avec la parole et un son brut, avant de
finaliser les matières. Règle à ce stade la prévisibilité, le contexte manquant ou les chutes
faibles. Des éléments déjà validés peuvent être réutilisés, mais vérifie quand même la nouvelle
séquence avant de passer du temps sur le rendu final.

Varie le rythme par séquence : un court enchaînement de découvertes, une brève attente, puis une
résolution. Garde le timing des mots tout en variant la vitesse et l'échelle des animations.
La règle d'un événement toutes les 1 à 2 secondes n'est ni un métronome ni une permission
d'ajouter du remplissage. Laisse l'expression de l'orateur porter un temps fort de conviction.
Pour chaque plan, note l'attente du spectateur et l'information nouvelle ou la conséquence qu'il apporte.

Contrôle les redites. La narration et les sous-titres portent les mots exacts ; les graphismes
doivent en général montrer l'exemple, la relation, la preuve ou la conséquence. Supprime une
troisième reformulation en titre sauf si une insistance voulue la justifie. Préfère une action
précise du produit ou un détail de la source à des images génériques de frappe au clavier.
N'invente pas un résultat de produit simplement pour rendre la chute plus satisfaisante.

### Traiter les trois premières secondes comme un montage à part

Pour chaque ouverture, note le bénéfice pour le spectateur, la question non résolue, la preuve
visible à la troisième seconde et la scène exacte de la résolution. Rejette les teasers vagues et
toute promesse que ces images ne peuvent pas tenir. Une publicité peut résoudre un exemple concret
ou expliquer un mécanisme avant d'inviter le spectateur à en savoir plus ; elle ne doit pas
promettre un tutoriel complet et ne livrer qu'un appel à s'inscrire.

Rends la première image immédiatement parlante. Une action surprenante, une contradiction, un
aperçu du résultat ou une expression humaine révélatrice peut poser la tension. Ne choisis un
impact ou une transition que s'il aiguise cette idée. Un résultat calme qui semble impossible peut
battre un montage bruyant. Évite un tampon, un flash ou un effet de 0,3 seconde obligatoires.

Utilise une référence sonore fournie si elle existe. Retire le silence d'amorce de
l'enregistrement, aligne l'impact audible de l'effet sur l'arrivée visuelle à deux images près,
et ajuste son niveau et sa queue autour des premiers mots. Rends l'impact perceptible tout en
gardant la parole claire ; baisse brièvement la musique si ça aide. Ne fais pas du volume la
seule accroche.

L'ouverture doit aussi fonctionner sans le son. Pose le sujet ou la tension tout de suite, puis
révèle un autre état parlant dans les trois premières secondes. Évite un jingle de logo sans
rapport, un silence ajouté, des flashs répétés ou un effet qui retarde l'argument. Reste dans le
style de matière choisi. Varie le procédé d'un reel à l'autre ; ne tamponne pas STOP
automatiquement sur chaque vidéo.

Enregistre un plan image et son des trois premières secondes et inspecte l'ouverture encodée image
par image, y compris sa première image, l'impact, la révélation et le retour au montage principal.
Vérifie que le premier mot prononcé survit au mixage de l'impact. Note-le comme un contrôle distinct
« accroche d'ouverture » dans le rapport de vérification.

### Construire l'univers visuel

- Choisis une direction visuelle à partir du sujet, du public, de la matière source et du brief de
  marque. Note pourquoi elle convient à cette histoire. Les images documentaires, la comédie
  visuelle, les démonstrations de produit et les objets conçus sont des options, pas des quotas.
  Utilise des couleurs, une typographie et des transitions cohérentes sans imposer le papier à
  chaque reel.
- Choisis entre orateur plein cadre, split ou images d'illustration plein cadre selon ce qui doit
  capter l'attention à ce moment-là. Préserve les expressions, les gestes et la preuve dans chaque
  format demandé.
- Planifie le rythme par séquence : rafale, attente, révélation et respiration. Traite 1 à 2
  secondes comme un diagnostic de rythme, pas comme un calendrier de coupes. Garde des plans plus
  longs quand une action qui se développe ou une interprétation le mérite, et note la raison.
  Attribue les transitions selon leur rôle éditorial, jamais par rotation selon l'indice du plan.
- Monte en tension, puis relâche. Utilise de courts moments de relative immobilité pour faire
  passer une conviction ou une révélation. N'impose pas la fin de 4 à 6 secondes des formats longs
  à un reel court.
- Utilise un rappel d'objet : le modèle inachevé planté dans l'accroche doit se résoudre à la chute.
  Montre des relations et des transformations, pas seulement des cartes de titre successives. Un
  spectateur sans le son doit quand même suivre l'idée centrale.
- Garde le texte dans une zone sûre pour le téléphone. En 1080x1920, commence par x=90..930,
  y=200..1600, en réservant le bord droit et le bas à l'interface des réseaux sociaux. Ajuste les
  sous-titres à la position réelle du visage dans chaque mise en page. Utilise de courts groupes de
  mots et les débuts exacts des mots ; la mise en avant d'un mot-clé doit garder les mots de l'orateur.

Pour un brief minimaliste façon Apple, lis
[premium-motion-and-footage.md](references/premium-motion-and-footage.md).
Utilise une typographie sobre, de l'espace vide, une vraie profondeur des objets, une lumière
directionnelle et des ombres de contact douces. Une composition minimale peut quand même avoir un
mouvement et un son riches et utiles. Ne confonds pas un petit objet sur une diapo vide avec un
design premium.

### Rendre le reel divertissant avec des couches et des actions

Donne à l'œil une seule cible d'attention claire. Utilise la profondeur, l'occultation, la lumière
et le mouvement de caméra quand ils rendent l'action plus facile à suivre. Garde une typographie
lisible et n'utilise un traitement en volume que si l'univers de matière choisi l'appelle.
Pour un brief papier, inspecte dans la sortie encodée les fibres, les bords, les plis, les ombres
de contact et la perspective. Ce sont des contrôles d'artisan conditionnels, pas des règles de
style universelles.

Donne à chaque temps fort graphique prolongé une action avec un résultat : une clé s'enfonce et un
projet démarre, des critères deviennent des coches, une carte s'ouvre pour révéler un résultat, une
pile s'assemble en système. Une carte comme « Définir le bon » peut pivoter ou s'incliner pour que
son bord et son ombre de contact en mouvement restent visibles pendant que ses critères se
résolvent. Évite les cartes de titre qui se posent puis se figent. Un léger mouvement secondaire
soutient l'action principale ; le même balancement au repos appliqué à chaque objet n'est pas
raconter une histoire.

Utilise la référence montée par un humain pour étudier comment l'attention se déplace : contexte
large, détail isolé, interaction, conséquence visible, puis retour à l'orateur. Avant de livrer,
demande-toi ce qui rend chaque séquence divertissante au-delà de son air professionnel. Un
nouveau titre ou un nouveau sous-titre seul n'est pas la réponse.

Repère les personnes, produits et lieux nommés dans la transcription avant le storyboard.
Utilise un portrait vérifié quand reconnaître une vraie personne compte, plutôt que d'afficher son
nom par défaut. Préfère son propre site ou une source attribuable, enregistre la provenance et
inspecte l'image réelle. Anime la photo comme un objet physique si c'est pertinent, avec un rappel
qui a du sens. Ne génère jamais une ressemblance pour la présenter comme une vraie photo. Un
portrait animé reste une couche photographique et ne compte pas comme du B-roll en mouvement.

Examine les plans voisins comme des silhouettes et des actions, titres masqués. S'ils ressemblent
encore à la même révélation de carte, repense le temps fort le plus faible. Varie les mécanismes :
déchirer pour révéler, déplier pour montrer l'échelle, appuyer pour créer, connecter pour
permettre, traiter pour produire un résultat. Garde un univers cohérent et des causes et effets
compréhensibles. Mets l'action la plus forte sur l'idée orale la plus importante. Une note
d'engagement donnée par l'utilisateur est un retour pour itérer, pas une mesure qu'un validateur
peut certifier.

Pour une histoire de produit, cherche de la vraie matière source : pages produit publiques,
documentation officielle, vrais enregistrements d'écran et logos officiels. Enregistre de vrais
défilements, sélections ou interactions visibles quand c'est utile. Présente les vrais logos sur
des surfaces en volume sans redessiner une marque approximative ni laisser croire à un partenariat.
Garde les URL sources et distingue les vraies images du produit des interfaces d'illustration et du
B-roll généré. N'expose jamais de vrais identifiants dans une interface capturée. Une capture
source animée peut être une couche dans une composition explicative, mais elle ne remplace pas le
B-roll en mouvement quand le brief demande de la vidéo.

### Vérifier les éléments de marque avant de dessiner

N'invente, n'approxime, ne redessine de mémoire et ne génère jamais le logo d'une marque existante.
Une étoile rayonnante ne remplace pas le symbole de Claude. Utilise d'abord le fichier exact fourni
par l'utilisateur ; sinon, récupère-le sur le site officiel ou le kit presse de la marque. Les
moteurs de recherche aident à trouver les sources mais ne prouvent pas l'authenticité. Enregistre
l'URL source ou le chemin fourni, le fichier d'origine et son empreinte. Inspecte le visuel avant
de l'utiliser, garde sa forme et ses proportions, et anime le fichier authentique ou la surface qui
le porte. Ne modifie pas la géométrie d'un logo pour créer de la profondeur. Contrôle chaque
apparition de logo dans le reel final encodé par rapport à son fichier source, y compris les petits
symboles et les motifs récurrents. Si aucun fichier vérifié n'est disponible, utilise le nom de la
marque en texte simple plutôt que de fabriquer un logo.

### Équilibrer graphismes et images en mouvement

Choisis le mélange selon l'histoire et les preuves disponibles. Il n'y a pas de pourcentage par
défaut entre graphismes et B-roll. Tiens un registre des durées : images authentiques,
illustrations générées, graphismes conçus et temps où l'orateur est seul ; explique la base de
calcul et compte une seule fois les panneaux en split. Des sous-titres sur des images restent des
images. Une image fixe avec un mouvement de caméra est une couche photographique, pas du B-roll en
mouvement.

Utilise chaque scène de B-roll distincte une seule fois par reel. Un autre recadrage, nom de
fichier, vitesse, sens inverse ou étalonnage n'en fait pas une nouvelle scène. Réutiliser la même
scène choisie dans les deux formats demandés est normal. Note l'identité de la scène source,
l'empreinte du fichier et l'intervalle choisi dans `assets/footage-ledger.json` ; lance le
validateur de plans ci-dessous. Un rappel graphique doit faire évoluer l'idée d'origine vers un
nouvel état et une nouvelle composition. Ce n'est pas une permission de rejouer des images.

Par défaut, garde le cadre source entier quand un recadrage plus serré cache le contexte. Garde le
sujet, l'action et la conséquence visibles sur tout l'intervalle choisi, avec les sous-titres en
dehors de l'action. Inspecte le début, le milieu et la fin dans chaque format, à taille de
téléphone. Un texte de démo dense ne doit pas être nécessaire pour comprendre un insert furtif ;
isole une action visible qui a du sens ou donne-lui plus de temps. Évite la vidéo de fond dupliquée
et floutée comme solution automatique pour le cadrage vertical.

Préfère une action précise avec une conséquence lisible. Compare les plans voisins titres masqués :
si la séquence répète le même mécanisme visuel ou pourrait figurer dans n'importe quelle publicité
IA, remplace l'insert le plus faible. Les métaphores générées peuvent surprendre mais ne remplacent
pas une preuve filmée. Privilégie de vraies réactions humaines quand elles servent l'histoire.

## Générer et assembler

1. Kie.ai est le fournisseur optionnel pour les inserts en mouvement et les images générés.
   Utilise le fournisseur choisi par l'utilisateur ou les médias fournis ; vérifie son compte, ses
   crédits et l'intégration avant de générer. Voir `docs/TOOLS-AND-API-KEYS.md`. Vérifie le schéma
   actuel de l'API officielle. Enregistre le modèle, le prompt, l'ID de tâche, la sortie retenue et
   l'état de la génération ; réutilise les tâches réussies plutôt que de les relancer à l'aveugle.
   Télécharge et inspecte les vrais fichiers vidéo, y compris les coins en pleine taille sur tout
   l'intervalle choisi, pour repérer du texte, des logos ou des objets déformés générés. Recadre ou
   régénère les défauts, puis vérifie le résultat encodé. Le B-roll doit avoir un vrai mouvement,
   pas une image fixe avec un zoom. Des schémas statiques peuvent servir de matière source
   seulement si l'animation finale les transforme vraiment. Ne génère jamais de fausse preuve et ne
   laisse jamais croire qu'une personne synthétique est la vraie personne nommée.
2. Anime les graphismes à partir des mots recalés. Enregistre la phrase d'ancrage et le temps de
   chaque plan. Lie les apparitions des sous-éléments à leurs propres noms prononcés, pas à des
   décalages arbitraires `index * 0.4`. Vise moins de 2 images d'écart avec le début du mot pour les
   sous-titres et les impacts, avec au plus 0,15 seconde d'anticipation visuelle volontaire.
3. Respecte le contrat de timeline HyperFrames : une timeline en pause enregistrée par composition,
   couverture de toute la durée, fichiers locaux, vidéo muette et audio séparé. Anime le conteneur
   des images. Un canvas déterministe ou du CSS 3D convient ; utilise un vrai rendu 3D quand la
   métaphore l'exige. Le framework est un outil, pas une esthétique. Garde une source modifiable.
4. Trouve ou génère un fond instrumental qui laisse de la place à la narration. Enregistre sa
   provenance. Normalise la voix avant de mixer ; commence avec le fond environ 14 à 20 dB sous la
   voix, puis ajuste selon la vraie piste. Baisse-le sous la parole, fais des fondus propres et
   mesure le mix final. Vise environ −16 LUFS et ≤ −1 dBTP, en t'adaptant à la dynamique de la
   source plutôt qu'en l'écrasant.
   Quand l'utilisateur dit que la musique est trop forte, réduis son gain par rapport à la version
   écoutée et enregistre le changement mesuré. Vérifie après la normalisation finale que le rapport
   fond/voix est plus bas ; baisser seulement le niveau du master ne règle rien.
5. Construis les bruitages à partir de la carte des événements visuels. Les impacts de papier
   tombent au contact des objets ; les glissements soutiennent le mouvement ; des sons de réussite
   discrets accompagnent les coches. Aligne le début audible ou le pic d'impact, pas seulement le
   début d'un fichier audio qui commence par du silence. Varie la densité et le niveau des effets.
   La voix reste dominante. Traite séparément l'anticipation, le contact et le relâchement. Une
   brève baisse du fond peut rendre le contact suivant plus net sans monter son volume. Laisse
   passer certaines coupes sans whoosh. Note le rôle de chaque son et écoute les transitions quand
   c'est possible. Une demande de plus de bruitages appelle une partition d'événements plus riche :
   mouvement de papier, contact d'objet, emboîtement, connexion, anticipation et révélation peuvent
   chacun avoir un son distinct. Rends perceptibles les contacts qui comptent, varie la texture et
   la densité, et garde des moments de conviction plus calmes. Ne remplace pas par une musique plus
   forte ou un whoosh sur chaque coupe. Inspecte l'arrivée réelle de l'animation avant de placer
   chaque son.
6. Lance le lint et inspecte l'aperçu en direct avant le rendu. L'automatisation du navigateur
   tourne sans interface, avec Pointer Lock et la capture du pointeur désactivés partout.
   La revue automatique en local est permise quand l'utilisateur a autorisé une itération
   autonome. Rends un brouillon, inspecte-le, corrige, puis rends en qualité finale.
   Si la capture du framework se bloque, un export déterministe des graphismes plus un assemblage
   FFmpeg est acceptable. Attends le chargement des polices locales avant de capturer un canvas.
   Normalise chaque vidéo d'entrée sur la même base de temps avant de superposer, et inspecte
   chaque coupe encodée pour repérer les décalages d'une image. Fais les recadrages finaux du
   visage à partir de la source en résolution native, pas d'un proxy de montage réduit.

## Contrôles avant livraison

Utilise [quality-gates.md](references/quality-gates.md). Le validateur du plan détecte les défauts
structurels mais ne peut certifier ni le goût, ni le mouvement, ni l'écoute audio :

```powershell
node .agents/skills/short-form-edit/scripts/validate-plan.mjs video-projects/<slug>
node .agents/skills/short-form-edit/scripts/validate-footage.mjs video-projects/<slug>
```

Il lit `assets/plan.json`, `assets/transcript.json` et `assets/edit-decisions.json`. Voir
[plan-schema.md](references/plan-schema.md). Pour une autre implémentation, exporte ce schéma ou
adapte explicitement le validateur ; ne saute jamais des vérifications en silence parce que le
schéma diffère.

Inspecte les images héros encodées de chaque plan en pleine taille et à taille de téléphone.
Inspecte des bandes continues autour de chaque coupe et transition, plus le mouvement complet quand
c'est possible. Vérifie les raccords de parole, une nouvelle transcription automatique de l'audio
final, l'équilibre voix/fond, le timing des bruitages, la saturation et la dernière syllabe.
Distingue l'écoute de l'analyse du signal. Note honnêtement toute modalité de revue indisponible.

Fais une revue séparée et sans interruption du divertissement, sur l'animatique et sur la version
finale, quand la revue vidéo en temps réel est possible. Note les moments où l'attention baisse,
les séquences prévisibles, les promesses non tenues et la surcharge de lecture dans
`ENTERTAINMENT-REVIEW.md`. Corrige les séquences les plus faibles, puis revérifie-les dans leur
contexte. Une lecture automatique jusqu'au bout et des planches contact sont des preuves techniques
et visuelles, pas l'affirmation d'un visionnage perceptif continu. Si cette modalité est
indisponible, utilise des bandes de séquences dans l'ordre chronologique et des vérifications
explicites de l'état des boucles, et signale la limite. N'invente jamais de score de rétention et
n'appelle jamais une comparaison interne d'accroches un test A/B d'audience.

Corrige ce qui a été trouvé, archive les versions remplacées et refais les vérifications touchées
par chaque changement. Mets dans `VERIFY.md` l'empreinte réelle de la sortie, les résultats mesurés,
les fichiers inspectés, les révisions et les limites non résolues. Ne déclare pas une réussite sur
la base d'une lecture du code, de l'existence d'un fichier ou d'un validateur sans résultat.

## Livraison

Rends un MP4 final lisible, son chemin absolu et le chemin du skill. Garde dans le projet la
composition, les médias, les transcriptions source et recalée, l'EDL, le plan des plans et des
événements, les pistes audio séparées, l'analyse de référence et les preuves de contrôle qualité.
Identifie clairement la version finale. N'appelle jamais un brouillon « final » et ne promets
jamais de performance virale garantie.

---
name: hyperframes-video-beats
description: Planifier, écrire, minuter, styliser et valider les temps forts en motion graphics des vidéos longues face caméra dans HyperFrames. À utiliser quand on demande d'ajouter ou d'améliorer des temps forts visuels, des bandeaux bas en verre dépoli (glassmorphism), des prises de contrôle plein écran en papier froissé, des encarts synchronisés sur la transcription, la couverture du rythme, des graphismes de rétention YouTube ou des incrustations prêtes au rendu dans un projet vidéo HyperFrames existant.
---

# Temps forts vidéo HyperFrames

Utilise ce skill pour transformer une vidéo face caméra et sa transcription en un ensemble rythmé
de motion graphics qui soutiennent la narration sans couvrir l'orateur inutilement.

## Objectif principal

Garder le spectateur orienté et accroché. Chaque temps fort doit répondre à l'une de ces questions :

- Que doit retenir le spectateur ?
- Quel concept a besoin d'une structure visuelle ?
- Quel chiffre, contraste ou virage mérite d'être mis en avant ?
- Où le rythme devient-il assez calme pour que le spectateur décroche ?

N'ajoute pas de graphisme simplement parce qu'il y a un trou. Ajoute-en parce que la narration a
un sujet, une transition, une preuve ou un modèle mental qui gagne à être soutenu visuellement.

## Première passe

1. Lis les instructions du projet (`AGENTS.md`, la doc des skills locaux et les notes propres au projet).
2. Inspecte la composition racine, le calendrier actuel des temps forts, le CSS partagé et la transcription.
3. Construis une carte de couverture à partir des entrées `data-start` / `data-duration` de la racine ou du tableau principal `SHOW`.
4. Extrais les morceaux de transcription de chaque zone demandée et de chaque trou non couvert.
5. Repère les plages de sujet d'après la narration, pas d'après des horodatages arbitraires.
6. Décide si chaque sujet a besoin d'un temps fort papier plein écran, d'une carte en verre en bas d'écran, ou d'aucun nouveau temps fort.

Utilise des commandes locales rapides. Préfère `rg`, `Select-String` et de petits scripts Node/PowerShell sur la transcription.

## Choisir le type de temps fort

### Papier froissé plein écran

Utilise une prise de contrôle papier quand la narration arrive à une thèse majeure, une liste, un
marqueur de section, une citation ou un chiffre qui doit brièvement occuper tout le cadre.

Bons usages :

- La résolution de l'accroche ou le sommaire « dans cette vidéo »
- Une grande transition de section
- Un gros chiffre ou un résultat d'étude
- Une phrase-thèse mémorable
- Une courte citation ou un mantra
- Un contraste qui demande au public de s'arrêter et regarder

Règles :

- Reste court, en général 4 à 12 secondes.
- Utilise un texte noir clairsemé.
- Ne mets en couleur d'accent que les vrais chiffres ou un seul mot extrêmement important.
- Ne couvre pas de longues explications avec des prises de contrôle papier.
- Ne rends pas le texte plein écran ludique, énorme ou trop gras par défaut.

### Bandeau bas en verre dépoli

Utilise un bandeau en verre quand l'orateur doit rester visible et que le graphisme doit soutenir l'idée en cours.

Bons usages :

- Échafaudages d'explication
- Étiquettes de sujet
- Modèles mentaux sous forme d'équation
- Petites listes
- Traductions « ce que ça veut dire »
- Remplissages de rythme pendant de longs passages face caméra
- Cartes de suite après un temps fort plein écran ou en split raccourci

Règles :

- Garde les bandeaux dans le tiers ou la moitié basse.
- Évite de couvrir le visage.
- Utilise un texte concis : un titre plus une courte ligne optionnelle, ou une liste de 2 à 4 éléments.
- Préfère une carte par plage de sujet plutôt que beaucoup de petits flashs.
- Garde le style de carte en verre existant sauf si l'utilisateur demande un changement de design.

## Repères de rythme

Pour les vidéos YouTube longues face caméra :

- Début de vidéo : évite plus de 20 à 30 secondes sans temps fort visuel.
- Corps principal : évite plus de 30 à 45 secondes sans temps fort.
- Sections d'explication denses : un bandeau à peu près par plage de sujet, pas par phrase.
- Les grosses prises de contrôle papier sont une ponctuation occasionnelle, pas la règle.
- Si un temps fort existant a été raccourci à la main parce qu'il paraissait trop long, respecte ce choix et comble après avec une nouvelle carte plus courte.

Quand tu parcours un calendrier, signale les vrais trous d'après le calendrier de visibilité, pas
seulement l'ordre du DOM. Si la timeline racine utilise un tableau `SHOW`, c'est en général lui
qui fait foi pour les plages visibles.

## Méthode de timing

Cale chaque temps fort sur le sujet dans la transcription :

1. Trouve le premier mot ou la première expression où le sujet commence.
2. Démarre le temps fort 0,2 à 0,6 seconde avant cette ancre quand c'est possible.
3. Garde-le visible jusqu'à la fin du sujet ou jusqu'à un passage de relais naturel.
4. Si le temps fort suivant démarre tout de suite, fais disparaître celui-ci 0,1 à 0,5 seconde avant, sauf si l'enchaînement est voulu.
5. Cale les entrées des sous-éléments sur les expressions prononcées.

Évite ce piège :

- La carte apparaît sur le bon sujet mais ne dure que 5 à 8 secondes alors que l'orateur continue d'en parler pendant 20 à 40 secondes.

Préfère :

- Une carte qui vit pendant tout le sujet, avec une ligne ou un élément de liste qui s'ajoute en cours de route si la narration évolue.

## Écrire le contenu

Écris pour une compréhension d'un coup d'œil. Le spectateur doit comprendre la carte en moins d'une seconde.

À utiliser :

- Des groupes nominaux courts
- Des étiquettes directes
- Un modèle mental par carte
- Des chiffres seulement quand ils ont un sens
- Des verbes quand ils clarifient l'action

À éviter :

- Répéter toute la voix off
- Les phrases longues
- Le vocabulaire « hype » vague
- Trop de mots mis en avant
- Expliquer dans le graphisme comment regarder la vidéo

Bons modèles :

```text
Le goulot d'étranglement
Pas assez d'IA dans les vrais processus.
Le problème, c'est l'adoption, pas le talent.
```

```text
Le pont
Skills + processus = 40 h gagnées
```

```text
Dans cette vidéo
-> L'étude
-> Les chiffres
-> Les chemins possibles
-> Ce qui compte vraiment
```

## Règles de style visuel

Suis d'abord le design system local. Pour cette famille de projets, utilise :

- Une typographie sérieuse et professionnelle.
- Un texte principal noir sur les temps forts papier.
- Le bleu d'accent seulement pour les grands chiffres ou de rares mots forts.
- Des cartes en verre avec le style dépoli sombre existant.
- Des bandeaux bas qui ne couvrent pas le visage de l'orateur.

Pour les temps forts papier :

- Utilise le noir pour les surtitres, étiquettes, flèches, sources, citations et textes d'appui.
- Garde une graisse de police retenue.
- Évite les très grands textes ludiques sauf si l'utilisateur le demande explicitement.
- Rends le mouvement du papier froissé déterministe.

Pour les cartes en verre :

- Réutilise `.glass-card dim lower-third` ou la classe existante la plus proche.
- Préfère un placement en bas au centre.
- Garde des cartes compactes.
- Utilise les aides équation/liste quand l'idée est structurelle.

## Règles d'implémentation HyperFrames

Suis le `AGENTS.md` du projet et les règles du lint HyperFrames :

- Chaque élément temporisé monté a besoin de `data-start`, `data-duration` et `data-track-index`.
- Les éléments temporisés visibles montés à la racine doivent avoir la classe clip/calque attendue par le projet.
- Les sous-compositions doivent enregistrer une timeline GSAP en pause dans `window.__timelines`.
- Fixe la durée de chaque timeline de sous-composition avec `tl.set({}, {}, SLOT);`.
- Garde une logique uniquement déterministe.
- N'anime pas les dimensions de l'élément vidéo ni ses propriétés média d'une façon qui peut figer les rendus.
- Lance `npx hyperframes lint` après toute modification du HTML.

Pour ajouter un temps fort :

1. Crée `compositions/beats/NNN-nom-court.html`.
2. Ajoute le montage à la racine dans `index.html`.
3. Ajoute ou mets à jour le calendrier de visibilité principal s'il existe.
4. Fais correspondre le `SLOT` de la sous-composition à la durée montée.
5. Vérifie qu'il n'y a pas de chevauchement sur une même piste, sauf si le projet utilise volontairement plusieurs pistes d'incrustation.

## Scan de couverture

Après les modifications, parcours le calendrier principal :

- Liste les temps forts triés par début visible.
- Affiche les trous au-dessus du seuil visé.
- N'ajoute ou ne recale des temps forts que là où la transcription a un concept à soutenir.

Pour ce modèle de projet, utilise 30 secondes comme seuil strict de scan et 45 secondes comme
seuil maximal acceptable dans le corps principal.

## Validation

Avant de terminer :

1. Lance le linter HyperFrames.
2. Corrige toutes les erreurs.
3. Mentionne séparément les avertissements s'ils sont connus et non bloquants.
4. Si l'utilisateur a demandé une sortie prête au rendu, fais un rendu ou un rendu d'essai selon le cas.
5. Donne à l'utilisateur les chemins de fichiers et les horodatages exacts modifiés.

## Valeurs par défaut pratiques

Utilise ces valeurs sauf si le contexte du projet dit autre chose :

- Sommaire papier plein écran : 8 à 10 secondes.
- Chiffre papier plein écran : 5 à 8 secondes.
- Bandeau en verre explicatif : 12 à 30 secondes.
- Carte en verre pour un long sujet : 25 à 45 secondes avec des sous-éléments décalés.
- Avance du début d'un temps fort : 0,2 à 0,6 seconde.
- Seuil de scan des trous : 30 secondes.
- Largeur d'un bandeau bas : environ 68 à 72vw, au maximum environ 1240 à 1280 px.

## Ce qu'il faut préserver

Garde les choix de goût de l'utilisateur découverts pendant la revue :

- Si l'utilisateur dit qu'un temps fort est trop long, ne le rétablis pas juste pour respecter une règle générique de couverture.
- Si le style des cartes en verre est validé, réutilise-le au lieu de le redessiner.
- Si la typographie est validée, garde-la stable et n'ajuste que la taille ou la graisse locales.
- Si le visage de l'orateur est important, préfère les bandeaux bas aux cartes au centre de l'écran.

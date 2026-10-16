# Étape 3 : Écrire le script de narration

**Avant d'écrire, relis DESIGN.md** — en particulier les sections Overview et Components. Le script
doit citer de vraies fonctionnalités du produit, de vrais chiffres et de vrais composants que le
site met en avant. Utilise les chiffres exacts de `extracted/visible-text.txt`.

Le script est la colonne vertébrale. Tout ce qui suit — durées des scènes, timing des animations,
rythme des temps forts — vient de la narration. Écris-le avant le storyboard.

Enregistre-le sous `SCRIPT.md` dans le dossier du projet.

## Rythme

- **Environ 2,5 mots par seconde** est un débit naturel (en français, souvent un peu plus : 2,5 à 3 mots/s selon la voix)
- 15 s ≈ 37 à 45 mots. 30 s ≈ 75 à 90 mots. 60 s ≈ 150 à 180 mots
- Laisse de la place aux pauses. Le silence entre deux phrases est une qualité, pas un temps mort
- Le script doit paraître PLUS COURT que la vidéo — l'espace pour respirer visuellement compte

## Ton

Écris comme une personne, pas comme une brochure :

- Utilise un français parlé naturel : « c'est », « t'as », « on » plutôt que « nous » si le ton s'y prête
- Varie la longueur des phrases — de courtes expressions percutantes mêlées à des phrases plus fluides
- Lis-le à voix haute. S'il sonne robotique, réécris-le
- Évite le jargon sauf si le public l'attend
- Choisis tutoiement ou vouvoiement selon la marque, et tiens-t'y

## Prononciation des nombres

Écris ce que tu veux que la voix dise. La synthèse vocale lit littéralement.

| Sur le site    | À écrire dans le script                   |
| -------------- | ----------------------------------------- |
| 135+           | plus de cent trente-cinq                  |
| 1,9 Md$        | près de deux milliards de dollars         |
| 99,999 %       | quatre-vingt-dix-neuf virgule neuf pour cent |
| 200 M+         | plus de deux cents millions               |
| 10x            | dix fois                                  |
| API            | A P I                                     |
| stripe.com     | stripe point com                          |

L'image peut montrer le chiffre exact pendant que la voix l'arrondit.

## Structure

Pour les vidéos produit tirées d'une capture de site :

1. **Accroche** — qu'est-ce qui est surprenant ou impressionnant dans ce produit ? Une affirmation forte, une question qui provoque, un contraste ou un chiffre frappant. C'est la première phrase. **Varie le type d'accroche** — n'ouvre pas sur un chiffre à chaque fois.
2. **Histoire** — que fait le produit ? Qui l'utilise ? Reste concret.
3. **Preuve** — chiffres, noms de clients, preuve sociale. De vrais chiffres tirés du site.
4. **Appel à l'action** — que doit faire le spectateur ? « Commencez sur stripe point com. »

Toutes les vidéos n'ont pas besoin des quatre. Une pub réseaux de 15 secondes peut se limiter à
Accroche + Preuve + Appel à l'action. Une visite produit de 60 secondes utilise les quatre, avec plus d'Histoire.

## La première phrase

La phrase la plus importante de la vidéo. Elle doit créer de la tension, de la curiosité ou de la
surprise dans les 3 premières secondes.

Des modèles qui marchent :

- **Une affirmation forte** : « L'infrastructure financière qui fait tourner l'économie d'internet. »
- **Une question qui provoque** : « Et si ta base de données pouvait réfléchir ? »
- **Un contraste** : « Ton agent IA sait déjà faire des vidéos. Il lui manque juste le bon format. »
- **Un chiffre qui choque** : « Près de deux mille milliards de dollars. » (Avec parcimonie — toutes les vidéos ne doivent pas ouvrir sur un chiffre.)

Si l'ouverture est générique (« Bienvenue chez Stripe » / « Découvrez notre produit »), recommence.

## Exemple

Tiré d'une vidéo de lancement produit de 62 secondes (référence de l'équipe), traduit :

```
Ton agent IA sait déjà faire des vidéos.
Il lui manque juste le bon format.

Voici Hyperframes. Un framework open source. Du HTML en entrée, de la vidéo en sortie.

Une div, c'est une image clé. Les attributs data, c'est ta timeline.
Le CSS, c'est ton style. G-Sap, c'est ton moteur d'animation.

Tout ce qu'un navigateur peut afficher peut devenir une image de ta vidéo.

Animations CSS. G-Sap. Lottie. Shaders. Three.js.

Ajoute de la musique, des bruitages, des images — tout se compose ensemble.

Aucun nouveau framework à apprendre pour l'agent.
Juste du HTML.

L'agent l'écrit. Le moteur de rendu capture chaque image en MP4.
C'est déterministe. Des sorties identiques, à chaque fois.

Donne la CLI à ton agent. Dis-lui quoi faire.
Regarde-le construire.

Hyperframes. À toi de jouer.
```

Note : environ 140 mots pour 62 secondes dans la version anglaise — soit 2,3 mots/s, ce qui laisse
de la place aux pauses et à la respiration visuelle. La version française est un peu plus longue :
vérifie toujours la durée réelle après la synthèse vocale.

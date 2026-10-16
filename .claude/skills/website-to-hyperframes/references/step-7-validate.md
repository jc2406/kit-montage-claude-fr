# Étape 7 : Valider et livrer

## Lint + validation

À lancer dans l'ordre. Corrige toutes les erreurs avant de passer à la commande suivante.

```bash
npx hyperframes lint
npx hyperframes validate
```

`lint` vérifie la structure HTML de façon statique — attributs manquants, enregistrement des
timelines, conflits d'animations, conflits entre `transform` CSS et GSAP (y compris dans les styles en ligne).
`validate` charge la composition dans Chrome sans interface et repère les erreurs JS à l'exécution,
les médias manquants et les requêtes réseau en échec.

## Vérification visuelle (snapshot)

Une fois le lint et la validation passés, capture des images pour VOIR ta propre sortie :

```bash
npx hyperframes snapshot <dossier-projet> --at <milieux-des-temps-forts>
```

Si la commande snapshot n'est pas disponible, rabats-toi sur :

```bash
npx tsx packages/cli/src/cli.ts snapshot <dossier-projet> --at <milieux-des-temps-forts>
```

Calcule le milieu de chaque temps fort à partir des timings de STORYBOARD.md. Pour une vidéo de 4
temps forts à 0-5,8 s, 5,8-15,0 s, 15,0-22,5 s, 22,5-25,3 s :

```bash
npx hyperframes snapshot <dossier-projet> --at 2.9,10.4,18.7,23.9
```

Ça rend une image par temps fort au moment où le contenu est le plus visible. Choisis des moments
où le plus de contenu est à l'écran — en général à 60-70 % du temps fort, après les entrées et avant les sorties.

**Regarde attentivement chaque image.** Ne jette pas un coup d'œil rapide. Pour chaque image, vérifie :

**Visibilité :**

- Y a-t-il du contenu visible ? Des images toutes blanches ou toutes noires signifient que les compositions ne se rendent pas.
- Peux-tu lire TOUT le texte ? Du texte blanc sur fond blanc ou clair est invisible. Du texte sombre sur fond sombre aussi. Chaque texte a besoin de contraste avec ce qui est juste derrière lui.
- Les images et les médias s'affichent-ils ? Un espace vide là où une image devrait être signifie un problème de chemin ou un fichier manquant.

**Position et mise en page :**

- Les images de fond remplissent-elles tout le cadre ? Si une image ne couvre que la moitié de l'écran, les valeurs `object-fit`, `width`, `height` ou de position sont fausses.
- Les éléments sont-ils là où le storyboard le dit ? Compare l'image à la description du temps fort.
- Y a-t-il trop d'espace vide / mort ? Si plus de 40 % du cadre est un aplat sans rien dessus, la composition est clairsemée.
- Des éléments se chevauchent-ils mal ? Du texte sur du texte, ou du contenu qui déborde des bords ?

**Qualité visuelle :**

- Les voiles sont-ils trop lourds ? Si une image de fond se voit à peine à travers un voile sombre, baisse l'opacité du voile.
- La hiérarchie visuelle est-elle claire ? Un élément dominant par image, les autres en appui.
- Les couleurs correspondent-elles à DESIGN.md ? Compare les couleurs réellement rendues à ce qui était prévu.

**Vérification code contre rendu :**

- Pour chaque temps fort, vérifie : l'image montre-t-elle les médias référencés dans le HTML ? Si une composition a `<img src="...wave.png">` mais que l'image ne montre aucune vague — l'image ne se charge pas, le chemin est faux, ou elle est cachée derrière un autre élément.
- Si une image ne montre rien à un moment donné, essaie un moment un peu différent (1 ou 2 secondes plus tard). Les compositions peuvent encore être dans leurs animations d'entrée.
- La commande snapshot est rapide — lance-la plusieurs fois à différents moments si besoin.

Si une image a un problème, reviens à l'étape 6 et corrige cette composition avant de continuer.

## Aperçu

```bash
npx hyperframes preview
```

Ouvre le Studio dans un navigateur. Parcours chaque temps fort.

## Créer HANDOFF.md

Écris un `HANDOFF.md` pour la continuité entre sessions :

```markdown
# Passation — [Nom du projet]

**Date :** [aujourd'hui]
**Aperçu :** `npx hyperframes preview`

## Ce qui est construit

| Temps fort | Fichier              | Durée | Statut    | Notes |
| ---------- | -------------------- | ----- | --------- | ----- |
| 1          | beat-1-hook.html     | 5.2s  | Construit | ...   |
| 2          | beat-2-features.html | 6.8s  | Construit | ...   |

## Audio

| Média           | Statut   | Notes                                     |
| --------------- | -------- | ----------------------------------------- |
| narration.wav   | Terminé  | [fournisseur], [nom de la voix], [durée]  |
| transcript.json | Terminé  | [nombre de mots] mots, [durée]            |

## Ce qui reste à faire

- [problèmes connus, demandes de finition, bruitages manquants]

## Commandes

npx hyperframes preview
npx hyperframes lint
npx hyperframes validate
npx hyperframes snapshot <dossier-projet> --at <milieux-des-temps-forts>
npx hyperframes render --output renders/final.mp4
```

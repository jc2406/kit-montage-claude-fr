# Déroulé curiosité et divertissement

Premier test, et le plus prioritaire : « Dans les 3 premières secondes, quelqu'un est-il convaincu
qu'il doit regarder jusqu'à la fin ? » Note le bénéfice, la question et la résolution méritée qui
appuient ce jugement. Un validateur technique ou une comparaison interne ne peut pas établir que de
vrais spectateurs sont convaincus.

Fais passer ce contrôle avant toute note esthétique. Si l'ouverture ne gagne que « c'était joli »
et ne répond pas à « pourquoi je resterais ? », reprends-la avant le rendu final. Documente la
raison éditoriale de valider ou de reprendre ; n'invente jamais un pourcentage de spectateurs
convaincus. Revérifie sur l'export encodé.

## Avant la composition

1. Lis la parole exacte conservée. Formule la leçon utile que le spectateur reçoit à la fin.
   Garde les nuances et ne fabrique pas d'affirmation pour une accroche.
2. Choisis un état non résolu que le spectateur comprend tout de suite. Exemples : trois
   emplacements vides autour d'un modèle d'IA ; un projet avec un accès manquant ; deux pièces
   qui semblent incompatibles. Rends l'information manquante précise.
3. Cartographie la mise en place, la réponse partielle, le rappel et la résolution. Utilise une
   question principale avec de courtes questions secondaires, plutôt que beaucoup de mystères sans lien.
4. Écris trois ouvertures différentes : le problème d'abord, un aperçu du résultat, ou la
   reconnaissance d'abord. Chacune doit mener naturellement à la même narration source. Rends leurs
   trois premières secondes à moindre coût, compare et note le choix.
5. Construis tout le montage brut en mouvement. Utilise des formes simples et les médias existants.
   Juge l'histoire avant les ombres. Ne recoupe la parole que si nécessaire et en gardant son sens ;
   reconstruis tous les fichiers qui dépendent du timing après tout changement d'EDL.

## Registre des boucles

Enregistre OPEN-LOOPS.json sous forme de tableau. Chaque élément contient :

```json
{
  "id": "main",
  "question": "Qu'est-ce qui remplit les trois emplacements vides ?",
  "object": "Trois emplacements vides numérotés autour du modèle",
  "setup": 2.3,
  "updates": [{"time": 5.1, "state": "Le premier emplacement devient la spécification"}],
  "closure": 38.4,
  "resolution": "Les trois couches nommées s'assemblent autour du même modèle",
  "supportingSpeech": "tout un système autour de Claude"
}
```

Les temps sont en secondes de sortie. Un vérificateur peut contrôler l'ordre, la couverture et les
ancres dans la source ; seule l'inspection du rendu établit si la question est claire.
Un objet qui revient sans rien résoudre est un rappel, pas une boucle fermée.
Ajoute un objet `opening` avec `benefit`, `evidenceBy3` et `payoffTime` pour que le test le plus
prioritaire ait une preuve concrète. Garde `supportingSpeech` mot pour mot quand tu cites ;
signale toute explication reformulée comme une paraphrase.

## Diriger chaque séquence

- Attente : que pense le spectateur qu'il va se passer ensuite ?
- Développement : qu'est-ce qui change sa compréhension ou donne une réponse partielle ?
- Résolution : quel résultat, contraste ou lien arrive ?
- Attention : quelle chose unique son œil doit-il suivre ?
- Rythme : où la densité augmente-t-elle, se relâche brièvement, puis se résout ?
- Son : quel son anticipe, marque le contact ou relâche ? Quelles coupes restent silencieuses ?

Ne force pas de suspense dans une explication simple. Ne cache pas le sujet, n'invente pas d'échec
et n'ajoute pas un vague « attendez la suite ». Un modèle éditorial volontairement incomplet ne
doit pas être présenté comme un vrai échec ou un vrai résultat de produit.
Montrer toutes les réponses sur la première carte ferme trop tôt une boucle fondée sur une liste.

## Revue

Aux étapes brute et finale, fais une revue du mouvement continu et du vrai son quand l'outil
permet de les percevoir. Note la modalité réelle. Quand seules des images fixes, des bandes et une
analyse du signal sont disponibles, utilise-les honnêtement : inspecte des échantillons
chronologiques toutes les 0,25 à 0,5 seconde plus des bandes d'action continues, contrôle chaque
état de boucle, et n'appelle pas une lecture automatique réussie une passe d'écoute ou de visionnage.

Écris les faiblesses et les décisions horodatées dans ENTERTAINMENT-REVIEW.md. Compare les plans
voisins sans leurs titres ; retire les images génériques et les titres répétés qui n'apportent
aucune information. Distingue les mesures d'audience du jugement éditorial. Si l'utilisateur
fournit un jour des données de rétention, relie les décrochages aux moments exacts du montage sans
supposer que le montage en est la cause.

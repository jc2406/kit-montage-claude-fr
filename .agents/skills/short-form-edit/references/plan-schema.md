# Schéma du plan modifiable

Garde une seule table de correspondance de référence. Les secondes sont sur la timeline montée,
sauf pour les champs préfixés par `source`. Cale les coupes et les limites de scènes sur `1/fps` ;
garde le timing précis des mots issu de la transcription automatique au lieu d'arrondir chaque mot
séparément.

`assets/plan.json` :

```json
{
  "duration": 10,
  "fps": 30,
  "scenes": [{"id":"s00","start":0,"end":10,"layout":"face","kind":"hook","anchor":"Trois premiers mots","anchorTime":0.1}],
  "events": [{"time":0,"type":"paper-tap","visual":"s00","anchor":"Trois premiers mots"}],
  "captions": [{"start":0.1,"end":0.8,"words":[{"text":"Trois","start":0.1,"end":0.3,"sourceStart":1.1,"sourceEnd":1.3}]}]
}
```

Les mises en page sont `face`, `split`, `paper`, `broll` et `broll-split`. Dans ce schéma, le
`kind` d'une scène de B-roll désigne `assets/<kind>.mp4`. Les `events` sont de vraies actions
visuelles qui ont un sens, jamais des entrées de remplissage ajoutées seulement pour respecter une
cadence. Les plans plus longs peuvent porter un `holdReason` sur leur scène et doivent être
justifiés éditorialement.

`assets/transcript.json` contient `words` avec les mêmes champs text/start/end/sourceStart/sourceEnd
et `text`. `assets/edit-decisions.json` contient `duration`, `fps`, `keeps` avec
`{sourceStart,sourceEnd,start,end}`, et les raisons des suppressions validées.
Chaque mot conservé doit correspondre à une seule plage gardée sans traverser un intervalle
supprimé. `sourceStart` ne peut manquer que si aucun montage n'a été fait ; adapte explicitement la
validation à ce cas plutôt que de deviner une correspondance.

## Compagnon créatif

Garde le raisonnement créatif dans DESIGN.md, à côté de la table technique. Il doit nommer :

- Le public, les formats demandés, la direction visuelle choisie et la présélection de médias.
- Trois concepts d'ouverture distincts et les chemins de leurs aperçus bruts ; pour le concept
  retenu : le bénéfice, la question du spectateur, la preuve visible à trois secondes et la résolution.
- Les plages des séquences avec l'attente, le développement, la conséquence, la cible d'attention,
  le rythme et la justification de la source. Regroupe les plans liés ; évite une prose image par image redondante.
- OPEN-LOOPS.json selon le schéma de curiosity-and-entertainment.md. Résous chaque réponse promise
  avant l'appel à l'action ; vérifie la fermeture dans la séquence rendue.
- Les constats horodatés d'ENTERTAINMENT-REVIEW.md et les révisions avant la finition.

Le validateur du plan vérifie le timing et la couverture. Il ne valide pas ces documents créatifs
et ne certifie pas l'engagement ; confronte leurs affirmations aux images rendues.

## Registre des plans

Pour les projets avec du B-roll, `assets/footage-ledger.json` est un tableau de lignes :

```json
[{"scene":"s02","sourceSceneId":"ouverture-portefeuille","asset":"assets/wallet.mp4",
"sha256":"<64 caractères hexadécimaux en minuscules>","sourceStart":0.5,"sourceEnd":1.5,
"framing":{"9x16":"Source entière contenue ; mains et portefeuille visibles",
"16x9":"Source entière contenue ; sous-titres hors de l'action"}}]
```

Les intervalles se réfèrent à ce fichier local exact, avant tout réglage de vitesse de lecture.
Note séparément la provenance d'origine des extraits téléchargés. L'identité de la scène survit
aux changements de recadrage, d'étalonnage, de vitesse, de sens et de transcodage. Chaque scène
apparaît une fois par reel ; la même sélection peut servir dans les deux formats demandés.
`validate-footage.mjs` vérifie les lignes sélectionnées, les empreintes des fichiers, les identités
de scène en double et les intervalles qui se chevauchent. La revue visuelle doit quand même établir
que l'action et le résultat restent visibles et que des doublons encodés différemment n'ont pas
échappé au registre des identités de source.

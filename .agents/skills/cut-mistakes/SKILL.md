---
name: cut-mistakes
description: "Agent 2 de la chaîne de montage vidéo. Trouve et retire les erreurs à l'oral — bégaiements, mots répétés, faux départs et reprises (phrases réenregistrées) — d'un enregistrement face caméra. À utiliser après cut-silences, quand on demande de couper les erreurs, enlever les bégaiements / répétitions / redémarrages, nettoyer les ratés ou garder la meilleure prise. Fonctionne avec validation : propose chaque coupe avec son contexte et une raison, puis ne rend que les coupes validées avec ffmpeg. Demande une transcription mot à mot."
---

# Couper les erreurs et les répétitions (agent 2 de la chaîne)

Deuxième étape du montage automatique, lancée après **cut-silences**. Elle retire ce qu'un monteur
coupe à la deuxième passe : les bégaiements (« le le », « je- je- »), les mots répétés à la suite,
les faux départs (une phrase abandonnée qui redémarre) et les reprises (une phrase réenregistrée :
garder la prise propre, jeter la ratée).

Décider ce qui est une erreur relève du **jugement, pas d'une formule** : une répétition pour
insister (« jamais, jamais ») ou un redoublement rhétorique (« le premier point, c'est, c'est
ceci… ») ressemblent mécaniquement à un bégaiement. Cet agent fonctionne donc **avec validation par
défaut** : il fait remonter les candidats avec tout leur contexte ; l'agent (et l'utilisateur)
décident ; seules les coupes validées sont rendues.

## Quand l'utiliser

- « coupe les erreurs », « enlève les bégaiements / répétitions », « nettoie les ratés », « garde la meilleure prise », « coupe les faux départs »
- Comme deuxième étape du montage complet, sur la sortie de cut-silences.

## Le déroulé en trois parties

### 1. Trouver les candidats (mécanique)

```bash
node .agents/skills/cut-mistakes/scripts/find-cut-candidates.mjs \
  <silence-transcript.json> --out-dir video-projects/<slug>/assets
```

L'entrée est normalement le `<stem>.silence-transcript.json` de l'agent 1, pour que les coupes
tombent sur la timeline déjà débarrassée des silences. Écrit :

- `<stem>.cut-candidates.json` — candidats structurés (type, confiance, plage `cut` proposée, texte `removes`/`keeps`, contexte, recommandation)
- `<stem>.cut-candidates.md` — proposition lisible

Types de candidats : `stutter` (bégaiement : répétition immédiate d'un mot), `retake` (reprise :
segment en double ou presque, par similarité de Jaccard), `false_start` (faux départ : courte phrase
abandonnée qui redémarre).

Version française : le détecteur garde les lettres accentuées et ignore les mots vides français
(« le », « de », « que », « euh »…) pour comparer les segments.

### 2. Examiner (l'étape de validation — OBLIGATOIRE)

Lis chaque candidat **dans son contexte** et décide de garder ou couper. Le détecteur mécanique ne
distingue pas une insistance volontaire ou un effet rhétorique d'un vrai raté : ne te fie donc pas
aveuglément à `recommend` — lis `removes` et `context`. Faux positifs courants : répétition pour
insister (« ce n'est jamais, jamais automatique »), verbe puis question (« le point, c'est, c'est
quoi… »), énumérations.

Présente les candidats à l'utilisateur avec une recommandation pour chacun ; recueille les
validations. Écris les coupes validées dans un fichier :

```json
{ "cuts": [ { "start": 100.93, "end": 101.06, "reason": "faux départ « je- »" }, ... ] }
```

(`start`/`end` en secondes sur la timeline de la transcription / vidéo d'entrée. Tu peux élargir
la plage d'un candidat — par exemple pour une reprise, couper du début de la prise ratée jusqu'au
redémarrage propre.)

### 3. Appliquer les coupes validées

```bash
node .agents/skills/cut-mistakes/scripts/apply-cuts.mjs \
  <silence-transcript.json> --cuts approved-cuts.json \
  --video video-projects/<slug>/assets/edited-silenced.mp4 \
  --output video-projects/<slug>/assets/edited-clean.mp4 --apply
```

Écrit l'EDL, une transcription recalée `<stem>.mistakes-transcript.json` (qui alimente l'agent de
motion graphics + `validate-beat-sync.mjs`), un journal des décisions et — avec `--apply` — la
vidéo coupée (ffmpeg trim+concat, image et son synchronisés). Retire `--apply` pour un essai à blanc.

## Vérifier le résultat

Utilise l'outil de revue partagé pour regarder les coupes et contrôler les raccords :

```bash
node scripts/build-edl-review.mjs <stem>.mistakes-edl.json \
  --original video-projects/<slug>/assets/edited-silenced.mp4 \
  --edited   video-projects/<slug>/assets/edited-clean.mp4 \
  --output   video-projects/<slug>/assets/mistakes-review.html
npx serve . -p 8080 -n
```

## Notes

- Une diction très propre peut donner peu ou aucune vraie coupe : c'est un résultat valide ; ne coupe pas une parole naturelle pour atteindre un quota.
- Une coupe entre deux mots prononcés est un raccord franc. C'est en général propre pour les bégaiements et faux départs ; pour un son plus serré, on peut ajouter plus tard un fondu de 20 à 30 ms.
- Transmets `mistakes-transcript.json` et la vidéo nettoyée à l'**agent 3 (motion graphics / cartes)**.

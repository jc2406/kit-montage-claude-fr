---
name: cut-silences
description: Agent 1 de la chaîne de montage vidéo. Supprime les silences et les blancs d'un enregistrement face caméra. À utiliser quand on demande de couper les silences, raccourcir les pauses, enlever les blancs ou resserrer le rythme d'une vidéo brute, à partir d'une transcription mot à mot. Produit une liste de montage (EDL), une transcription recalée pour les agents suivants et, en option, la vidéo coupée avec ffmpeg. Ne coupe PAS les erreurs, répétitions ou faux départs — c'est le rôle de l'agent cut-mistakes.
---

# Couper les silences (agent 1 de la chaîne)

Première étape du montage automatique. Prend un enregistrement brut et sa transcription mot à mot,
et retire **uniquement les silences** : les blancs avant le premier mot et après le dernier, plus
les pauses entre les mots plus longues qu'un seuil (réduites à une respiration naturelle, jamais à
zéro). Les mots de l'orateur ne sont pas touchés : faux départs, reprises et bégaiements sont le
travail de l'agent **cut-mistakes** (agent 2).

Cet agent est déterministe et piloté par la transcription : sa sortie (`*.silence-transcript.json`)
alimente proprement les agents suivants et le validateur de synchro des temps forts.

## Quand l'utiliser

- « coupe les silences », « raccourcis les pauses », « enlève les blancs », « resserre le rythme »
- Comme première étape du montage complet, juste après la transcription.

## Prérequis

Une transcription JSON mot à mot. Soit au format ElevenLabs Scribe
(`{ words: [{ text, start, end, type }], audio_duration_secs }`), soit au format générique
`{ words: [{ text, start, end }] }`. Pour en générer une avec l'outil de transcription du kit :

```bash
node scripts/transcribe-elevenlabs.mjs chemin/vers/raw.mp4    # -> chemin/vers/raw.json
```

## Utilisation

```bash
# 1) Planifier seulement — calcule la coupe, écrit l'EDL + la transcription recalée (vidéo intacte)
node .claude/skills/cut-silences/scripts/cut-silences.mjs <transcript.json> \
  --out-dir video-projects/<slug>/assets

# 2) Avec une vidéo — écrit aussi la commande ffmpeg (toujours sans rendu)
node .claude/skills/cut-silences/scripts/cut-silences.mjs <transcript.json> \
  --video video-projects/<slug>/assets/raw.mp4 --out-dir video-projects/<slug>/assets

# 3) Rendre la vidéo coupée (ffmpeg en local, réencodage, image et son synchronisés)
#    ajouter --apply pour lancer vraiment ffmpeg
node .claude/skills/cut-silences/scripts/cut-silences.mjs <transcript.json> \
  --video video-projects/<slug>/assets/raw.mp4 --apply \
  --output video-projects/<slug>/assets/edited-silenced.mp4
```

### Options

| Option | Par défaut | Signification |
| --- | --- | --- |
| `--video <chemin>` | — | Vidéo source ; active la commande ffmpeg / le rendu |
| `--out-dir <dossier>` | à côté de la transcription | Où les sorties sont écrites |
| `--output <chemin>` | `<video-stem>.silenced.mp4` | Chemin de la vidéo coupée |
| `--gap <s>` | `0.55` | Pause minimale traitée comme un silence à réduire |
| `--head-pad <s>` | `0.22` | Silence gardé avant le premier mot |
| `--tail-pad <s>` | `0.34` | Silence gardé après le dernier mot |
| `--apply` | désactivé | Lancer vraiment ffmpeg pour rendre la coupe |

## Comment il décide (les règles de silence)

- Les pauses sous `--gap` (0,55 s) ne sont pas touchées : c'est le rythme naturel de la parole.
- Pour une pause réduite, **une respiration naturelle est gardée**, selon le contexte : `0,24 s` pour les longues pauses (≥ 2 s), `0,20 s` après une fin de phrase (`. ! ?`), `0,14 s` sinon. La respiration gardée est placée un peu plus du côté de la fin de la phrase précédente.
- Les blancs du début et de la fin sont réduits à `--head-pad` / `--tail-pad`.
- Les plages à supprimer sont fusionnées ; les plages gardées en sont le complément. La coupe est rendue avec un graphe de filtres ffmpeg `trim`/`atrim` + `concat` (écrit dans un script `*.silence-filter.txt` et passé via `-/filter_complex`), pour que l'image et le son restent synchronisés.

## Sorties (écrites dans `--out-dir`)

| Fichier | Rôle |
| --- | --- |
| `<stem>.silence-edl.json` | Plages gardées/supprimées, durées, paramètres — la liste de montage |
| `<stem>.silence-transcript.json` | Mots recalés sur la timeline montée (alimente l'agent 2 + les temps forts) |
| `<stem>.silence-decisions.md` | Résumé lisible + plus grandes pauses réduites |
| `<stem>.silence-filter.txt` | Le graphe de filtres ffmpeg (seulement avec `--video`) |
| `<video-stem>.silenced.mp4` | La vidéo coupée (seulement avec `--apply`) |

Le résumé JSON affiché sur la sortie standard contient `removed`, `removedPct`, le nombre de plages
et les chemins de sortie — utile pour que le montage complet les note et les enchaîne.

## Notes de réglage

- La valeur par défaut pour un face caméra YouTube (`--gap 0.55`) retire environ 15 à 20 % d'une prise brute typique en silence pur. Baissez `--gap` pour un montage plus nerveux et rapide ; montez-le pour garder plus de respiration naturelle.
- En français, le débit est souvent un peu plus rapide et les liaisons plus serrées : vérifiez à l'oreille que les fins de mots ne sont pas mangées, surtout avant une voyelle.
- Si une coupe paraît trop agressive aux fins de phrase, augmentez la respiration de fin de phrase ou `--gap`.

## Passage à l'agent suivant

Transmettez `<stem>.silence-transcript.json` (et `silenced.mp4` s'il a été rendu) à l'agent
**cut-mistakes**. Comme les horodatages sont déjà sur la timeline montée, le timing des temps forts
et `scripts/validate-beat-sync.mjs` fonctionnent sans autre ajustement.

# Étape 5 : Générer la voix off + caler le timing

## Essayer des voix

N'utilise jamais la première voix trouvée. Essaie 2 ou 3 voix avec la première phrase de SCRIPT.md :

- **Kokoro** (à essayer d'abord — gratuit, sans clé API) — `npx hyperframes tts SCRIPT.md --voice af_nova --output narration.wav`. Tourne en local sur le processeur. Demande Python 3.10+ (le Python 3.9 du système macOS ne marche pas — en cas d'erreur onnxruntime, passe à l'option suivante). Attention : les voix Kokoro sont anglophones ; pour une narration en français, préfère ElevenLabs ou HeyGen.
- **ElevenLabs** (meilleure qualité de voix, choix le plus large, voix françaises et clonage) — `mcp__elevenlabs__search_voices` pour parcourir, `mcp__elevenlabs__text_to_speech` pour générer. Ne renvoie pas d'horodatages — transcris séparément ensuite.
- **Synthèse vocale HeyGen** (renvoie automatiquement les horodatages des mots — évite une étape de transcription) — `mcp__claude_ai_HeyGen__text_to_speech`. À utiliser quand tu veux les horodatages sans passe de transcription séparée.

Ces noms d'outils MCP dépendent des connecteurs installés : vérifie d'abord lesquels sont
disponibles. Choisis la voix qui sonne la plus naturelle et conversationnelle. Écoute le rythme —
respire-t-elle entre les phrases ? Sonne-t-elle comme une personne ou un robot ?

## Générer la narration complète

Génère tout le script en `narration.wav` (ou `.mp3`) dans le dossier du projet.

## Transcrire pour obtenir les horodatages par mot

```bash
npx hyperframes transcribe narration.wav
```

Produit `transcript.json` avec `[{ text, start, end }]` pour chaque mot. Ces horodatages font foi
pour toutes les durées des temps forts. Pour une narration en français, vérifie que le modèle de
transcription choisi gère le français (pas un modèle `.en`), ou utilise ElevenLabs Scribe.

## Associer les horodatages aux temps forts

Parcours STORYBOARD.md temps fort par temps fort. Pour chacun :

1. Trouve le premier mot de la phrase de voix off de ce temps fort dans `transcript.json`
2. Trouve le dernier mot de cette phrase
3. Fixe `beat.start = firstWord.start`, `beat.end = lastWord.end`
4. Ajoute 0,3 à 0,5 s de marge à la fin pour laisser respirer l'image

Mets à jour STORYBOARD.md avec les vraies durées. Remplace les temps estimés (par ex. « 0:00-0:05 »)
par les horodatages réels (par ex. « 0.00-3.21s »).

Les limites des temps forts tombent sur les débuts de mots — des coupes franches sur la voix off.

## Mettre à jour index.html

Mets à jour le `data-start` et le `data-duration` de chaque emplacement de scène pour qu'ils
correspondent aux vrais timings tirés de la transcription. Mets aussi à jour la durée totale de la
composition et la durée de l'élément audio.

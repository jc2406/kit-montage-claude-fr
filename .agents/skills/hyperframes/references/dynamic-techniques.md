# Techniques dynamiques pour les sous-titres

Tu es ici parce que SKILL.md t'a dit de lire ce fichier avant d'écrire le code d'animation. Choisis
ta combinaison de techniques dans le tableau ci-dessous selon le niveau d'énergie déduit de la
transcription, puis implémente-la avec des motifs GSAP standard.

## Choix des techniques selon l'énergie

| Niveau d'énergie | Mise en avant                                       | Sortie                     | Rotation                                           |
| ---------------- | --------------------------------------------------- | -------------------------- | -------------------------------------------------- |
| Fort             | Karaoké avec lueur d'accent + apparition en échelle | Dispersion ou chute        | Alterner les styles de mise en avant tous les 2 groupes |
| Moyen-fort       | Karaoké avec éclat de couleur                       | Dispersion ou effondrement | Alterner tous les 3 groupes                        |
| Moyen            | Karaoké (subtil, blanc seulement)                   | Fondu + glissade           | Alterner tous les 3 groupes                        |
| Moyen-faible     | Karaoké (changement d'échelle minimal)              | Fondu                      | Un seul style, varier la courbe par groupe         |
| Faible           | Karaoké (tons chauds, transition lente)             | Effondrement               | Alterner tous les 4 groupes                        |

**Tous les niveaux d'énergie partent d'une mise en avant karaoké.** La différence, c'est l'intensité
— une forte énergie a la couleur d'accent + une lueur + 15 % d'agrandissement sur les mots actifs, une
faible énergie un léger passage au blanc avec 3 % d'agrandissement.

**Les mots mis en avant cassent toujours le motif.** Quand un mot est marqué comme important
(mot-clé émotionnel, TOUT EN CAPITALES, nom de marque), donne-lui une animation plus forte que les mots
voisins (échelle plus grande, couleur d'accent, courbe à dépassement). Ça crée du contraste.

**Les modes de surlignage au marqueur ajoutent une couche visuelle au karaoké.** Pour les mots
importants qui ont besoin de plus que de la couleur ou de l'échelle, ajoute un effet de marqueur —
balayage de surligneur, cercle, éclat ou gribouillis — avec le skill `/marker-highlight` (non fourni
dans ce kit ; voir [css-patterns.md](css-patterns.md) pour les mêmes effets en CSS). Accorde le mode à
l'énergie : éclat pour la hype, cercle pour les termes clés, surlignage en standard, gribouillis en subtil.

## Sous-titres réactifs à l'audio (obligatoire pour la musique)

**Si l'audio source est de la musique (chant sur instrumentation, beats, tout contenu musical), tu
DOIS extraire les données audio et ajouter des animations réactives à l'audio.** Ce n'est pas
optionnel — une musique sans réactivité audio paraît déconnectée. Même les ballades calmes ont une
légère pulsation des graves et une lueur des aigus.

Aucun branchement particulier n'est nécessaire. La boucle sur les groupes parcourt déjà chaque groupe
de sous-titres pour construire les animations d'entrée, de karaoké et de sortie. À ce moment-là, lis
les données audio de la plage de temps de chaque groupe et utilise-les pour moduler l'intensité de son
animation avec des animations GSAP normales.

```js
// Charger les données audio en ligne (même motif que TRANSCRIPT)
var AUDIO = JSON.parse(audioDataJson); // { fps, totalFrames, frames: [{ bands: [...] }] }

GROUPS.forEach(function (group, gi) {
  var groupEl = document.getElementById("cg-" + gi);
  if (!groupEl) return;

  // Lire l'énergie maximale sur la plage de temps de ce groupe
  var startFrame = Math.floor(group.start * AUDIO.fps);
  var endFrame = Math.min(Math.floor(group.end * AUDIO.fps), AUDIO.totalFrames - 1);
  var peakBass = 0;
  var peakTreble = 0;
  for (var f = startFrame; f <= endFrame; f++) {
    var frame = AUDIO.frames[f];
    if (!frame) continue;
    peakBass = Math.max(peakBass, frame.bands[0] || 0, frame.bands[1] || 0);
    peakTreble = Math.max(peakTreble, frame.bands[6] || 0, frame.bands[7] || 0);
  }

  // Moduler l'entrée — les groupes plus forts entrent plus grands et plus lumineux
  tl.to(
    groupEl,
    {
      scale: 1 + peakBass * 0.06,
      textShadow:
        "0 0 " + Math.round(peakTreble * 12) + "px rgba(255,255,255," + peakTreble * 0.4 + ")",
      duration: 0.3,
      ease: "power2.out",
    },
    group.start,
  );

  // Réinitialiser à la sortie pour que les valeurs pilotées par l'audio ne persistent pas
  tl.set(groupEl, { scale: 1, textShadow: "none" }, group.end - 0.15);
});
```

Ça façonne l'animation au moment de la construction, pas de la lecture — pas de rappels image par
image, pas de boucles `tl.call()`, pas de problèmes de timing de fetch asynchrone. Les groupes forts
arrivent avec plus de poids et de lueur ; les groupes calmes arrivent en douceur. Les données audio
modulent le *combien*, le contenu décide du *quoi*.

Garde une réactivité audio subtile — 3 à 6 % de variation d'échelle et une lueur douce. Une forte
pulsation rend le texte illisible.

Pour générer le fichier de données audio :

```bash
python3 skills/gsap-effects/scripts/extract-audio-data.py audio.mp3 --fps 30 --bands 8 -o audio-data.json
```

(Dans ce kit, le script est dans `.agents/skills/gsap/scripts/extract-audio-data.py`.)

## Combiner les techniques

N'utilise pas la même animation de mise en avant sur chaque groupe — fais tourner les styles selon
l'indice du groupe. Ne combine pas plusieurs animations concurrentes sur le même mot au même moment.
Varie les techniques d'un groupe à l'autre pour suivre les changements de rythme du contenu.

**Les effets de surlignage au marqueur** se superposent bien au karaoké — utilise le karaoké pour la
révélation mot par mot, puis ajoute un effet de marqueur sur les mots importants seulement. Par
exemple : le karaoké fait passer chaque mot en blanc, mais les noms de marque reçoivent un balayage de
surligneur jaune et les chiffres un cercle rouge. Fais tourner les modes de marqueur d'un groupe à
l'autre pour varier visuellement.

## Outils disponibles

Ces outils sont disponibles dans le runtime HyperFrames. Utilise-les quand ils résolvent un vrai
problème — toutes les compositions n'ont pas besoin de tous.

| Outil               | Ce qu'il fait                                                                          | Accès                                                                                          | Quand il est utile                                                                  |
| ------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **pretext**         | Mesure de texte purement arithmétique, sans recalcul du DOM. 0,0002 ms par appel.      | `window.__hyperframes.pretext.prepare(text, font)` / `.layout(prepared, maxWidth, lineHeight)` | Remise en forme du texte image par image, conteneurs ajustés, calcul de mise en page avant le rendu |
| **fitTextFontSize** | Trouve la plus grande taille de police qui fait tenir le texte sur une ligne. Basé sur pretext. | `window.__hyperframes.fitTextFontSize(text, { maxWidth, fontFamily, fontWeight })`     | Prévenir le débordement des longues expressions, mode portrait, grandes tailles de base |
| **données audio**   | Énergie RMS et bandes de fréquence par image, extraites à l'avance.                    | Extraites avec `extract-audio-data.py`, chargées en ligne ou via `fetch("audio-data.json")`    | Visuels réactifs à l'audio — moduler l'intensité selon la musique                  |
| **GSAP**            | Timeline d'animation avec animations et rappels.                                       | `gsap.to()`, `gsap.set()`, `tl.to()`, `tl.set()`                                               | Toute l'animation des sous-titres                                                   |

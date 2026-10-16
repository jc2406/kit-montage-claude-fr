# Animation réactive à l'audio

Piloter les visuels avec la musique, la voix ou le son. Toute propriété animable par GSAP peut
réagir à des données audio extraites à l'avance.

## Format des données audio

```js
var AUDIO_DATA = {
  fps: 30,
  totalFrames: 900,
  frames: [{ bands: [0.82, 0.45, 0.31, ...] }, ...]
};
```

- `frames[i].bands[]` — amplitudes des bandes de fréquence, de 0 à 1. Indice 0 = graves, plus haut = aigus.
- Chaque bande est normalisée séparément sur toute la piste.

## Associer l'audio aux visuels

| Signal audio             | Propriété visuelle                | Effet                                  |
| ------------------------ | --------------------------------- | -------------------------------------- |
| Graves (bands[0])        | `scale`                           | Pulsation sur le beat                  |
| Aigus (bands[12-14])     | `textShadow`, `boxShadow`         | Intensité de la lueur                  |
| Amplitude globale        | `opacity`, `y`, `backgroundColor` | Respiration, élévation, changement de couleur |
| Médiums (bands[4-8])     | `borderRadius`, `width`           | Transformation de forme                |

Toute propriété animable par GSAP fonctionne — `clipPath`, `filter`, attributs SVG, propriétés personnalisées CSS.

## Le contenu, pas le support

L'audio fournit le **timing et l'intensité**. Le vocabulaire visuel vient du récit.

**N'ajoute jamais :** barres d'égaliseur, analyseurs de spectre, affichages de forme d'onde, notes de
musique en clipart, systèmes de particules génériques, cycles de couleurs arc-en-ciel, flashs blancs
stroboscopiques sur les beats, orbes abstraits qui pulsent.

**À la place :** laisse le contenu guider le visuel et l'audio piloter son comportement. Les graves
font *gonfler* la chaleur. Les aigus aiguisent le *contraste*. Le choix visuel vient de « quelle
sensation donne ce morceau ? »

## Motif d'échantillonnage

La réactivité audio demande un échantillonnage image par image via une boucle `for` avec `tl.call()`, pas une seule animation :

```js
// ✅ Correct — échantillonner chaque image
for (var f = 0; f < AUDIO_DATA.totalFrames; f++) {
  tl.call(
    (function (frame) {
      return function () {
        draw(frame);
      };
    })(AUDIO_DATA.frames[f]),
    [],
    f / AUDIO_DATA.fps,
  );
}

// ❌ Faux — une seule animation, qui ne réagit pas à l'audio
gsap.to(".el", { scale: 1.2, duration: totalDuration });
```

Sans échantillonnage image par image, la composition ne réagit pas vraiment à l'audio.

## Piège de textShadow

Un `textShadow` sur un conteneur parent dont les enfants sont semi-transparents (par ex. des mots de
sous-titres inactifs à `rgba(255,255,255,0.3)`) rend un rectangle de lueur visible derrière tous les
enfants. Correction : applique `scale` au conteneur pour la pulsation sur le beat, mais applique
`textShadow` seulement aux mots actifs, un par un.

## Repères

- **Subtilité pour le texte** — 3 à 6 % de variation d'échelle, lueur douce. Une forte pulsation rend le texte illisible.
- **Plus fort pour le reste** — les fonds et les formes supportent des variations de 10 à 30 %.
- **Accorde l'énergie** — corporate = subtil ; clip musical = spectaculaire.
- **Déterministe** — données extraites à l'avance, pas de Web Audio API, pas d'analyse à l'exécution.

## Contraintes

- Toutes les données audio doivent être extraites à l'avance (utilise `extract-audio-data.py` dans le dossier scripts/ du skill gsap)
- Pas de `Math.random()` ni de `Date.now()`
- La réactivité audio tourne sur la même timeline GSAP que tout le reste

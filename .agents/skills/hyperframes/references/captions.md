# Sous-titres

## Règle de langue (non négociable)

**N'utilise jamais un modèle `.en` sauf si l'utilisateur dit explicitement que l'audio est en anglais.**
Les modèles `.en` TRADUISENT un audio non anglais en anglais au lieu de le transcrire.

1. L'utilisateur indique la langue → `--model small --language <code>` (sans `.en`) — pour le français : `--language fr`
2. L'utilisateur dit anglais → `--model small.en`
3. Langue inconnue → `--model small` (sans `.en`, sans `--language`) — détection automatique

---

Analyse le contenu parlé pour choisir le style des sous-titres. Si l'utilisateur précise un style,
utilise-le. Sinon, déduis le ton de la transcription.

## Source de la transcription

```json
[
  { "text": "Bonjour", "start": 0.0, "end": 0.5 },
  { "text": "à tous.", "start": 0.6, "end": 1.2 }
]
```

Pour les commandes de transcription, les modèles Whisper et les API externes, voir [transcript-guide.md](transcript-guide.md).

## Détection du style (quand aucun style n'est précisé)

Lis toute la transcription avant de choisir. Quatre dimensions :

**1. Sensation visuelle** — corporate → épuré ; énergique → audacieux ; récit → élégant ; technique → précis ; réseaux sociaux → ludique.

**2. Palette** — sombre + vif pour l'énergie ; sourd pour le professionnel ; fort contraste pour la clarté ; une seule couleur d'accent.

**3. Ambiance de la police** — épaisse/condensée pour l'impact ; sans propre pour le moderne ; arrondie pour l'amical ; serif pour l'élégance.

**4. Caractère de l'animation** — apparition en échelle pour le percutant ; fondu doux pour le calme ; mot par mot pour l'insistance ; machine à écrire pour le technique.

## Style par mot

Repère les mots qui méritent un traitement distinct :

- **Noms de marque/produit** — plus grands, couleur unique
- **TOUT EN CAPITALES** — agrandissement, flash, couleur d'accent
- **Nombres/statistiques** — graisse épaisse, couleur d'accent
- **Mots-clés émotionnels** — animation exagérée (dépassement, rebond)
- **Appel à l'action** — surlignage, soulignement, éclat de couleur
- **Surlignage au marqueur** — pour une insistance au-delà de la couleur, voir [css-patterns.md](css-patterns.md)

## Correspondance script → style

| Ton           | Ambiance de police            | Animation                                   | Couleur                         | Taille   |
| ------------- | ----------------------------- | ------------------------------------------- | ------------------------------- | -------- |
| Hype/lancement | Épaisse condensée, 800-900   | Apparition en échelle, back.out(1.7), 0,1-0,2 s | Vif sur sombre              | 72-96 px |
| Corporate     | Sans propre, 600-700          | Fondu+glissade, power3.out, 0,3 s           | Blanc/neutre, accent sourd      | 56-72 px |
| Tutoriel      | Mono/sans propre, 500-600     | Machine à écrire/fondu, 0,4-0,5 s           | Fort contraste, minimal         | 48-64 px |
| Récit         | Serif/élégante, 400-500       | Fondu lent, power2.out, 0,5-0,6 s           | Tons chauds et sourds           | 44-56 px |
| Réseaux sociaux | Sans arrondie, 700-800      | Rebond, elastic.out, mot par mot            | Ludique, pastilles colorées     | 56-80 px |

## Regroupement des mots

- **Forte énergie :** 2 ou 3 mots. Renouvellement rapide.
- **Conversationnel :** 3 à 5 mots. Groupes naturels.
- **Posé/calme :** 4 à 6 mots. Groupes plus longs.

Coupe aux fins de phrase, aux pauses de 150 ms et plus, ou au nombre de mots maximal. En français,
évite de finir un groupe sur un article ou une préposition (« le », « de », « pour ») : rattache-le au mot suivant.

## Placement

- **Paysage (1920x1080) :** en bas, à 80-120 px du bord, centré
- **Portrait (1080x1920) :** au milieu bas, à environ 600-700 px du bas, centré
- Ne couvre jamais le visage du sujet
- `position: absolute` — jamais relative
- Un seul groupe de sous-titres visible à la fois

## Prévenir le débordement de texte

Utilise `window.__hyperframes.fitTextFontSize()` :

```js
var result = window.__hyperframes.fitTextFontSize(group.text.toUpperCase(), {
  fontFamily: "Outfit",
  fontWeight: 900,
  maxWidth: 1600,
});
el.style.fontSize = result.fontSize + "px";
```

Options : `maxWidth` (1600 en paysage, 900 en portrait), `baseFontSize` (78), `minFontSize` (42), `fontWeight`, `fontFamily`, `step` (2).

Filets de sécurité CSS : `max-width` sur le conteneur, `overflow: visible` (**pas** `hidden` —
hidden coupe les mots agrandis pour l'insistance et les effets de lueur), `position: absolute`,
`height` explicite. Quand le style par mot utilise `scale > 1.0`, calcule
`maxWidth = safeWidth / maxScale` pour garder de la marge.

**Motif de conteneur :** un conteneur absolu pleine largeur, centré. N'utilise **pas**
`left: 50%; transform: translateX(-50%)` — ça provoque des coupures aux bords de la composition.

## Garantie de sortie des sous-titres

Chaque groupe **doit** avoir une disparition forcée après son animation de sortie :

```js
tl.to(groupEl, { opacity: 0, scale: 0.95, duration: 0.12, ease: "power2.in" }, group.end - 0.12);
tl.set(groupEl, { opacity: 0, visibility: "hidden" }, group.end); // disparition déterministe
```

Auto-vérification après avoir construit la timeline — à placer **avant** `window.__timelines[id] = tl`
pour qu'elle tourne à l'initialisation de la composition :

```js
GROUPS.forEach(function (group, gi) {
  var el = document.getElementById("cg-" + gi);
  if (!el) return;
  tl.seek(group.end + 0.01);
  var computed = window.getComputedStyle(el);
  if (computed.opacity !== "0" && computed.visibility !== "hidden") {
    console.warn(
      "[caption-lint] groupe " + gi + " encore visible à t=" + (group.end + 0.01).toFixed(2) + "s",
    );
  }
});
tl.seek(0);
```

## Autres références

- [dynamic-techniques.md](dynamic-techniques.md) — karaoké, révélations en clip-path, mots qui claquent, sorties dispersées, élastique, rotation 3D
- [transcript-guide.md](transcript-guide.md) — commandes de transcription, modèles Whisper, API externes
- [css-patterns.md](css-patterns.md) — surlignage au marqueur en CSS+GSAP (déterministe, entièrement navigable)

## Contraintes

- Déterministe. Pas de `Math.random()`, pas de `Date.now()`.
- Synchronisé sur les horodatages de la transcription.
- Un seul groupe visible à la fois.
- Chaque groupe doit avoir une disparition forcée `tl.set` à `group.end`.
- Le compilateur intègre automatiquement les polices prises en charge — déclare simplement `font-family` en CSS.

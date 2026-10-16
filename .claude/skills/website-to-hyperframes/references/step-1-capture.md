# Étape 1 : Capturer et comprendre

## Lancer la capture

```bash
npx hyperframes capture <URL> -o captures/<nom-du-projet>
```

Aucune clé API nécessaire. La capture extrait automatiquement les tokens de design, des captures
d'écran, les polices et les médias, avec des descriptions tirées du contexte du DOM.

**Optionnel :** définis `GEMINI_API_KEY` (ou `GOOGLE_API_KEY`) dans un fichier `.env` à la racine du
dépôt pour des descriptions d'images plus riches par IA, via la vision de Gemini 2.5 Flash. Offre
gratuite : 5 requêtes/min ; l'offre payante lève cette limite.

Attends la fin. Affiche combien de captures d'écran, de médias, de sections et de polices ont été extraits.

## Lire et résumer

Lis chaque fichier ci-dessous. Après chacun, **écris un résumé de 1 ou 2 phrases** de ce que tu as
appris. Ces résumés sont ta mémoire de travail — le contenu brut des fichiers pourra être effacé du
contexte plus tard.

### À lire absolument (ne pas sauter)

1. **Regarde les captures de défilement** — des captures de la taille de la fenêtre qui couvrent toute la hauteur de la page (leur nombre dépend de la longueur de la page). Commence par :
   - `screenshots/scroll-000.png` — la section d'en-tête en pleine résolution 1920x1080. C'est l'image la plus importante. Décris : le fond est-il clair ou sombre ? Quel est l'élément visuel dominant ? Quelles couleurs sautent aux yeux ?
   - Puis parcours le reste pour voir toute la page. Chaque capture recouvre la précédente d'environ 30 %.

   Après les avoir vues, écris 3 ou 4 phrases sur l'ambiance visuelle du site, ses motifs de mise en page, sa stratégie de couleurs et son impression générale.

2. **`extracted/tokens.json`** — Note les 5 à 7 couleurs principales (HEX), toutes les familles de polices, le nombre de sections et le nombre de titres/appels à l'action.

3. **`extracted/visible-text.txt`** — Note le titre principal, l'accroche, les arguments de vente clés et toute statistique ou preuve sociale notable.

4. **`extracted/asset-descriptions.md`** — Un résumé d'une ligne par fichier de tous les médias téléchargés. Note ceux qui sont les plus frappants ou utiles pour une vidéo (images d'en-tête, logos, captures du produit).

### À lire s'ils existent

5. **`extracted/animations.json`** — Note si le site utilise des animations déclenchées au défilement, des bandeaux défilants, du canvas/WebGL ou des animations CSS nommées.

6. **`extracted/lottie-manifest.json`** — Regarde chaque image d'aperçu dans `assets/lottie/previews/` pour voir à quoi ressemblent les animations.

7. **`extracted/video-manifest.json`** — Regarde chaque aperçu dans `assets/videos/previews/` pour voir ce que montre chaque vidéo.

8. **`extracted/shaders.json`** — S'il est présent, il contient le vrai code de shader GLSL qui fait tourner les effets visuels WebGL du site (vagues de dégradés, systèmes de particules, champs de bruit). Lis les fragment shaders pour en extraire : les couleurs des dégradés, les algorithmes de bruit, les fonctions de mélange. Tu peux recréer des effets similaires dans tes compositions en Canvas 2D ou en intégrant les motifs de shader avec un `<canvas>` + un contexte WebGL. Voir les motifs Canvas 2D et d'art procédural dans `techniques.md`.

### À la demande (à lire en construisant les scènes)

9. **Les images individuelles de `assets/`** — Utilise `asset-descriptions.md` comme index. Regarde une image précise quand tu en as besoin pour un temps fort.

10. **`extracted/assets-catalog.json`** — Sert à trouver les URL distantes quand tu as besoin d'un média qui n'a pas été téléchargé.

### Pour les captures riches (plus de 30 images)

Lance un sous-agent pour regarder toutes les images et tous les SVG :

> « Lis chaque image de assets/ et chaque SVG de assets/svgs/. Pour chacun, écris une ligne : nom du fichier — ce qu'il montre, couleurs dominantes, taille approximative. Rends le catalogue complet. »

Utilise le catalogue du sous-agent comme référence des médias pour la suite du déroulé.

## Validation

Affiche ton résumé du site avant de passer à l'étape 2 :

- **Site :** [nom]
- **Couleurs :** [3 à 5 valeurs HEX principales avec leurs rôles]
- **Polices :** [familles de polices]
- **Sections :** [nombre] sections, [nombre] titres, [nombre] appels à l'action
- **Médias clés :** [les 3 à 5 médias les plus utiles pour la vidéo]
- **Ambiance :** [une phrase qui décrit l'identité visuelle]

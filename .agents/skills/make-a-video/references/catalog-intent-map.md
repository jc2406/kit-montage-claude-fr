# Correspondance intentions → catalogue — « l'utilisateur dit X → installer Y »

Utilisée par l'étape 5 de `/make-a-video`. Traduit le vocabulaire d'un débutant en commandes
`npx hyperframes add <bloc>`.

## La correspondance

| L'utilisateur dit… | Installer |
|---|---|
| « carte de titre / ouverture / typographie cinétique » | à faire à la main — le catalogue n'a pas de bloc de typographie cinétique ; voir MOTION_PHILOSOPHY §2.2 |
| « révélation du logo / outro / carte finale » | `logo-outro` |
| « grain film / texture sur tout » | `grain-overlay` (composant) |
| « reflet sur mon logo / éclat de lumière » | `shimmer-sweep` (composant) |
| « transition douce / fondu léger » | `transitions-blur` · `transitions-dissolve` |
| « transition énergique / coupe rapide / percutante » | `whip-pan` · `cinematic-zoom` · `glitch` |
| « transition cinéma / transformation premium » | `cross-warp-morph` · `swirl-vortex` |
| « changement d'acte / flash dramatique » | `flash-through-white` · `light-leak` |
| « zoom à travers le texte » | `cinematic-zoom` |
| « changement de couleur dans la même scène » | `chromatic-radial-split` — ou la recoloration par variables CSS à la main, MOTION_PHILOSOPHY §3.3 |
| « vitrine de téléphone / démo mobile » | `app-showcase` |
| « révélation d'interface en 3D / produit en perspective » | `ui-3d-reveal` |
| « notification macOS » | `macos-notification` |
| « graphique / visualisation de données / diagramme en barres » | `data-chart` |
| « organigramme / arbre de décision / schéma de nœuds » | `flowchart` |
| « transition en tuiles / volet pixelisé » | `grid-pixelate-wipe` (composant) · `transitions-grid` |
| « incrustation abonnement TikTok » | `tiktok-follow` |
| « incrustation abonnement Instagram » | `instagram-follow` |
| « bandeau bas abonnement YouTube » | `yt-lower-third` |
| « carte de post Twitter/X » | `x-post` |
| « carte de post Reddit » | `reddit-post` |
| « carte « en écoute » Spotify » | `spotify-card` |
| « distorsion thermique / de chaleur » | `thermal-distortion` |
| « ondulation / eau / ondes concentriques » | `ripple-waves` |
| « iris / révélation circulaire » | `sdf-iris` |
| « déformation de domaine / dissolution par bruit » | `domain-warp-dissolve` |
| « brûlure en crêtes / effet de feu » | `ridged-burn` |
| « lentille gravitationnelle / déformation » | `gravitational-lens` |

Pour le catalogue complet, parcours-le en direct avec `npx hyperframes catalog --type block` et
`npx hyperframes catalog --type component`.

Les blocs du catalogue contiennent souvent des textes d'exemple en anglais : traduis-les dans le
fichier installé.

---

## Installer et brancher

1. **Depuis le dossier du projet :**
   ```bash
   npx hyperframes add <nom-du-bloc>
   ```
2. **Le bloc s'installe dans** `<projet>/compositions/<nom-du-bloc>.html` (ou `<projet>/compositions/components/<nom>.html` pour les composants).
3. **Limite tout de suite son CSS.** Les blocs du catalogue arrivent avec des règles `html, body { ... }` au premier niveau. Quand ils sont chargés comme sous-composition via `data-composition-src`, ces règles débordent sur le document parent.
   - Ouvre le fichier installé
   - Place la règle `html, body { ... }` sous `[data-composition-id="<id-du-bloc>"]`
   - Fais de même pour toute autre règle globale non limitée
4. **Branche-le dans `index.html` :**
   ```html
   <template
     data-composition-src="compositions/<nom-du-bloc>.html"
     data-start="..."
     data-duration="..."
     data-track-index="..."></template>
   ```
5. **Applique la palette de l'utilisateur.** La plupart des blocs acceptent des variables CSS en haut du fichier — trouve-les et remplace-les par les codes hex de l'utilisateur tirés de `style-profile.md`.

---

## Composants et blocs

- **Les blocs** sont des sous-compositions autonomes — leur propre timeline, leur propre `<div>` racine. On les référence via `data-composition-src`. Exemples : `logo-outro`, `app-showcase`, `tiktok-follow`.
- **Les composants** sont des extraits que tu fusionnes *dans* le HTML d'une composition existante. Colle le DOM + le CSS + une partie du script du composant dans la composition hôte. Exemples : `grain-overlay`, `shimmer-sweep`, `grid-pixelate-wipe`.

L'installeur gère la distinction automatiquement ; il te suffit de savoir lequel choisir en planifiant le storyboard.

---

## Quand NE PAS installer

Les blocs du catalogue font gagner du temps de production. Quand tu as le temps, faire les moments
héros à la main (ouvertures en typographie cinétique, révélations de logo) donne en général un
meilleur résultat qu'installer un bloc — le spot de référence de MOTION_PHILOSOPHY n'installe **aucun** bloc.

**Règle pratique pour ce skill :**
- Transitions et incrustations réseaux sociaux / interface → installer
- Ouverture héros et appel à l'action final → à la main, sauf si l'utilisateur a une échéance serrée
- Grain film et reflet → toujours installer (ce sont des composants, faits pour être ajoutés tels quels)

---

## Pièges

- Après l'installation d'un bloc, lance toujours `npx hyperframes lint` — l'installeur peut créer des collisions de `data-composition-id` si tu en as déjà un du même nom.
- Les blocs arrivent avec leurs propres polices. Si l'utilisateur a précisé des polices dans son profil de style, remplace la famille de police du bloc par une règle limitée.
- Certains blocs (notamment `logo-outro`) attendent des noms de fichiers précis — lis le fichier installé et renomme / remplace le chemin par celui du logo de l'utilisateur.
- Les blocs à shaders (les 14 transitions en shader) utilisent WebGL. Dans le WebGL logiciel de secours du Studio, ils peuvent bloquer l'aperçu de la composition principale. L'étape 7 envoie l'utilisateur vers les URL de chaque composition pour contourner le problème.

# Templates de scène

- `dark-graph-paper-template/` : fond animé ; aucun rush nécessaire. Copiez
  le HTML et la config dans un nouveau projet vidéo, puis ajoutez le contenu de votre histoire.
- `left-glass-popout/` : un recadrage caméra avec un panneau en verre animé. Fournissez
  votre propre `assets/source.mp4` avec image et son, et ajustez la durée de la source,
  le recadrage, le texte de la carte et les timings avant le rendu.

Ce sont des points de départ de scènes autonomes, alors que style-library contient des cartes.
Les templates référencent pour l'instant un CDN public de GSAP. Pour un projet autonome,
copiez `node_modules/gsap/dist/gsap.min.js` dans son dossier assets et changez la
source du script en `assets/gsap.min.js`, comme le fait le starter.

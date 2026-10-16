# Le kit consolidé

Ce dépôt (`kit-montage-claude-fr`) réunit en un seul kit, en français, les outils de montage
et le pipeline vidéo réutilisable.

## Ce qui a été ajouté

- Les instructions pour Codex, les réglages du projet et les copies générées des skills.
- La coupe des silences et des erreurs, l'orchestration du montage complet, le storytelling et les outils de temps forts.
- Le nouveau déroulé `short-form-edit`, ses références et ses validateurs de plan et de plans de coupe.
- 406 cartes brouillon, deux modèles de scène réutilisables, un projet de départ synthétique et des tests.
- L'installation, des recettes de prompts, un guide de vérification et une CI sous Windows, macOS et Linux.

## Ce qui reste

Les exemples de `video-projects/` et le dossier `assets/` ne sont pas inclus (voir
[le périmètre de l'export](EXPORT-SCOPE.md)). Les nouveaux reels passent par `short-form-edit` ; `short-form-video` est la
référence historique des May Shorts.

Le paquet garde le comportement CommonJS pour les anciens scripts `.js` ; les nouveaux outils
utilisent des modules `.mjs` explicites. La version d'HyperFrames est figée dans le lockfile.
Les anciens exemples n'ont pas tous été rendus de nouveau avec cette version, et peuvent demander
une configuration propre au projet (médias, polices, dépendances ou API). Leur rendu historique
ne garantit pas la compatibilité actuelle. Commencez un nouveau travail avec
`npm run new-video -- ma-video`.

Les nouveaux projets privés sont ignorés par Git. Les fichiers déjà suivis par Git le restent
malgré les règles d'exclusion : ne mettez donc pas de rushs privés dans ces dossiers.
Aucun historique d'espace de travail privé, aucun enregistrement brut ni aucun identifiant n'a été importé.

La licence MIT s'applique. Le matériel importé du pipeline garde sa permission
d'usage, et les licences tierces restent applicables. Voir les
[mentions des ressources](../THIRD_PARTY_NOTICES.md).

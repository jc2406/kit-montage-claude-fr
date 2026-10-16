# Le Herk Edit Kit consolidé

`nateherkai/herk-edit-kit` (anciennement `nateherkai/hyperframes-student-kit`) est le dépôt de référence.
Le kit réutilisable de `nateherkai/hyperframes-video-pipeline` y a été fusionné, en conservant
les deux historiques publiés ainsi que les étoiles et l'URL du dépôt d'origine.
Ce dépôt (`kit-montage-claude-fr`) en est la traduction française.

## Ce qui a été ajouté

- Les instructions pour Codex, les réglages du projet et les copies générées des skills.
- La coupe des silences et des erreurs, l'orchestration du montage complet, le storytelling et les outils de temps forts.
- Le nouveau déroulé `short-form-edit`, ses références et ses validateurs de plan et de plans de coupe.
- 406 cartes brouillon, deux modèles de scène réutilisables, un projet de départ synthétique et des tests.
- L'installation, des recettes de prompts, un guide de vérification et une CI sous Windows, macOS et Linux.

## Ce qui reste

Dans le dépôt d'origine, les 12 exemples de `video-projects/` et le dossier `assets/` à la racine
sont conservés sans modification ; ils ne sont pas repris dans cette traduction (voir
[le périmètre de l'export](EXPORT-SCOPE.md)). Les trois skills supplémentaires d'origine restent
disponibles. Les nouveaux reels passent par `short-form-edit` ; `short-form-video` est la
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

La licence MIT d'origine s'applique toujours. Le matériel importé du pipeline garde sa permission
d'usage, et les licences tierces restent applicables. Voir les
[mentions des ressources](../THIRD_PARTY_NOTICES.md).

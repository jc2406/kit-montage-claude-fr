# Kit Montage Claude (FR)

Version française par Jean-Charles Salvin ([JCBuildsAI](https://github.com/jc2406)).

Un kit de montage vidéo en français pour **Claude Code et Codex**, construit sur HyperFrames.
Apportez vos propres rushs. Coupez les blancs, repérez les erreurs, construisez l'histoire
et créez des motion graphics avec HyperFrames et GSAP.

> - Tout le texte est en français : skills, documentation, instructions de l'agent, textes des cartes, commentaires et messages des scripts. Le code (noms de variables, de fonctions, de fichiers) reste en anglais pour ne rien casser.
> - Aucun projet vidéo d'exemple ni média n'est inclus : créez un projet avec vos propres rushs (`npm run new-video -- <nom>`).
> - Licences conservées : [LICENSE](LICENSE) (MIT), [licenses/](licenses/) et [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Ce qu'il contient

- **[Méthode de montage](docs/EDITING-PLAYBOOK.md)** : comment monter des vidéos avec l'IA, le style maison mesuré pour les reels, les règles de B-roll, de sous-titres et de son, et comment chaque remarque devient une règle dans un skill.
- **15 skills**, dupliqués pour les deux assistants, avec leurs scripts et leurs références.
- **406 cartes de motion graphics** (brouillons) réparties en deux styles, avec manifestes, tokens CSS et emplacements modifiables.
- **Deux modèles de scène** : papier millimétré sombre et encart vitré à gauche.
- Outils de transcription, coupe des silences, détection des erreurs, rendu des coupes validées, recalage de la transcription, revue de l'EDL, validation de la synchro sur le rythme et vérifications préalables.
- **Montage court** : reels, YouTube Shorts, planification de l'accroche et de la chute, sous-titres précis, B-roll en mouvement et revue audio.
- Une composition de départ synthétique et des données de test de montage qui ne demandent ni rushs ni clé API.

## Outils et services optionnels

**Le kit utilise par défaut ElevenLabs Scribe pour transcrire et, en option, Kie.ai pour générer des vidéos et
des images.** Utilisez vos propres clés API et crédits pour ces services.
Vous pouvez demander à l'assistant d'utiliser OpenAI Whisper ou Whisper en local à la place,
ou fournir une transcription mot à mot existante. Les médias générés sont optionnels.

Le projet de départ en local ne demande aucune API payante de transcription ou de génération. Voir le
[guide des outils, comptes et clés API](docs/TOOLS-AND-API-KEYS.md) pour les outils nécessaires,
les services optionnels, les détails d'installation et des prompts à copier.

## Installation

Installez Node.js **22 ou plus récent**, Git, FFmpeg (avec ffprobe) et Chrome ou
Chromium. Rendez `node`, `ffmpeg` et `ffprobe` accessibles dans votre terminal.
Lancez ensuite ces commandes dans PowerShell, le Terminal macOS ou un shell Linux :

```sh
git clone https://github.com/jc2406/kit-montage-claude-fr.git
cd kit-montage-claude-fr
npm ci
npm run setup
npm test
```

La configuration vérifie les outils et crée `.env` seulement s'il n'existe pas. Ajoutez uniquement
les clés des services que vous choisissez. L'outil de transcription inclus utilise ElevenLabs ;
les intégrations Whisper et Kie.ai demandent la configuration décrite dans le
[guide des outils](docs/TOOLS-AND-API-KEYS.md). [Installation et dépannage](docs/SETUP.md).

## Rendre votre premier exemple

```sh
npm run demo
cd video-projects/demo
npx hyperframes lint
npx hyperframes preview
```

Parcourez l'animation de huit secondes dans le Studio. Après l'avoir vérifiée, arrêtez l'aperçu
avec Ctrl+C, puis lancez le rendu :

```sh
npx hyperframes render --quality draft --output renders/demo.mp4
```

La démo utilise GSAP en local. HyperFrames peut télécharger et mettre en cache des polices de remplacement au premier rendu. Elle n'a pas de voix off. La
[transcription synthétique](examples/editing/source.json) séparée sert à tester les outils de coupe ;
ce sont des données de test fictives, pas la transcription de l'animation du titre.

## Monter vos rushs

Ouvrez ce dossier dans Codex ou Claude Code et dites :

> Utilise edit-video pour monter mon enregistrement situé à [chemin local]. Garde mes exemples
> et les leçons principales. Resserre les blancs, montre-moi les coupes d'erreurs proposées et utilise
> le style papier millimétré sombre avec quelques cartes vitrées. Produis un brouillon validé.

Codex : `$edit-video`. Claude Code : `/edit-video`. Pour une seule opération, utilisez
`cut-silences`, `cut-mistakes`, `video-storytelling` ou `style-library`.
Voir le [déroulé étape par étape](docs/WORKFLOW.md), les [recettes de prompts](docs/PROMPTS.md)
et le [cahier de storytelling](docs/STORYTELLING-WORKBOOK.md).

## Créer un reel ou un YouTube Short

> Utilise short-form-edit pour transformer mon enregistrement situé à [chemin local] en reel 9:16.
> Construis une accroche et une chute honnêtes, garde le sens de mes propos, resserre les erreurs et
> ajoute des sous-titres précis, des plans en mouvement qui servent le propos et un habillage sonore.
> Prépare un brouillon à valider. Utilise mes rushs existants avant de proposer des médias générés.

Codex : `$short-form-edit`. Claude Code : `/short-form-edit`.
Le skill contient des références de planification et des validateurs pour le timing des sous-titres,
la correspondance avec la source, la couverture des scènes et la réutilisation des plans. C'est un
déroulé guidé par l'agent : vérifiez le mouvement et le son réels avant de publier.
[Déroulé du format court et commandes de validation](docs/SHORT-FORM.md).

## Créer un showreel motion design

> Utilise motion-showreel pour créer un showreel de 15 secondes pour [marque]. Étudie mon reel de
> référence situé à [chemin local] si je t'en donne un. Choisis un motif qui se transforme à chaque
> chapitre, coupe sur la grille rythmique de la musique et termine sur le logo. Montre-moi le storyboard
> et la grille des temps avant de construire, et demande-moi avant toute génération payante de musique ou de médias.

Codex : `$motion-showreel`. Claude Code : `/motion-showreel`.
Le skill contient l'analyse mesurée du reel qui a servi de base, une bibliothèque de techniques par
chapitre, un modèle de HUD et des outils Node pour analyser une vidéo de référence, mesurer la grille
rythmique d'une musique, la caler sur la grille des coupes et prémixer les bruitages.

## Projets d'origine et migration

Le dépôt d'origine contient 12 projets pédagogiques dans `video-projects/` et des exemples de marque
partagés. Ils ne sont pas inclus dans cette traduction (voir plus haut). Les skills `make-a-video`,
`short-form-video` et `website-to-hyperframes` sont inclus et traduits.
Utilisez `short-form-edit` pour les nouveaux reels ; `short-form-video` documente les anciennes
compositions « May Shorts ». [Notes de migration et de compatibilité](docs/MIGRATION.md).

## Explorer et personnaliser

| Ressource | Par où commencer |
| --- | --- |
| Comment monter (style, règles, leçons) | [Méthode de montage](docs/EDITING-PLAYBOOK.md) |
| Instructions partagées pour l'agent | [AGENTS.md](AGENTS.md) |
| Vocabulaire du mouvement et des transitions | [MOTION_PHILOSOPHY.md](MOTION_PHILOSOPHY.md) |
| Bibliothèque de cartes et tokens de design | [Guide de la bibliothèque](style-library/GUIDE.md) |
| Métadonnées des cartes, consultables | [registry.json](style-library/registry.json) |
| Modèles de scène complète | [Guide des modèles](style-templates/README.md) |
| Configuration et duplication pour Codex | [.codex/README.md](.codex/README.md) |
| Vérifications de publication et limites | [Vérification](docs/VERIFICATION.md) |
| Ressources tierces | [Mentions](THIRD_PARTY_NOTICES.md) |

Les cartes sont des **brouillons réutilisables**. Testez les cartes que vous choisissez avec votre texte
et vos rushs. Les modèles de la bibliothèque peuvent charger GSAP et Google Fonts depuis leurs CDN
publics ; rapatriez ces dépendances en local quand vous assemblez un projet final.

Aucun enregistrement privé, aucune transcription privée, aucun identifiant ni réglage d'espace de travail
privé n'est inclus. Les nouveaux dossiers dans `video-projects/` et `raw-media/` sont ignorés
automatiquement par Git. Créez un nouveau projet pour vos propres rushs.

## Crédits et licence

- Code sous licence MIT ([LICENSE](LICENSE)) et permission d'usage du kit ([licenses/PIPELINE-USE-PERMISSION.txt](licenses/PIPELINE-USE-PERMISSION.txt)).
- Version française : Jean-Charles Salvin, 2026. Mêmes conditions.
- Les skills `hyperframes`, `hyperframes-cli`, `hyperframes-registry` et `gsap` viennent de l'écosystème [HyperFrames](https://github.com/heygen-com/hyperframes) (Apache-2.0, [licenses/HYPERFRAMES-LICENSE](licenses/HYPERFRAMES-LICENSE)). Leurs fichiers ont été traduits en français : voir la mention dans chaque `NOTICE.txt`.
- Ce kit n'est ni affilié ni approuvé par HeyGen.

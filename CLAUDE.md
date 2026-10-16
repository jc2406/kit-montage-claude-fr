# Kit Montage Claude (FR) : guide de l'espace de travail

Transformer un enregistrement face caméra en montage réfléchi, avec le rendu local
HyperFrames, des coupes pilotées par la transcription et des motion graphics réutilisables.

## Langue

Ce kit est la traduction française du Herk Edit Kit de Nate Herk. Réponds à l'utilisateur
en français. Écris les plans, les storyboards, les sous-titres et les textes à l'écran en
français, sauf si l'utilisateur demande une autre langue ou si la vidéo est dans une autre
langue. Les noms de fichiers, de skills, de commandes et le code restent en anglais.

## Aiguillage selon l'outil

`AGENTS.md` et `CLAUDE.md` contiennent le même guide permanent. Garde-les synchronisés.
Claude Code utilise `.claude/skills/`. Codex utilise `.agents/skills/`, généré automatiquement.
Modifie les skills de référence dans `.claude/skills/`, puis lance `npm run sync:skills`.
Utilise `$edit-video` dans Codex, `/edit-video` dans Claude Code, ou le langage naturel.
Le choix du modèle et des permissions appartient à l'utilisateur ; `.codex/config.toml` ajoute
seulement des réglages de chargement des documents. Travaille en local sauf si l'utilisateur
demande des sous-agents.

## Démarrer et choisir le skill

Lis `README.md` pour l'installation et `docs/WORKFLOW.md` pour un montage complet.
Utilise `edit-video` pour coordonner transcription, coupes, design et vérification.
Pour une seule étape, charge le skill local correspondant :

| Besoin | Skill |
| --- | --- |
| Reels, Shorts et publicités courtes | `short-form-edit` |
| Showreels motion design et reels de marque calés sur la musique | `motion-showreel` |
| Maintenance des anciens exemples May Shorts | `short-form-video` |
| Nouvelle vidéo de motion graphics à partir d'un brief | `make-a-video` |
| Compositions inspirées d'un site web | `website-to-hyperframes` |
| Montage complet d'une vidéo brute | `edit-video` |
| Suppression des silences | `cut-silences` |
| Reprises, faux départs ou bégaiements | `cut-mistakes` |
| Arc narratif, univers persistant et rappels visuels | `video-storytelling` |
| Incrustations, prises de contrôle « papier » et cartes vitrées | `hyperframes-video-beats` |
| Choisir ou enrichir les styles et les modèles | `style-library` |
| Compositions HTML et timing des médias | `hyperframes` |
| Aperçu, lint et rendu | `hyperframes-cli` |
| Animation sur la timeline | `gsap` |
| Installer des blocs du catalogue HyperFrames | `hyperframes-registry` |

Avant une session créative, lis `MOTION_PHILOSOPHY.md` et le DESIGN.md du projet.
Le rythme rapide « sizzle » de la philosophie est une référence de style. Laisse respirer
un discours pédagogique. Le brief du projet décide du rythme, de la palette et de la typographie.
Les contrats des skills du framework priment sur les anciennes recettes de code du guide de style.

## Espace de travail

Crée un projet avec `npm run new-video -- ma-video`. Garde les médias sources, les EDL,
les transcriptions, les compositions et les rendus ensemble dans `video-projects/<slug>/`.
Lance HyperFrames depuis le dossier du projet. Les utilitaires de `scripts/` à la racine
acceptent des chemins relatifs au dossier courant. `style-library/registry.json` indexe
les cartes ; chaque style a un DESIGN.md, des tokens CSS et des emplacements de texte nommés.
Voir `style-templates/README.md` pour les modèles de scène complète.

Préserve les fichiers bruts. Utilise un nouveau nom de fichier de sortie à chaque étape du montage.
Archive le travail obsolète. Les projets vidéo, les rushs personnels, les transcriptions, les
identifiants et les rendus sont ignorés par Git. Les nouveaux projets privés restent ignorés.
N'affiche jamais de secrets et ne copie jamais de médias privés dans les exemples de la bibliothèque.

## Montage et timing

Avant de choisir un service de transcription, de génération de médias ou de voix off, lis
`docs/TOOLS-AND-API-KEYS.md` et vérifie le fournisseur choisi par l'utilisateur et sa configuration
locale. ElevenLabs Scribe est le choix par défaut de Nate ; respecte une demande pour OpenAI Whisper,
Whisper en local ou un autre fournisseur. Normalise les horodatages des mots vérifiés pour les outils
de coupe. Le script de transcription inclus ne gère qu'ElevenLabs. Kie.ai est optionnel et demande
une intégration configurée et des crédits. Réutilise les transcriptions et les médias existants ;
présente concrètement tout envoi ou appel payant non validé avant de demander l'accord.

Coupe d'abord les silences ; utilise sa vidéo montée ET sa transcription recalée pour cut-mistakes.
Examine chaque erreur dans son contexte. Une répétition volontaire n'est pas une erreur. Note les
décisions validées avant de les appliquer. Si aucune coupe n'est nécessaire, garde l'entrée telle
quelle ou utilise une liste de coupes vide. Ne mélange jamais les horodatages d'origine avec des
images déjà montées.

Charge les skills concernés avant de modifier du HTML. Les compositions racines utilisent une div
visible avec id, data-composition-id, data-start, duration, width et height. Les éléments
temporisés portent data-start, data-duration et data-track-index ; deux clips d'une même piste ne
doivent pas se chevaucher. Les div temporisées visibles utilisent class="clip" ; les vidéos non.
Coupe le son des vidéos et utilise un élément audio voisin pour le mix. Anime un conteneur de vidéo
non temporisé. Enregistre une timeline GSAP synchrone et en pause par composition dans
window.__timelines, avec l'ID exact de la composition. Garde des timelines finies et des durées
explicites. HyperFrames gère la lecture des médias. Utilise une animation déterministe et des
fichiers locaux.

## Vérification et validations

Lance `node scripts/preflight.mjs <projet>` et le lint HyperFrames. Pour les sous-compositions
ancrées, lance `node scripts/validate-beat-sync.mjs <projet>` ; chaque temps fort a besoin d'un
data-anchor avec une phrase exacte de la transcription. Il doit entrer entre 0,2 seconde après
et 1,8 seconde avant ce mot. Les timelines écrites en ligne demandent une revue manuelle du timing.

Vérifie dans le Studio avant le rendu brouillon. Vérifie le brouillon encodé, extrais et inspecte
les images clés et les limites de transitions, et écoute les raccords audio. Contrôle les visages
coupés, les débordements, les flashs noirs, la lisibilité des textes, la saturation et la synchro
image/son. Règle les problèmes avant le rendu final. Consigne les preuves dans VERIFY.md.
Utilise un serveur d'aperçu qui gère les requêtes Range pour naviguer dans un MP4
(par exemple `npx serve`).

Respecte les validations déjà données. Quand une validation manque, prépare d'abord l'aperçu
concret ou la proposition de coupes. N'affirme jamais qu'un lint réussi prouve la qualité visuelle.
Ne publie ou n'envoie une vidéo terminée que si l'utilisateur l'autorise.
Les vérifications automatiques dans le navigateur doivent tourner sans interface, avec Pointer Lock
et capture du curseur désactivés ; les saisies simulées doivent rester dans le navigateur virtuel.

Pour les formats courts, lis `docs/SHORT-FORM.md` et `docs/EDITING-PLAYBOOK.md` (le style maison
mesuré de Nate et ses leçons), et utilise les validateurs du plan et des plans de coupe. Les
vérifications structurelles complètent la revue de la vidéo et du son rendus, elles ne la remplacent pas.

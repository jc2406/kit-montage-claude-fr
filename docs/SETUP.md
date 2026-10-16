# Installation et dépannage

Commencez par [les outils, comptes et clés API](TOOLS-AND-API-KEYS.md) pour les choix par défaut
(ElevenLabs et Kie.ai), les alternatives Whisper et les services optionnels.

Utilisez Node 22+ (exigé par la version figée de la CLI HyperFrames), FFmpeg avec ffprobe et
Chrome ou Chromium. Lancez `npm ci` à la racine du dépôt avant toute commande de projet.
`npm run setup` vérifie la présence des outils ; `npx hyperframes doctor` diagnostique le moteur
de rendu. Si Chromium n'est pas disponible, suivez `npx hyperframes browser --help`.
Sous Windows, rouvrez le terminal après avoir installé FFmpeg pour rafraîchir le PATH.

Le dépôt fige HyperFrames 0.7.109 et GSAP 3.14.2. Gardez package-lock.json avec package.json.
Mettez à jour volontairement, puis refaites les vérifications de rendu.

`npm run new-video -- lecon-un` copie le projet de départ synthétique et GSAP en local dans un
nouveau dossier autonome. Un nom de projet existant est refusé pour ne rien écraser. Remplacez le
projet de départ par votre enregistrement et vos compositions. Le modèle « encart vitré à gauche »
a besoin de votre propre `assets/source.mp4` avec une piste audio.

Codex lit AGENTS.md et découvre `.agents/skills/`. Faites confiance au projet dans Codex si vous
voulez que ses réglages soient chargés. Redémarrez si les skills n'apparaissent pas.
Claude Code lit CLAUDE.md et `.claude/skills/`. Aucun des deux n'a besoin d'un serveur MCP
particulier pour le montage en local. `npm run check` à la racine valide la distribution ; il ne
vérifie pas votre travail personnel dans video-projects.

Pour modifier un skill, éditez `.claude/skills/<nom>/`, lancez `npm run sync:skills`, puis
`npm run check:skills`. Aucun droit de lien symbolique n'est nécessaire sous Windows.

Erreurs Scribe : un 401 signifie en général une authentification invalide ; un 403 peut signifier
que la clé n'a pas l'accès speech_to_text. Vérifiez les permissions de la clé sans l'afficher.
Aucune clé n'est nécessaire pour `npm test`, l'aperçu ou le rendu du projet de départ.
Pour une source sans parole, fournissez une piste audio séparée avant d'utiliser les outils de
coupe : ils attendent une piste vidéo et une piste audio.

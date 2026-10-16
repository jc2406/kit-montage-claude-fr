# Configuration de Codex

Ouvrez ce dossier de projet dans Codex. `AGENTS.md` contient le guide partagé de l'espace de
travail ; Codex découvre automatiquement les paquets de skills complets dans `.agents/skills/`.
Utilisez `$cut-silences`, `$cut-mistakes`, `$video-storytelling` ou le langage naturel.

`.claude/skills/` est la version de référence. Après une modification, lancez :

```sh
node scripts/sync-codex-skills.mjs
node scripts/sync-codex-skills.mjs --check
```

La copie utilise de vrais fichiers pour que les utilisateurs Windows n'aient pas besoin de droits
de lien symbolique. Gardez `AGENTS.md` et `CLAUDE.md` synchronisés. La configuration du projet ne
touche pas aux réglages de modèle, d'authentification, de bac à sable et de validation de l'élève.
Les réglages du projet se chargent une fois que l'utilisateur fait confiance au projet. Redémarrez
Codex si de nouveaux skills n'apparaissent pas. Claude Code utilise les fichiers de référence
de `.claude/skills/`.

Références officielles : [découverte des skills](https://learn.chatgpt.com/docs/build-skills)
et [configuration du projet](https://learn.chatgpt.com/docs/config-file/config-basic).

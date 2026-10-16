# Bibliothèque de styles visuels

Des identités visuelles nommées pour les vidéos HyperFrames. Chaque style s'appuie sur une vraie
tradition du graphisme. Utilise-les pour donner à ta vidéo une personnalité visuelle précise, pas
juste un « épuré » ou « audacieux » générique.

**Comment choisir :** l'ambiance d'abord, le contenu ensuite. Demande-toi : _« Que doit RESSENTIR le spectateur ? »_

**Comment l'utiliser :** cite le style dans ton plan de scènes. Traduis ses principes en décisions de
composition concrètes — choix de palette, choix de police, motifs d'entrée, type de transition,
sensation du mouvement d'ambiance.

Les noms des styles restent en anglais : ce sont des noms propres que les autres fichiers citent.

## Référence rapide

| Style           | Ambiance                  | Idéal pour                                   | Shader principal                  |
| --------------- | ------------------------- | -------------------------------------------- | --------------------------------- |
| Swiss Pulse     | Clinique, précis          | SaaS, données, outils dev, indicateurs       | Cinematic Zoom ou SDF Iris        |
| Velvet Standard | Premium, intemporel       | Luxe, entreprise, keynotes                   | Cross-Warp Morph                  |
| Deconstructed   | Industriel, brut          | Lancements tech, sécurité, punk              | Glitch ou Whip Pan                |
| Maximalist Type | Bruyant, cinétique        | Grandes annonces, lancements                 | Ridged Burn                       |
| Data Drift      | Futuriste, immersif       | IA, ML, technologies de pointe               | Gravitational Lens ou Domain Warp |
| Soft Signal     | Intime, chaleureux        | Bien-être, histoires personnelles, marque    | Thermal Distortion                |
| Folk Frequency  | Culturel, vif             | Applis grand public, food, communautés       | Swirl Vortex ou Ripple Waves      |
| Shadow Cut      | Sombre, cinématographique | Révélations dramatiques, sécurité, enquêtes  | Domain Warp                       |

---

## 1. Swiss Pulse — Josef Müller-Brockmann

**Ambiance :** clinique, précise | **Idéal pour :** tableaux de bord SaaS, outils pour développeurs, API, indicateurs

- Noir (`#1a1a1a`), blanc, UN SEUL accent — bleu électrique (`#0066FF`) ou ambre (`#FFB300`)
- Helvetica ou Inter Bold pour les titres, Regular pour les étiquettes. Grands chiffres (80-120 px)
- Compositions calées sur une grille. Chaque élément s'aligne sur une grille invisible de 12 colonnes
- Des compteurs animés qui partent de 0. Coupes franches, pas de transitions décoratives
- Transitions : Cinematic Zoom ou SDF Iris (précises, géométriques)

**Signature GSAP :** `expo.out`, `power4.out`. Les entrées sont rapides et se calent net. Rien ne flotte.

```
Swiss Pulse : noir/blanc + un accent électrique. Compositions calées sur une grille.
Les chiffres dominent l'image à 80-120 px. Compteurs animés depuis 0.
Coupes franches ou transitions géométriques. Rien de décoratif.
```

---

## 2. Velvet Standard — Massimo Vignelli

**Ambiance :** premium, intemporelle | **Idéal pour :** produits de luxe, logiciels d'entreprise, keynotes, présentations investisseurs

- Noir, blanc, UN SEUL accent riche — bleu marine profond (`#1a237e`) ou or (`#c9a84c`)
- Sans-serif fine, TOUT EN CAPITALES, interlettrage large (`0.15em+`)
- Espace vide généreux. Symétrique, centré, d'une précision architecturale
- Lent, posé. Révélations successives avec de longues tenues. Pas de mouvement frénétique
- Transitions : Cross-Warp Morph (passage élégant et organique entre les scènes)

**Signature GSAP :** `sine.inOut`, `power1`. Rien ne claque — tout glisse avec intention.

```
Velvet Standard : noir, blanc, un accent riche. Typographie fine TOUT EN CAPITALES, très espacée.
Espace vide généreux. Révélations successives, longues tenues.
Transitions Cross-Warp Morph. Lent et posé — le luxe prend son temps.
```

---

## 3. Deconstructed — Neville Brody

**Ambiance :** industrielle, brute | **Idéal pour :** actualité tech, lancements pour développeurs, produits de sécurité, révélations à l'énergie punk

- Gris foncé (`#1a1a1a`), orange rouille (`#D4501E`), blanc brut (`#f0f0f0`)
- Texte en biais, bords qui se chevauchent, qui sortent du cadre. Graisse industrielle épaisse
- Textures rugueuses : effets de lignes de balayage, artefacts de glitch intégrés au design
- Le texte S'ÉCRASE et VOLE EN ÉCLATS. Les lettres se brouillent puis se calent à leur place finale
- Transitions : shader Glitch ou Whip Pan (casse les règles, paraît agressif)

**Signature GSAP :** `back.out(2.5)`, `steps(8)`, `elastic.out(1.2, 0.4)`. Une irrégularité voulue.

```
Deconstructed : gris foncé #1a1a1a + orange rouille #D4501E. Texte en biais, qui sort du cadre.
Superpositions de glitch en lignes de balayage. Le texte S'ÉCRASE et se brouille avant de se caler.
Transitions en shader Glitch. Industriel et brut — rien ne doit paraître léché.
```

---

## 4. Maximalist Type — Paula Scher

**Ambiance :** bruyante, cinétique | **Idéal pour :** gros lancements de produit, annonces d'étapes, vidéos de hype très énergiques

- Couleurs saturées et audacieuses : rouge (`#E63946`), jaune (`#FFD60A`), noir, blanc — contraste maximal
- Le texte EST le visuel. Couches de texte qui se chevauchent à différentes échelles et angles, remplissant 50 à 80 % du cadre
- Tout est cinétique : claques, glissades, changements d'échelle. Scènes en rafale de 2 à 3 secondes
- Texte superposé SUR des images — jamais de fonds vides
- Transitions : Ridged Burn (explosive, dramatique, impossible à ignorer)

**Signature GSAP :** `expo.out`, `back.out(1.8)`. Arrivées rapides, arrêts nets.

```
Maximalist Type : rouge, jaune, noir, blanc — contraste maximal. Le texte EST le visuel.
Superpositions à différentes échelles, 50 à 80 % du cadre. Tout est en mouvement.
Transitions Ridged Burn. Aucun moment statique — une énergie cinétique du début à la fin.
```

---

## 5. Data Drift — Refik Anadol

**Ambiance :** futuriste, immersive | **Idéal pour :** produits d'IA, plateformes de ML, entreprises de données, technologies spéculatives

- Irisé : noir profond (`#0a0a0a`), violet électrique (`#7c3aed`), cyan (`#06b6d4`)
- Sans-serif fine et futuriste — flottante, en apesanteur, minimale
- Compositions fluides qui se transforment. Changements d'échelle extrêmes (micro → macro)
- Des particules se rassemblent en chiffres. La lumière trace des chemins de données dans le cadre
- Transitions : Gravitational Lens ou Domain Warp (déformation d'un autre monde)

**Signature GSAP :** `sine.inOut`, `power2.out`. Lisse, continu, organique. Rien de dur.

```
Data Drift : noir profond #0a0a0a avec violet électrique #7c3aed et cyan #06b6d4.
Typographie fine et futuriste, peu de texte. Des particules se rassemblent en chiffres.
Transitions Gravitational Lens ou Domain Warp. Fluide, immersif, d'un autre monde.
```

---

## 6. Soft Signal — Stefan Sagmeister

**Ambiance :** intime, chaleureuse | **Idéal pour :** marques de bien-être, histoires personnelles, produits lifestyle, applis centrées sur l'humain

- Ambre chaud (`#F5A623`), crème (`#FFF8EC`), vieux rose (`#C4A3A3`), vert sauge (`#8FAF8C`)
- Polices façon écriture manuscrite ou serif humaniste. Personnel, en minuscules, délicat
- Sensation de gros plan : un seul élément remplit le cadre. Rien ne paraît corporate
- Dérives et flottements lents, jamais de claque. Un mouvement doux et organique partout
- Transitions : Thermal Distortion (chaude, fluide, comme un miroitement de chaleur)

**Signature GSAP :** `sine.inOut`, `power1.inOut`. Tout respire.

```
Soft Signal : ambre chaud, crème, vieux rose, vert sauge. Typographie humaniste ou manuscrite.
Un seul élément remplit le cadre — intime, jamais corporate.
Dérives et flottements lents partout. Transitions Thermal Distortion.
Rien ne doit paraître pressé ou léché.
```

---

## 7. Folk Frequency — Eduardo Terrazas

**Ambiance :** culturelle, vive | **Idéal pour :** applis grand public, plateformes de food, produits communautaires, lancements festifs

- Couleurs folk vives : rose vif (`#FF1493`), bleu cobalt (`#0047AB`), jaune soleil (`#FFE000`), émeraude (`#009B77`)
- Typographie arrondie, chaleureuse et épaisse. Motifs et répétition — le rythme et la densité de l'art populaire
- Compositions en couches avec une riche texture visuelle. Chaque image paraît faite à la main
- Mouvement coloré : les éléments rebondissent, apparaissent et tournent jusqu'à leur place avec joie
- Transitions : Swirl Vortex ou Ripple Waves (hypnotiques, festives)

**Signature GSAP :** `back.out(1.6)`, `elastic.out(1, 0.5)`. Les dépassements paraissent voulus.

```
Folk Frequency : rose vif #FF1493, bleu cobalt, jaune soleil, émeraude. Typographie arrondie et épaisse.
Motifs et répétition partout. Une sensation en couches, dense, faite à la main.
Transitions Swirl Vortex ou Ripple Waves. Une énergie joyeuse et festive.
```

---

## 8. Shadow Cut — Hans Hillmann

**Ambiance :** sombre, cinématographique | **Idéal pour :** produits de sécurité, révélations dramatiques, contenus d'enquête, lancements intenses

- Presque monochrome : noirs profonds (`#0a0a0a`), gris froids (`#3a3a3a`), blanc cru + rouge sang (`#C1121F`) ou vert toxique (`#39FF14`)
- Texte anguleux et tranchant comme les cartons de titre du film noir. Fort contraste, aucune douceur
- Ombre lourde — les éléments émergent de l'obscurité. La révélation est le récit
- Lents zooms avant rampants, révélations spectaculaires par l'échelle, silence avant le coup
- Transitions : Domain Warp (dissout la réalité elle-même avant de révéler la scène suivante)

**Signature GSAP :** `power4.in` pour les sorties, `power3.out` pour les révélations dramatiques. La pause avant le coup compte.

```
Shadow Cut : noirs profonds #0a0a0a, gris froids, blanc cru + un accent (rouge sang ou vert toxique).
Typographie anguleuse et tranchante, esthétique film noir. Les éléments émergent de l'obscurité.
Lents zooms avant rampants. Transitions Domain Warp. La révélation EST l'histoire.
```

---

## Guide ambiance → style

| Si le contenu paraît…                         | Utilise…        |
| --------------------------------------------- | --------------- |
| Orienté données, analytique, technique        | Swiss Pulse     |
| Premium, entreprise, luxe                     | Velvet Standard |
| Brut, punk, agressif, rebelle                 | Deconstructed   |
| Hype, bruyant, lancement très énergique       | Maximalist Type |
| IA, ML, spéculatif, futuriste                 | Data Drift      |
| Humain, chaleureux, personnel, bien-être      | Soft Signal     |
| Culturel, ludique, grand public, festif       | Folk Frequency  |
| Sombre, dramatique, intense, cinématographique | Shadow Cut     |

---

## Créer des styles sur mesure

Ces 8 styles sont des exemples — pas des contraintes. Crée le tien :

1. **Nomme-le** d'après un designer, un mouvement artistique ou une référence culturelle
2. **Palette** : 2 ou 3 couleurs au maximum. Déclare des valeurs hex explicites
3. **Typographie** : une famille, deux graisses. Indique le rôle de chacune
4. **Règles de mouvement** : à quelle vitesse ? Nerveux ou fluide ? Dépassement ou précision ?
5. **Transition** : quel shader correspond à l'énergie ?
6. **À ne pas faire** : 2 ou 3 anti-motifs explicites pour ce style

Le modèle : **style nommé → palette → typographie → règles de mouvement → transition → à éviter.**

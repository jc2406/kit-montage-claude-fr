# Typographie

Le compilateur intègre les polices prises en charge — écris simplement `font-family` en CSS.

## Interdites

Les choix par défaut des données d'entraînement, que tout LLM attrape. Elles produisent une
monoculture entre les compositions.

Inter, Roboto, Open Sans, Noto Sans, Arimo, Lato, Source Sans, PT Sans, Nunito, Poppins, Outfit, Sora, Playfair Display, Cormorant Garamond, Bodoni Moda, EB Garamond, Cinzel, Prata, Syne

**Syne en particulier** est la police d'affichage « distinctive » la plus surutilisée. C'est un signe immédiat de design par IA.

(Exception : si la marque de l'utilisateur impose l'une de ces polices dans son DESIGN.md, la marque l'emporte.)

## Garde-fous

Tu connais ces règles mais tu les enfreins. Arrête.

- **N'associe pas deux sans-serif.** Tu le fais tout le temps — une pour les titres, une pour le texte. Franchis la frontière : serif + sans, ou sans + mono.
- **Une seule police expressive par scène.** Tu choisis deux polices intéressantes pour faire « mieux ». L'une joue, l'autre s'efface.
- **Le contraste de graisse doit être extrême.** Par défaut, tu mets 400 contre 700. La vidéo demande 300 contre 900. La différence doit se voir d'un coup d'œil en mouvement.
- **Des tailles de vidéo, pas de web.** Texte : 20 px minimum. Titres : 60 px et plus. Étiquettes de données : 16 px. Tu vas essayer d'utiliser 14 px. Ne le fais pas.

## Ce que tu ne fais pas sans qu'on te le dise

- **La tension doit avoir un sens.** Ne fais pas d'associations par habitude. Demande-toi POURQUOI ces deux polices s'opposent. L'association doit incarner la contradiction du contenu — mécanique contre humain, public contre privé, institutionnel contre personnel. Si tu ne peux pas formuler la tension, elle est arbitraire.
- **Changer de registre.** Attribue des polices différentes à des modes de communication différents — une voix pour les affirmations, une autre pour les données, une autre pour l'attribution. Pas une hiérarchie sur une page. Des voix dans une conversation.
- **La tension peut vivre dans une seule police.** Une police qui paraît familière mais qui est secrètement étrange crée une tension avec les attentes du spectateur, pas avec une autre police.
- **Une seule variable changée = contraste spectaculaire.** Les mêmes formes de lettres, en chasse fixe ou proportionnelle. La même famille à différentes tailles optiques. Ne changer que le rythme quand tout le reste reste constant.
- **La double personnalité fonctionne.** Deux polices expressives peuvent coexister si elles partagent une attitude (toutes deux irrévérencieuses, toutes deux précises), même si leurs formes sont complètement différentes.
- **Le temps est une hiérarchie.** Le premier élément qui apparaît est le plus important. En vidéo, l'ordre remplace la position.
- **Le mouvement est de la typographie.** La façon dont un mot entre porte autant de sens que la police. Une claque de 0,1 s contre un fondu de 2 s — même police, message complètement différent.
- **Temps de lecture fixe.** 3 secondes à l'écran = doit se lire en 2. Moins de mots, texte plus grand.
- **Interlettrage plus serré que sur le web.** −0,03em à −0,05em sur les tailles d'affichage. L'encodage vidéo compresse les détails des lettres.
- **Accents et longueur du français.** Vérifie que la police choisie contient bien les capitales accentuées (É, À, Ç…) et que les textes français, souvent plus longs, tiennent dans le cadre.

## Trouver des polices

Ne prends pas par défaut ce que tu connais. Si le contenu est luxueux, une sans grotesque peut créer
plus de tension que la serif Didone attendue. Décide d'abord du registre, puis cherche.

Enregistre ce script dans `/tmp/fontquery.py` et lance-le avec
`curl -s 'https://fonts.google.com/metadata/fonts' > /tmp/gfonts.json && python3 /tmp/fontquery.py /tmp/gfonts.json` :

```python
import json, sys, random
from collections import OrderedDict

random.seed()  # vraiment aléatoire à chaque exécution

with open(sys.argv[1]) as f:
    data = json.load(f)
fonts = data.get("familyMetadataList", [])

ban = {"Inter","Roboto","Open Sans","Noto Sans","Lato","Poppins","Source Sans 3",
       "PT Sans","Nunito","Outfit","Sora","Playfair Display","Cormorant Garamond",
       "Bodoni Moda","EB Garamond","Cinzel","Prata","Arimo","Source Sans Pro","Syne"}
skip_pfx = ("Roboto","Noto ","Google Sans","Bpmf","Playwrite","Anek","BIZ ",
            "Nanum","Shippori","Sawarabi","Zen ","Kaisei","Kiwi ","Yuji ","Radio ")

def ok(f):
    if f["family"] in ban: return False
    if any(f["family"].startswith(b) for b in skip_pfx): return False
    if "latin" not in (f.get("subsets") or []): return False
    return True

seen = set()
R = OrderedDict()

# Sans tendance — récentes (2022+), populaires (<300)
R["Trending Sans"] = []
for f in fonts:
    if not ok(f) or f["family"] in seen: continue
    if f.get("category") in ("Sans Serif","Display") and f.get("dateAdded","") >= "2022-01-01" and f.get("popularity",9999) < 300:
        R["Trending Sans"].append(f); seen.add(f["family"])

# Serif tendance — récentes (2018+), populaires (<600)
R["Trending Serif"] = []
for f in fonts:
    if not ok(f) or f["family"] in seen: continue
    if f.get("category") == "Serif" and f.get("dateAdded","") >= "2018-01-01" and f.get("popularity",9999) < 600:
        R["Trending Serif"].append(f); seen.add(f["family"])

# Monospace — récentes (2018+), populaires (<600)
R["Monospace"] = []
for f in fonts:
    if not ok(f) or f["family"] in seen: continue
    if f.get("category") == "Monospace" and f.get("dateAdded","") >= "2018-01-01" and f.get("popularity",9999) < 600:
        R["Monospace"].append(f); seen.add(f["family"])

# Impact et condensées — polices d'affichage épaisses avec une graisse 800+
R["Impact & Condensed"] = []
for f in fonts:
    if not ok(f) or f["family"] in seen: continue
    has_heavy = any(k in list(f.get("fonts",{}).keys()) for k in ("800","900"))
    is_display = f.get("category") in ("Sans Serif","Display")
    if has_heavy and is_display and f.get("popularity",9999) < 400:
        R["Impact & Condensed"].append(f); seen.add(f["family"])

# Script et manuscrites — populaires (<300)
R["Script & Handwriting"] = []
for f in fonts:
    if not ok(f) or f["family"] in seen: continue
    if f.get("category") == "Handwriting" and f.get("popularity",9999) < 300:
        R["Script & Handwriting"].append(f); seen.add(f["family"])


# Mélanger les 5 premières de chaque catégorie pour que le LLM ne choisisse pas toujours le premier résultat
for cat in R:
    R[cat].sort(key=lambda x: x.get("popularity",9999))
    top5 = R[cat][:5]
    rest = R[cat][5:]
    random.shuffle(top5)
    R[cat] = top5 + rest
limits = {"Trending Sans":15,"Trending Serif":12,"Monospace":8,
          "Impact & Condensed":12,"Script & Handwriting":10}
for cat in R:
    items = R[cat][:limits.get(cat,10)]
    if not items: continue
    print(f"--- {cat} ({len(items)}) ---")
    for ff in items:
        var = "VAR" if ff.get("axes") else "   "
        print(f'  {ff.get("popularity"):4d} | {var} | {ff["family"]}')
    print()
```

Cinq catégories : sans tendance, serif tendance, monospace, impact/condensées, script/manuscrites.
Toutes filtrées dynamiquement à partir des métadonnées de Google Fonts — aucun nom de police codé en
dur. Franchis les frontières de classification quand tu associes des polices.

## Penser le choix

Ne choisis pas les polices par réflexe de catégorie (éditorial → serif, tech → mono, moderne → sans
géométrique). C'est de la reconnaissance de motif, pas du design.

1. **Nomme le registre.** Dans quelle voix parle le contenu ? Autorité institutionnelle ? Confession personnelle ? Précision technique ? Irrévérence décontractée ? Le registre réduit plus le choix que la catégorie.
2. **Pense physique.** Imagine la police comme un objet physique que la marque pourrait fabriquer — la légende d'une exposition de musée, une enseigne de boutique peinte à la main, le manuel d'un terminal d'ordinateur central des années 1970, une étiquette en tissu dans un manteau, un livre pour enfants imprimé sur du papier journal bon marché, un formulaire d'impôts. L'objet physique qui colle au registre indique le bon _type_ de police.
3. **Rejette ton premier instinct.** La première police qui paraît juste est en général ton choix par défaut issu de l'entraînement pour ce registre. Si tu l'as aussi choisie la dernière fois, trouve autre chose.
4. **Vérifie l'hypothèse.** Un brief éditorial n'a PAS besoin d'une serif. Un brief technique n'a PAS besoin d'une sans. Un produit pour enfants n'a PAS besoin d'une police d'affichage arrondie. Le choix le plus distinctif contredit souvent l'attente de la catégorie.

## Associer des polices proches

N'associe jamais deux polices proches mais pas identiques — deux sans géométriques, deux serif de
transition, deux sans humanistes. Elles créent une friction visuelle sans hiérarchie claire. Le
spectateur sent que quelque chose « cloche » sans pouvoir le formuler. Utilise soit une seule police
en deux graisses, soit des polices qui contrastent sur plusieurs axes : serif + sans, condensée + large, géométrique + humaniste.

## Fonds sombres

Un texte clair sur fond sombre crée deux illusions d'optique à compenser :

- **Poids apparent plus fort.** Le clair sur sombre paraît plus gras que le sombre sur clair à `font-weight` égal. Utilise 350 au lieu de 400 pour le texte. Les titres sont moins touchés car la taille compense.
- **Espacement apparent plus serré.** Les halos lumineux autour des lettres réduisent les espaces perçus. Augmente le `line-height` de 0,05 à 0,1 par rapport à ta valeur sur fond clair. Aux tailles d'affichage, ajoute 0,01em de `letter-spacing` pour compenser.

## Fonctions OpenType pour les données

La plupart des polices ont des fonctions OpenType désactivées par défaut. Active-les pour les compositions de données :

```css
/* Chiffres tabulaires — les chiffres s'alignent verticalement en colonnes */
.stat-value,
.timer,
.data-column {
  font-variant-numeric: tabular-nums;
}

/* Fractions en diagonale — affiche 1/2 comme ½ */
.recipe-amount,
.ratio {
  font-variant-numeric: diagonal-fractions;
}

/* Petites capitales pour les abréviations — moins criard */
.abbreviation,
.unit {
  font-variant-caps: all-small-caps;
}

/* Désactiver les ligatures dans le code — fi, fl, ffi doivent rester séparés */
code,
.code {
  font-variant-ligatures: none;
}
```

`tabular-nums` est indispensable dès que des chiffres sont empilés verticalement — encarts de
chiffres, minuteurs, tableaux de scores, tableaux de données. Sans lui, les chiffres ont des largeurs
proportionnelles et les colonnes ne s'alignent pas.

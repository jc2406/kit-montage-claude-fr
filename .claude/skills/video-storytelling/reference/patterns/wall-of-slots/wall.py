# -*- coding: utf-8 -*-
"""LE MUR - la colonne à cinq emplacements que toute la vidéo résout.

Importé par chaque constructeur de section pour que la cible d'arrimage, la matière
des emplacements et la ligne de résolution soient identiques partout. Rien ici n'est
propre à une section.

Les <defs> de la composition hôte doivent contenir :
    gNode   linearGradient  remplissage de la plaque, lumière en haut
    gEdge   linearGradient  lumière de bord directionnelle  (.97 -> .84 -> .70)
    shadow  filter          la pile d'ombres à trois couches
plus gWell - colle wall.DEFS si l'hôte ne le définit pas déjà.

Le CSS de l'hôte doit contenir .lab (60px), .lab-c (30px) et .num (84px).

Les coordonnées sont celles de l'univers 1920x1080. L'EMPLACEMENT 1 EST À (320,540)
ET NE DOIT PAS BOUGER - build_s01.py code en dur fit((0,24,1920,1080),(174,438,466,642),9.0)
comme arrimage.

Les emplacements vides sont des LOGEMENTS, pas des maquettes en fil de fer : une plaque
de verre avec une lumière de bord directionnelle et un biseau en haut, qui contient un
creux dont l'éclairage est inversé (ligne sombre en haut de la cavité, ligne claire au
fond). Ça se lit comme un support qui attend d'être rempli plutôt que comme un
emplacement en pointillés.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from geom import sq, arrow  # noqa: E402

# ------------------------------------------------------------------ géométrie
SLOT_W, SLOT_H, SLOT_R = 292.0, 204.0, 22.0
SLOT_CY = 540.0
SLOT_CX = (320.0, 640.0, 960.0, 1280.0, 1600.0)
WELL_W, WELL_H, WELL_R = 236.0, 148.0, 10.0
# F1 révèle les cinq à partir d'un tas en désordre : ils arrivent hors de la colonne et
# ne s'alignent que quand les domaines sont nommés. L'emplacement 3 ne bouge pas pour que
# le temps fort des critères puisse accrocher une colonne à un logement dont le y est connu.
SCATTER = (30.0, -22.0, 0.0, 26.0, -18.0)

STUB_TOP = SLOT_CY + SLOT_H / 2.0          # 642
SPINE_Y = 760.0
BRACKET_Y = 792.0
DOMAIN_Y = 852.0
SPINE_X0, SPINE_X1 = 140.0, 1780.0         # la colonne sous les cinq
SPINE_LEN = SPINE_X1 - SPINE_X0
FLOW_END = -SPINE_LEN                      # cible strokeDashoffset de #g-flow
SPINE_XL, SPINE_XR = 20.0, 1900.0          # ...et jusqu'où elle se prolonge

# quatre domaines sur cinq emplacements : le support et la voix relèvent tous deux du service
DOMAINS = (("ACQUISITION", (1,)), ("SERVICE", (2, 3)),
           ("BACK-OFFICE", (4,)), ("RH / OPÉRATIONS", (5,)))

STR = "#BFC9DA"
BLUE_INK = "#8FC0FF"
SW_HAIR, SW_REG, SW_EMPH, SW_HERO = 1.5, 2.5, 4, 7

DEFS = ('<linearGradient id="gWell" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#0D1424"/><stop offset="1" stop-color="#1E293E"/>'
        '</linearGradient>')


def _n(v):
    s = "%.1f" % float(v)
    return s[:-2] if s.endswith(".0") else s


# --------------------------------------------------------------------- API
def slot_center(i):
    """i commence à 1. Le centre de l'emplacement en coordonnées univers/écran."""
    return (SLOT_CX[i - 1], SLOT_CY)


def slot_rect(i):
    """i commence à 1. (x0,y0,x1,y1) - le rectangle dans lequel une section arrime sa carte."""
    cx, cy = slot_center(i)
    return (cx - SLOT_W / 2.0, cy - SLOT_H / 2.0, cx + SLOT_W / 2.0, cy + SLOT_H / 2.0)


def fit(rect, vp, pad=26.0):
    """Cadrer un rectangle de l'univers dans une fenêtre d'écran. svgOrigin vaut 960,540."""
    wx0, wy0, wx1, wy1 = rect
    vx0, vy0, vx1, vy1 = vp
    sc = min((vx1 - vx0 - 2 * pad) / float(wx1 - wx0),
             (vy1 - vy0 - 2 * pad) / float(wy1 - wy0))
    wcx, wcy = (wx0 + wx1) / 2.0, (wy0 + wy1) / 2.0
    vcx, vcy = (vx0 + vx1) / 2.0, (vy0 + vy1) / 2.0
    return (round(sc, 4),
            round(vcx - (960.0 + (wcx - 960.0) * sc), 1),
            round(vcy - (540.0 + (wcy - 540.0) * sc), 1))


def dock_cam(i, pad=9.0, world=(0.0, 24.0, 1920.0, 1080.0)):
    """La transformation de caméra qui pose toute la carte d'une section dans l'emplacement i.
    À mettre directement dans le dict CAM d'une section :  CAM["DOCK"] = wall.dock_cam(1)"""
    return fit(world, slot_rect(i), pad)


# ------------------------------------------------------------------- balisage
def slot_content_transform(i, world=(0.0, 24.0, 1920.0, 1080.0), pad=9.0):
    """Transformation SVG qui projette tout l'univers 1920x1080 dans le rectangle de l'emplacement i.

    C'est le jumeau STATIQUE de dock_cam() : dock_cam fait voler une carte en direct dans
    l'emplacement avec la caméra, celle-ci fige une carte terminée comme enfant de
    l'emplacement pour que le mur montre cinq cartes terminées en miniature au lieu de
    cinq plaques vides. À utiliser à l'assemblage : passe le balisage final de chaque
    section comme contenu du logement."""
    wx0, wy0, wx1, wy1 = world
    rx0, ry0, rx1, ry1 = slot_rect(i)
    sc = min((rx1 - rx0 - 2 * pad) / float(wx1 - wx0),
             (ry1 - ry0 - 2 * pad) / float(wy1 - wy0))
    wcx, wcy = (wx0 + wx1) / 2.0, (wy0 + wy1) / 2.0
    rcx, rcy = (rx0 + rx1) / 2.0, (ry0 + ry1) / 2.0
    return "translate(%s,%s) scale(%s)" % (_n(rcx - wcx * sc), _n(rcy - wcy * sc),
                                           ("%.5f" % sc).rstrip("0").rstrip("."))


def socket_markup(i, numerals=True, data_rows=True, gid=None, content=None,
                  world=(0.0, 24.0, 1920.0, 1080.0), pad=9.0):
    """Un logement en attente. Renvoie une liste de lignes SVG.

    content : liste optionnelle de lignes SVG écrites dans l'univers 1920x1080. Elles sont
    enveloppées dans <g class="sfill"> à l'opacité 0, déjà mises à l'échelle et placées
    dans le rectangle de l'emplacement. À révéler avec slot_fill_js(i, t)."""
    cx, cy = slot_center(i)
    gid = gid or ("g-slot-%d" % i)
    # class="slot" pour que les cinq soient pilotés par UNE seule animation (l'arrivée du mur
    # est un seul temps fort, et c'est elle qui a l'unique back.out de la section)
    L = ['<g id="' + gid + '" class="slot" opacity="0">']
    L.append('<path class="splate" d="' + sq(cx, cy, SLOT_W, SLOT_H, SLOT_R)
             + '" fill="url(#gNode)" opacity=".93" filter="url(#shadow)"/>')
    L.append('<path class="swell" d="' + sq(cx, cy, WELL_W, WELL_H, WELL_R)
             + '" fill="url(#gWell)"/>')
    L.append('<path class="swelld" d="M%s,%s h%s" stroke="rgba(0,0,0,.58)" stroke-width="%s" '
             'stroke-linecap="round"/>' % (_n(cx - 108), _n(cy - 72), _n(216), _n(SW_REG)))
    L.append('<path class="swellh" d="M%s,%s h%s" stroke="rgba(255,255,255,.28)" stroke-width="%s" '
             'stroke-linecap="round"/>' % (_n(cx - 108), _n(cy + 72), _n(216), _n(SW_HAIR)))
    L.append('<path class="srim" d="' + sq(cx, cy, SLOT_W - 4, SLOT_H - 4, SLOT_R)
             + '" fill="none" stroke="url(#gEdge)" stroke-width="%s"/>' % _n(SW_HAIR))
    L.append('<path class="sbev" d="M%s,%s h%s" stroke="rgba(255,255,255,.60)" stroke-width="%s" '
             'stroke-linecap="round"/>' % (_n(cx - 104), _n(cy - 96), _n(208), _n(SW_REG)))
    if content:
        L.append('<g class="sfill" opacity="0" transform="'
                 + slot_content_transform(i, world, pad) + '">')
        L.extend(content)
        L.append('</g>')
    if data_rows:
        L.append('<g class="sdata" opacity="0">')
        for k, w in enumerate((152.0, 116.0, 80.0)):
            L.append('<path d="M%s,%s h%s" stroke="%s" stroke-width="%s" stroke-linecap="round"/>'
                     % (_n(cx - 92), _n(cy + 16 + k * 22), _n(w), STR, _n(SW_HAIR)))
        L.append('</g>')
    if numerals:
        L.append('<text class="num snum" x="%s" y="%s" opacity="0">%02d</text>'
                 % (_n(cx), _n(cy + 30), i))
    L.append('</g>')
    return L


def wall_markup(numerals=True, data_rows=True, contents=None):
    """Les cinq logements. Renvoie (lines, ids).

    contents : {indice_emplacement: [lignes svg]} optionnel, des cartes terminées à figer
    dans les emplacements. Voir slot_content_transform()."""
    contents = contents or {}
    lines, ids = [], []
    for i in range(1, 6):
        lines.extend(socket_markup(i, numerals, data_rows, content=contents.get(i)))
        ids.append("g-slot-%d" % i)
    return lines, ids


def spine_markup():
    """La colonne unique sur laquelle reposent les cinq, les amorces qui les y accrochent,
    les quatre accolades de domaine avec leurs étiquettes, le prolongement du rail au-delà
    des cinq, et le flux qui parcourt l'ensemble. Renvoie (lines, ids)."""
    lines, ids = [], []

    d = "M%s,%s H%s" % (_n(SPINE_X0), _n(SPINE_Y), _n(SPINE_X1))
    ln = SPINE_X1 - SPINE_X0
    lines.append('<g id="g-spine" opacity="0"><path class="spn" d="' + d
                 + '" stroke="%s" stroke-width="%s" stroke-linecap="round" fill="none" '
                   'stroke-dasharray="%s" stroke-dashoffset="%s"/></g>'
                 % (STR, _n(SW_REG), _n(ln), _n(ln)))
    ids.append("g-spine")

    for i in range(1, 6):
        cx, _ = slot_center(i)
        h = SPINE_Y - STUB_TOP
        lines.append('<g id="g-stub-%d" opacity="0"><path class="spn" d="M%s,%s V%s" '
                     'stroke="%s" stroke-width="%s" stroke-linecap="round" fill="none" '
                     'stroke-dasharray="%s" stroke-dashoffset="%s"/></g>'
                     % (i, _n(cx), _n(STUB_TOP), _n(SPINE_Y), STR, _n(SW_HAIR), _n(h), _n(h)))
        ids.append("g-stub-%d" % i)

    for k, (name, group) in enumerate(DOMAINS):
        x0 = slot_rect(group[0])[0]
        x1 = slot_rect(group[-1])[2]
        mid = (x0 + x1) / 2.0
        lines.append('<g id="g-dom-%d" opacity="0">' % (k + 1))
        lines.append('<path class="brk" d="M%s,%s v14 H%s v-14" stroke="%s" stroke-width="%s" '
                     'fill="none" stroke-linecap="round"/>'
                     % (_n(x0), _n(BRACKET_Y), _n(x1), STR, _n(SW_HAIR)))
        lines.append('<text class="lab lab-c" x="%s" y="%s">%s</text>'
                     % (_n(mid), _n(DOMAIN_Y), name))
        lines.append('</g>')
        ids.append("g-dom-%d" % (k + 1))

    lines.append('<g id="g-spine-x" opacity="0">')
    for (a, b) in ((SPINE_X0, SPINE_XL), (SPINE_X1, SPINE_XR)):
        lines.append('<path class="spn" d="M%s,%s H%s" stroke="%s" stroke-width="%s" fill="none" '
                     'stroke-dasharray="%s" stroke-dashoffset="%s"/>'
                     % (_n(a), _n(SPINE_Y), _n(b), STR, _n(SW_HAIR),
                        _n(abs(b - a)), _n(abs(b - a))))
    lines.append('</g>')
    ids.append("g-spine-x")

    # une impulsion qui voyage, pas un tracé progressif : le tiret commence entièrement AVANT
    # le tracé (décalage +tiret) et est animé jusqu'à FLOW_END pour sortir entièrement après la fin.
    lines.append('<g id="g-flow" opacity="0"><path class="flw" d="' + d
                 + '" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round" '
                   'stroke-dasharray="%s %s" stroke-dashoffset="%s"/></g>'
                 % (BLUE_INK, _n(SW_EMPH), _n(ln * 0.30), _n(ln * 2.0), _n(ln * 0.30)))
    ids.append("g-flow")
    return lines, ids


def payoff_markup(gid="g-payoff", y=None):
    """LA LIGNE DE RÉSOLUTION. Une ligne qui traverse les cinq, entre à gauche de
    l'emplacement 1 et sort à droite de l'emplacement 5 avec la seule pointe de flèche du mur.
    À révéler avec strokeDashoffset:0 une fois chaque emplacement rempli. Renvoie (lines, ids)."""
    y = SLOT_CY if y is None else y
    x0, x1 = 40.0, 1854.0
    ln = x1 - x0
    lines = ['<g id="' + gid + '" opacity="0">',
             '<path class="pay" d="M%s,%s H%s" stroke="%s" stroke-width="%s" fill="none" '
             'stroke-linecap="round" stroke-dasharray="%s" stroke-dashoffset="%s"/>'
             % (_n(x0), _n(y), _n(x1), BLUE_INK, _n(SW_HERO), _n(ln), _n(ln)),
             '<path class="payah" d="' + arrow(1880.0, y, 0, 22)
             + '" fill="%s" opacity="0"/>' % BLUE_INK,
             '</g>']
    return lines, [gid]


# ----------------------------------------------------------------- timeline
def wall_reveal_js(t, tl="m", q="Q", wall="g-wall", dur=0.5, stagger=0.07, to=0.9):
    """Faire apparaître le mur derrière une carte terminée, à la sortie d'une section."""
    r = repr(round(t, 3))
    return [tl + '.set(' + q + '("#' + wall + '"),{opacity:1},' + r + ');',
            tl + '.to(' + q + '("#' + wall + ' .slot"),{opacity:' + repr(to)
            + ',duration:' + repr(dur) + ',ease:"power4.out",stagger:' + repr(stagger) + '},'
            + r + ');']


def slot_fill_js(i, t, dur=0.6, tl="m", q="Q"):
    """Passer l'emplacement i de logement vide à rempli : la carte miniature figée apparaît
    pendant que la cavité, sa lumière de fond et son numéro s'effacent. À utiliser à la
    résolution, où les cinq sont déjà terminés, plutôt que slot_dock_js (qui sert à une
    carte en direct qui arrive avec la caméra)."""
    g = "#g-slot-%d" % i
    r = repr(round(t, 3))
    out = [tl + '.to(' + q + '("' + g + ' .sfill"),{opacity:1,duration:' + repr(dur)
           + ',ease:"power4.out"},' + r + ');']
    for cls in ("swell", "swellh", "swelld", "snum"):
        out.append(tl + '.to(' + q + '("' + g + ' .' + cls + '"),{opacity:0,duration:'
                   + repr(round(dur * 0.6, 3)) + ',ease:"power2.in"},' + r + ');')
    return out


def slot_dock_js(i, t, dur=1.4, tl="m", q="Q"):
    """Confier l'emplacement i à la carte qui s'y pose : la cavité, sa lumière de fond et son
    numéro s'effacent pendant que la caméra fait descendre la carte dans le rectangle.
    À associer à une animation de caméra vers dock_cam(i) qui commence au même t."""
    g = "#g-slot-%d" % i
    r = repr(round(t, 3))
    out = []
    for cls, f in (("swell", 0.55), ("swellh", 0.55), ("swelld", 0.55), ("snum", 0.40)):
        out.append(tl + '.to(' + q + '("' + g + ' .' + cls + '"),{opacity:0,duration:'
                   + repr(round(dur * f, 3)) + ',ease:"power2.in"},' + r + ');')
    return out


def payoff_js(t, dur=2.6, tl="m", q="Q", gid="g-payoff"):
    """Tracer la ligne unique à travers les cinq, puis poser la pointe de flèche."""
    r = repr(round(t, 3))
    return [
        tl + '.set(' + q + '("#' + gid + '"),{opacity:1},' + r + ');',
        tl + '.to(' + q + '("#' + gid + ' .pay"),{strokeDashoffset:0,duration:' + repr(dur)
        + ',ease:"power2.inOut"},' + r + ');',
        tl + '.to(' + q + '("#' + gid + ' .payah"),{opacity:1,duration:0.3,ease:"power4.out"},'
        + repr(round(t + dur - 0.18, 3)) + ');',
    ]

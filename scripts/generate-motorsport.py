"""Generate a genuine vector, orthographic single-seater drawing.

The silhouette follows the FIA 2026 concept overhead render. Axle spacing and
maximum width are calibrated at 0.3 SVG units per millimetre. Team branding,
sponsor marks and the reference image are not embedded in the SVG.
"""

from pathlib import Path
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "experiments"
OUTPUT.mkdir(parents=True, exist_ok=True)

GEOMETRY = {
    "viewBox": [0, 0, 1600, 610],
    "units_per_mm": 0.3,
    "wheelbase_mm": 3400,
    "maximum_width_mm": 1900,
    "front_axle_x": 336,
    "rear_axle_x": 1356,
    "centreline_y": 305,
    "outer_tyre_y": [20, 590],
    "front_tyre_plan_mm": [715, 280],
    "rear_tyre_plan_mm": [715, 375],
    "tyre_note": "Illustrative footprints, not a supplier specification.",
    "reference": "https://www.formula1.com/en/latest/article/gallery-check-out-every-angle-of-the-2026-f1-car.3W738wJViWXa3NVDNHSEaQ.3W738wJViWXa3NVDNHSEaQ",
    "dimensional_source": "https://www.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_c_technical_-_iss_16_-_2026-02-27.pdf",
}

STYLES = {
    "model": {
        "ink": "#24242a", "detail": "#7c7d86", "rubber": "#25252b",
        "rubber_line": "#74747c", "floor": "#e2e3e7", "body": "#f5f5f7",
        "body_alt": "#ebecf0", "wing": "#e9eaee", "cockpit": "#34343b",
        "halo": "#777881", "seat": "#56565e", "stroke_width": "2.3",
    },
    "outline": {
        "ink": "#62636c", "detail": "#a3a4ad", "rubber": "#eeeef0",
        "rubber_line": "#b0b1b9", "floor": "#ffffff", "body": "#ffffff",
        "body_alt": "#f7f7f8", "wing": "#ffffff", "cockpit": "#eeeef0",
        "halo": "#d3d4d9", "seat": "#d3d4d9", "stroke_width": "2.7",
    },
}


def build(variant):
    p = STYLES[variant]
    parts = []

    def path(d, cls="body", **attributes):
        extra = " ".join(f'{key.replace("_", "-")}="{value}"' for key, value in attributes.items())
        parts.append(f'<path class="{cls}" d="{d}" {extra}/>')

    def rect(x, y, width, height, radius=0, cls="body", **attributes):
        extra = " ".join(f'{key.replace("_", "-")}="{value}"' for key, value in attributes.items())
        parts.append(f'<rect class="{cls}" x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" {extra}/>')

    def use(name, mirrored=False):
        transform = ' transform="translate(0 610) scale(1 -1)"' if mirrored else ""
        parts.append(f'<use href="#{name}"{transform}/>')

    def group(name):
        parts.append(f'<g id="{name}">')

    def end():
        parts.append('</g>')

    # Flat floor, with the front bib, fences and the rear diffuser kept distinct.
    group("floor-assembly")
    path("M518 80 L642 122 C785 159 1070 122 1268 124 L1380 143 L1421 227 L1421 383 L1380 467 L1268 486 C1070 488 785 451 642 488 L518 530 L531 466 C605 450 632 418 619 368 L619 242 C632 192 605 160 531 144 Z", "floor")
    path("M536 100 L641 141 C807 179 1077 142 1270 142 L1370 158", "detail")
    path("M536 510 L641 469 C807 431 1077 468 1270 468 L1370 452", "detail")
    path("M600 165 L617 188 L623 222 M600 445 L617 422 L623 388", "detail")
    for y in [229, 252, 276, 305, 334, 358, 381]:
        path(f"M1330 {y} L1442 {y}", "detail")
    end()

    # Front and rear wishbones: mirrored about the true vehicle centreline.
    parts.append('<defs>')
    group("front-suspension")
    path("M320 96 L344 101 L491 245 L472 253 Z", "suspension")
    path("M320 96 L333 104 L286 264 L266 269 Z", "suspension")
    path("M334 108 L351 117 L390 258 L379 260 Z", "suspension")
    path("M323 111 L303 262", "detail")
    rect(304, 121, 19, 45, 3, "suspension")
    end()
    group("rear-suspension")
    path("M1327 119 L1350 120 L1251 265 L1227 272 Z", "suspension")
    path("M1354 121 L1371 116 L1438 270 L1414 273 Z", "suspension")
    path("M1347 131 L1363 131 L1363 274 L1347 274 Z", "suspension")
    path("M1340 133 L1270 273", "detail")
    end()
    parts.append('</defs>')
    use("front-suspension")
    use("front-suspension", True)
    use("rear-suspension")
    use("rear-suspension", True)

    # Exposed slick tyres are oblong in plan, never circular in an overhead view.
    group("wheels")
    for axle, x, width in [("front", 336, 84), ("rear", 1356, 112.5)]:
        for side, y in [("upper", 20), ("lower", 590 - width)]:
            rect(x - 107.25, y, 214.5, width, 18, "tyre", data_axle=axle, data_side=side, data_centre_x=x)
            path(f"M{x-82} {y+8} C{x-32} {y+3} {x+35} {y+3} {x+82} {y+8}", "tyre-detail")
            path(f"M{x-82} {y+width-8} C{x-32} {y+width-3} {x+35} {y+width-3} {x+82} {y+width-8}", "tyre-detail")
            path(f"M{x-98} {y+23} L{x-98} {y+width-23} M{x+98} {y+23} L{x+98} {y+width-23}", "tyre-detail")
            path(f"M{x-67} {y+width/2} L{x+67} {y+width/2}", "tyre-highlight")
    end()

    # Two-element bowed front wing, with individual endplates and flap seams.
    group("front-wing")
    path("M64 37 L214 35 L214 91 L156 107 C144 164 128 236 130 305 C128 374 144 446 156 503 L214 519 L214 575 L64 573 C45 517 22 410 16 326 L16 284 C22 200 45 93 64 37 Z", "wing")
    path("M84 50 C59 136 39 222 36 284 L36 326 C39 388 59 474 84 560", "detail")
    path("M114 52 C94 137 77 218 77 276 L77 334 C77 392 94 473 114 558", "detail")
    path("M146 54 C129 130 118 214 118 274 L118 336 C118 396 129 480 146 556", "detail")
    path("M69 47 L211 45 L211 92 L156 102 L151 83 L71 83 Z", "body-alt")
    path("M69 563 L211 565 L211 518 L156 508 L151 527 L71 527 Z", "body-alt")
    path("M74 56 L199 55 M77 70 L203 69 M74 554 L199 555 M77 540 L203 541", "detail")
    rect(16, 272, 21, 66, 8, "wing")
    end()

    # Continuous monocoque/nose. The taper is traced as a contour, not a wedge.
    group("survival-cell")
    path("M20 275 C42 262 115 267 199 260 L448 238 C503 229 549 217 603 198 C657 178 704 164 773 166 L859 172 C926 183 978 213 1027 243 L1074 270 L1074 340 L1027 367 C978 397 926 427 859 438 L773 444 C704 446 657 432 603 412 C549 393 503 381 448 372 L199 350 C115 343 42 348 20 335 C9 325 7 285 20 275 Z", "body")
    path("M31 282 C75 278 143 281 200 276 L448 253 C511 244 553 232 608 214", "detail")
    path("M31 328 C75 332 143 329 200 334 L448 357 C511 366 553 378 608 396", "detail")
    path("M200 275 L200 335 M445 253 L445 357", "detail")
    path("M116 290 C129 286 160 286 180 290 L180 320 C160 324 129 324 116 320 Z", "body-alt")
    path("M484 253 L507 259 L507 351 L484 357", "detail")
    end()

    # Sidepods and their undercuts, reflected from one shared half geometry.
    parts.append('<defs>')
    group("sidepod")
    path("M594 204 C619 127 688 92 782 86 C894 74 996 113 1093 160 C1187 206 1265 236 1351 260 L1345 277 C1226 258 1117 224 1018 196 C898 160 758 156 660 220 L602 234 Z", "body-alt")
    path("M625 183 C648 139 699 117 765 112 C880 96 981 129 1086 178 C1182 222 1252 244 1324 262", "detail")
    path("M642 197 C679 168 724 157 769 155 L764 172 C716 178 682 188 653 210 Z", "intake")
    path("M658 213 C760 163 881 170 1004 202 C1120 233 1228 260 1328 274", "detail")
    path("M671 128 C745 110 822 110 885 121", "detail")
    for i in range(7):
        x = 868 + i * 23
        y = 137 + i * 7
        path(f"M{x} {y} L{x+27} {y+10} L{x+15} {y+17} L{x-8} {y+10} Z", "vent")
    end()
    parts.append('</defs>')
    use("sidepod")
    use("sidepod", True)

    # Mirror pods and struts, intentionally separate from the sidepod envelope.
    group("mirrors")
    path("M588 174 L610 174 L610 239 L602 239 Z", "suspension")
    path("M588 371 L610 371 L610 436 L602 436 Z", "suspension")
    path("M587 129 L612 147 L604 194 L584 190 L572 177 Z", "body-alt")
    path("M587 481 L612 463 L604 416 L584 420 L572 433 Z", "body-alt")
    path("M582 143 L603 153 M582 467 L603 457", "detail")
    end()

    # Cockpit, a true top-view halo loop and its central forward support.
    group("cockpit")
    path("M637 254 C660 237 684 233 711 233 L846 233 C883 233 901 257 901 305 C901 353 883 377 846 377 L711 377 C684 377 660 373 637 356 L612 305 Z", "cockpit")
    rect(688, 258, 140, 94, 15, "seat")
    rect(853, 265, 48, 80, 11, "seat")
    path("M670 264 L664 283 L664 327 L670 346 M685 250 L685 360", "cockpit-detail")
    path("M601 305 C628 247 659 226 714 223 L833 223 C883 223 910 247 910 305 C910 363 883 387 833 387 L714 387 C659 384 628 363 601 305 Z", "halo")
    path("M601 305 L647 305", "halo-pillar")
    path("M626 285 C652 248 672 239 716 238 L831 238", "detail")
    path("M626 325 C652 362 672 371 716 372 L831 372", "detail")
    rect(641, 294, 24, 22, 4, "intake")
    end()

    # Airbox, tapered engine cover, dorsal ridge and rear impact structure.
    group("engine-cover")
    path("M920 252 C982 253 1028 261 1085 272 C1174 287 1254 277 1354 278 L1363 291 L1363 319 L1354 332 C1254 333 1174 323 1085 338 C1028 349 982 357 920 358 Z", "body")
    path("M942 279 C1003 282 1084 294 1164 297 L1334 290 M942 331 C1003 328 1084 316 1164 313 L1334 320", "detail")
    path("M952 305 L1356 305", "ridge")
    rect(933, 259, 34, 92, 4, "body-alt")
    rect(940, 279, 13, 52, 5, "intake")
    path("M1363 293 L1462 293 L1462 317 L1363 317 Z", "suspension")
    rect(1441, 290, 35, 30, 5, "suspension")
    # New Machines' Morse motif, without recreating third-party sponsor marks.
    for i in range(5):
        path(f"M{1100+i*4} 299 L{1104+i*4} 299 L{1097+i*4} 311 L{1093+i*4} 311 Z", "livery")
    for x, w in [(1128, 6), (1140, 18), (1164, 18)]:
        path(f"M{x+7} 299 L{x+w+7} 299 L{x+w} 311 L{x} 311 Z", "livery")
    end()

    group("rear-wing")
    path("M1462 123 L1578 123 L1584 142 L1584 468 L1578 487 L1462 487 Z", "wing")
    path("M1482 133 L1482 477 M1513 133 L1513 477 M1558 133 L1558 477", "detail")
    rect(1453, 117, 135, 12, 3, "body-alt")
    rect(1453, 481, 135, 12, 3, "body-alt")
    path("M1466 136 L1482 136 L1482 474 L1466 474 Z", "body-alt")
    path("M1517 138 L1554 138 L1554 472 L1517 472 Z", "body-alt")
    rect(1422, 301, 107, 8, 2, "suspension")
    end()

    css = f"""
      .body,.body-alt,.wing,.floor,.cockpit,.seat,.intake,.tyre{{stroke:{p['ink']};stroke-width:{p['stroke_width']};stroke-linejoin:round}}
      .body{{fill:{p['body']}}}.body-alt{{fill:{p['body_alt']}}}.wing{{fill:{p['wing']}}}.floor{{fill:{p['floor']}}}
      .suspension,.intake{{fill:{p['ink']}}}.tyre{{fill:{p['rubber']}}}.cockpit{{fill:{p['cockpit']}}}.seat{{fill:{p['seat']}}}
      .detail{{fill:none;stroke:{p['detail']};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}}
      .vent{{fill:{p['floor']};stroke:{p['detail']};stroke-width:1.3}}
      .tyre-detail{{fill:none;stroke:{p['rubber_line']};stroke-width:1.4;stroke-linecap:round}}
      .tyre-highlight{{fill:none;stroke:{p['rubber_line']};stroke-width:1;opacity:.35}}
      .halo{{fill:none;stroke:{p['halo']};stroke-width:12;stroke-linejoin:round}}
      .halo-pillar{{fill:none;stroke:{p['halo']};stroke-width:10;stroke-linecap:round}}
      .cockpit-detail{{fill:none;stroke:{p['rubber_line']};stroke-width:2}}
      .ridge{{fill:none;stroke:{p['ink']};stroke-width:2.5}}
      .livery{{fill:{p['ink']};stroke:none}}
    """
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 610" width="1600" height="610" role="img" aria-labelledby="car-title car-description">
      <title id="car-title">NM-01 - 2026 single-seater concept, top view</title>
      <desc id="car-description">A proportioned orthographic vector with 3400 mm axle spacing and a 1900 mm width envelope. Shape study based on the FIA 2026 concept overhead render, with original New Machines detailing.</desc>
      <metadata>{json.dumps(GEOMETRY)}</metadata><style>{css}</style>
      {''.join(parts)}
    </svg>'''
    ET.fromstring(svg)  # Refuse malformed SVG before writing an artifact.
    return svg


for name in ["model", "outline"]:
    (OUTPUT / f"nm-01-top-{name}.svg").write_text(build(name), encoding="utf-8")
(OUTPUT / "nm-01-geometry.json").write_text(json.dumps(GEOMETRY, indent=2), encoding="utf-8")
print("Generated both SVG models. Wheelbase/width ratio:", GEOMETRY["wheelbase_mm"] / GEOMETRY["maximum_width_mm"])

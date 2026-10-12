"""Build a compact, equally spaced land-dot mesh from Natural Earth's land polygons."""
import array
import json
import math
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / '.design/japac-globe/reference/land.geojson'
OUT = ROOT / 'public/globe'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads(SOURCE.read_text(encoding='utf-8'))
mask = Image.new('1', (3600, 1800))
draw = ImageDraw.Draw(mask)
for feature in data['features']:
    geometry = feature['geometry']
    polygons = geometry['coordinates'] if geometry['type'] == 'MultiPolygon' else [geometry['coordinates']]
    for rings in polygons:
        for i, ring in enumerate(rings):
            draw.polygon([((lon + 180) * 10, (90 - lat) * 10) for lon, lat in ring], fill=1 if i == 0 else 0)

positions = array.array('f')
coordinates = []
lat = -85.0
while lat < 85:
    stride = .7 / max(.08, math.cos(math.radians(lat)))
    lon = -180.0
    while lon < 180:
        px, py = min(3599, int((lon + 180) * 10)), min(1799, int((90 - lat) * 10))
        if mask.getpixel((px, py)):
            phi, theta = math.radians(lat), math.radians(lon)
            positions.extend([math.cos(phi) * math.sin(theta), math.sin(phi), math.cos(phi) * math.cos(theta)])
            coordinates.append((lat, lon))
        lon += stride
    lat += .7
(OUT / 'land-points.bin').write_bytes(positions.tobytes())

# Matching SVG remains visible until WebGL is ready and on devices without it.
nodes = []
pitch, yaw = math.radians(22), math.radians(-132)
for i, (lat, lon) in enumerate(coordinates):
    x, y, z = positions[i * 3:i * 3 + 3]
    xx, zz = math.cos(yaw) * x + math.sin(yaw) * z, -math.sin(yaw) * x + math.cos(yaw) * z
    yy, z = math.cos(pitch) * y - math.sin(pitch) * zz, math.sin(pitch) * y + math.cos(pitch) * zz
    if z > .04:
        colour = '#55555e' if 90 < lon < 180 and -50 < lat < 60 else '#bdbdc5'
        nodes.append(f'<circle cx="{300 + xx * 240:.2f}" cy="{300 - yy * 240:.2f}" r=".82" fill="{colour}"/>')
(OUT / 'japac-fallback.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">' + ''.join(nodes) + '</svg>', encoding='utf-8')
(OUT / 'source.json').write_text(json.dumps({'source': 'https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_land.geojson', 'license': 'Natural Earth public domain', 'points': len(coordinates), 'spacingDegrees': .7}), encoding='utf-8')
print(f'{len(coordinates)} land points, {len(positions) * 4:,} bytes')

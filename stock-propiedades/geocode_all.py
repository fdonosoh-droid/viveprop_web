"""
Geocodifica todas las direcciones únicas del stock y genera geocodes.js
Correr una sola vez. Si ya existe geocodes.js, solo agrega las nuevas.
"""
import json, re, time, urllib.request, urllib.parse, os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DATA_JS   = os.path.join(os.path.dirname(__file__), 'data.js')
OUT_JS    = os.path.join(os.path.dirname(__file__), 'geocodes.js')
DELAY     = 1.2   # segundos entre requests (Nominatim policy)
HEADERS   = {'User-Agent': 'ViveProp-StockMap/1.0 (propiedadesdomingof@gmail.com)'}

# ── 1. Leer data.js y extraer pares únicos direccion|comuna ──────────────────
with open(DATA_JS, encoding='utf-8') as f:
    raw = f.read()

# Extrae el JSON del array STOCK
m = re.search(r'const STOCK\s*=\s*(\[.*\])', raw, re.DOTALL)
if not m:
    raise SystemExit("No se encontró STOCK en data.js")

stock = json.loads(m.group(1))
pairs = {}  # key -> (direccion, comuna)
for p in stock:
    d = (p.get('direccion') or '').strip()
    c = (p.get('comuna')    or '').strip()
    if d and c:
        pairs[f"{d}|{c}"] = (d, c)

print(f"Direcciones únicas encontradas: {len(pairs)}")

# ── 2. Cargar cache existente ────────────────────────────────────────────────
existing = {}
if os.path.exists(OUT_JS):
    with open(OUT_JS, encoding='utf-8') as f:
        txt = f.read()
    m2 = re.search(r'const GEOCODES\s*=\s*(\{.*\})', txt, re.DOTALL)
    if m2:
        existing = json.loads(m2.group(1))
    print(f"Cache existente: {len(existing)} entradas")

# ── 3. Geocodificar solo las nuevas ──────────────────────────────────────────
pending = {k: v for k, v in pairs.items() if k not in existing}
print(f"Pendientes de geocodificar: {len(pending)}")

results = dict(existing)
errors  = []

for i, (key, (direccion, comuna)) in enumerate(pending.items(), 1):
    q = urllib.parse.quote(f"{direccion}, {comuna}, Santiago, Chile")
    url = f"https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=1"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        if data:
            results[key] = [round(float(data[0]['lat']), 6),
                            round(float(data[0]['lon']), 6)]
            status = f"OK {results[key]}"
        else:
            results[key] = None
            errors.append(key)
            status = "NO resultado"
    except Exception as e:
        results[key] = None
        errors.append(key)
        status = f"ERROR: {e}"

    pct = round(i / len(pending) * 100)
    print(f"[{pct:3d}%] ({i}/{len(pending)}) {key[:60]}  ->  {status}")
    time.sleep(DELAY)

# ── 4. Escribir geocodes.js ──────────────────────────────────────────────────
with open(OUT_JS, 'w', encoding='utf-8') as f:
    f.write('// Auto-generado por geocode_all.py — no editar manualmente\n')
    f.write(f'// Entradas: {len(results)} | Nulas: {sum(1 for v in results.values() if v is None)}\n')
    f.write('const GEOCODES = ')
    f.write(json.dumps(results, ensure_ascii=False, indent=2))
    f.write(';\n')

print(f"\nOK geocodes.js generado -- {len(results)} entradas, {len(errors)} sin coordenadas")
if errors:
    print("Sin resultado:")
    for e in errors[:20]:
        print(f"  · {e}")

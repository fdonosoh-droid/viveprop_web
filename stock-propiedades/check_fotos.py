"""
Verifica qué propiedades de Ñuñoa y Providencia tienen fotos en AssetPlan API.
Genera reporte en check_fotos_result.txt
"""
import json, re, time, urllib.request, os, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DATA_JS = os.path.join(os.path.dirname(__file__), 'data.js')
OUT_TXT = os.path.join(os.path.dirname(__file__), 'check_fotos_result.txt')
API_URL = 'https://api.assetplan.cl/api/v1/property/for_sale/{}?list=1'
DELAY   = 0.8
COMUNAS = {'ñuñoa', 'providencia'}

with open(DATA_JS, encoding='utf-8') as f:
    raw = f.read()

m = re.search(r'const STOCK\s*=\s*(\[.*\])', raw, re.DOTALL)
if not m:
    raise SystemExit("No se encontro STOCK en data.js")

stock = json.loads(m.group(1))
target = [p for p in stock if (p.get('comuna') or '').strip().lower() in COMUNAS]

print(f"Total propiedades Nunoa+Providencia: {len(target)}")

sin_fotos = []
con_fotos = []
errores   = []

for i, p in enumerate(target, 1):
    op  = p.get('op', '?')
    pid = p.get('id', '')
    comuna = p.get('comuna', '')
    cond   = p.get('condominio', '')
    dp     = p.get('dp', '')

    if not pid:
        sin_fotos.append({'op': op, 'id': pid, 'comuna': comuna, 'cond': cond, 'dp': dp, 'motivo': 'sin id'})
        print(f"[{i}/{len(target)}] OP {op} - sin id")
        continue

    url = API_URL.format(pid)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=12) as r:
            data = json.loads(r.read())

        fotos = data.get('fotos') or data.get('fotos_originales') or []
        # also check nested
        if not fotos and isinstance(data, dict):
            for key in ('property', 'data', 'result'):
                sub = data.get(key)
                if isinstance(sub, dict):
                    fotos = sub.get('fotos') or sub.get('fotos_originales') or []
                    if fotos:
                        break

        n = len(fotos)
        entry = {'op': op, 'id': pid, 'comuna': comuna, 'cond': cond, 'dp': dp, 'n_fotos': n}
        if n == 0:
            sin_fotos.append({**entry, 'motivo': 'fotos=[]'})
            status = "SIN FOTOS"
        else:
            con_fotos.append(entry)
            status = f"OK ({n} fotos)"

    except Exception as e:
        errores.append({'op': op, 'id': pid, 'comuna': comuna, 'cond': cond, 'dp': dp, 'error': str(e)})
        status = f"ERROR: {e}"

    pct = round(i / len(target) * 100)
    print(f"[{pct:3d}%] ({i}/{len(target)}) OP {op} | {comuna} | {cond} DP{dp}  ->  {status}")
    time.sleep(DELAY)

# --- Reporte ---
lines = []
lines.append("=" * 70)
lines.append(f"REPORTE FOTOS: NUNOA + PROVIDENCIA")
lines.append(f"Total consultadas: {len(target)}")
lines.append(f"Con fotos:         {len(con_fotos)}")
lines.append(f"SIN fotos:         {len(sin_fotos)}")
lines.append(f"Errores API:       {len(errores)}")
lines.append("=" * 70)

lines.append(f"\n--- PROPIEDADES SIN FOTOS ({len(sin_fotos)}) ---")
for p in sin_fotos:
    lines.append(f"  OP {p['op']:10s}  id={p['id']:8s}  {p['comuna']:15s}  {p['cond']} DP{p['dp']}  [{p.get('motivo','')}]")

if errores:
    lines.append(f"\n--- ERRORES API ({len(errores)}) ---")
    for p in errores:
        lines.append(f"  OP {p['op']:10s}  id={p['id']:8s}  {p['comuna']:15s}  {p['cond']}  ERROR: {p['error'][:60]}")

lines.append("\n--- PROPIEDADES CON FOTOS ---")
for p in con_fotos:
    lines.append(f"  OP {p['op']:10s}  id={p['id']:8s}  {p['comuna']:15s}  {p['cond']} DP{p['dp']}  ({p['n_fotos']} fotos)")

report = '\n'.join(lines)
with open(OUT_TXT, 'w', encoding='utf-8') as f:
    f.write(report)

print(f"\n==> Reporte guardado en check_fotos_result.txt")
print(f"    Sin fotos: {len(sin_fotos)} | Con fotos: {len(con_fotos)} | Errores: {len(errores)}")

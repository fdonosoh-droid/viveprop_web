"""
gsheet_to_stock.py — Descarga el stock de propiedades usadas desde Google Sheets
y genera stock.json + stock.js para el programa.

Uso: python tools/gsheet_to_stock.py
"""
import sys, csv, io, re, json, requests
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse, parse_qs

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Configuración ─────────────────────────────────────────────────────────────

SHEET_URL  = (
    "https://docs.google.com/spreadsheets/d/"
    "18oR3_vRDG-_wfTU0bTZQX20yoG9A5MgQpkUNzLFTJoc"
    "/export?format=csv&gid=162036413"
)
ROOT       = Path(__file__).parent.parent
OUT_JSON   = ROOT / "frontend" / "public" / "data" / "stock.json"
OUT_JS     = ROOT / "data" / "stock.js"

# ── Helpers ───────────────────────────────────────────────────────────────────

def dash(v):
    """Convierte None, vacío o '-' a string vacío."""
    return "" if str(v or "").strip() in ("-", "None", "") else str(v).strip()

def bono_pct(v):
    """Convierte '10%' o '10' a entero 10."""
    s = str(v or "").strip().replace("%", "").strip()
    try:
        return int(float(s))
    except (ValueError, TypeError):
        return 0

def extract_id(link):
    """
    Extrae el ID numérico de AssetPlan desde LINK PUBLICACIÓN.
    Soporta dos formatos:
      - ?title=nombre-edificio-468246  → '468246'
      - ?title=476440                  → '476440'
    """
    link = str(link or "").strip().rstrip("/")
    if not link or link == "-":
        return ""
    qs    = parse_qs(urlparse(link).query)
    title = qs.get("title", [""])[0]
    if re.fullmatch(r"\d+", title):
        return title
    m = re.search(r"-(\d+)$", title) or re.search(r"-(\d+)$", link)
    return m.group(1) if m else ""

# ── Mapeo de una fila CSV → dict stock ───────────────────────────────────────

def map_row(headers, row):
    while len(row) < len(headers):
        row.append("")
    r = dict(zip(headers, row))
    return {
        "op":           dash(r.get("OP")),
        "condominio":   dash(r.get("CONDOMINIO")),
        "direccion":    dash(r.get("DIRECCIÓN", "")),
        "comuna":       dash(r.get("COMUNA")),
        "dp":           dash(r.get("DP")),
        "tipologia":    dash(r.get("TIPOLOGIA")),
        "orientacion":  dash(r.get("ORIENTACION")),
        "est":          dash(r.get("EST")),
        "bod":          dash(r.get("BOD")),
        "m2interior":   dash(r.get("M2 INTERIOR")),
        "m2total":      dash(r.get("M2 TOTAL")),
        "m2terraza":    dash(r.get("M2 TERR.", "")),
        "anio":         dash(r.get("AÑO DE CONSTRUCCIÓN", "")),
        "estado":       dash(r.get("ESTADO DE ADMINISTRACIÓN DE PROPIEDAD", "")),
        "rango":        dash(r.get("RANGO DE PRECIO")),
        "precioSinBono": dash(r.get("PRECIO SIN BONO PIE")),
        "bonoPct":      bono_pct(r.get("% BONO PIE", 0)),
        "bonoUF":       dash(r.get("BONO PIE UF")),
        "video":        dash(r.get("LINK VIDEO")),
        "oportunidad":  dash(r.get("OPORTUNIDADES")),
        "id":           extract_id(r.get("LINK PUBLICACIÓN", "")),
    }

# ── Descarga y parseo ─────────────────────────────────────────────────────────

def download_stock():
    print(f"Descargando stock desde Google Sheets...")
    try:
        resp = requests.get(SHEET_URL, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        sys.exit(f"Error al descargar: {e}")

    text     = resp.content.decode("utf-8", errors="replace")
    reader   = csv.reader(io.StringIO(text))
    all_rows = list(reader)

    if len(all_rows) < 8:
        sys.exit("El archivo descargado tiene menos filas de las esperadas.")

    headers   = all_rows[6]   # fila 7 = encabezados
    data_rows = [r for r in all_rows[7:] if any(c.strip() for c in r)]

    stock = [map_row(headers, row) for row in data_rows]

    sin_id = [p for p in stock if not p["id"]]
    if sin_id:
        print(f"  Aviso: {len(sin_id)} propiedad(es) sin ID (link no reconocido):")
        for p in sin_id:
            print(f"    {p['condominio']} — dpto {p['dp']}")

    return stock

# ── Escritura de archivos ─────────────────────────────────────────────────────

def write_outputs(stock):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps(stock, ensure_ascii=False),
        encoding="utf-8"
    )

    OUT_JS.parent.mkdir(parents=True, exist_ok=True)
    OUT_JS.write_text(
        f"// Generado por gsheet_to_stock.py — {ts}\n"
        f"// Propiedades: {len(stock)}\n"
        f"const STOCK = {json.dumps(stock, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8"
    )

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    stock = download_stock()
    write_outputs(stock)
    print(f"  {len(stock)} propiedades escritas")
    print(f"  → {OUT_JSON}")
    print(f"  → {OUT_JS}")
    print("Listo.")

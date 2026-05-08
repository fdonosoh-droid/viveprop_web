"""
cc_importer.py v2 — Lee condiciones_cc_unified.xlsx y genera cc.json + cc_data.js

Uso: python tools/cc_importer.py
     (ejecutar cuando se actualicen las condiciones comerciales)

Formato de entrada: data/condiciones_cc_unified.xlsx
  Columnas: proyecto_id | inmobiliaria | titulo | descuento_depto | descuento_adicional |
            descuento_adicional_cond | aporte_inmobiliaria | reserva_clp | reserva_uf |
            cuotas_pie_n | upfront_pct | pie_pct_default | pie_const_pct |
            credito_directo_pct | cuoton_pct | tipo_entrega | descuento_regla | nota

Para generar condiciones_cc_unified.xlsx por primera vez:
  python tools/migrar_cc_a_unified.py
"""
import json, sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    import openpyxl
except ImportError:
    sys.exit("Falta openpyxl. Instalá con: pip install openpyxl")

ROOT     = Path(__file__).parent.parent
SRC      = ROOT / "data/condiciones_cc_unified.xlsx"
OUT_JSON = ROOT / "frontend/public/data/cc.json"
OUT_JS   = ROOT / "data/cc_data.js"

# ── Helpers ───────────────────────────────────────────────────────────────────

def _f(v):
    if v is None or str(v).strip() == "": return None
    try: return float(str(v).replace(",", "."))
    except: return None

def _i(v):
    if v is None or str(v).strip() == "": return None
    try: return int(float(str(v)))
    except: return None

def _s(v):
    if v is None: return ""
    s = str(v).strip()
    return "" if s in ("None", "-", "N/A") else s

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not SRC.exists():
        sys.exit(
            f"ERROR: no encontrado {SRC}\n"
            f"Corre primero: python tools/migrar_cc_a_unified.py"
        )

    wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    if not rows:
        sys.exit("ERROR: el archivo está vacío")

    # Fila 1 puede ser descripción — buscar la que contiene "proyecto_id"
    header_idx = next(
        (i for i, r in enumerate(rows) if r and str(r[0]).strip() == "proyecto_id"),
        None
    )
    if header_idx is None:
        sys.exit("ERROR: no encontré fila de encabezados con 'proyecto_id'")

    headers = [str(h).strip() if h else "" for h in rows[header_idx]]
    cc_out  = {}
    sin_id  = 0

    for row in rows[header_idx + 1:]:
        r   = dict(zip(headers, row))
        pid = _s(r.get("proyecto_id"))
        if not pid:
            sin_id += 1
            continue

        pie_default = _f(r.get("pie_pct_default"))  # None = usar PIE_DEFAULT del motor

        # Campos donde 0 es un valor válido — no usar "or default"
        v_cuotas = _i(r.get("cuotas_pie_n"))
        v_clp    = _i(r.get("reserva_clp"))

        cc_out[pid] = {
            "titulo":                _s(r.get("titulo")),
            "inmobiliaria":          _s(r.get("inmobiliaria")),
            "descuentoDepto":        _f(r.get("descuento_depto"))         or 0,
            "descuentoAdicional":    _f(r.get("descuento_adicional"))     or 0,
            "descuentoAdicionalCond":_s(r.get("descuento_adicional_cond")),
            "aporteInmobiliario":    _f(r.get("aporte_inmobiliaria"))     or 0,
            "reservaCLP":            v_clp    if v_clp    is not None else 100000,
            "reservaUF":             _f(r.get("reserva_uf"))              or 0,
            "cuotasPieN":            v_cuotas if v_cuotas is not None else 1,
            "upfrontPct":            _f(r.get("upfront_pct"))             or 0,
            "piePctDefault":         pie_default,
            "pieConstPct":           _f(r.get("pie_const_pct"))           or 0,
            "creditoDirectoPct":     _f(r.get("credito_directo_pct"))     or 0,
            "cuotonPct":             _f(r.get("cuoton_pct"))              or 0,
            "tipoEntrega":           _s(r.get("tipo_entrega"))            or "Futura",
            "descuentoRegla":        _s(r.get("descuento_regla")),
            "nota":                  _s(r.get("nota")),
        }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(cc_out, ensure_ascii=False), encoding="utf-8")

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    OUT_JS.write_text(
        f"// Generado por cc_importer.py — {ts}\n"
        f"// Proyectos con condiciones: {len(cc_out)}\n"
        f"const CC_DATA = {json.dumps(cc_out, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )

    print(f"[ok] {len(cc_out)} proyectos con condiciones comerciales")
    print(f"  → {OUT_JSON}")
    print(f"  → {OUT_JS}")
    if sin_id:
        print(f"  (omitidas: {sin_id} filas sin proyecto_id)")

    print("\nListo.")


if __name__ == "__main__":
    main()

"""
migrar_cc_a_unified.py — Migración ONE-TIME
Lee cc.json (actual) + projects.json y genera condiciones_cc_unified.xlsx pre-poblado.

Uso: python tools/migrar_cc_a_unified.py
     (ejecutar UNA VEZ para migrar datos actuales al nuevo formato)
"""
import re, json, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

try:
    from openpyxl import Workbook
except ImportError:
    sys.exit("Falta openpyxl. Instalá con: pip install openpyxl")

ROOT     = Path(__file__).parent.parent
SRC_CC   = ROOT / "frontend/public/data/cc.json"
SRC_PROJ = ROOT / "frontend/public/data/projects.json"
OUT      = ROOT / "data/condiciones_cc_unified.xlsx"

UNIFIED_COLS = [
    "proyecto_id", "inmobiliaria", "titulo",
    "descuento_depto", "descuento_adicional", "descuento_adicional_cond",
    "aporte_inmobiliaria", "reserva_clp", "reserva_uf",
    "cuotas_pie_n", "upfront_pct", "pie_pct_default",
    "pie_const_pct", "credito_directo_pct", "cuoton_pct",
    "tipo_entrega", "descuento_regla", "nota",
]

COL_DESCRIPTIONS = [
    "ID slug del proyecto (proj_xxx)",
    "Inmobiliaria (MAESTRA/INGEVEC/RVC/TOCTOC/URMENETA)",
    "Nombre del proyecto",
    "% Descuento unidad (ej: 10 = 10%)",
    "% Descuento adicional (ej: 3 = 3%)",
    "Condición descuento adicional (ej: 3D = solo para 3 dormitorios)",
    "% Aporte/Bono pie de inmobiliaria (ej: 15 = 15%)",
    "Reserva en pesos (ej: 100000)",
    "Reserva en UF (ej: 10)",
    "Número de cuotas del saldo del pie",
    "% Upfront pagado en promesa (MAESTRA) (ej: 2 = 2%)",
    "% Pie total mínimo — vacío = usar default del sistema",
    "% Pie en período de construcción (ej: 3 = 3%)",
    "% Crédito directo inmobiliaria (ej: 5 = 5%)",
    "% Cuotón (ej: 2 = 2%)",
    "Tipo/período de entrega (texto libre)",
    "Regla de descuento por tramos (TOCTOC) — dejar vacío si descuento es único",
    "Nota adicional (texto libre)",
]

# ── Helpers ───────────────────────────────────────────────────────────────────

def _pct(s):
    if not s or str(s).strip() in ("", "-", "None"): return None
    m = re.search(r"(\d+(?:[.,]\d+)?)", str(s))
    if not m: return None
    return round(float(m.group(1).replace(",", ".")), 2)

def _clp(s):
    if not s: return None
    try:
        n = float(str(s).replace(".", "").replace(",", "."))
        return int(n) if n >= 10000 else None
    except: return None

def _uf(s):
    if not s or "uf" not in str(s).lower(): return None
    m = re.search(r"(\d+(?:[.,]\d+)?)", str(s))
    return float(m.group(1).replace(",", ".")) if m else None

def _nint(s):
    if not s: return None
    m = re.search(r"(\d+)", str(s))
    return int(m.group(1)) if m else None

def cm_map(campos):
    return {lbl: val for lbl, val in (campos or [])}

def detect_inmob(cm, pid, inmob_map):
    if "Descuento Base" in cm or "Certificado Pago" in cm:
        return "MAESTRA"
    if "Aporte inmobiliario" in cm or "Cuotas pie" in cm:
        return "INGEVEC"
    if "Descuento RVC" in cm:
        return "RVC"
    if "Descuento autorizado" in cm or "Pie minimo %" in cm:
        return "TOCTOC"
    if "Descuento máximo" in cm or "Valor reserva" in cm:
        return "URMENETA"
    return inmob_map.get(pid, "").upper()

# ── Extracción por inmobiliaria ───────────────────────────────────────────────

def extract(pid, entry, inmob_map):
    cm    = cm_map(entry.get("campos", []))
    nota  = entry.get("nota", "")
    titulo = entry.get("titulo", "")
    inmob = detect_inmob(cm, pid, inmob_map)

    out = {c: None for c in UNIFIED_COLS}
    out["proyecto_id"]  = pid
    out["titulo"]       = titulo
    out["inmobiliaria"] = inmob
    out["nota"]         = nota or None

    if inmob == "MAESTRA":
        upfront     = _pct(cm.get("Upfront"))
        pie_cuotas  = _pct(cm.get("Pie en cuotas"))
        adic_raw    = cm.get("Dcto Adicional", "")
        desc_adic   = None
        desc_cond   = None
        if adic_raw:
            m = re.search(r"(\d+(?:[.,]\d+)?)\s*%\s*(\d+)\s*D", str(adic_raw), re.I)
            if m:
                desc_adic = float(m.group(1).replace(",", "."))
                desc_cond = m.group(2) + "D"
            else:
                desc_adic = _pct(adic_raw)
        pie_default = (upfront or 0) + (pie_cuotas or 0) or None
        out.update({
            "descuento_depto":          _pct(cm.get("Descuento Base")),
            "descuento_adicional":      desc_adic,
            "descuento_adicional_cond": desc_cond,
            "aporte_inmobiliaria":      _pct(cm.get("Certificado Pago")),
            "reserva_clp":              100000,
            "cuotas_pie_n":             _nint(cm.get("UPAGO Cuotas")),
            "upfront_pct":              upfront,
            "pie_pct_default":          pie_default,
            "tipo_entrega":             cm.get("ENTREGA") or None,
        })

    elif inmob == "INGEVEC":
        cuotas_tot = _nint(cm.get("Cuotas pie"))
        out.update({
            "descuento_depto":     _pct(cm.get("Dcto. depto.")),
            "aporte_inmobiliaria": _pct(cm.get("Aporte inmobiliario")),
            "reserva_clp":         _clp(cm.get("Reserva")) or 100000,
            "cuotas_pie_n":        max(cuotas_tot - 1, 0) if cuotas_tot else None,
            "pie_const_pct":       _pct(cm.get("Pie período const.")),
            "credito_directo_pct": _pct(cm.get("Pie crédito s/int.")),
            "cuoton_pct":          _pct(cm.get("Cuotón")),
            "tipo_entrega":        cm.get("Tipo de entrega") or None,
        })

    elif inmob == "RVC":
        out.update({
            "descuento_depto": _pct(cm.get("Descuento RVC")),
            "pie_pct_default": _pct(cm.get("Pie mínimo")),
            "cuotas_pie_n":    _nint(cm.get("Cuotas prog.")),
            "tipo_entrega":    cm.get("Tipo entrega") or None,
        })

    elif inmob == "TOCTOC":
        raw_desc  = cm.get("Descuento autorizado", "")
        monto_res = cm.get("Monto Reserva", "")
        pct_count = len(re.findall(r"\d+\s*%", raw_desc or ""))
        uf_val    = _uf(monto_res)
        out.update({
            "descuento_depto": _pct(raw_desc) if raw_desc else None,
            "descuento_regla": raw_desc.strip() if pct_count > 1 else None,
            "reserva_uf":      uf_val,
            "reserva_clp":     0 if uf_val else _clp(monto_res),  # si usa UF, CLP = 0
            "pie_pct_default": _pct(cm.get("Pie minimo %")),
            "cuotas_pie_n":    _nint(cm.get("Cuotas")),
            "tipo_entrega":    cm.get("Estado") or None,
        })

    elif inmob == "URMENETA":
        nota_str = nota or ""
        bm = (re.search(r"(\d+(?:[.,]\d+)?)\s*%\s*bono\s+pie", nota_str, re.I)
              or re.search(r"bono\s+pie\s+(\d+(?:[.,]\d+)?)\s*%", nota_str, re.I))
        bono = float(bm.group(1).replace(",", ".")) if bm else None
        out.update({
            "descuento_depto":     _pct(cm.get("Descuento máximo")),
            "aporte_inmobiliaria": bono,
            "reserva_clp":         _clp(cm.get("Valor reserva")),
            "pie_const_pct":       _pct(cm.get("% cuotas const.")),
            "cuotas_pie_n":        _nint(cm.get("N° cuotas const.")),
            "tipo_entrega":        cm.get("Tipo de entrega") or None,
        })

    return out

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("Leyendo cc.json...")
    cc_data = json.loads(SRC_CC.read_text(encoding="utf-8"))
    print(f"  {len(cc_data)} proyectos")

    print("Leyendo projects.json (mapa inmobiliaria)...")
    projects = json.loads(SRC_PROJ.read_text(encoding="utf-8"))
    inmob_map = {p["id"]: p.get("inmobiliaria", "") for p in projects}

    wb = Workbook()
    ws = wb.active
    ws.title = "CC Unified"

    # Encabezados con descripción en fila 1 (comentario) y nombres en fila 2
    ws.append(COL_DESCRIPTIONS)
    ws.append(UNIFIED_COLS)

    # Freeze panes en fila 3 (datos desde ahí)
    ws.freeze_panes = "A3"

    # Ancho de columnas
    ws.column_dimensions["A"].width = 35
    ws.column_dimensions["B"].width = 12
    ws.column_dimensions["C"].width = 40
    for col in "DEFGHIJKLMNOPQR": ws.column_dimensions[col].width = 18
    ws.column_dimensions["R"].width = 50  # nota

    count = 0
    sin_inmob = []
    for pid, entry in cc_data.items():
        row = extract(pid, entry, inmob_map)
        if not row["inmobiliaria"]:
            sin_inmob.append(pid)
        ws.append([row.get(c) for c in UNIFIED_COLS])
        count += 1

    wb.save(OUT)
    print(f"\n  {count} proyectos → {OUT}")

    if sin_inmob:
        print(f"\n  Aviso: {len(sin_inmob)} proyectos sin inmobiliaria detectada (completar manualmente):")
        for pid in sin_inmob:
            print(f"    {pid}")

    print("\nRevisa condiciones_cc_unified.xlsx antes de correr el nuevo cc_importer.py")


if __name__ == "__main__":
    main()

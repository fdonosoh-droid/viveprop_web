"""
audit_multimedia_pri.py
Genera Excel con estado de imágenes y PDFs por proyecto de mercado primario.
"""
import sys, json
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from pathlib import Path
import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ROOT     = Path(__file__).parent.parent
PROJECTS = ROOT / "frontend" / "public" / "data" / "projects.json"
FOTOS    = ROOT / "frontend" / "public" / "data" / "fotos_pri.json"
OUT      = ROOT / "data" / "audit_multimedia_pri.xlsx"

projects = json.loads(PROJECTS.read_text(encoding="utf-8"))
fotos    = json.loads(FOTOS.read_text(encoding="utf-8"))

rows = []
for p in projects:
    pid    = p["id"]
    nombre = p.get("nombre", pid)
    inmob  = p.get("inmobiliaria", "")
    comuna = p.get("comuna", "")
    entrega= p.get("entrega", "")

    # Contar unidades disponibles (excluye bodegas/estacionamientos puros)
    unidades = p.get("unidades", [])
    total_unidades   = len(unidades)
    unidades_disp    = sum(1 for u in unidades if u.get("disponible") and u.get("estado","").lower() == "disponible")

    # Proyectos sin stock disponible → saltar
    if unidades_disp == 0:
        continue

    # Estado multimedia desde fotos_pri.json
    f = fotos.get(pid, {})
    portada     = f.get("portada", "") or ""
    galeria     = f.get("galeria", []) or []
    pdfs        = f.get("pdfs", []) or []
    tipologias  = f.get("tipologias", []) or []

    tiene_portada   = bool(portada)
    n_galeria       = len(galeria)
    tiene_galeria   = n_galeria > 0
    n_pdfs          = len(pdfs)
    tiene_pdf       = n_pdfs > 0
    n_tipologias    = len(tipologias)

    # Etiqueta de carencia
    faltantes = []
    if not tiene_portada:  faltantes.append("Portada")
    if not tiene_galeria:  faltantes.append("Galería")
    if not tiene_pdf:      faltantes.append("PDF")
    estado = "Completo" if not faltantes else "Falta: " + " + ".join(faltantes)

    rows.append({
        "id":             pid,
        "nombre":         nombre,
        "inmobiliaria":   inmob,
        "comuna":         comuna,
        "entrega":        entrega,
        "unidades_disp":  unidades_disp,
        "tiene_portada":  tiene_portada,
        "n_galeria":      n_galeria,
        "tiene_galeria":  tiene_galeria,
        "n_pdfs":         n_pdfs,
        "tiene_pdf":      tiene_pdf,
        "n_tipologias":   n_tipologias,
        "faltantes":      estado,
    })

# Ordenar: primero los que tienen más carencias, luego por unidades desc
def sort_key(r):
    faltan = 0
    if not r["tiene_portada"]: faltan += 4
    if not r["tiene_galeria"]: faltan += 2
    if not r["tiene_pdf"]:     faltan += 1
    return (-faltan, -r["unidades_disp"])

rows.sort(key=sort_key)

# ── Estilos ──────────────────────────────────────────────────────────────────
RED    = PatternFill("solid", fgColor="FEE2E2")
AMBER  = PatternFill("solid", fgColor="FEF3C7")
GREEN  = PatternFill("solid", fgColor="DCFCE7")
GRAY   = PatternFill("solid", fgColor="F3F4F6")
HEADER = PatternFill("solid", fgColor="1E3A5F")
HDR_FONT = Font(name="Calibri", bold=True, color="FFFFFF", size=11)
BOLD     = Font(name="Calibri", bold=True, size=10)
NORMAL   = Font(name="Calibri", size=10)
CENTER   = Alignment(horizontal="center", vertical="center", wrap_text=False)
LEFT     = Alignment(horizontal="left",   vertical="center")
thin     = Side(border_style="thin", color="D1D5DB")
BORDER   = Border(left=thin, right=thin, top=thin, bottom=thin)

def fill_for(value, col):
    if col in ("tiene_portada", "tiene_galeria", "tiene_pdf"):
        return GREEN if value else RED
    if col == "faltantes":
        if value == "Completo": return GREEN
        if "Portada" in value:  return RED
        return AMBER
    return None

wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Auditoría Multimedia"
ws.freeze_panes = "A3"

# ── Título ────────────────────────────────────────────────────────────────────
ws.merge_cells("A1:N1")
tc = ws["A1"]
tc.value = "AUDITORÍA MULTIMEDIA — PROYECTOS MERCADO PRIMARIO"
tc.font  = Font(name="Calibri", bold=True, size=13, color="1E3A5F")
tc.alignment = CENTER
ws.row_dimensions[1].height = 24

# ── Encabezados ───────────────────────────────────────────────────────────────
headers = [
    ("ID Proyecto",      16),
    ("Nombre",           32),
    ("Inmobiliaria",     18),
    ("Comuna",           14),
    ("Entrega",          12),
    ("Unid. Disp.",      11),
    ("Portada",          10),
    ("Fotos Galería",    12),
    ("Galería OK",       11),
    ("PDFs",             8),
    ("PDF OK",           9),
    ("Tipologías",       11),
    ("Estado",           28),
]

for col_idx, (h, w) in enumerate(headers, 1):
    cell = ws.cell(row=2, column=col_idx, value=h)
    cell.fill      = HEADER
    cell.font      = HDR_FONT
    cell.alignment = CENTER
    cell.border    = BORDER
    ws.column_dimensions[get_column_letter(col_idx)].width = w

ws.row_dimensions[2].height = 20

# ── Datos ─────────────────────────────────────────────────────────────────────
col_keys = [
    "id", "nombre", "inmobiliaria", "comuna", "entrega",
    "unidades_disp",
    "tiene_portada", "n_galeria", "tiene_galeria",
    "n_pdfs", "tiene_pdf",
    "n_tipologias", "faltantes",
]

bool_labels = {True: "Sí", False: "No"}

for row_idx, r in enumerate(rows, 3):
    is_gray = row_idx % 2 == 0
    for col_idx, key in enumerate(col_keys, 1):
        val = r[key]
        display = bool_labels.get(val, val) if isinstance(val, bool) else val
        cell = ws.cell(row=row_idx, column=col_idx, value=display)
        cell.font      = NORMAL
        cell.border    = BORDER

        # Color por celda
        f = fill_for(r[key], key)
        if f:
            cell.fill = f
        elif is_gray:
            cell.fill = GRAY

        # Alineación
        cell.alignment = CENTER if col_idx not in (2, 3, 13) else LEFT

    ws.row_dimensions[row_idx].height = 16

# ── Hoja resumen ──────────────────────────────────────────────────────────────
ws2 = wb.create_sheet("Resumen")
totales = {
    "Total proyectos con stock":           len(rows),
    "Proyectos completos":                 sum(1 for r in rows if r["faltantes"] == "Completo"),
    "Sin portada":                         sum(1 for r in rows if not r["tiene_portada"]),
    "Sin galería":                         sum(1 for r in rows if not r["tiene_galeria"]),
    "Sin PDF":                             sum(1 for r in rows if not r["tiene_pdf"]),
    "Sin portada + galería + PDF (crítico)": sum(1 for r in rows if not r["tiene_portada"] and not r["tiene_galeria"] and not r["tiene_pdf"]),
    "Unidades sin ningún material":        sum(r["unidades_disp"] for r in rows if not r["tiene_portada"] and not r["tiene_galeria"] and not r["tiene_pdf"]),
    "Unidades totales en stock":           sum(r["unidades_disp"] for r in rows),
}

ws2.column_dimensions["A"].width = 42
ws2.column_dimensions["B"].width = 14

ws2.merge_cells("A1:B1")
t2 = ws2["A1"]
t2.value = "RESUMEN EJECUTIVO"
t2.font  = Font(name="Calibri", bold=True, size=12, color="1E3A5F")
t2.alignment = CENTER
ws2.row_dimensions[1].height = 22

for i, (lbl, val) in enumerate(totales.items(), 2):
    ca = ws2.cell(row=i, column=1, value=lbl)
    cb = ws2.cell(row=i, column=2, value=val)
    ca.font = NORMAL; ca.alignment = LEFT
    cb.font = BOLD;   cb.alignment = CENTER
    ca.border = BORDER; cb.border = BORDER
    if i % 2 == 0:
        ca.fill = GRAY; cb.fill = GRAY

wb.save(OUT)
print(f"Excel guardado: {OUT}")
print(f"Proyectos con stock: {len(rows)}")
print(f"Completos: {sum(1 for r in rows if r['faltantes'] == 'Completo')}")
print(f"Con carencias: {sum(1 for r in rows if r['faltantes'] != 'Completo')}")

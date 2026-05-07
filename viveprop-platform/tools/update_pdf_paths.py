"""
update_pdf_paths.py — Busca los PDFs de cada proyecto en photos/primario/,
los copia a frontend/public/photos/pri/{pid}/ y actualiza fotos_pri.json.

Uso: python tools/update_pdf_paths.py
"""
import sys, json, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from pathlib import Path
from urllib.parse import quote

ROOT     = Path(__file__).parent.parent
SRC_DIR  = ROOT / "photos" / "primario"
DST_DIR  = ROOT / "frontend" / "public" / "photos" / "pri"
MANIFEST = ROOT / "frontend" / "public" / "data" / "fotos_pri.json"

manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

# Indexar TODOS los PDFs de la carpeta fuente por nombre de archivo
print("Indexando PDFs en fuente...")
pdf_index: dict[str, Path] = {}
for f in SRC_DIR.rglob("*.pdf"):
    name = f.name
    if name not in pdf_index:
        pdf_index[name] = f
    # Si hay duplicados, preferir el que tenga "Brochure" en su ruta
    elif "brochure" in str(f).lower() and "brochure" not in str(pdf_index[name]).lower():
        pdf_index[name] = f

print(f"  {len(pdf_index)} PDFs encontrados en fuente")

updated = 0
not_found = 0

for pid, entry in manifest.items():
    pdfs = entry.get("pdfs", [])
    if not pdfs:
        continue

    dst_proj = DST_DIR / pid
    new_pdfs = []

    for pdf in pdfs:
        nombre = pdf.get("nombre", "")
        path   = pdf.get("path", "")

        # Ya tiene path y el archivo destino existe → no tocar
        if path and (DST_DIR / pid / nombre).exists():
            new_pdfs.append(pdf)
            continue

        # Buscar en el índice
        src_file = pdf_index.get(nombre)
        if not src_file:
            print(f"  [NO ENCONTRADO] {pid}: {nombre}")
            not_found += 1
            new_pdfs.append({"nombre": nombre, "path": ""})
            continue

        # Copiar
        dst_proj.mkdir(parents=True, exist_ok=True)
        dst_file = dst_proj / nombre
        shutil.copy2(src_file, dst_file)

        new_path = f"/photos/pri/{pid}/{quote(nombre)}"
        new_pdfs.append({"nombre": nombre, "path": new_path})
        print(f"  [OK] {pid}: {nombre}")
        updated += 1

    entry["pdfs"] = new_pdfs

MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

print(f"\n─── Resumen ───────────────────────────")
print(f"  PDFs actualizados : {updated}")
print(f"  No encontrados    : {not_found}")
print(f"  Manifest guardado : {MANIFEST}")

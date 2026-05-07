"""
copy_portadas.py — Copia fotos de proyectos primario a frontend/public/photos/pri/
y genera frontend/public/data/fotos_pri.json con el manifest de fotos.

Uso: python tools/copy_portadas.py
"""
import sys, re, json, shutil
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from pathlib import Path
from urllib.parse import quote

ROOT       = Path(__file__).parent.parent
PHOTOS_SRC = ROOT / "photos" / "primario"
DST_DIR    = ROOT / "frontend" / "public" / "photos" / "pri"
MANIFEST   = ROOT / "frontend" / "public" / "data" / "fotos_pri.json"
PROJECTS_JS = ROOT / "data" / "projects.js"


# ─── Clasificadores de archivos ────────────────────────────────────────────────

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
PDF_EXTS   = {".pdf"}

# Galería: img<dígitos>.* o hash alfanumérico de 5 chars seguido de guión (ej. 11cbe-...)
RE_GALERIA = re.compile(r"^(img\d+|[0-9a-f]{5}-.+)$", re.IGNORECASE)

# Tipología: empieza con dígito seguido de D (ej. 1D,1B.jpg, 2D,2B-52MT2.jpg)
#            o contiene ESTUDIO (case insensitive)
RE_TIPOLOGIA_DIGIT = re.compile(r"^\d+D[,\s]", re.IGNORECASE)
RE_TIPOLOGIA_EST   = re.compile(r"ESTUDIO", re.IGNORECASE)


def classify_file(stem: str) -> str:
    """Devuelve 'galeria' o 'tipologia' según el nombre base (sin extensión).
    Todo archivo de imagen que no sea tipología va a galería."""
    if RE_TIPOLOGIA_DIGIT.match(stem) or RE_TIPOLOGIA_EST.search(stem):
        return "tipologia"
    return "galeria"


def tipologia_label(stem: str) -> str:
    """
    Convierte el nombre de archivo de tipología a una label legible.
    Ejemplos:
      ESTUDIO              → Estudio
      1D,1B                → 1D, 1B
      2D,2B-50MT           → 2D, 2B — 50 m²
      1D,1B-26MTS          → 1D, 1B — 26 m²
      2D,2B-52MT2          → 2D, 2B — 52 m²
      2D,1B-53MTS-MARIPOSA → 2D, 1B — 53 m²
    """
    if RE_TIPOLOGIA_EST.match(stem):
        return "Estudio"

    # Patrón: XD,YB[-ZZMTn]  (acepta 52MT2, 50MT, 26MTS, 53MTS-MARIPOSA, etc.)
    m = re.match(r"^(\d+D),(\d+B)(?:-(\d+MT\w*))?", stem, re.IGNORECASE)
    if m:
        dorms = m.group(1).upper()   # 1D
        banos = m.group(2).upper()   # 1B
        m2_raw = m.group(3)          # 52MT2 / 50MT / 26MTS o None
        base = f"{dorms}, {banos}"
        if m2_raw:
            # Extrae el número antes de MT
            m2_m = re.match(r"(\d+)MT", m2_raw, re.IGNORECASE)
            if m2_m:
                base += f" — {m2_m.group(1)} m²"
        return base

    # Fallback: capitalizar
    return stem.replace("_", " ").replace("-", " ").title()


# ─── Leer projects.js ─────────────────────────────────────────────────────────

def load_projects_js(path: Path) -> list[dict]:
    """
    Extrae los proyectos del archivo projects.js (const PROJECTS = [...]).
    """
    text = path.read_text(encoding="utf-8", errors="replace")
    # Eliminar líneas de comentarios JS
    text = "\n".join(l for l in text.split("\n") if not l.strip().startswith("//"))
    # Quitar asignación const PROJECTS =
    text = re.sub(r"^\s*const\s+\w+\s*=\s*", "", text.strip())
    if text.rstrip().endswith(";"):
        text = text.rstrip()[:-1]
    return json.loads(text)


# ─── Procesar un proyecto ─────────────────────────────────────────────────────

def process_project(p: dict, manifest: dict, stats: dict):
    pid         = p["id"]
    foto_portada = p.get("foto_portada", "").strip()

    if not foto_portada:
        stats["sin_portada"] += 1
        return

    # Ruta local de la portada
    portada_src = ROOT / foto_portada
    if not portada_src.exists():
        print(f"  [NO ENCONTRADA] {pid}: {foto_portada}")
        stats["no_encontrada"] += 1
        return

    proj_folder = portada_src.parent   # carpeta del proyecto (fotos locales)
    portada_name = portada_src.name
    portada_ext  = portada_src.suffix.lower()

    # ── Destinos ──────────────────────────────────────────────────────────────
    dst_portada = DST_DIR / f"{pid}{portada_ext}"
    dst_proj    = DST_DIR / pid
    dst_proj.mkdir(parents=True, exist_ok=True)

    # Copiar portada
    shutil.copy2(portada_src, dst_portada)

    # Escanear carpeta del proyecto
    galeria   = []
    tipologias = []
    pdfs      = []

    all_files = sorted(proj_folder.iterdir())

    # Identificar galería candidata para aplicar el corte DataBrokers.
    # Los brochures de Databrokers siempre terminan con 2 páginas de contacto
    # (Agendamiento Visitas + página de contacto) como últimos img*.jpg del PDF.
    galeria_candidates = [
        f for f in all_files
        if f.is_file() and f.suffix.lower() in IMAGE_EXTS
        and f.name != portada_name
        and classify_file(f.stem) == "galeria"
    ]
    # Excluir las últimas 2 imágenes de galería solo si son brochures DataBrokers.
    # Los brochures DataBrokers usan img\d+.jpg; proyectos RVC usan nombres hash.
    DB_TAIL = 2
    all_are_imgN = all(re.match(r'^img\d+$', f.stem, re.IGNORECASE) for f in galeria_candidates)
    if all_are_imgN and len(galeria_candidates) > DB_TAIL:
        galeria_valid = set(f.name for f in galeria_candidates[:-DB_TAIL])
    else:
        galeria_valid = set(f.name for f in galeria_candidates)

    for f in all_files:
        if not f.is_file():
            continue
        ext = f.suffix.lower()
        stem = f.stem

        if ext in PDF_EXTS:
            dst_pdf = dst_proj / f.name
            shutil.copy2(f, dst_pdf)
            pdfs.append({"nombre": f.name, "path": f"/photos/pri/{pid}/{quote(f.name)}"})
            continue

        if ext not in IMAGE_EXTS:
            continue

        if f.name == portada_name:
            # La portada ya fue copiada arriba; no va en galería
            continue

        kind = classify_file(stem)

        if kind == "galeria":
            if f.name not in galeria_valid:
                continue  # página DataBrokers — omitir
            dst_f = dst_proj / f.name
            shutil.copy2(f, dst_f)
            galeria.append(f"/photos/pri/{pid}/{f.name}")

        elif kind == "tipologia":
            dst_f = dst_proj / f.name
            shutil.copy2(f, dst_f)
            tipologias.append({
                "label": tipologia_label(stem),
                "src":   f"/photos/pri/{pid}/{f.name}",
            })
        # else: 'otro' — ignorar (logos, docs, etc.)

    manifest[pid] = {
        "portada":   f"/photos/pri/{pid}{portada_ext}",
        "galeria":   galeria,
        "tipologias": tipologias,
        "pdfs":      pdfs,
    }

    stats["ok"] += 1
    n_gal = len(galeria)
    n_tip = len(tipologias)
    n_pdf = len(pdfs)
    print(f"  [OK] {pid}: portada + {n_gal} galería + {n_tip} tipología + {n_pdf} PDF")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not PROJECTS_JS.exists():
        sys.exit(f"No encontré {PROJECTS_JS}")

    DST_DIR.mkdir(parents=True, exist_ok=True)
    (ROOT / "frontend" / "public" / "data").mkdir(parents=True, exist_ok=True)

    print(f"Leyendo {PROJECTS_JS.name} ...")
    projects = load_projects_js(PROJECTS_JS)
    print(f"  {len(projects)} proyectos cargados")

    # Cargar manifest existente para preservar proyectos ya procesados
    existing_manifest: dict = {}
    if MANIFEST.exists():
        try:
            existing_manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        except Exception:
            pass

    # Deduplicar por id (pueden repetirse proyectos con misma carpeta de fotos)
    seen_ids: set[str] = set()
    manifest: dict = dict(existing_manifest)   # preservar entradas previas
    stats = {"ok": 0, "sin_portada": 0, "no_encontrada": 0, "ya_en_manifest": 0}

    print(f"\nProcesando proyectos ...")
    for p in projects:
        pid = p.get("id", "")
        if pid in seen_ids:
            continue
        seen_ids.add(pid)
        # Si ya está en el manifest y foto_portada apunta a /photos/pri/ (ya procesado),
        # no re-procesar — la entrada existente se mantiene del dict inicial.
        fp = p.get("foto_portada", "").strip()
        if pid in existing_manifest and fp.startswith("/photos/pri/"):
            stats["ya_en_manifest"] += 1
            continue
        process_project(p, manifest, stats)

    # Guardar manifest
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n─── Resumen ───────────────────────────────────────────")
    print(f"  Proyectos procesados OK    : {stats['ok']}")
    print(f"  Ya en manifest (omitidos)  : {stats['ya_en_manifest']}")
    print(f"  Sin foto_portada (vacío)   : {stats['sin_portada']}")
    print(f"  Carpeta no encontrada      : {stats['no_encontrada']}")
    print(f"  Total en manifest          : {len(manifest)}")
    print(f"  Manifest generado          : {MANIFEST}")
    print(f"  Fotos copiadas a           : {DST_DIR}")
    print(f"────────────────────────────────────────────────────────")


if __name__ == "__main__":
    main()

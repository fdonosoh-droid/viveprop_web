"""
access_to_projects.py — Lee stock y proyectos desde la base Access de Viveprop
y genera projects.json para el programa.

Uso: python tools/access_to_projects.py
     (correr después de actualizar datos en Access)
"""
import sys, json, re, openpyxl, pyodbc
from pathlib import Path
from datetime import datetime

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# ── Configuración ─────────────────────────────────────────────────────────────

ACCDB    = r"H:\Mi unidad\Viveprop\00 - DDBB_AGENCIA\STOCK MERCADO PRIMARIO\STOCK MP.accdb"
ROOT     = Path(__file__).parent.parent
PROJECTS_XLSX = ROOT / "data" / "projects.xlsx"
FOTOS_JSON    = ROOT / "frontend" / "public" / "data" / "fotos_pri.json"
OUT_JSON      = ROOT / "frontend" / "public" / "data" / "projects.json"
OUT_JS        = ROOT / "data" / "projects.js"

# Mapeo NEMOTECNICO Access → id slug en projects.json
# Generado automáticamente el 2026-05-08. Actualizar si se renombran proyectos en Access.
NEMO_MAP = {
    "ZAÑ":                                    "proj_zanartu-1111",
    "OSSA":                                   "proj_santos-ossa",
    "TOC":                                    "proj_tocornal",
    "ÑUB":                                    "proj_vicuna-mackenna-1796",
    "STI":                                    "proj_santa-isabel",
    "SRO":                                    "proj_santa-rosa",
    "FRK":                                    "proj_centenario-i",
    "BEL":                                    "proj_bellavista",
    "ROA":                                    "proj_froilan-roa",
    "ALE":                                    "proj_los-alerces",
    "ALTO BUZETA (MT)":                       "proj_alto-buzeta-mt",
    "VIC":                                    "proj_vicuna-mackenna-7589-i",
    "VTA":                                    "proj_vivaceta",
    "VIC2":                                   "proj_vicuna-mackenna-7589-ii",
    "DP":                                     "proj_diagonal-paraguay",
    "ING":                                    "proj_valle-los-ingleses",
    "ABD":                                    "proj_abdon-cifuentes",
    "DOM":                                    "proj_don-ignacio",
    "LEN":                                    "proj_los-lilenes",
    "GOD":                                    "proj_coronel-godoy",
    "NES":                                    "proj_nueva-esmeralda",
    "VESP":                                   "proj_vespucio-capital",
    "ARO":                                    "proj_el-aromo",
    "BRA":                                    "proj_brasil",
    "TER":                                    "proj_terrazzo",
    "MAT":                                    "proj_matta",
    "CUR":                                    "proj_curauma",
    "CÁCERES":                                "proj_caceres",
    "GENERAL MACKENNA":                       "proj_general-mackenna",
    "JARDINES DE ALVARADO":                   "proj_jardines-de-alvarado",
    "MIRADOR MAPOCHO":                        "proj_mirador-mapocho",
    "PINTOR CICARELLI I (PC I)":              "proj_pintor-cicarelli-i-pc-i",
    "PINTOR CICARELLI II":                    "proj_pintor-cicarelli-ii",
    "PLAZA CERVANTES I":                      "proj_plaza-cervantes-i",
    "PLAZA CERVANTES II":                     "proj_plaza-cervantes-ii",
    "PLAZA QUILICURA":                        "proj_plaza-quilicura",
    "SERRANO TORRE A":                        "proj_serrano-torre-a",
    "TRINIDAD III":                           "proj_trinidad-iii",
    "VISTA COSTANERA":                        "proj_vista-costanera",
    "VISTA LLACOLÉN A":                       "proj_vista-llacolen-a",
    "VISTA LLACOLÉN B2":                      "proj_vista-llacolen-b2",
    "VISTA RELONCAVÍ":                        "proj_vista-reloncavi",
    "VISTAMAR":                               "proj_vistamar",
    "DISTRITO CENTRO":                        "proj_distrito-centro",
    "EDIFICIO PEDRO DE LA BARRA":             "proj_edificio-pedro-de-la-barra",
    "EDIFICIO GUILLERMO MANN":                "proj_edificio-guillermo-mann",
    "EDIFICIO PARQUE URBANO":                 "proj_edificio-parque-urbano",
    "CONDOMINIO PARQUE DEL SUR TORRE A":      "proj_condominio-parque-del-sur-torre-a",
    "EDIFICIO CORONEL SOUPER":                "proj_edificio-coronel-souper",
    "EDIFICIO CASTILLO URIZAR":               "proj_edificio-castillo-urizar",
    "EDIFICIO TRINIDAD RAMIREZ":              "proj_edificio-trinidad-ramirez",
    "EDIFICIO LIA AGUIRRE":                   "proj_edificio-lia-aguirre",
    "BLANCA ESTELA I TORRE A":                "proj_blanca-estela-i-torre-a",
    "BLANCA ESTELA I TORRE B":                "proj_blanca-estela-i-torre-b",
    "ALTO MARAÑON 3":                         "proj_alto-maranon-3",
    "PLAY":                                   "proj_play",
    "FAM":                                    "proj_fam",
    "LINE":                                   "proj_line",
    "PARQUE DE ARAYA-TORRE PONIENTE":         "proj_parque-de-araya-torre-poniente",
    "MIND":                                   "proj_mind",
    "PARQUE DE ARAYA-TORRE ORIENTE":          "proj_parque-de-araya-torre-oriente",
    "Barrio Cueto":                           "proj_barrio-cueto",
    "Ciudad Siete":                           "proj_ciudad-siete",
    "Ciudad Cerrillos":                       "proj_ciudad-cerrillos",
    "Ciudad España":                          "proj_ciudad-espana",
    "Ciudad Lyon":                            "proj_ciudad-lyon",
    "Ciudad Matta":                           "proj_ciudad-matta",
    "Fuenzalida Urrejola 303":                "proj_fuenzalida-urrejola-303",
    "Garden Macul":                           "proj_garden-macul",
    "Jmc 608":                                "proj_jmc-608",
    "Mapocho 2880":                           "proj_mapocho-2880",
    "Neoflorida 3":                           "proj_neoflorida-3",
    "Nodo La Cisterna":                       "proj_nodo-la-cisterna",
    "Status":                                 "proj_status",
    "Sueña Lincoyan":                         "proj_suena-lincoyan",
    "Sueña Marin":                            "proj_suena-marin",
    "Sueña Toesca":                           "proj_suena-toesca",
    "Condominio Alto Hurtado II":             "proj_condominio-alto-hurtado-ii",
    "Condominio Alto Hurtado III":            "proj_condominio-alto-hurtado-iii",
    "Porta Hurtado":                          "proj_porta-hurtado",
    "CONDOMINIO FRANCISCO ZELADA TORRE a":    "proj_condominio-francisco-zelada-torre-a",
    "CONDOMINIO FRANCISCO ZELADA TORRE B":    "proj_condominio-francisco-zelada-torre-b",
    # Sin match en Access aún (agregar cuando se carguen en Access):
    # "???": "proj_parque-maranon-torre-a",
    # "???": "proj_suena-santa-elisa",
}

# Invertir para lookup por slug
SLUG_TO_NEMO = {v: k for k, v in NEMO_MAP.items()}

ESTADOS_DISPONIBLE = {"disponible"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def val(v, default=""):
    return default if v is None else str(v).strip()

def safe_float(v):
    try:
        return float(str(v).replace(",", "."))
    except (TypeError, ValueError):
        return 0.0

def safe_int(v):
    try:
        return int(float(str(v)))
    except (TypeError, ValueError):
        return 0

# ── 1. Leer datos estáticos desde projects.xlsx ───────────────────────────────

def load_static_projects():
    wb = openpyxl.load_workbook(PROJECTS_XLSX, read_only=True, data_only=True)
    ws = wb["Proyectos"]
    rows = list(ws.iter_rows(values_only=True))
    headers = rows[0]
    static = {}
    for row in rows[1:]:
        r = dict(zip(headers, row))
        pid = val(r.get("id"))
        if not pid:
            continue
        amenidades_raw = val(r.get("amenidades"))
        static[pid] = {
            "id":           pid,
            "nombre":       val(r.get("nombre")),
            "inmobiliaria": val(r.get("inmobiliaria")),
            "descripcion":  val(r.get("descripcion")),
            "foto_portada": val(r.get("foto_portada")),
            "amenidades":   [a.strip() for a in amenidades_raw.split(",") if a.strip()],
        }
    wb.close()
    return static

# ── 2. Leer datos dinámicos desde Access ──────────────────────────────────────

def load_access_data():
    conn_str = rf"DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={ACCDB};"
    try:
        conn = pyodbc.connect(conn_str)
    except Exception as e:
        sys.exit(f"No se pudo conectar a Access: {e}")

    cur = conn.cursor()

    # Proyectos: datos dinámicos (entrega, comuna, dirección)
    cur.execute("SELECT NEMOTECNICO, COMUNA, DIRECCION, [TIPO ENTREGA], [PERIODO ENTREGA] FROM PROYECTOS")
    cols = [c[0] for c in cur.description]
    access_projs = {}
    for row in cur.fetchall():
        r = dict(zip(cols, row))
        nemo = val(r.get("NEMOTECNICO"))
        pid  = NEMO_MAP.get(nemo)
        if not pid:
            continue
        access_projs[pid] = {
            "comuna":    val(r.get("COMUNA")),
            "direccion": val(r.get("DIRECCION")),
            "entrega":   val(r.get("PERIODO ENTREGA")),
        }

    # Unidades desde query
    cur.execute("SELECT * FROM STOCK_MP_VIVEPROP_WEB")
    cols2 = [c[0] for c in cur.description]
    units_by_proj = {}
    for row in cur.fetchall():
        r = dict(zip(cols2, row))
        nemo = val(r.get("NEMOTECNICO"))
        pid  = NEMO_MAP.get(nemo)
        if not pid:
            continue
        estado    = val(r.get("ESTADO STOCK"))
        disponible = estado.lower() in ESTADOS_DISPONIBLE
        unidad = {
            "dp":          val(r.get("NUMERO UNIDAD")),
            "tipologia":   val(r.get("PROGRAMA")),
            "piso":        safe_int(r.get("PISO PRODUCTO")),
            "m2_interior": safe_float(r.get("SUPERFICIE UTIL")),
            "m2_terraza":  safe_float(r.get("SUPERFICIE TERRAZA")),
            "m2_total":    safe_float(r.get("SUPERFICIE TOTAL")),
            "orientacion": val(r.get("ORIENTACION")),
            "dormitorios": val(r.get("DORMITORIOS")),
            "banos":       val(r.get("BAÑOS")),
            "precio_uf":   safe_float(r.get("PRECIO LISTA")),
            "disponible":  disponible,
            "estado":      estado,
        }
        units_by_proj.setdefault(pid, []).append(unidad)

    conn.close()
    return access_projs, units_by_proj

# ── 3. Leer fotos desde fotos_pri.json ───────────────────────────────────────

def load_fotos():
    if not FOTOS_JSON.exists():
        return {}
    try:
        return json.loads(FOTOS_JSON.read_text(encoding="utf-8"))
    except Exception:
        return {}

# ── 4. Fusionar y generar projects.json ───────────────────────────────────────

def build_projects(static, access_projs, units_by_proj, fotos):
    projects = []
    sin_access = []
    sin_unidades = []

    for pid, s in static.items():
        ap = access_projs.get(pid, {})
        ft = fotos.get(pid, {})
        units = units_by_proj.get(pid, [])

        if not ap:
            sin_access.append(pid)
        if not units:
            sin_unidades.append(pid)

        projects.append({
            "id":           pid,
            "nombre":       s["nombre"],
            "inmobiliaria": s["inmobiliaria"],
            "comuna":       ap.get("comuna") or s.get("comuna", ""),
            "direccion":    ap.get("direccion") or s.get("direccion", ""),
            "entrega":      ap.get("entrega", ""),
            "descripcion":  s["descripcion"],
            "foto_portada": ft.get("portada", s["foto_portada"]),
            "amenidades":   s["amenidades"],
            "fotos":        ft.get("galeria", []),
            "tipologias":   ft.get("tipologias", []),
            "pdfs":         ft.get("pdfs", []),
            "unidades":     units,
        })

    return projects, sin_access, sin_unidades

# ── 5. Escribir archivos ──────────────────────────────────────────────────────

def write_outputs(projects):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    total_u = sum(len(p["unidades"]) for p in projects)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps(projects, ensure_ascii=False),
        encoding="utf-8"
    )
    OUT_JS.write_text(
        f"// Generado por access_to_projects.py — {ts}\n"
        f"// Proyectos: {len(projects)} | Unidades: {total_u}\n"
        f"const PROJECTS = {json.dumps(projects, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8"
    )

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Leyendo projects.xlsx (datos estáticos)...")
    static = load_static_projects()
    print(f"  {len(static)} proyectos cargados")

    print("Conectando a Access...")
    access_projs, units_by_proj = load_access_data()
    print(f"  {len(access_projs)} proyectos con datos en Access")
    print(f"  {sum(len(u) for u in units_by_proj.values())} unidades cargadas")

    print("Leyendo fotos_pri.json...")
    fotos = load_fotos()
    print(f"  {len(fotos)} proyectos con fotos")

    print("Fusionando y generando projects.json...")
    projects, sin_access, sin_unidades = build_projects(static, access_projs, units_by_proj, fotos)

    write_outputs(projects)

    total_u = sum(len(p["unidades"]) for p in projects)
    print(f"  {len(projects)} proyectos | {total_u} unidades escritas")
    print(f"  → {OUT_JSON}")
    print(f"  → {OUT_JS}")

    if sin_access:
        print(f"\n  Aviso: {len(sin_access)} proyectos sin datos en Access (se mantienen con datos anteriores):")
        for pid in sin_access:
            print(f"    {pid}")
    if sin_unidades:
        print(f"\n  Aviso: {len(sin_unidades)} proyectos sin unidades en Access:")
        for pid in sin_unidades:
            print(f"    {pid}")

    print("\nListo.")

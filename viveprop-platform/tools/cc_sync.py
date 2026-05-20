"""
cc_sync.py — Sincroniza condiciones_cc_unified.xlsx desde condiciones comerciales.xlsx.
Uso: python tools/cc_sync.py
     Luego ejecutar actualizar_cc.bat para publicar cc.json.
"""
import sys, re, unicodedata, openpyxl
from pathlib import Path
from collections import OrderedDict

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT    = Path(__file__).parent.parent
SRC     = ROOT / "data" / "condiciones comerciales.xlsx"
UNIFIED = ROOT / "data" / "condiciones_cc_unified.xlsx"

HEADERS_DESC = [
    'ID slug del proyecto (proj_xxx)',
    'Inmobiliaria (MAESTRA/INGEVEC/RVC/TOCTOC/URMENETA)',
    'Nombre del proyecto',
    '% Descuento unidad (ej: 10 = 10%)',
    '% Descuento adicional (ej: 3 = 3%)',
    'Condición descuento adicional (ej: 3D = solo para 3 dormitorios)',
    '% Aporte/Bono pie de inmobiliaria (ej: 15 = 15%)',
    'Reserva en pesos (ej: 100000)',
    'Reserva en UF (ej: 10)',
    'Número de cuotas del saldo del pie',
    '% Upfront pagado en promesa (MAESTRA) (ej: 2 = 2%)',
    '% Pie total mínimo — vacío = usar default del sistema',
    '% Pie en período de construcción (ej: 3 = 3%)',
    '% Crédito directo inmobiliaria (ej: 5 = 5%)',
    '% Cuotón (ej: 2 = 2%)',
    'Tipo/período de entrega (texto libre)',
    'Regla de descuento por tramos (TOCTOC) — dejar vacío si descuento es único',
    'Nota adicional (texto libre)',
]
FIELDS = [
    'proyecto_id', 'inmobiliaria', 'titulo',
    'descuento_depto', 'descuento_adicional', 'descuento_adicional_cond',
    'aporte_inmobiliaria', 'reserva_clp', 'reserva_uf', 'cuotas_pie_n',
    'upfront_pct', 'pie_pct_default', 'pie_const_pct',
    'credito_directo_pct', 'cuoton_pct',
    'tipo_entrega', 'descuento_regla', 'nota',
]

# ── Nombre → slug ─────────────────────────────────────────────────────────────
# Valor puede ser str (un slug) o list[str] (proyecto duplicado).
# Claves en minúsculas; la función name_to_slug normaliza acentos también.
NAME_TO_SLUG = {
    # MAESTRA
    'vista llacolén b2':                            'proj_vista-llacolen-b2',
    'vista llacolen b2':                            'proj_vista-llacolen-b2',
    'vista llacolén a':                             'proj_vista-llacolen-a',
    'vista llacolen a':                             'proj_vista-llacolen-a',
    'serrano torre a':                              'proj_serrano-torre-a',
    'general mackenna':                             'proj_general-mackenna',
    'vistamar':                                     'proj_vistamar',
    'distrito centro':                              'proj_distrito-centro',
    'pintor cicarelli i (pc i)':                    'proj_pintor-cicarelli-i-pc-i',
    'alto buzeta (mt)':                             'proj_alto-buzeta-mt',
    'cáceres':                                      'proj_caceres',
    'caceres':                                      'proj_caceres',
    'jardines de alvarado':                         'proj_jardines-de-alvarado',
    'mirador mapocho':                              'proj_mirador-mapocho',
    'pintor cicarelli ii':                          'proj_pintor-cicarelli-ii',
    'plaza cervantes i':                            'proj_plaza-cervantes-i',
    'plaza cervantes ii':                           'proj_plaza-cervantes-ii',
    'plaza quilicura':                              'proj_plaza-quilicura',
    'trinidad iii':                                 'proj_trinidad-iii',
    'vista costanera':                              'proj_vista-costanera',
    'vista reloncaví':                              'proj_vista-reloncavi',
    'vista reloncavi':                              'proj_vista-reloncavi',
    # INGEVEC
    'vicuña mackenna 1796 (ñub)':                  'proj_vicuna-mackenna-1796',
    'vicuna mackenna 1796 (nub)':                   'proj_vicuna-mackenna-1796',
    'tocornal (toc)':                               'proj_tocornal',
    'santos ossa (ossa)':                           'proj_santos-ossa',
    'los alerces (ale)':                            'proj_los-alerces',
    'bellavista (bel)':                             'proj_bellavista',
    'froilan roa (roa)':                            'proj_froilan-roa',
    'centenario i (frk)':                           'proj_centenario-i',
    'valle los ingleses (ing)':                     'proj_valle-los-ingleses',
    'vespucio capital (vesp)':                      'proj_vespucio-capital',
    'serrano (ser)':                                'proj_serrano-torre-a',
    'vivaceta (vta)':                               'proj_vivaceta',
    'vicuña mackenna 7589 (vic y vic2)':            ['proj_vicuna-mackenna-7589-i', 'proj_vicuna-mackenna-7589-ii'],
    'vicuna mackenna 7589 (vic y vic2)':            ['proj_vicuna-mackenna-7589-i', 'proj_vicuna-mackenna-7589-ii'],
    'diagonal paraguay (dp)':                       'proj_diagonal-paraguay',
    'abdón cifuentes (abd)':                        'proj_abdon-cifuentes',
    'abdon cifuentes (abd)':                        'proj_abdon-cifuentes',
    'don ignacio (dom)':                            'proj_don-ignacio',
    'los lilenes (len)':                            'proj_los-lilenes',
    'coronel godoy (god)':                          'proj_coronel-godoy',
    'nueva esmeralda (nes)':                        'proj_nueva-esmeralda',
    'brasil (bra)':                                 'proj_brasil',
    'terrazzo (ter)':                               'proj_terrazzo',
    'el aromo (aro)':                               'proj_el-aromo',
    'matta (mat)':                                  'proj_matta',
    # RVC
    'condominio parque del sur torre a':            'proj_condominio-parque-del-sur-torre-a',
    'edificio castillo urizar':                     'proj_edificio-castillo-urizar',
    'edificio coronel souper':                      'proj_edificio-coronel-souper',
    'edificio francisco zelada torre a':            'proj_condominio-francisco-zelada-torre-a',
    'edificio francisco zelada torre b':            'proj_condominio-francisco-zelada-torre-b',
    'edificio guillermo mann':                      'proj_edificio-guillermo-mann',
    'edificio lia aguirre':                         'proj_edificio-lia-aguirre',
    'edificio pedro de la barra':                   'proj_edificio-pedro-de-la-barra',
    'edificio trinidad ramirez':                    'proj_edificio-trinidad-ramirez',
    'alto maranon 3':                               'proj_alto-maranon-3',
    'edificio blanca estela torre a':               'proj_blanca-estela-i-torre-a',
    'edificio blanca estela torre b':               'proj_blanca-estela-i-torre-b',
    'edificio parque urbano oficinas':              'proj_edificio-parque-urbano',
    'parque maranon torre a':                       'proj_parque-maranon-torre-a',
    # TOCTOC
    'play':                                         'proj_play',
    'fam':                                          'proj_fam',
    'line':                                         'proj_line',
    'mind':                                         'proj_mind',
    'pda torre poniente':                           'proj_parque-de-araya-torre-poniente',
    'pda torre oriente':                            'proj_parque-de-araya-torre-oriente',
    # EUROCORP
    'santa elena 1670 mbi':                         'proj_santa-elena-1670-mbi',
    'vicuna mackenna 1432':                         'proj_vicuna-mackenna-1432',
    'mapocho torre a y b':                          ['proj_mapocho-3521', 'proj_edificio-mapocho-3521-edificio-a'],
    'rosas 1444':                                   'proj_rosas-1444',
    'guillermo mann':                               'proj_guillermo-mann-1401',
    'independencia 4745':                           'proj_independencia-4745',
    'jose pedro alessandri':                        'proj_jose-pedro-alessandri-1498',
    'vitro':                                        'proj_edificio-vitro',
    'froilan roa 5731 – ts y tn':              ['proj_froilan-roa-5731', 'proj_froilan-roa-5731-torre-norte'],
    'diagonal vicuna torre norte':                  'proj_diagonal-vicuna',
    'diagonal vicuna torre sur':                    'proj_diagonal-vicuna',
    'entre vicunas':                                'proj_entre-vicunas',
    'don pepe 2':                                   'proj_edificio-don-pepe-154',
    'plaza de lourdes':                             'proj_edificio-plaza-de-lourdes',
    'mirador irarrazaval':                          'proj_mirador-irarrazaval',
    'alto irarrazaval':                             'proj_alto-irarrazaval',
    'ambar':                                        'proj_edificio-ambar-urbano',
    'nova parque':                                  'proj_nova-parque',
    # URMENETA
    'status, stgo. centro (santolaya)':             'proj_status',
    'suena marin, stgo. centro (santolaya)':        'proj_suena-marin',
    'suena lincoyan, nunoa (santolaya)':            'proj_suena-lincoyan',
    'suena toesca, stgo (santolaya)':               'proj_suena-toesca',
    'neo florida iii. la florida (santolaya)':      'proj_neoflorida-3',
    'ciudad lyon, providencia (deisa)':             'proj_ciudad-lyon',
    'ciudad cerrillos, cerrillos (deisa)':          'proj_ciudad-cerrillos',
    'barrio cueto, stgo (ormuz)':                   'proj_barrio-cueto',
    'ciudad matta, santiago (deisa)':               'proj_ciudad-matta',
    'ciudad espana, santiago (deisa)':              'proj_ciudad-espana',
    'ciudad siete, cerrillos (deisa)':              'proj_ciudad-siete',
    'mapocho 2880, santiago (santolaya)':           'proj_mapocho-2880',
    'fuenzalida urrejola 303, la cisterna (inmob. lugano)': 'proj_fuenzalida-urrejola-303',
    'jmc 608, santiago (santolaya)':                'proj_jmc-608',
    'alto hurtado et 3, padre hurtado (70w)':       'proj_condominio-alto-hurtado-ii',
    'porta hurtado, padre hurtado (70w)':           'proj_porta-hurtado',
    'nodo la cisterna, la cisterna (deisa)':        'proj_nodo-la-cisterna',
}

def _norm(s):
    """Lowercase + strip whitespace + remove diacritics."""
    s = str(s).strip().lower()
    s = re.sub(r'\s+', ' ', s)
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn')

def name_to_slug(name):
    if name is None:
        return None
    key = _norm(name)
    if key in NAME_TO_SLUG:
        return NAME_TO_SLUG[key]
    return None

# ── Helpers ───────────────────────────────────────────────────────────────────

def sv(val):
    if val is None: return None
    return str(val).strip() if isinstance(val, str) else val

def pct(val):
    """0.1 → 10, 10 → 10. Returns None for 0 or None input."""
    if val is None: return None
    try:
        f = float(val)
    except (ValueError, TypeError):
        return None
    if f == 0: return None
    return round(f * 100, 4) if f < 1 else round(f, 4)

def pct_keep_zero(val):
    """Like pct() but keeps 0 as 0."""
    if val is None: return None
    try:
        f = float(val)
    except (ValueError, TypeError):
        return None
    return round(f * 100, 4) if f < 1 else round(f, 4)

def safe_int(val):
    if val is None: return None
    try: return int(float(str(val)))
    except: return None

def col(row, i):
    return row[i] if len(row) > i else None

def slugs_list(name, sheet_name):
    s = name_to_slug(name)
    if s is None:
        print(f"  [{sheet_name}] sin mapeo: '{name}'")
        return []
    return [s] if isinstance(s, str) else s

# ── Parser: CC MAESTRA ────────────────────────────────────────────────────────
# Cols (header fila 3, idx 2): [marker, PROYECTO, ENTREGA, COMUNA,
#   Descuento Base(4), Dcto Adicional(5), Giftcard(6), Upfront(7),
#   Pie en cuotas%(8), UPAGO Cuotas(9), Cuota desde(10), Certificado Pago(11), ...]

def _parse_dcto_adicional(val):
    if val is None or str(val).strip() in ('-', '—', ''):
        return None, None
    s = str(val).strip()
    m = re.match(r'^(\d+(?:[.,]\d+)?)\s*%\s*(.*)?$', s, re.IGNORECASE)
    if m:
        p = float(m.group(1).replace(',', '.'))
        cond = (m.group(2) or '').strip() or None
        return p, cond
    return None, s  # no numeric %, return raw string as condition

def parse_maestra(rows):
    results = []
    STOP_WORDS = ('para todas', 'recordar que', 'promoci')
    for row in rows[3:]:
        nombre = sv(col(row, 1))
        if not nombre: continue
        if any(str(nombre).lower().startswith(w) for w in STOP_WORDS): break

        slugs = slugs_list(nombre, 'CC MAESTRA')
        if not slugs: continue

        dcto_add, dcto_cond = _parse_dcto_adicional(col(row, 5))
        upfront  = pct(col(row, 7))
        # col[8] = "Pie en cuotas" = % pie const; col[9] = nº cuotas UPAGO
        pie_pct  = pct(col(row, 8))
        cuotas_n = safe_int(col(row, 9))
        # col[11] = Certificado de Pago = aporte inmobiliario (bono pie %)
        aporte   = pct(col(row, 11))
        dcto     = pct(col(row, 4))
        # col[2] = entrega (year int or string)
        entrega_raw = col(row, 2)
        if isinstance(entrega_raw, int) and entrega_raw > 2000:
            tipo_entrega = str(entrega_raw)
        else:
            tipo_entrega = sv(entrega_raw)

        base = {
            'inmobiliaria':            'MAESTRA',
            'titulo':                  nombre,
            'descuento_depto':         dcto,
            'descuento_adicional':     dcto_add,
            'descuento_adicional_cond': dcto_cond,
            'aporte_inmobiliaria':     aporte,
            'upfront_pct':             upfront,
            'pie_const_pct':           pie_pct,
            'cuotas_pie_n':            cuotas_n,
            'tipo_entrega':            tipo_entrega,
        }
        for slug in slugs:
            results.append({'proyecto_id': slug, **base})
    return results

# ── Parser: CC INGEVEC ────────────────────────────────────────────────────────
# Cols (header fila 1, idx 0): [idx(0), nombre(1), comuna(2), tipo_entrega(3),
#   reserva_clp(4), dcto_depto(5), aporte(6), cuotas_pie_n(7),
#   pie_const_pct(8), cuoton_pct(9), credito_directo_pct(10), productos_sec(11), nota(12)]

def parse_ingevec(rows):
    results = []
    for row in rows[1:]:
        if not isinstance(col(row, 0), (int, float)): continue  # skip notes/blank

        nombre = sv(col(row, 1))
        if not nombre: continue

        slugs = slugs_list(nombre, 'CC INGEVEC')
        if not slugs: continue

        tipo = sv(col(row, 3)) or ''
        # cuotas=1 en entrega inmediata → convenio existente usa 0
        cuotas_raw = safe_int(col(row, 7))
        if cuotas_raw == 1 and 'inmediata' in tipo.lower():
            cuotas_raw = 0

        base = {
            'inmobiliaria':        'INGEVEC',
            'titulo':              nombre,
            'descuento_depto':     pct(col(row, 5)),
            'aporte_inmobiliaria': pct(col(row, 6)),
            'reserva_clp':         safe_int(col(row, 4)),
            'cuotas_pie_n':        cuotas_raw,
            'pie_const_pct':       pct(col(row, 8)),
            'cuoton_pct':          pct(col(row, 9)),
            'credito_directo_pct': pct(col(row, 10)),
            'tipo_entrega':        tipo or None,
            'nota':                sv(col(row, 12)),
        }
        for slug in slugs:
            results.append({'proyecto_id': slug, **base})
    return results

# ── Parser: CC RVC ────────────────────────────────────────────────────────────
# Cols (header rows at idx 1 and 21): [None(0), Comuna(1), Proyectos(2),
#   Tipo de Entrega(3), Pie Mínimo(4), Fin.Bancario(5), Nº Cuotas(6),
#   Fecha(7), getnet(8), alternativa(9), seguro(10), BROKER(11), Observaciones(12),
#   GOP(13), 6DIV(14), 24DIV(15), ARRIENDO(16), CREDITO DIRECTO(17), ...]

def _parse_rvc_descuento(val):
    if val is None: return None
    m = re.search(r'máximo de un (\d+)%', str(val), re.IGNORECASE)
    return int(m.group(1)) if m else None

_RVC_SECTION_MARKERS = {'* 24 dividendos', 'knockit', 'financiamientos',
                         'topes gop', 'zona', 'quinta', 'central', 'norte',
                         'sur', 'v región', 'topes', 'valorizaci'}

def parse_rvc(rows):
    results = []
    in_data = False
    for row in rows:
        # Detect header row
        c1 = sv(col(row, 1)) or ''
        c2 = sv(col(row, 2)) or ''
        if c1 == 'Comuna' and c2 == 'Proyectos':
            in_data = True
            continue
        if not in_data: continue
        if not any(v is not None for v in row):
            in_data = False
            continue
        # Stop at note/section rows
        if c1 and _norm(c1).split()[0] in _RVC_SECTION_MARKERS:
            in_data = False
            continue

        nombre = sv(col(row, 2))
        if not nombre: continue

        slugs = slugs_list(nombre, 'CC RVC')
        if not slugs: continue

        base = {
            'inmobiliaria':    'RVC',
            'titulo':          nombre,
            'descuento_depto': _parse_rvc_descuento(col(row, 11)),
            'cuotas_pie_n':    safe_int(col(row, 6)),
            'pie_pct_default': 10,
            'tipo_entrega':    sv(col(row, 3)),
            'nota':            sv(col(row, 12)),
        }
        for slug in slugs:
            results.append({'proyecto_id': slug, **base})
    return results

# ── Parser: TOC TOC ───────────────────────────────────────────────────────────
# Header fila 5 (idx 4): [None(0), Proyecto(1), Estado(2), Pre/Aprobación(3),
#   Monto Reserva(4), Pie minimo %(5), Cuotas(6), Monto Contra promesa(7),
#   Forma de pago(8), Fecha máx(9), Cond.Est.(10), Cond.Bod.(11), Descuento(12)]

def _parse_toctoc_dcto(val):
    if val is None: return None, None
    if str(val).strip().lower() == 'ninguno': return 0, None
    if isinstance(val, (int, float)):
        return int(pct_keep_zero(val) or 0), None
    s = str(val).strip()
    nums = [int(n) for n in re.findall(r'(\d+)%', s)]
    if not nums: return None, None
    base = min(nums)
    regla = s if len(nums) > 1 else None
    return base, regla

def _parse_reserva_uf(val):
    if val is None: return None
    if isinstance(val, (int, float)): return float(val)
    m = re.match(r'^\s*(\d+(?:[.,]\d+)?)\s*uf', str(val), re.IGNORECASE)
    return float(m.group(1).replace(',', '.')) if m else None

def parse_toctoc(rows):
    results = []
    STOP = 'forma de pago'
    for row in rows[5:]:
        if not any(v is not None for v in row): continue
        nombre = sv(col(row, 1))
        if not nombre: continue
        if STOP in str(nombre).lower(): break

        slugs = slugs_list(nombre, 'TOC TOC')
        if not slugs: continue

        dcto_base, regla = _parse_toctoc_dcto(col(row, 12))
        pie_raw = col(row, 5)
        pie_pct = pct_keep_zero(pie_raw) if pie_raw is not None else None

        base = {
            'inmobiliaria':    'TOCTOC',
            'titulo':          nombre,
            'descuento_depto': dcto_base,
            'reserva_uf':      _parse_reserva_uf(col(row, 4)),
            'cuotas_pie_n':    safe_int(col(row, 6)),
            'pie_pct_default': pie_pct,
            'tipo_entrega':    sv(col(row, 2)),
            'descuento_regla': regla,
        }
        for slug in slugs:
            results.append({'proyecto_id': slug, **base})
    return results

# ── Parser: CC URMENETA ───────────────────────────────────────────────────────
# Header rows per-project (col[3] = reserva_clp > 50000).
# Sub-rows per tipología: last element = descuento (float < 1) or 'AGOTADOS'.
# Col layout of project header:
#   [Proyecto(0), JV(1), Tipo entrega(2), Reserva(3), % pie const(4),
#    Contra promesa(5), Tipología(6), Est min(7), Est max(8), Bod min(9),
#    Bod max(10), Fecha inicio(11), Nº Cuotas const(12), Fecha máx cuota(13),
#    Desc Maximo(14)]

def parse_urmeneta(rows):
    # Layout real (col 0-indexed, leyendo sin read_only para preservar merged cells):
    # Header por proyecto: [None/ok(0), nombre(1), JV(2), tipo_entrega(3),
    #   reserva_clp(4), %pie_const(5), contra_promesa(6), tipologia(7),
    #   est_min(8), est_max(9), bod_min(10), bod_max(11),
    #   fecha_inicio(12), nro_cuotas(13), fecha_max(14), desc_maximo(15)]
    # Sub-fila tipología: col[7]=tipo, col[15]=descuento (float<1) o 'AGOTADOS'
    results = []
    current = None
    sub_rows = []

    def _finalize():
        if not current: return
        descuentos = []
        for sr in sub_rows:
            last = sr[15] if len(sr) > 15 else None
            if isinstance(last, (int, float)) and 0 < last < 1:
                descuentos.append(round(last * 100, 4))
            elif isinstance(last, (int, float)) and 1 < last <= 100:
                descuentos.append(float(last))
        current['descuento_depto'] = max(descuentos) if descuentos else None
        for slug in current.pop('_slugs'):
            results.append({'proyecto_id': slug,
                            **{k: v for k, v in current.items()}})

    for row in rows[4:]:  # primeras 4 filas = encabezados del sheet
        if not any(v is not None for v in row): continue
        c1 = col(row, 1)  # nombre del proyecto
        c4 = col(row, 4)  # reserva_clp

        is_header = (isinstance(c1, str) and c1.strip() and
                     isinstance(c4, (int, float)) and c4 > 50000)
        if is_header:
            _finalize()
            current = None
            sub_rows = []

            nombre = c1.strip()
            slugs = slugs_list(nombre, 'CC URMENETA')
            if not slugs: continue

            cuotas_raw = col(row, 13)
            cuotas = None
            if isinstance(cuotas_raw, (int, float)):
                cuotas = safe_int(cuotas_raw)
            elif isinstance(cuotas_raw, str):
                tipo_str = (sv(col(row, 3)) or '').lower()
                if 'inmediata' in tipo_str or 'pronta entrega' in tipo_str:
                    cuotas = 1  # entrega inmediata = 1 pago en promesa
                else:
                    nums = re.findall(r'\b(\d+)\s+cuotas?\b', cuotas_raw, re.IGNORECASE)
                    if nums: cuotas = int(nums[0])

            pie_raw = col(row, 5)
            pie_const = None
            if isinstance(pie_raw, (int, float)) and pie_raw > 0:
                pie_const = pct(pie_raw)

            current = {
                '_slugs':        slugs,
                'inmobiliaria':  'URMENETA',
                'titulo':        nombre,
                'reserva_clp':   safe_int(c4),
                'cuotas_pie_n':  cuotas,
                'pie_const_pct': pie_const,
                'tipo_entrega':  sv(col(row, 3)),
            }
            sub_rows = []
        elif current is not None:
            sub_rows.append(list(row))

    _finalize()
    return results

# ── Parser: CC EURO ──────────────────────────────────────────────────────────
# Cols (header fila 0, idx 0): [idx(0), Proyecto(1), Comuna(2), Fecha Escrit.(3),
#   reserva_clp(4), dcto_depto(5), aporte_inmobiliaria(6), cuotas_pie_n(7),
#   pie_const_pct(8), cuoton_pct(9), credito_directo_pct(10), prod_sec(11), nota(12)]

def parse_euro(rows):
    results = []
    for row in rows[1:]:
        if not isinstance(col(row, 0), (int, float)):
            continue

        nombre = sv(col(row, 1))
        if not nombre:
            continue

        slugs = slugs_list(nombre, 'CC EURO')
        if not slugs:
            continue

        tipo = sv(col(row, 3)) or ''
        cuotas_raw = safe_int(col(row, 7))
        if cuotas_raw == 1 and 'inmediata' in tipo.lower():
            cuotas_raw = 0

        base = {
            'inmobiliaria':        'EUROCORP',
            'titulo':              nombre,
            'descuento_depto':     pct(col(row, 5)),
            'aporte_inmobiliaria': pct(col(row, 6)),
            'reserva_clp':         safe_int(col(row, 4)),
            'cuotas_pie_n':        cuotas_raw,
            'pie_const_pct':       pct(col(row, 8)),
            'cuoton_pct':          pct(col(row, 9)),
            'credito_directo_pct': pct(col(row, 10)),
            'tipo_entrega':        tipo or None,
            'nota':                sv(col(row, 12)),
        }
        for slug in slugs:
            results.append({'proyecto_id': slug, **base})
    return results


# ── Load / merge / write ──────────────────────────────────────────────────────

def load_existing():
    wb = openpyxl.load_workbook(UNIFIED, read_only=True, data_only=True)
    ws = wb['CC Unified']
    rows = list(ws.iter_rows(values_only=True))
    wb.close()
    existing = OrderedDict()
    for row in rows[2:]:
        if not any(c is not None for c in row): continue
        d = dict(zip(FIELDS, list(row) + [None] * len(FIELDS)))
        pid = d.get('proyecto_id')
        if pid:
            existing[pid] = d
    return existing

def merge(existing, cc_rows):
    result = OrderedDict(existing)
    for cc in cc_rows:
        pid = cc['proyecto_id']
        if pid in result:
            for f in FIELDS:
                if f == 'proyecto_id': continue
                val = cc.get(f)
                if val is not None:
                    result[pid][f] = val
        else:
            row = {f: None for f in FIELDS}
            row.update({k: v for k, v in cc.items() if v is not None})
            result[pid] = row
    return result

def write_unified(result_dict):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = 'CC Unified'
    ws.append(HEADERS_DESC)
    ws.append(FIELDS)
    for d in result_dict.values():
        ws.append([d.get(f) for f in FIELDS])
    wb.save(UNIFIED)

# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("Leyendo unified existente...")
    existing = load_existing()
    print(f"  {len(existing)} proyectos")

    print(f"Leyendo {SRC.name}...")
    # La mayoría de sheets se lee en modo read_only (más rápido).
    # CC URMENETA tiene celdas fusionadas → necesita modo normal.
    wb_fast = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
    wb_full = openpyxl.load_workbook(SRC, data_only=True)

    def sheet_rows(name, full=False):
        wb = wb_full if full else wb_fast
        return [list(r) for r in wb[name].iter_rows(values_only=True)]

    all_cc = []
    for sh_name, parser, full in [
        ('CC MAESTRA',  parse_maestra,  False),
        ('CC INGEVEC',  parse_ingevec,  False),
        ('CC RVC',      parse_rvc,      False),
        ('TOC TOC',     parse_toctoc,   False),
        ('CC URMENETA', parse_urmeneta, True),
        ('CC EURO',     parse_euro,     False),
    ]:
        try:
            parsed = parser(sheet_rows(sh_name, full))
            print(f"  [{sh_name}] {len(parsed)} proyectos")
            all_cc.extend(parsed)
        except Exception as e:
            print(f"  [{sh_name}] ERROR: {e}")
            import traceback; traceback.print_exc()

    wb_fast.close()
    wb_full.close()

    print("Fusionando...")
    result = merge(existing, all_cc)

    print(f"Escribiendo unified ({len(result)} proyectos)...")
    write_unified(result)
    print(f"  → {UNIFIED}")

    print("\nListo. Ejecuta actualizar_cc.bat para publicar cc.json.")

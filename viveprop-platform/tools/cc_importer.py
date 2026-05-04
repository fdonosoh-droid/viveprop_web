#!/usr/bin/env python3
"""
cc_importer.py
Lee 'data/condiciones comerciales.xlsx' y regenera data/cc_data.xlsx + data/cc_data.js

Uso: python tools/cc_importer.py   (ejecutar desde la raíz del proyecto)
"""
import re
import json
import unicodedata as ud
from datetime import datetime, date
from pathlib import Path

import openpyxl
from openpyxl import Workbook

ROOT     = Path(__file__).parent.parent
SRC      = ROOT / "data/condiciones comerciales.xlsx"
PROJ     = ROOT / "data/projects.xlsx"
OUT_XLSX = ROOT / "data/cc_data.xlsx"
OUT_JS   = ROOT / "data/cc_data.js"

# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _no_accent(s: str) -> str:
    return ''.join(c for c in ud.normalize('NFD', s) if ud.category(c) != 'Mn')

def _norm(s) -> str:
    if not s: return ''
    s = _no_accent(str(s)).lower()
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r'[^\w\s]', ' ', s)
    return ' '.join(s.split())

def _fmt(v) -> str:
    if v is None: return ''
    if isinstance(v, bool): return 'Sí' if v else 'No'
    if isinstance(v, float):
        if 0 < abs(v) <= 1.00001:
            pct = round(v * 100, 2)
            return f'{int(pct)}%' if pct == int(pct) else f'{pct}%'
        iv = int(v)
        if v == iv:
            return f'{iv:,}'.replace(',', '.')
        return f'{v:.2f}'
    if isinstance(v, int):
        return f'{v:,}'.replace(',', '.') if v >= 1000 else str(v)
    if isinstance(v, (datetime, date)):
        return v.strftime('%d/%m/%Y')
    return str(v).strip()

def _v(row, i, default=None):
    return row[i] if i < len(row) and row[i] is not None else default

# ──────────────────────────────────────────────────────────────────────────────
# Project lookup
# ──────────────────────────────────────────────────────────────────────────────

# Overrides para nombres que no hacen match automático
OVERRIDES = {
    ('TOCTOC',   'PDA Torre Poniente'):                  'proj_parque-de-araya-torre-poniente',
    ('TOCTOC',   'PDA Torre Oriente'):                   'proj_parque-de-araya-torre-oriente',
    ('URMENETA', 'CIUDAD BUZETA'):                       'proj_ciudad-cerrillos',
    ('URMENETA', 'SUEÑA STA ELISA'):                     'proj_suena-santa-elisa',
    ('URMENETA', 'NEO FLORIDA III'):                         'proj_neoflorida-3',
    ('URMENETA', 'NEO FLORIDA III. La florida (SANTOLAYA)'): 'proj_neoflorida-3',
    ('URMENETA', 'CIUDAD LYON'):                             'proj_ciudad-lyon',
    ('URMENETA', 'GARDEN MACUL'):                        'proj_garden-macul',
    ('URMENETA', 'ESPACIO PRIME'):                       None,   # no está en projects.xlsx
    ('URMENETA', 'GREEN CONCEPT VM'):                    None,
    ('INGEVEC',  'Vicuña Mackenna 7589 I y II (VIC) (VIC2)'): '__split__',
    ('INGEVEC',  'Vicuña Mackenna 7589 (VIC y VIC2)'):        '__split__',
    ('INGEVEC',  'Serrano (SER)'):                             None,
    ('INGEVEC',  'ViMA (VIMA)'):                               None,
}

def load_projects():
    wb = openpyxl.load_workbook(PROJ, read_only=True, data_only=True)
    rows = list(wb['Proyectos'].iter_rows(values_only=True))[1:]
    wb.close()
    by_name_inmob = {}
    by_norm = {}
    for r in rows:
        if not r[0]: continue
        pid, nombre, inmob = str(r[0]), str(r[1]), str(r[2])
        n = _norm(nombre)
        by_name_inmob[(n, inmob.upper())] = pid
        by_norm.setdefault(n, []).append((pid, inmob.upper()))
    return by_name_inmob, by_norm

def find_pids(name: str, inmob: str, by_name_inmob, by_norm) -> list:
    """Devuelve lista de project IDs que coinciden con el nombre."""
    if not name or not isinstance(name, str): return []
    name = name.strip()
    inm_up = inmob.upper()

    key = (inm_up, name)
    if key in OVERRIDES:
        val = OVERRIDES[key]
        if val == '__split__':
            # Strip parentheticals first, then "I y II" suffix
            base = re.sub(r'\s*\(.*', '', name).strip()
            base = re.sub(r'\s*I\s+[Yy]\s+II.*', '', base).strip()
            r1 = find_pids(base + ' I',  inmob, by_name_inmob, by_norm)
            r2 = find_pids(base + ' II', inmob, by_name_inmob, by_norm)
            return r1 + r2
        return [val] if val else []

    n = _norm(name)
    exact = by_name_inmob.get((n, inm_up))
    if exact: return [exact]

    # Partial word match within same inmobiliaria
    best, best_score = None, 0
    n_words = set(n.split())
    for k, vals in by_norm.items():
        for (pid, pinmob) in vals:
            if pinmob != inm_up: continue
            k_words = set(k.split())
            overlap = len(n_words & k_words)
            if overlap >= min(2, len(k_words)) and overlap > best_score:
                best, best_score = pid, overlap
    return [best] if best else []

# ──────────────────────────────────────────────────────────────────────────────
# Parsers por inmobiliaria
# ──────────────────────────────────────────────────────────────────────────────

def _is_skip_str(s):
    """True si el string parece una fila de nota/footer, no un proyecto."""
    if not s: return True
    bad_starts = ('Recordar', 'Portal', 'http', 'Promoci', 'Pago de',
                  'Nueva Promoci', 'Nomenclatura', 'PD', '1D', '2D', '3D',
                  'Apostol', 'Sin cambios', 'Con cambios', 'Lanzamiento')
    return any(s.startswith(b) for b in bad_starts) or len(s) < 3

def parse_maestra(ws, by_name_inmob, by_norm):
    rows = list(ws.iter_rows(values_only=True))
    hdr = next((i for i, r in enumerate(rows) if len(r) > 1 and r[1] == 'PROYECTO'), None)
    if hdr is None: return {}

    # col 0=marker, col 1=PROYECTO, col 2=ENTREGA, col 3=COMUNA,
    # col 4=Dcto Base, col 5=Dcto Adicional, col 6=Giftcard,
    # col 7=Upfront, col 8=Pie cuotas, col 9=UPAGO Cuotas,
    # col 10=Cuota desde, col 11=Certificado Pago, col 12=Mutuo UPAGO
    COLMAP = {
        2: 'ENTREGA', 3: 'COMUNA', 4: 'Descuento Base', 5: 'Dcto Adicional',
        6: 'Giftcard', 7: 'Upfront', 8: 'Pie en cuotas', 9: 'UPAGO Cuotas',
        10: 'Cuota desde', 11: 'Certificado Pago', 12: 'Mutuo UPAGO',
    }
    result = {}
    for row in rows[hdr + 1:]:
        name = _v(row, 1)
        if not name or not isinstance(name, str): continue
        name = name.strip()
        if name == 'PROYECTO': break   # segunda tabla (ej: Fecha Ingreso CBR)
        if _is_skip_str(name): continue

        pids = find_pids(name, 'MAESTRA', by_name_inmob, by_norm)
        if not pids:
            print(f'  [MAESTRA] sin match: {repr(name)}')
            continue

        campos_map = {}
        for ci, label in COLMAP.items():
            v = _v(row, ci)
            if v is None: continue
            s = str(v).strip() if isinstance(v, str) else _fmt(v)
            if s and s not in ('0', '0%', 'None'): campos_map[label] = s

        for pid in pids:
            result[pid] = {'titulo': name, 'campos_map': campos_map,
                           'inmob': 'MAESTRA', 'nota': ''}
    return result


def parse_ingevec(ws, by_name_inmob, by_norm):
    rows = list(ws.iter_rows(values_only=True))
    if not rows: return {}
    hdr = rows[0]
    # col 0=None(hdr)/nro(data), col 1=Proyecto, col 2=Comuna,
    # col 3=Fecha Escrituración→"Tipo de entrega", col 4=Pago reserva,
    # col 5=Dcto.Depto, col 6=Aporte Inmob, col 7=Cuotas Pie,
    # col 8=Pie Const., col 9=Cuotón, col 10=Pie Crédito s/int,
    # col 11=Productos Secundarios, col 12=Info adicional (nota)
    proj_col = 1 if (len(hdr) > 1 and str(hdr[1] or '').strip() == 'Proyecto') else 0
    pc = proj_col
    COLMAP = {
        pc+2: 'Tipo de entrega', pc+3: 'Reserva',      pc+4: 'Dcto. depto.',
        pc+5: 'Aporte inmobiliario', pc+6: 'Cuotas pie', pc+7: 'Pie período const.',
        pc+8: 'Cuotón',  pc+9: 'Pie crédito s/int.', pc+10: 'Productos secundarios',
    }
    NOTA_COL = pc + 11

    result = {}
    for row in rows[1:]:
        name = _v(row, pc)
        if not name or not isinstance(name, str): continue
        name = name.strip()
        if name.startswith('Nota') or name.startswith('Sin cambios'): break

        pids = find_pids(name, 'INGEVEC', by_name_inmob, by_norm)
        if not pids:
            print(f'  [INGEVEC] sin match: {repr(name)}')
            continue

        campos_map = {}
        for ci, label in COLMAP.items():
            v = _v(row, ci)
            if v is None: continue
            s = str(v).strip() if isinstance(v, str) else _fmt(v)
            if s and s not in ('0', '0%', '0,0%', '0.0%', '0,0', 'None'):
                campos_map[label] = s

        nota = ''
        nv = _v(row, NOTA_COL)
        if nv: nota = str(nv).strip()

        for pid in pids:
            result[pid] = {'titulo': name, 'campos_map': campos_map,
                           'inmob': 'INGEVEC', 'nota': nota}
    return result


def parse_rvc(ws, by_name_inmob, by_norm):
    # New format (2025+): zone blocks with col 1=Comuna, col 2=Proyectos
    # col 3=Tipo Entrega, col 4=Pie Mínimo, col 5=Financiamiento,
    # col 6=N° Cuotas, col 7=Fecha entrega, col 8=Getnet, col 9=Alt. pie 10%,
    # col 11=BROKER (contains "Si, con descuento máximo de un X%..."),
    # col 12=Observaciones, col 13-18=promotion flags
    rows = list(ws.iter_rows(values_only=True))

    COLMAP = {
        3: 'Tipo entrega', 4: 'Pie mínimo', 5: 'Financiamiento',
        6: 'Cuotas prog.', 7: 'Fecha ult. cuota', 8: 'Getnet (cuotas)',
        9: 'Alt. pie 10%',
    }
    _PROMOS = {
        13: 'GOP Gratis', 14: '6 Dividendos Gratis', 15: '24 Dividendos',
        16: 'Arriendo Asegurado 24m', 17: 'Crédito Directo', 18: 'Knockit',
    }

    in_data = False
    result = {}

    for row in rows:
        col1 = str(_v(row, 1) or '').strip()
        col2 = str(_v(row, 2) or '').strip()
        col4 = str(_v(row, 4) or '').strip()

        # Zone group header (CENTRAL / QUINTA / NORTE): col 4 = 'CONDICIONES DE VENTA'
        if col4 == 'CONDICIONES DE VENTA':
            in_data = False
            continue

        # Conditions column header row
        if col2 == 'Proyectos':
            in_data = True
            continue

        # Non-conditions table (TOPES GOP etc.): col 1 = 'ZONA'
        if col1 == 'ZONA':
            in_data = False
            continue

        if not in_data or not col2:
            continue

        name = col2
        # Skip footer/note rows: long strings or known note starts
        if (len(name) > 60
                or name.startswith('Si ')
                or name.startswith('Incluye')
                or name.startswith('-')):
            continue

        pids = find_pids(name, 'RVC', by_name_inmob, by_norm)
        if not pids:
            print(f'  [RVC] sin match: {repr(name)}')
            continue

        campos_map = {}
        if col1 and col1 != 'Comuna':
            campos_map['Comuna'] = col1

        for ci, label in COLMAP.items():
            v = _v(row, ci)
            if v is None: continue
            s = str(v).strip() if isinstance(v, str) else _fmt(v)
            if s and s not in ('0', '0%', 'None'):
                campos_map[label] = s

        # Extract discount from BROKER column (col 11)
        broker_val = _v(row, 11)
        if broker_val and isinstance(broker_val, str) and broker_val.strip().lower() != 'no':
            m = re.search(r'(\d+(?:[.,]\d+)?)\s*%', broker_val)
            if m:
                campos_map['Descuento RVC'] = m.group(1) + '%'

        # Active promotions
        active = [lbl for ci, lbl in _PROMOS.items()
                  if str(_v(row, ci) or '').strip().upper().startswith('SI')]
        if active:
            campos_map['Promociones'] = ', '.join(active)

        nota = str(_v(row, 12) or '').strip()

        for pid in pids:
            if pid not in result:   # first-wins
                result[pid] = {'titulo': name, 'campos_map': campos_map,
                               'inmob': 'RVC', 'nota': nota}
    return result


def parse_toctoc(ws, by_name_inmob, by_norm):
    rows = list(ws.iter_rows(values_only=True))
    # Buscar columna del header dinámicamente (puede estar en col 1 o col 2)
    hdr_idx = None
    proj_col = None
    for i, r in enumerate(rows):
        for j, c in enumerate(r):
            if str(c or '').strip() == 'Proyecto':
                hdr_idx, proj_col = i, j
                break
        if hdr_idx is not None: break
    if hdr_idx is None: return {}

    pc = proj_col
    # pc=Proyecto, pc+1=Estado, pc+2=Pre/Aprobación, pc+3=Monto Reserva,
    # pc+4=Pie mínimo, pc+5=Cuotas, pc+6=Contra promesa, pc+7=Forma pago,
    # pc+8=Fecha máx pie, pc+9=Cond. Estacionamientos, pc+10=Cond. Bodegas,
    # pc+11=Descuento autorizado
    COLMAP = {
        pc+1: 'Estado', pc+2: 'Pre/Aprobación bancaria', pc+3: 'Monto Reserva',
        pc+4: 'Pie minimo %', pc+5: 'Cuotas', pc+6: 'Monto Contra promesa',
        pc+7: 'Forma de pago cuotas', pc+8: 'Fecha máxima de pago pie',
        pc+9: 'Condición Estacionamientos', pc+10: 'Condición Bodegas',
        pc+11: 'Descuento autorizado',
    }
    result = {}
    for row in rows[hdr_idx + 1:]:
        name = _v(row, pc)
        if not name or not isinstance(name, str): continue
        name = name.strip()
        if not name or ':' in name or name.startswith('Forma'): continue

        pids = find_pids(name, 'TOCTOC', by_name_inmob, by_norm)
        if not pids:
            print(f'  [TOCTOC] sin match: {repr(name)}')
            continue

        campos_map = {}
        for ci, label in COLMAP.items():
            v = _v(row, ci)
            if v is None: continue
            s = str(v).strip() if isinstance(v, str) else _fmt(v)
            if s and s not in ('0', '0%', 'None'): campos_map[label] = s

        for pid in pids:
            result[pid] = {'titulo': name, 'campos_map': campos_map,
                           'inmob': 'TOCTOC', 'nota': ''}
    return result


def parse_urmeneta(ws, by_name_inmob, by_norm):
    rows = list(ws.iter_rows(values_only=True))
    hdr_idx = next((i for i, r in enumerate(rows)
                    if len(r) > 1 and 'royecto' in str(r[1] or '')), None)
    if hdr_idx is None: return {}

    # col 0=marker, col 1=Proyecto, col 2=JV, col 3=Tipo entrega,
    # col 4=Valor Reserva, col 5=% Cuotas const., col 6=Contra promesa,
    # col 7=Tipología (primera), col 8=Est min, col 9=Est max,
    # col 10=Bod min, col 11=Bod max, col 12=Fecha escrituración,
    # col 13=Nº cuotas const., col 14=Fecha máx. cuota,
    # col 15=Descuento Máximo, col 16=Desc adic cierre, col 17=Observaciones
    PROJ_COLMAP = {
        3: 'Tipo de entrega', 4: 'Valor reserva', 5: '% cuotas const.',
        6: 'Contra promesa', 12: 'Fecha escrituración', 13: 'N° cuotas const.',
        14: 'Fecha máx. cuota', 16: 'Desc. adic. cierre',
    }
    DESC_COL = 15
    OBS_COL  = 17

    result = {}
    cur_name = None
    cur_campos = {}
    cur_descs = []
    cur_obs = []

    def flush():
        nonlocal cur_name, cur_campos, cur_descs, cur_obs
        if not cur_name: return
        if cur_descs:
            unique = sorted(set(d for d in cur_descs if d))
            cur_campos['Descuento máximo'] = ' / '.join(unique)
        nota = ' · '.join(o for o in cur_obs if o)

        pids = find_pids(cur_name, 'URMENETA', by_name_inmob, by_norm)
        if pids:
            for pid in pids:
                result[pid] = {'titulo': cur_name, 'campos_map': dict(cur_campos),
                               'inmob': 'URMENETA', 'nota': nota}
        else:
            print(f'  [URMENETA] sin match: {repr(cur_name)}')
        cur_name = None; cur_campos = {}; cur_descs = []; cur_obs = []

    for row in rows[hdr_idx + 1:]:
        proj_name = _v(row, 1)
        tip_val   = _v(row, 7)

        is_project_row = (proj_name and isinstance(proj_name, str)
                          and len(proj_name.strip()) > 3
                          and _v(row, 3) is not None)

        if is_project_row:
            flush()
            cur_name = proj_name.strip()
            for ci, label in PROJ_COLMAP.items():
                v = _v(row, ci)
                if v is None: continue
                s = str(v).strip() if isinstance(v, str) else _fmt(v)
                if s and s not in ('N/A', '0', '0%', 'None'):
                    cur_campos[label] = s
            # Descuento y obs de la primera tipología
            d = _v(row, DESC_COL)
            if d and str(d).strip() not in ('AGOTADOS', '', 'None'):
                cur_descs.append(_fmt(d) if isinstance(d, (int, float)) else str(d).strip())
            o = _v(row, OBS_COL)
            if o and str(o).strip() not in ('', 'N/A', 'None'):
                cur_obs.append(str(o).strip())

        elif cur_name and tip_val and isinstance(tip_val, str):
            # fila de tipología
            d = _v(row, DESC_COL)
            if d and str(d).strip() not in ('AGOTADOS', '', 'None'):
                cur_descs.append(_fmt(d) if isinstance(d, (int, float)) else str(d).strip())
            o = _v(row, OBS_COL)
            if o and str(o).strip() not in ('', 'N/A', 'None'):
                cur_obs.append(str(o).strip())

    flush()
    return result

# ──────────────────────────────────────────────────────────────────────────────
# Columnas de cc_data.xlsx  (mismo esquema que la versión anterior)
# ──────────────────────────────────────────────────────────────────────────────

XLSX_COLS = [
    'proyecto_id', 'titulo',
    # MAESTRA
    'ENTREGA', 'COMUNA', 'Descuento Base', 'Giftcard', 'Upfront', 'Pie en cuotas',
    'UPAGO Cuotas', 'Cuota desde', 'Certificado Pago', 'Mutuo UPAGO',
    'PROYECTO', 'RAZÓN SOCIAL', 'RUT', 'Dcto Adicional',
    # INGEVEC
    'Tipo de entrega', 'Reserva', 'Dcto. depto.', 'Aporte inmobiliario',
    'Cuotas pie', 'Pie período const.', 'Cuotón', 'Pie crédito s/int.',
    'Productos secundarios', 'Info adicional', 'Coordinador/a', 'Email', 'Celular',
    # RVC
    'Comuna', 'Tipo entrega', 'Pie mínimo', 'Financiamiento', 'Cuotas prog.',
    'Getnet (cuotas)', 'Alt. pie 10%', 'Fecha ult. cuota', 'Descuento RVC',
    'Promociones', 'Condiciones',
    # TOCTOC
    'Estado', 'Pre/Aprobación bancaria', 'Monto Reserva', 'Pie minimo %',
    'Cuotas', 'Monto Contra promesa', 'Forma de pago cuotas',
    'Fecha máxima de pago pie', 'Condición Estacionamientos', 'Condición Bodegas',
    'Descuento autorizado',
    # URMENETA
    'Valor reserva', 'Fecha escrituración', 'N° cuotas const.', 'Descuento máximo',
    'Observaciones', '% cuotas const.', 'Contra promesa', 'Fecha máx. cuota',
    'Desc. adic. cierre', 'Tipo de entrega',
    # shared
    'nota',
]
# Quitar duplicados manteniendo orden
_seen = set()
XLSX_COLS = [c for c in XLSX_COLS if not (c in _seen or _seen.add(c))]

NON_CAMPO = {'proyecto_id', 'titulo', 'PROYECTO', 'RAZÓN SOCIAL', 'RUT', 'nota'}

# ──────────────────────────────────────────────────────────────────────────────
# Writers
# ──────────────────────────────────────────────────────────────────────────────

def write_xlsx(cc_data: dict):
    wb = Workbook()
    ws = wb.active
    ws.title = 'Condiciones'
    ws.append(XLSX_COLS)
    for pid, entry in cc_data.items():
        row_dict = dict.fromkeys(XLSX_COLS, None)
        row_dict['proyecto_id'] = pid
        row_dict['titulo'] = entry['titulo']
        row_dict['nota'] = entry.get('nota', '')
        for label, val in entry['campos_map'].items():
            if label in row_dict:
                row_dict[label] = val
        ws.append([row_dict[c] for c in XLSX_COLS])
    wb.save(OUT_XLSX)
    print(f'[ok] {OUT_XLSX}  ({len(cc_data)} proyectos)')


def write_js(cc_data: dict):
    out = {}
    for pid, entry in cc_data.items():
        campos = [[lbl, val] for lbl, val in entry['campos_map'].items()
                  if lbl not in NON_CAMPO and val]
        out[pid] = {'titulo': entry['titulo'], 'campos': campos,
                    'nota': entry.get('nota', '')}
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    body = json.dumps(out, ensure_ascii=False, indent=2)
    text = (f'// Generado por cc_importer.py — {now}\n'
            f'// Proyectos con condiciones: {len(out)}\n'
            f'const CC_DATA = {body};\n')
    OUT_JS.write_text(text, encoding='utf-8')
    print(f'[ok] {OUT_JS}  ({len(out)} proyectos)')

# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

def main():
    if not SRC.exists():
        print(f'ERROR: no encontrado {SRC}')
        return

    by_name_inmob, by_norm = load_projects()
    wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)

    cc_data = {}
    for inmob, sheet_name, parser in [
        ('MAESTRA',  'CC MAESTRA',  parse_maestra),
        ('INGEVEC',  'CC INGEVEC',  parse_ingevec),
        ('RVC',      'CC RVC',      parse_rvc),
        ('TOCTOC',   'TOC TOC',     parse_toctoc),
        ('URMENETA', 'CC URMENETA', parse_urmeneta),
    ]:
        if sheet_name not in wb.sheetnames:
            print(f'  [warn] hoja no encontrada: {sheet_name}')
            continue
        print(f'Parseando {sheet_name}...')
        parsed = parser(wb[sheet_name], by_name_inmob, by_norm)
        cc_data.update(parsed)
        print(f'  -> {len(parsed)} proyectos')

    wb.close()

    print(f'\nTotal: {len(cc_data)} proyectos con condiciones')
    write_xlsx(cc_data)
    write_js(cc_data)
    print('\nListo. Reiniciá el backend para que cargue cc_data.xlsx actualizado.')


if __name__ == '__main__':
    main()

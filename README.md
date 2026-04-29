# viveprop_web

Repositorio de herramientas web internas para **VIVEPROP** — corretaje de propiedades. Contiene dos plataformas activas, una herramienta legacy y utilidades de soporte.

---

## Proyectos

| Proyecto | Stack | Estado | Puerto |
|---------|-------|--------|--------|
| [`viveprop-platform/`](#viveprop-platform) | FastAPI + Vanilla JS + Vite | Activo | 8001 / 5176 |
| [`cotizador-web-mp/`](#cotizador-web-mp) | Next.js 15 + TypeScript | Activo | 3003 |
| [`stock-propiedades/`](#stock-propiedades) | HTML + JS standalone | Legacy | — |

---

## viveprop-platform

Plataforma interna de análisis de mercado inmobiliario. Integra mercado secundario (stock de propiedades usadas), mercado primario (proyectos nuevos), condiciones comerciales por inmobiliaria y cotizador de unidades.

### Stack

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI + Uvicorn |
| Frontend | Vanilla JS + Vite |
| Datos | Excel (openpyxl) → JSON en memoria |
| UF | mindicador.cl (cache 1 hora) |

### Arranque rápido

```bat
cd viveprop-platform
start.bat
```

| Servicio | URL |
|---------|-----|
| Backend API | http://localhost:8001 |
| Frontend dev | http://localhost:5176 |
| Swagger | http://localhost:8001/docs |

### Estructura

```
viveprop-platform/
├── backend/
│   ├── main.py               # FastAPI app
│   ├── routers/              # stock · projects · cc_data · indicators
│   └── services/
│       ├── excel_loader.py   # DataStore singleton
│       └── uf_cache.py       # UF con cache 1h
├── data/
│   ├── projects.xlsx         # Proyectos y unidades (~10.600 unidades, 84 proyectos)
│   ├── cc_data.xlsx          # Condiciones comerciales — generado por cc_importer
│   ├── condiciones comerciales.xlsx  # Fuente maestra (5 inmobiliarias)
│   └── *.js                  # Snapshots para carga rápida
├── frontend/src/
│   ├── modules/
│   │   ├── secundario.js     # Mercado secundario
│   │   ├── primario.js       # Proyectos nuevos
│   │   ├── perfilador.js     # Perfilador de clientes
│   │   └── cotizador.js      # Cotizador (en desarrollo)
│   └── components/           # Mapa · Filtros
├── tools/
│   ├── cc_importer.py        # Genera cc_data.xlsx + cc_data.js desde fuente maestra
│   ├── excel_to_js.py
│   └── js_to_excel.py
└── Docs/                     # Cotizaciones de referencia
```

### API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/stock` | Unidades mercado secundario |
| GET | `/api/geocodes` | Geocodes mercado secundario |
| GET | `/api/projects` | Proyectos y unidades mercado primario |
| GET | `/api/pri-geocodes` | Geocodes mercado primario |
| GET | `/api/cc` | Condiciones comerciales |
| GET | `/api/uf` | Valor UF del día |
| POST | `/api/data/reload` | Recarga datos sin reiniciar |

### Actualizar condiciones comerciales

```bash
# Desde viveprop-platform/
python tools/cc_importer.py
```

Lee `data/condiciones comerciales.xlsx` (hojas: `CC MAESTRA`, `CC INGEVEC`, `CC RVC`, `TOC TOC`, `CC URMENETA`) y regenera `cc_data.xlsx` + `cc_data.js`. Reiniciar backend para aplicar.

Resultado esperado: ~77 proyectos con condiciones (18 MAESTRA + 22 INGEVEC + 14 RVC + 6 TOCTOC + 17 URMENETA).

### Requisitos

```bash
pip install -r backend/requirements.txt   # Python 3.10+
cd frontend && npm install                 # Node.js 18+
```

---

## cotizador-web-mp

Aplicación web para generación de cotizaciones de compra de propiedades en mercado primario. Diseñada para corredores VIVEPROP.

### Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4.x |
| Lenguaje | TypeScript (strict) |
| PDF | @react-pdf/renderer (server-side) |
| Email | Nodemailer (SMTP) |
| DB dev | Excel (INPUT_FILES.xlsx vía ExcelAdapter) |
| DB prod | PostgreSQL 15+ |

### Arranque rápido

```bash
cd cotizador-web-mp
npm install
cp .env.example .env.local   # configurar variables
npm run dev                   # http://localhost:3000
```

### Flujo de uso

```
1. Selección de unidad
   Filtros en cascada: Comuna → Entrega → Inmobiliaria → Proyecto → N° Unidad
   Agregar estacionamiento / bodega opcionales

2. Datos cliente + corredor

3. Cotización
   Parámetros editables: % pie, upfront, plazo, tasas CAE, plusvalía, arriendo
   Resultado: plan de pie, crédito hipotecario, 3 escenarios CAE, evaluación 5 años
   Acciones: Imprimir / Descargar PDF / Enviar email
```

### Motor de cálculo

Reglas por inmobiliaria cargadas desde `REGLAS_INMOBILIARIAS` en `INPUT_FILES.xlsx`:

| Inmobiliaria | Base aporte | LTV | Pie secundarios |
|---|---|---|---|
| MAESTRA | % sobre tasación | 80% | igual que depto |
| INGEVEC | % sobre precio lista depto | 100% | 20% fijo |
| URMENETA | % sobre precio lista total | 100% | 20% fijo |
| Resto | % sobre precio lista depto | 100% | 20% fijo |

Ver [`cotizador-web-mp/Documentos/README.md`](cotizador-web-mp/Documentos/README.md) para documentación completa.

---

## stock-propiedades

Frontend standalone (legacy) para visualización de stock de propiedades en arriendo/venta del mercado secundario. Reemplazado por el módulo `secundario` de `viveprop-platform`.

```
stock-propiedades/
├── index.html     # App completa en un solo archivo HTML
├── data.js        # Snapshot de unidades (~510 KB)
└── geocodes.js    # Coordenadas por propiedad
```

---

## Historial del proyecto

### Origen

El proyecto nació de la necesidad de consolidar varias herramientas dispersas usadas por el equipo de VIVEPROP: planillas Excel de stock, condiciones comerciales en PDFs por inmobiliaria, y cálculos de cotización manual.

### Etapas de desarrollo

**Fase 1 — stock-propiedades (legacy)**
Frontend HTML/JS standalone para visualizar el inventario de propiedades en arriendo y venta. Requería actualización manual del snapshot `data.js`.

**Fase 2 — cotizador-web-mp**
Aplicación Next.js 15 para generación de cotizaciones de mercado primario. Motor de cálculo que replica fórmulas Excel con reglas específicas por inmobiliaria. Genera PDF, envía email, guarda historial. Soporta Excel como base de datos en desarrollo y PostgreSQL en producción.

**Fase 3 — viveprop-platform**
Plataforma unificada que integra:
- Mercado secundario (migración desde stock-propiedades)
- Mercado primario con condiciones comerciales en tiempo real
- Pipeline de condiciones comerciales (`cc_importer.py`) que lee el archivo maestro Excel con 5 inmobiliarias (MAESTRA, INGEVEC, RVC, TOCTOC, URMENETA) y genera los datos para el frontend automáticamente
- Perfilador de clientes
- Cotizador de unidades (en desarrollo)

**Pipeline cc_importer — decisiones técnicas**
- Normalización de nombres con fuzzy matching (word overlap) para mapear proyectos entre la planilla de condiciones y el catálogo de proyectos
- Lógica diferenciada por inmobiliaria: RVC usa bloques por zona con discount extraído del campo BROKER; INGEVEC aplica aporte sobre precio lista pre-descuento; URMENETA agrega descuentos por tipología; TOCTOC con detección dinámica de columna header
- Proyecto `Vicuña Mackenna 7589` manejado con sentinel `__split__` para separar Torre I y Torre II desde una fila combinada en el fuente

**Reglas de cálculo del cotizador (validadas contra cotización real COT-2026-0001)**
- `Pie período const.` y `Crédito Directo`: base = valor de venta total (depto ajustado + secundarios)
- `Aporte inmobiliario`: base = precio lista depto **pre-descuento**
- Tasación banco = valor de venta + aporte inmobiliario
- Crédito hipotecario = LTV × tasación banco
- Cuotas pie construcción: **decrecientes**, no fijas

---

## Datos

Los archivos de datos no se versionan en producción. Estructura esperada:

| Archivo | Descripción |
|---------|-------------|
| `viveprop-platform/data/projects.xlsx` | Catálogo de proyectos y unidades |
| `viveprop-platform/data/condiciones comerciales.xlsx` | Condiciones por inmobiliaria (fuente maestra) |
| `cotizador-web-mp/INPUT_FILES.xlsx` | Stock + condiciones + UF + reglas (cotizador MP) |

---

## Licencia

Uso interno VIVEPROP. Todos los derechos reservados.

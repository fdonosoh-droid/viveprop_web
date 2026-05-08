# Cotizador — viveprop-platform

> **Estado:** Implementado y en producción. Flujo completo: selección → condiciones → cotización imprimible.

## Contexto

El cotizador está integrado al módulo **Proyectos Nuevos** de viveprop-platform. Desde `primario.js` (selección de unidad + secundarios + botón "Cotizar") se lanza el flujo de 3 pasos que produce una cotización imprimible con datos del cliente, plan de pie y crédito hipotecario.

### Referencia de cálculo validada

Cotización real: `Docs/cotizacion-COT-2026-0001.pdf`
- Proyecto: VICUÑA MACKENNA 7589 II (INGEVEC · La Florida)
- Unidades: DP 316 (2D2B · 4.294 UF) + Est DP 76 (390 UF) + Bod DP 41 (128 UF)
- UF del día: 39.841,72
- Usado como caso de prueba para verificar el motor en Sprint 1

---

## Arquitectura

### Fuentes de datos

| Dato | Fuente | Disponibilidad |
|------|--------|---------------|
| Proyectos y unidades | `PROJECTS` (projects.js → projects.json) | ✅ En memoria |
| Condiciones comerciales | `cc.json` (generado por `cc_importer.py` desde `condiciones_cc_unified.xlsx`) | ✅ En memoria |
| Valor UF | `store.UF` (GET /api/uf → mindicador.cl, cache 1h) | ✅ En memoria |
| Reglas por inmobiliaria | `PARAMETROS_CALCULO` en `calc_cotizador.js` | ✅ Implementado |
| Parámetros del motor | `PARAMETROS_CALCULO` en `calc_cotizador.js` | ✅ Implementado |

### Flujo de datos

```
Click "Cotizar" (primario.js)
  │
  ├─ _currentProject  →  { id, nombre, inmobiliaria, ... }
  ├─ _selectedUnit    →  { dp, tipologia, precio_uf, ... }
  └─ checkboxes       →  [{ dp, tipologia, precio_uf }, ...]
         │
         ▼
  pmCotizar()  →  cotizFromProp({ project, depto, secundarios })
         │
         ▼
  parseCCForCotizador(CC_DATA[project.id], seleccion)
  →  InputCotizacion (objeto normalizado)
         │
         ▼
  calcularCotizacion(input, store.UF)
  →  ResultadoCotizacion
         │
         ▼
  renderCotizador(resultado)
  →  Panel UI visible
```

### Archivos involucrados

| Archivo | Estado |
|---------|--------|
| `frontend/src/utils/calc_cotizador.js` | ✅ Motor de cálculo (PMT, pie, tasación, escenarios CAE) |
| `frontend/src/utils/cc_parser.js` | ✅ `parseCCForCotizador()` — ruta genérica, sin branches por inmobiliaria |
| `frontend/src/modules/cotizador.js` | ✅ Flujo 3 pasos: selección datos cliente → parámetros → impresión |
| `frontend/src/modules/primario.js` | ✅ `pmCotizar()` pasa `{ project, depto, secundarios }` |
| `frontend/index.html` | ✅ Sección `#cotiz-panel` con todos los sub-paneles |
| `frontend/src/styles/app.css` | ✅ Estilos del panel cotizador |

---

## Implementación (referencia de sprints completados)

### Sprint 1 — Motor de cálculo ✅
**Objetivo:** El motor produce números correctos verificados contra COT-2026-0001.

**Tareas:**
1. Crear `frontend/src/utils/calc_cotizador.js`
   - Portar `calcularCotizacion(input)` desde `cotizador-web-mp/lib/calculators/cotizador.ts`
   - Eliminar tipos TypeScript → JS puro (módulo ES6)
   - Incluir función auxiliar `pmt(tasa, n, pv)`
2. Crear constante `REGLAS_INMOBILIARIAS` en el mismo archivo
3. Crear constante `PARAMETROS_CALCULO` en el mismo archivo
4. Prueba manual en consola del browser con datos de COT-2026-0001

**Criterio de aceptación:**
```js
calcularCotizacion({
  precioListaDepto: 4294, descuentoPct: 0.02, descuentoAdicionalPct: 0,
  preciosConjuntos: [390, 128],
  bonoPiePct: 0.09, reservaCLP: 100000,
  piePct: 0.11,           // 11% — el doc muestra "PIE (11%)" en el header
  upfrontPct: 0,          // 0% upfront
  cuotasPieN: 20,
  cuotonPct: 0,
  piePeriodoConstruccionPct: 0.06,
  pieCreditoDirectoPct: 0.05,
  plazoAnios: 30,          // 30 años — default en cotizador-web-mp
  tasasCAE: [0.04, 0.045, 0.05],
  valorUF: 39841.72,
  tipoCalculoBono: 'precio-lista-depto',
  pieConjuntosPct: 0.20,  // 20% fijo para conjuntos (INPUT_FILES.xlsx)
  arriendosMensualesCLP: [0, 0, 0],
  plusvaliaAnual: 0.02,
})
// → valorVentaUF    = 4726.12  ✓
// → pieTotalUF      = 566.49   ✓  (462.89 depto + 103.60 conjuntos)
// → bonoPieUF       = 386.46   ✓
// → tasacionUF      = 5112.58  ✓
// → creditoHipFinalUF = 3773.17 ✓
// → escenarios[0].cuotaMensualCLP ≈ 717.696  ✓
```

---

### Sprint 2 — Puente de datos ✅
**Objetivo:** `cc.json` alimenta correctamente el motor.

`parseCCForCotizador(cc, depto, inmobiliaria)` en `cc_parser.js` usa una **ruta genérica** — no hay branches por inmobiliaria. El formato unificado de `cc.json` normaliza todos los campos a números directos divididos entre 100 al consumirlos:

| Campo cc.json | → InputCotizacion |
|---|---|
| `descuentoDepto / 100` | → `descuentoPct` |
| `descuentoAdicional / 100` | → `descuentoAdicionalPct` (condicional por `descuentoAdicionalCond`) |
| `aporteInmobiliario / 100` | → `bonoPiePct` |
| `reservaCLP` | → `reservaCLP` |
| `cuotasPieN` | → `cuotasPieN` |
| `upfrontPct / 100` | → `upfrontPct` |
| `piePctDefault / 100` | → `piePct` base (o `PIE_DEFAULT` si null) |
| `pieConstPct / 100` | → `piePeriodoConstruccionPct` |
| `creditoDirectoPct / 100` | → `pieCreditoDirectoPct` |
| `cuotonPct / 100` | → `cuotonPct` |
| `descuentoRegla` | → procesado por `_parseTieredDescuento()` (descuentos escalonados TOCTOC) |

El descuento adicional condicional se evalúa contra `depto.dormitorios`:
```js
// cc.descuentoAdicionalCond = "3D" → solo aplica si dormitorios === 3
if (cc.descuentoAdicionalCond && depto) {
  const m = String(cc.descuentoAdicionalCond).match(/^(\d+)D$/i)
  if (m && parseInt(depto.dormitorios) !== parseInt(m[1])) descuentoAdicional = 0
}
```

---

### Sprint 3 — Panel UI base ✅
**Objetivo:** Panel visible con resultados reales.

**Estructura HTML del panel:**
```
#cotiz-panel
  ├── .cotiz-header         (nombre proyecto + unidades + botón ← Volver)
  ├── #cotiz-params         (controles editables: % pie, plazo, tasa CAE)
  ├── .cotiz-section#valores
  │     └── tabla: precio lista por unidad / descuento / valor de venta
  ├── .cotiz-section#plan-pago
  │     └── reserva / saldo pie / cuotas / pie const. / total pie inmob.
  ├── .cotiz-section#credito-directo   (si > 0)
  ├── .cotiz-section#credito-hip
  │     └── tasación / crédito hipotecario / 3 escenarios CAE
  └── .cotiz-actions        (Imprimir / Nueva cotización)
```

**Tareas:**
1. Agregar sección `#cotiz-panel` en `index.html`
2. Reescribir `cotizador.js`: `cotizFromProp({ project, depto, secundarios })` ejecuta pipeline completo y renderiza panel
3. Controles editables básicos (% pie, plazo, tasa) con recálculo reactivo
4. Estilos en `app.css` coherentes con el design system existente

**Criterio de aceptación:** Cotización VICUÑA MACKENNA 7589 II muestra los mismos valores que COT-2026-0001.

---

### Sprint 4 — Condiciones comerciales editables ✅
**Objetivo:** El corredor puede ajustar condiciones antes de presentar.

**Tareas:**
1. Agregar controles para: Aporte inmobiliario (%), Cuotón (%), Pie período const. (%), Crédito directo (%), N° cuotas pie
2. Deshabilitar automáticamente controles cuando el valor base de CC es 0
3. Campo descuento adicional negociado (se suma al base)
4. Highlight visual de valores modificados respecto al default CC
5. Recálculo reactivo en cada cambio

**Criterio de aceptación:** Modificar % pie de 12% a 15% recalcula instantáneamente todos los valores del panel.

---

### Sprint 5 — Documento imprimible ✅
**Objetivo:** Generar documento entregable al cliente.

**Tareas:**
1. Formulario datos cliente + corredor (nombre, RUT, email, teléfono) — modal o sección previa
2. Generación de número `COT-YYYY-NNNN` con timestamp local
3. Template HTML imprimible con `@media print` (logo, encabezado, secciones, disclaimer)
4. Botón "Imprimir / Guardar PDF" → `window.print()`

**Criterio de aceptación:** Documento impreso equivalente en información a COT-2026-0001.pdf.

---

### Sprint 6 — Pulido e integración ✅
**Objetivo:** Flujo sin fricciones, listo para uso en producción.

**Tareas:**
1. Botón "← Volver" regresa al modal del proyecto con unidad pre-seleccionada
2. Flujo desde perfilador → cotizador
3. Smoke test de las 5 inmobiliarias (1 proyecto por inmob.)
4. Ajustes responsive y estilos finales

---

## Reglas de cálculo por inmobiliaria

Extraídas de `cotizador-web-mp/lib/data/types.ts` y validadas contra cotizaciones reales:

| Inmobiliaria | tipoCalculoBono | ltvMaxPct | pieConjuntosPct |
|---|---|---|---|
| MAESTRA | `'maestra'` | 0.80 | igual que depto |
| INGEVEC | `'precio-lista-depto'` | 1.00 | 0.20 |
| URMENETA | `'precio-lista-total'` | 1.00 | 0.20 |
| RVC | `'precio-lista-depto'` | 1.00 | 0.20 |
| TOCTOC | `'precio-lista-depto'` | 1.00 | 0.20 |

### Fórmulas por tipo

**MAESTRA:**
```
tasacion = creditoHipBase / (1 - piePct - bonoPiePct)
CH = tasacion × 0.80
aporte = tasacion - pie - CH
```

**INGEVEC / RVC / TOCTOC:**
```
bonoPieUF = precioListaDepto × bonoPiePct
tasacion = valorVenta + bonoPieUF
CH = valorVenta - pieTotalUF - bonoPieUF
```

**URMENETA:**
```
bonoPieUF = precioListaTotal × bonoPiePct
tasacion = valorVenta + bonoPieUF
CH = valorVenta - pieTotalUF - bonoPieUF
```

### Notas críticas (validadas contra COT-2026-0001)

- `piePeriodoConstruccionPct` y `pieCreditoDirectoPct` → base = **valor de venta total** (depto ajustado + secundarios)
- `bonoPiePct` (aporte INGEVEC) → base = **precio lista depto** (sin descuento, pre-descuento)
- El descuento aplica **solo al depto**, nunca a estacionamiento ni bodega
- Cuotas del pie período construcción: **decrecientes** (no fijas)
- Tasación banco = valor de venta + aporte inmobiliario

---

## Parámetros por defecto del motor

```js
const PARAMETROS_CALCULO = {
  UPFRONT_PCT:         0.00,   // % valor venta pagado upfront en promesa
  MESES_ARRIENDO_ANIO: 11,     // 1 mes vacío asumido
  HAIRCUT_VENTA:       0.95,   // descuento 5% precio venta año 5
  PLUSVALIA_DEFAULT:   0.02,   // 2% anual
  PIE_DEFAULT:         0.12,   // 12% (ajustable)
  PLAZO_DEFAULT:       25,     // años
  TASAS_CAE_DEFAULT:   [0.04, 0.045, 0.05],
}
```

---

## Resumen de tiempos

| Sprint | Descripción | Estado |
|--------|-------------|--------|
| 1 | Motor de cálculo | ✅ |
| 2 | Puente cc.json → motor | ✅ |
| 3 | Panel UI base | ✅ |
| 4 | CC editables + reactivo | ✅ |
| 5 | Documento imprimible | ✅ |
| 6 | Pulido + integración | ✅ |

**Cotizador completo y en producción desde 2026-05.**

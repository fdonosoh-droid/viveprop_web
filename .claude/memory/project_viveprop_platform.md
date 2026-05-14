---
name: project-viveprop-platform
description: Estado y arquitectura del proyecto Viveprop Platform (cotizador JS activo)
metadata:
  type: project
---

Viveprop Platform es la plataforma inmobiliaria principal. Stack: Vite + vanilla JS en `viveprop-platform/frontend/`.

**Why:** Plataforma en producción que gestiona cotizaciones de mercado primario y secundario para Viveprop.

**How to apply:** Al trabajar en el cotizador, referirse a los archivos en `viveprop-platform/frontend/src/`.

## Archivos clave
- `src/modules/cotizador.js` — UI del cotizador y documentos imprimibles
- `src/utils/calc_cotizador.js` — Motor de cálculo financiero (secciones A-D)
- `src/utils/cc_parser.js` — Parser de condiciones comerciales (`parsedCC`)
- `src/data/` — Proyectos e inventario

## Estado del modelo bono pie (fix aplicado 2026-05-14)
El bug QA "no cuadran montos total vs pie y crédito hipotecario" fue corregido.

**Causa raíz**: CH se calculaba como `valorVenta - pie - bono` (doble resta del bono). Corrección:
- `bonoPieUF = precioDescDepto × bonoPct` (base: precio con descuento, NO precio lista)
- `pieTotalUF = valorCompra × piePct - bonoPieUF` (pie efectivo del comprador)
- `CH = valorCompra × (1 - piePct)` (bono dentro de valorCompra)
- Invariante garantizada: `pieTotalUF + CH = valorVenta`

`tipoCalculoBono = 'maestra'` usa fórmula propia, sin cambios.

## Dev server
```
cd viveprop-platform/frontend
npm run dev   # → http://localhost:5176
```

## Segundo sistema
`cotizador-web-mp/` es un cotizador Next.js con etapas 0-8 completas.
Maestro: `cotizador-web-mp/Documentos/MAESTRO_DESARROLLO_COTIZADOR.md`

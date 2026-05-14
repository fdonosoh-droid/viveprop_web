# Viveprop Web — Claude Code Context

## Proyecto
Portal inmobiliario de Viveprop. Dos sistemas principales en este monorepo:

### 1. `viveprop-platform/` — Plataforma principal (activa)
- Stack: Vite + vanilla JS
- Dev server: `cd viveprop-platform/frontend && npm run dev` → http://localhost:5176
- Módulos clave:
  - `frontend/src/modules/cotizador.js` — UI del cotizador (render + documentos imprimibles)
  - `frontend/src/utils/calc_cotizador.js` — Motor de cálculo financiero
  - `frontend/src/utils/cc_parser.js` — Parser de condiciones comerciales
  - `frontend/src/data/` — Datos de proyectos e inventario

### 2. `cotizador-web-mp/` — Cotizador mercado primario (Next.js, etapas 0-8 completas)
- Documentación maestra: `cotizador-web-mp/Documentos/MAESTRO_DESARROLLO_COTIZADOR.md`

## Modelo de negocio: Bono Pie / Aporte Inmobiliaria
El bono pie es un aporte de la inmobiliaria que **infla el precio de compra oficial** para reducir el pie efectivo del comprador:

```
Valor lista:    1000
Descuento 10%:  - 100
Precio desc:     900
Bono pie 15%:  + 135   ← aplica SOLO sobre precio desc del depto (no conjuntos)
Valor compra:   1035   ← precio oficial de venta (base del crédito hipotecario)
```

**Regla clave**: el bono pie NO se suma al concepto "Pie" del comprador. Se incluye en el valor de compra.

### tipoCalculoBono
- `'maestra'` — MAESTRA Inmobiliaria: fórmula especial LTV. **No modificar.**
  - `CH = valorVenta × (1 - piePct)`
  - `pieTotalUF = precioDescDepto × piePct`
- Todo lo demás (INGEVEC, URMENETA, DEFAULT) — modelo unificado:
  - `valorCompra = precioDescDepto × (1 + bonoPct) + conjuntos`
  - `bonoPieUF = precioDescDepto × bonoPct`
  - `pieTotalUF = valorCompra × piePct - bonoPieUF`   ← pie efectivo del comprador
  - `CH = valorCompra × (1 - piePct)`
  - Invariante: `pieTotalUF + bonoPieUF + CH = valorCompra` y `pieTotalUF + CH = valorVenta`

## Memoria del proyecto
Ver `.claude/memory/` para contexto persistente entre conversaciones.

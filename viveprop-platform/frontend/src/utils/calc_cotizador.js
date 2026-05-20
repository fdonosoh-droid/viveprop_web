// ============================================================
// MOTOR DE CÁLCULO — COTIZADOR MERCADO PRIMARIO
// Portado desde cotizador-web-mp/lib/calculators/cotizador.ts
// Fórmulas verificadas contra cotización real COT-2026-0001
// ============================================================

// ── Constantes ────────────────────────────────────────────────────────────────

export const CONSTANTES = {
  UPFRONT_PCT:         0.00,   // % upfront en promesa (0 por defecto en viveprop-platform)
  MESES_ARRIENDO_ANIO: 11,     // 1 mes vacío asumido
  HAIRCUT_VENTA:       0.95,   // descuento 5% al precio año 5
  PLUSVALIA_DEFAULT:   0.02,   // 2% anual
}

// Reglas de cálculo por inmobiliaria
// tipoCalculoBono: cómo se calcula la base del aporte/bono pie
// ltvMaxPct: LTV máximo del banco (MAESTRA especial 80%)
// pieConjuntosPct: % de pie aplicado a estacionamientos/bodegas
export const REGLAS_INMOBILIARIAS = {
  MAESTRA:   { tipoCalculoBono: 'maestra',            ltvMaxPct: 0.80, pieConjuntosPct: 0.20 },
  INGEVEC:   { tipoCalculoBono: 'precio-lista-depto', ltvMaxPct: 1.00, pieConjuntosPct: 0.20 },
  URMENETA:  { tipoCalculoBono: 'precio-lista-total', ltvMaxPct: 1.00, pieConjuntosPct: 0.20 },
  RVC:       { tipoCalculoBono: 'precio-lista-depto', ltvMaxPct: 1.00, pieConjuntosPct: 0.20 },
  TOCTOC:    { tipoCalculoBono: 'precio-lista-depto', ltvMaxPct: 1.00, pieConjuntosPct: 0.20 },
  DEFAULT:   { tipoCalculoBono: 'precio-lista-depto', ltvMaxPct: 1.00, pieConjuntosPct: 0.20 },
}

export const CAE_OPTIONS    = [0.04, 0.045, 0.05]
export const PLAZO_DEFAULT  = 30
export const PIE_DEFAULT    = 0.12

// ── Función auxiliar PMT (equivalente Excel) ─────────────────────────────────

/**
 * Cuota de anualidad.
 * @param {number} tasa  tasa mensual (cae / 12)
 * @param {number} n     número de periodos (meses)
 * @param {number} pv    valor presente (positivo)
 * @returns {number}     cuota mensual
 */
export function pmt(tasa, n, pv) {
  if (tasa === 0) return pv / n
  return (pv * tasa) / (1 - Math.pow(1 + tasa, -n))
}

// ── Regla de inmobiliaria ─────────────────────────────────────────────────────

/**
 * Devuelve las reglas de cálculo para una inmobiliaria dada.
 * @param {string} inmobiliaria  nombre de la inmobiliaria (INGEVEC, MAESTRA, etc.)
 * @returns {{ tipoCalculoBono: string, ltvMaxPct: number, pieConjuntosPct: number }}
 */
export function getReglaInmobiliaria(inmobiliaria) {
  const key = (inmobiliaria || '').toUpperCase()
  return REGLAS_INMOBILIARIAS[key] || REGLAS_INMOBILIARIAS.DEFAULT
}

// ── Motor principal ───────────────────────────────────────────────────────────

/**
 * Calcula una cotización completa de mercado primario.
 *
 * @param {Object} input
 * @param {number}   input.precioListaDepto            UF precio lista departamento
 * @param {number}   input.descuentoPct                decimal (0.02 = 2%)
 * @param {number}   input.descuentoAdicionalPct       decimal extra negociado
 * @param {number}   input.bonoPiePct                  decimal aporte inmobiliaria
 * @param {number}   input.reservaCLP                  pesos chilenos
 * @param {number[]} input.preciosConjuntos            UF estacionamiento/bodega (puede ser [])
 * @param {number}   input.piePct                      decimal (0.12 = 12%)
 * @param {number}   input.upfrontPct                  decimal % valor venta pagado en promesa
 * @param {number}   input.plazoAnios                  20 | 25 | 30
 * @param {number[]} input.tasasCAE                    [0.04, 0.045, 0.05]
 * @param {number}   input.valorUF                     CLP por 1 UF
 * @param {number}   input.cuotonPct                   decimal pago único adicional
 * @param {number}   input.piePeriodoConstruccionPct   decimal pie en cuotas decrecientes
 * @param {number}   input.pieCreditoDirectoPct        decimal % financiado por inmobiliaria
 * @param {number}   input.cuotasPieN                  cantidad cuotas saldo pie
 * @param {number[]} input.arriendosMensualesCLP       [arr1, arr2, arr3] uno por escenario CAE
 * @param {number}   input.plusvaliaAnual              decimal (0.02 = 2%)
 * @param {string}   input.tipoCalculoBono             'maestra' | 'precio-lista-depto' | 'precio-lista-total'
 * @param {number}  [input.pieConjuntosPct]            decimal % pie bienes conjuntos (default 0.20)
 *
 * @returns {Object} ResultadoCotizacion
 */
export function calcularCotizacion(input) {
  const {
    precioListaDepto,
    descuentoPct,
    descuentoAdicionalPct,
    bonoPiePct,
    reservaCLP,
    preciosConjuntos,
    piePct,
    upfrontPct,
    plazoAnios,
    tasasCAE,
    valorUF,
    cuotonPct,
    piePeriodoConstruccionPct,
    pieCreditoDirectoPct,
    cuotasPieN,
    arriendosMensualesCLP,
    plusvaliaAnual,
    tipoCalculoBono,
  } = input

  const pieConjuntosPct = input.pieConjuntosPct ?? 0.20

  // ── A. Precios lista ───────────────────────────────────────────────────────
  const precioListaOtros = (preciosConjuntos || []).reduce((s, p) => s + p, 0)
  const precioListaTotal = precioListaDepto + precioListaOtros

  // ── B. Descuento (solo al depto; acumula adicional) ────────────────────────
  const descTotalPct    = Math.min(descuentoPct + (descuentoAdicionalPct || 0), 1)
  const precioDescDepto = precioListaDepto * (1 - descTotalPct)
  const precioDescOtros = precioListaOtros   // sin descuento
  const valorVentaUF    = precioDescDepto + precioDescOtros
  const valorVentaCLP   = valorVentaUF * valorUF

  // ── C. Pie ─────────────────────────────────────────────────────────────────
  // No-MAESTRA: bono se pre-computa aquí para derivar pie efectivo del comprador.
  // piePct (input) = % bruto que exige el banco (ej. 20%).
  // Pie efectivo = piePct × valorCompra - bonoPieUF (comprador paga menos gracias al bono).
  const bonoPieUF_early = tipoCalculoBono !== 'maestra'
    ? Math.round(precioDescDepto * bonoPiePct * 100) / 100
    : 0
  const valorCompraDepto = tipoCalculoBono !== 'maestra' && bonoPiePct > 0
    ? precioDescDepto + bonoPieUF_early
    : precioDescDepto

  // MAESTRA: bienes conjuntos pagan el mismo piePct que el depto
  // Otros: bienes conjuntos pagan pieConjuntosPct (20% fijo por defecto)
  const PIE_CONJ = tipoCalculoBono === 'maestra' ? piePct : pieConjuntosPct

  const pieTotalDeptoUF = tipoCalculoBono === 'maestra'
    ? Math.round(precioDescDepto * piePct * 100) / 100
    : Math.max(0, Math.round((precioDescDepto * piePct - bonoPieUF_early) * 100) / 100)
  const pieTotalConjuntosUF = Math.round(precioListaOtros * PIE_CONJ * 100) / 100
  const pieTotalUF          = pieTotalDeptoUF + pieTotalConjuntosUF

  const reservaUF    = reservaCLP / valorUF
  const upfrontUF    = Math.round(valorVentaUF * (upfrontPct || 0) * 100) / 100
  const saldoPieUF   = pieTotalUF - reservaUF - upfrontUF
  const saldoPieCLP  = saldoPieUF * valorUF

  const valorCuotaPieUF  = cuotasPieN > 0 ? saldoPieUF / cuotasPieN : saldoPieUF
  const valorCuotaPieCLP = valorCuotaPieUF * valorUF

  // ── C2. Modalidades especiales ────────────────────────────────────────────
  // Cuotón: pago único adicional (% del valor de venta)
  const cuotonUF                 = Math.round(valorVentaUF * (cuotonPct || 0) * 100) / 100
  const cuotonCLP                = Math.round(cuotonUF * valorUF)

  // Pie período construcción: % del valor de venta en cuotas decrecientes
  const piePeriodoConstruccionUF  = Math.round(valorVentaUF * (piePeriodoConstruccionPct || 0) * 100) / 100
  const piePeriodoConstruccionCLP = Math.round(piePeriodoConstruccionUF * valorUF)

  // Crédito directo inmobiliaria: % del valor de venta financiado por la inmob
  const pieCreditoDirectoUF  = Math.round(valorVentaUF * (pieCreditoDirectoPct || 0) * 100) / 100
  const pieCreditoDirectoCLP = Math.round(pieCreditoDirectoUF * valorUF)

  // Total pie pagado a inmobiliaria (crédito directo es deuda separada, no reduce CH)
  const totalPieInmobUF = pieTotalUF + cuotonUF + piePeriodoConstruccionUF

  // ── D. Crédito hipotecario y tasación ─────────────────────────────────────
  const creditoHipBaseUF = valorVentaUF * (1 - piePct)  // referencia

  let bonoPieUF, tasacionUFfinal, creditoHipFinalUF, saldoAporteInmobUF, aportePct, pieCreditoHipUF

  if (tipoCalculoBono === 'maestra') {
    // Base MAESTRA: D35 — tasación despejada, LTV 80%
    const chPct      = 1 - piePct - bonoPiePct
    tasacionUFfinal  = bonoPiePct > 0
      ? Math.round(creditoHipBaseUF / chPct * 100) / 100
      : valorVentaUF
    bonoPieUF           = Math.round(tasacionUFfinal * bonoPiePct * 100) / 100
    creditoHipFinalUF   = Math.round(tasacionUFfinal * chPct * 100) / 100
    pieCreditoHipUF     = pieTotalUF
    saldoAporteInmobUF  = Math.round((tasacionUFfinal - pieCreditoHipUF - creditoHipFinalUF) * 100) / 100
    aportePct           = tasacionUFfinal > 0 ? saldoAporteInmobUF / tasacionUFfinal : 0

  } else {
    // INGEVEC, URMENETA, DEFAULT:
    // Bono sobre precio desc del depto. Pie calculado sobre precio lista (no sobre base inflada).
    // Tasación = precioDesc × (1 + bonoPct) + conjuntos (el bono infla la tasación bancaria).
    // pieTotalDepto ya está clampeado a 0 si bonoPct >= piePct.
    bonoPieUF          = bonoPieUF_early
    tasacionUFfinal    = bonoPiePct > 0
      ? Math.round((valorCompraDepto + precioListaOtros) * 100) / 100
      : valorVentaUF
    saldoAporteInmobUF = bonoPieUF
    aportePct          = precioDescDepto > 0 ? bonoPieUF / precioDescDepto : 0
    pieCreditoHipUF    = Math.round((pieTotalUF + bonoPieUF + piePeriodoConstruccionUF + cuotonUF) * 100) / 100
    creditoHipFinalUF  = Math.round((tasacionUFfinal - pieCreditoHipUF) * 100) / 100
  }

  const creditoHipFinalCLP = creditoHipFinalUF * valorUF
  const tasacionCLP        = tasacionUFfinal * valorUF

  // ── E. Evaluación a 5 años ────────────────────────────────────────────────
  const plusvaliaAcumulada  = Math.pow(1 + (plusvaliaAnual || CONSTANTES.PLUSVALIA_DEFAULT), 5) - 1
  const precioVentaAnio5CLP = valorVentaCLP * (1 + plusvaliaAcumulada) * CONSTANTES.HAIRCUT_VENTA
  const piePagadoCLP        = totalPieInmobUF * valorUF

  // ── F. 3 escenarios CAE ───────────────────────────────────────────────────
  const escenarios = tasasCAE.map((cae, i) => {
    const arriendoCLP     = (arriendosMensualesCLP || [0, 0, 0])[i] || 0
    const n               = plazoAnios * 12
    const cuotaMensualCLP = pmt(cae / 12, n, creditoHipFinalCLP)
    const cuotaMensualUF  = cuotaMensualCLP / valorUF
    const flujoMensualCLP = arriendoCLP - cuotaMensualCLP
    const flujoAcumuladoCLP = flujoMensualCLP * CONSTANTES.MESES_ARRIENDO_ANIO * 5
    const capRate = tasacionUFfinal > 0
      ? (arriendoCLP * CONSTANTES.MESES_ARRIENDO_ANIO / valorUF) / tasacionUFfinal
      : 0
    const flujoNetoMensualCLP = arriendoCLP * 0.90
    const roiAnual  = valorVentaCLP > 0
      ? Math.round(flujoNetoMensualCLP * 12 / valorVentaCLP * 10000) / 10000
      : 0
    const roi5Anios = Math.round(roiAnual * 5 * 10000) / 10000

    return {
      cae,
      arriendoMensualCLP:  arriendoCLP,
      cuotaMensualCLP:     Math.round(cuotaMensualCLP),
      cuotaMensualUF:      Math.round(cuotaMensualUF * 100) / 100,
      flujoMensualCLP:     Math.round(flujoMensualCLP),
      flujoAcumuladoCLP:   Math.round(flujoAcumuladoCLP),
      capRate:             Math.round(capRate * 10000) / 10000,
      roi5Anios,
      roiAnual,
    }
  })

  // ── Resultado completo ────────────────────────────────────────────────────
  return {
    valorUF,
    // A. Precios lista
    precioListaDepto,
    precioListaOtros,
    precioListaTotal,
    // B. Con descuento
    precioDescDepto:             Math.round(precioDescDepto * 100) / 100,
    precioDescOtros,
    valorVentaUF:                Math.round(valorVentaUF * 100) / 100,
    valorVentaCLP:               Math.round(valorVentaCLP),
    // C. Pie
    piePct,
    upfrontPct:                  upfrontPct || 0,
    pieTotalDeptoUF:             Math.round(pieTotalDeptoUF * 100) / 100,
    pieTotalConjuntosUF:         Math.round(pieTotalConjuntosUF * 100) / 100,
    pieTotalUF:                  Math.round(pieTotalUF * 100) / 100,
    reservaUF:                   Math.round(reservaUF * 100) / 100,
    upfrontUF,
    saldoPieUF:                  Math.round(saldoPieUF * 100) / 100,
    saldoPieCLP:                 Math.round(saldoPieCLP),
    cuotasPieN,
    valorCuotaPieUF:             Math.round(valorCuotaPieUF * 100) / 100,
    valorCuotaPieCLP:            Math.round(valorCuotaPieCLP),
    // C2. Modalidades especiales
    cuotonUF,
    cuotonCLP,
    piePeriodoConstruccionUF,
    piePeriodoConstruccionCLP,
    pieCreditoDirectoUF,
    pieCreditoDirectoCLP,
    totalPieInmobUF:             Math.round(totalPieInmobUF * 100) / 100,
    // D. Crédito hipotecario
    descuentoAdicionalPct:       descuentoAdicionalPct || 0,
    bonoPieUF,
    saldoAporteInmobUF:          Math.round(saldoAporteInmobUF * 100) / 100,
    aportePct:                   Math.round(aportePct * 10000) / 10000,
    pieCreditoHipUF:             Math.round(pieCreditoHipUF * 100) / 100,
    tasacionUF:                  Math.round(tasacionUFfinal * 100) / 100,
    tasacionCLP:                 Math.round(tasacionCLP),
    creditoHipBaseUF:            Math.round(creditoHipBaseUF * 100) / 100,
    creditoHipFinalUF:           Math.round(creditoHipFinalUF * 100) / 100,
    creditoHipFinalCLP:          Math.round(creditoHipFinalCLP),
    // E. Evaluación
    plusvaliaAcumulada:          Math.round(plusvaliaAcumulada * 10000) / 10000,
    precioVentaAnio5CLP:         Math.round(precioVentaAnio5CLP),
    piePagadoCLP:                Math.round(piePagadoCLP),
    // F. Escenarios CAE
    escenarios,
  }
}

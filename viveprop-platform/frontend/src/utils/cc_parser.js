// ============================================================
// CC PARSER — Normaliza CC_DATA por inmobiliaria
// Entrada: cc = { titulo, campos: [[label, val], ...], nota }
// Salida:  campos normalizados para calcularCotizacion()
// ============================================================

// ── Helpers de parseo ─────────────────────────────────────────────────────────

// "9%" → 0.09 | "10.5%" → 0.105 | toma el primer número encontrado
function parsePct(str) {
  if (!str) return 0
  const m = String(str).match(/(\d+(?:[.,]\d+)?)/)
  if (!m) return 0
  return parseFloat(m[1].replace(',', '.')) / 100
}

// "100.000" → 100000 | "249.000" → 249000 (CLP con separador de miles punto)
function parseCLP(str) {
  if (!str) return 0
  const n = parseFloat(String(str).replace(/\./g, '').replace(',', '.'))
  return isFinite(n) && n >= 1000 ? Math.round(n) : 0
}

// "10 UF" → 10 | "50 UF" → 50
function parseUFAmt(str) {
  if (!str) return 0
  const m = String(str).match(/(\d+(?:[.,]\d+)?)/)
  return m ? parseFloat(m[1].replace(',', '.')) : 0
}

// "21" → 21 | "1 a 3 cuotas TOKU..." → 1
function parseNInt(str) {
  if (!str) return 0
  const m = String(str).match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

// Construye mapa label → valor desde cc.campos
function camposMap(cc) {
  const map = {}
  for (const [lbl, val] of (cc?.campos || [])) {
    if (lbl) map[String(lbl).trim()] = String(val ?? '').trim()
  }
  return map
}

// ── Función principal ─────────────────────────────────────────────────────────

/**
 * Normaliza los campos de CC_DATA[pid] para una inmobiliaria dada.
 *
 * @param {Object}  cc            - { titulo, campos: [[label, val], ...], nota }
 * @param {string}  inmobiliaria  - 'INGEVEC' | 'MAESTRA' | 'RVC' | 'TOCTOC' | 'URMENETA'
 * @returns {Object} campos normalizados — todos con valores numéricos
 *
 * Notas:
 * - reservaUF > 0 (TOCTOC): el cotizador debe multiplicar por store.UF para obtener reservaCLP
 * - piePctDefault = null: el cotizador debe usar PIE_DEFAULT del motor
 * - aporteInmobiliario URMENETA: extraído de la nota cuando no hay campo estándar
 */
export function parseCCForCotizador(cc, inmobiliaria) {
  const cm  = camposMap(cc)
  const key = (inmobiliaria || '').toUpperCase()

  const defaults = {
    descuentoDepto:      0,      // % descuento solo al depto
    descuentoAdicional:  0,      // % descuento adicional negociado
    aporteInmobiliario:  0,      // % aporte inmobiliaria al banco (base depende de inmob)
    reservaCLP:          100000, // reserva en pesos
    reservaUF:           0,      // reserva en UF (TOCTOC) — convertir × store.UF en cotizador
    cuotasPieN:          1,      // cuotas del SALDO pie (sin contar reserva)
    upfrontPct:          0,      // % pagado upfront en promesa (MAESTRA)
    piePctDefault:       null,   // null = usar PIE_DEFAULT; número = CC especifica el pie
    pieConstPct:         0,      // % pie período construcción (sobre valor venta total)
    creditoDirectoPct:   0,      // % crédito directo inmobiliaria (sobre valor venta total)
    cuotonPct:           0,      // % cuotón (pago único adicional)
    tipoEntrega:         'Futura',
    nota:                cc?.nota || '',
  }

  // ── INGEVEC ────────────────────────────────────────────────────────────────
  if (key.includes('INGEVEC')) {
    const cuotasTotales = parseNInt(cm['Cuotas pie'])
    return {
      ...defaults,
      descuentoDepto:     parsePct(cm['Dcto. depto.']),
      aporteInmobiliario: parsePct(cm['Aporte inmobiliario']),
      reservaCLP:         parseCLP(cm['Reserva']),
      // "Cuotas pie": 21 = 1 reserva + 20 saldo → cuotasPieN = 20
      cuotasPieN:         Math.max(cuotasTotales - 1, 0),
      pieConstPct:        parsePct(cm['Pie período const.']),
      creditoDirectoPct:  parsePct(cm['Pie crédito s/int.']),
      cuotonPct:          parsePct(cm['Cuotón']),
      tipoEntrega:        cm['Tipo de entrega'] || 'Futura',
      nota:               cc?.nota || '',
    }
  }

  // ── MAESTRA ────────────────────────────────────────────────────────────────
  // piePctDefault = Upfront + Pie en cuotas (total pie = ambas partes)
  if (key.includes('MAESTRA')) {
    const upfrontPct     = parsePct(cm['Upfront'])
    const pieEnCuotasPct = parsePct(cm['Pie en cuotas'])
    return {
      ...defaults,
      descuentoDepto:     parsePct(cm['Descuento Base']) + parsePct(cm['Dcto Adicional']),
      aporteInmobiliario: parsePct(cm['Certificado Pago']),
      upfrontPct,
      piePctDefault:      upfrontPct + pieEnCuotasPct || null,
      cuotasPieN:         parseNInt(cm['UPAGO Cuotas']),
      tipoEntrega:        cm['ENTREGA'] ? String(cm['ENTREGA']).trim() : 'Futura',
      nota:               cc?.nota || '',
    }
  }

  // ── RVC ────────────────────────────────────────────────────────────────────
  // "Pie mínimo": "10% o lo que no financie el Banco" → toma el porcentaje
  if (key.includes('RVC')) {
    const pieMin = parsePct(cm['Pie mínimo'])
    return {
      ...defaults,
      descuentoDepto: parsePct(cm['Descuento RVC']),
      piePctDefault:  pieMin || null,
      cuotasPieN:     parseNInt(cm['Cuotas prog.']),
      tipoEntrega:    cm['Tipo entrega'] || cm['Financiamiento'] || 'Futura',
      nota:           cc?.nota || '',
    }
  }

  // ── TOCTOC ─────────────────────────────────────────────────────────────────
  // Reserva siempre en UF (ej: "10 UF") → reservaUF; cotizador convierte a CLP
  // "Descuento autorizado" puede tener múltiples tipologías → toma el primero
  if (key.includes('TOCTOC') || key.includes('TOC TOC')) {
    const montoRes = cm['Monto Reserva'] || ''
    const esUF     = /uf/i.test(montoRes)
    const pieMin   = parsePct(cm['Pie minimo %'])
    return {
      ...defaults,
      descuentoDepto: parsePct(cm['Descuento autorizado']),
      reservaCLP:     esUF ? 0 : parseCLP(montoRes),
      reservaUF:      esUF ? parseUFAmt(montoRes) : 0,
      piePctDefault:  pieMin || null,
      cuotasPieN:     parseNInt(cm['Cuotas']),
      tipoEntrega:    cm['Estado'] || 'Futura',
      nota:           cc?.nota || '',
    }
  }

  // ── URMENETA ───────────────────────────────────────────────────────────────
  // No tiene "Aporte inmobiliario" estándar; bono pie aparece en la nota
  // Ej: "BONO PIE 10%" → aporteInmobiliario = 0.10
  if (key.includes('URMENETA')) {
    const notaStr    = cc?.nota || ''
    const bonoMatch  = notaStr.match(/bono\s+pie\s+(\d+(?:[.,]\d+)?)%/i)
    const aporte     = bonoMatch ? parseFloat(bonoMatch[1].replace(',', '.')) / 100 : 0
    return {
      ...defaults,
      descuentoDepto:     parsePct(cm['Descuento máximo']),
      aporteInmobiliario: aporte,
      reservaCLP:         parseCLP(cm['Valor reserva']),
      pieConstPct:        parsePct(cm['% cuotas const.']),
      cuotasPieN:         parseNInt(cm['N° cuotas const.']),
      tipoEntrega:        cm['Tipo de entrega'] || 'Futura',
      nota:               notaStr,
    }
  }

  // Fallback: CC no disponible o inmobiliaria no reconocida
  return defaults
}

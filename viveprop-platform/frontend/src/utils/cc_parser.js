// ============================================================
// CC PARSER — Lee cc.json normalizado (cc_importer.py v2)
// Entrada: cc = { descuentoDepto, aporteInmobiliario, ..., nota }
//          Porcentajes almacenados como números: 10 = 10%
// Salida:  campos en decimales para calcularCotizacion()
// ============================================================

// Tiered discount: "25% 1D+1B/Estudio   20% en el resto"
function _parseTieredDescuento(raw, depto) {
  if (!raw) return 0
  const str = String(raw).trim()
  const pctRe = /(\d+(?:[.,]\d+)?)\s*%/g
  const hits = []
  let m
  while ((m = pctRe.exec(str)) !== null) {
    hits.push({ pct: parseFloat(m[1].replace(',', '.')) / 100, end: m.index + m[0].length })
  }
  if (hits.length <= 1) return hits.length ? hits[0].pct : 0

  const unitDorms = parseInt(depto?.dormitorios) || 0
  let defaultPct  = hits[hits.length - 1].pct

  for (let i = 0; i < hits.length; i++) {
    const condEnd = i + 1 < hits.length
      ? str.indexOf(String(Math.round(hits[i + 1].pct * 100)), hits[i].end)
      : str.length
    const cond       = str.slice(hits[i].end, condEnd)
    if (/en el resto|resto/i.test(cond)) { defaultPct = hits[i].pct; continue }
    const hasEstudio = /estudio/i.test(cond)
    const dormNums   = [...cond.matchAll(/(\d+)\s*D\b/gi)].map(x => parseInt(x[1]))
    if ((hasEstudio && unitDorms === 0) || dormNums.includes(unitDorms)) return hits[i].pct
  }
  return defaultPct
}

/**
 * Normaliza CC_DATA[pid] para calcularCotizacion().
 *
 * @param {Object}  cc           - entrada de cc.json v2 (% almacenados como números, ej: 10 = 10%)
 * @param {string}  inmobiliaria - ignorado (ya está en cc.inmobiliaria); mantenido por compatibilidad
 * @param {Object}  depto        - unidad seleccionada (para descuentos condicionales por tipología)
 */
export function parseCCForCotizador(cc, inmobiliaria, depto = null) {
  const defaults = {
    descuentoDepto:      0,
    descuentoAdicional:  0,
    aporteInmobiliario:  0,
    reservaCLP:          100000,
    reservaUF:           0,
    cuotasPieN:          1,
    upfrontPct:          0,
    piePctDefault:       null,
    pieConstPct:         0,
    creditoDirectoPct:   0,
    cuotonPct:           0,
    tipoEntrega:         'Futura',
    nota:                '',
  }

  if (!cc) return defaults

  // Tiered discount rule overrides flat rate (TOCTOC-style)
  let descuentoDepto = (cc.descuentoDepto || 0) / 100
  if (cc.descuentoRegla && depto) {
    descuentoDepto = _parseTieredDescuento(cc.descuentoRegla, depto)
  }

  // Descuento adicional condicional por dormitorios: "3D" = solo para 3 dormitorios
  let descuentoAdicional = (cc.descuentoAdicional || 0) / 100
  if (cc.descuentoAdicionalCond && depto) {
    const cm = String(cc.descuentoAdicionalCond).match(/^(\d+)D$/i)
    if (cm && parseInt(depto.dormitorios) !== parseInt(cm[1])) {
      descuentoAdicional = 0
    }
  }

  return {
    descuentoDepto,
    descuentoAdicional,
    aporteInmobiliario:  (cc.aporteInmobiliario  || 0) / 100,
    reservaCLP:          cc.reservaCLP  ?? 100000,
    reservaUF:           cc.reservaUF   || 0,
    cuotasPieN:          cc.cuotasPieN  ?? 1,
    upfrontPct:          (cc.upfrontPct || 0) / 100,
    piePctDefault:       (cc.piePctDefault != null && cc.piePctDefault !== '')
                           ? cc.piePctDefault / 100
                           : null,
    pieConstPct:         (cc.pieConstPct       || 0) / 100,
    creditoDirectoPct:   (cc.creditoDirectoPct || 0) / 100,
    cuotonPct:           (cc.cuotonPct         || 0) / 100,
    tipoEntrega:         cc.tipoEntrega || 'Futura',
    nota:                cc.nota || '',
  }
}

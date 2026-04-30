import { store } from '../state/store.js';
import { H, fmt } from '../utils/format.js';
import { parseCCForCotizador } from '../utils/cc_parser.js';
import { calcularCotizacion, getReglaInmobiliaria, PLAZO_DEFAULT, CAE_OPTIONS, PIE_DEFAULT } from '../utils/calc_cotizador.js';

// ── Estado panel completo ─────────────────────────────────────────────────────

let _state = null;   // { project, depto, secundarios, parsedCC, regla, reservaCLP }
let cotizLabel = ''; // para calculadora básica

// ── Entrada principal desde primario.js ──────────────────────────────────────

/**
 * Punto de entrada al hacer click en "Cotizar".
 * - Objeto: nueva ruta completa con panel
 * - Número: ruta legacy (calculadora básica)
 */
export function cotizFromProp(arg, legacyLabel) {
  if (typeof arg === 'number') {
    _openBasicCalc(arg, legacyLabel)
    return
  }

  const { project, depto, secundarios = [] } = arg

  const cc       = store.CC_DATA[project.id] || null
  const parsedCC = parseCCForCotizador(cc, project.inmobiliaria)
  const regla    = getReglaInmobiliaria(project.inmobiliaria)

  const reservaCLP = parsedCC.reservaUF > 0
    ? Math.round(parsedCC.reservaUF * store.UF)
    : parsedCC.reservaCLP

  _state = { project, depto, secundarios, parsedCC, regla, reservaCLP }

  // Inicializar controles con valores del CC
  const piePctInt = Math.round((parsedCC.piePctDefault ?? PIE_DEFAULT) * 100)
  document.getElementById('cpanel-pie-r').value = piePctInt
  document.getElementById('cpanel-pie-n').value = piePctInt
  document.getElementById('cpanel-pie-lbl').textContent = piePctInt + '%'
  document.getElementById('cpanel-plazo').value = PLAZO_DEFAULT

  // Mostrar panel
  document.getElementById('cotiz-basic').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'flex'
  window.openModule('cotiz')

  recalcCotizPanel()
}

// ── Recálculo reactivo ────────────────────────────────────────────────────────

export function recalcCotizPanel() {
  if (!_state) return

  const piePct     = (parseFloat(document.getElementById('cpanel-pie-n').value) || 12) / 100
  const plazoAnios = parseFloat(document.getElementById('cpanel-plazo').value) || PLAZO_DEFAULT
  const input      = _buildInput(piePct, plazoAnios)
  const result     = calcularCotizacion(input)

  console.log('[Cotizador] Input:', input)
  console.log('[Cotizador] Resultado:', result)

  _renderPanel(result, piePct, plazoAnios)
}

export function syncCPanelPie(src) {
  const r = document.getElementById('cpanel-pie-r')
  const n = document.getElementById('cpanel-pie-n')
  if (src === 'r') n.value = r.value; else r.value = n.value
  document.getElementById('cpanel-pie-lbl').textContent = (src === 'r' ? r : n).value + '%'
  recalcCotizPanel()
}

export function volverDesdeCotiz() {
  _state = null
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-basic').style.display = ''
  window.openModule('pri')
}

// ── Helpers internos ──────────────────────────────────────────────────────────

function _buildInput(piePct, plazoAnios) {
  const { parsedCC, regla, reservaCLP, depto, secundarios } = _state
  return {
    precioListaDepto:          depto.precio_uf,
    descuentoPct:              parsedCC.descuentoDepto,
    descuentoAdicionalPct:     parsedCC.descuentoAdicional || 0,
    bonoPiePct:                parsedCC.aporteInmobiliario,
    reservaCLP,
    preciosConjuntos:          secundarios.map(s => s.precio_uf),
    piePct,
    upfrontPct:                parsedCC.upfrontPct || 0,
    cuotasPieN:                parsedCC.cuotasPieN,
    cuotonPct:                 parsedCC.cuotonPct || 0,
    piePeriodoConstruccionPct: parsedCC.pieConstPct,
    pieCreditoDirectoPct:      parsedCC.creditoDirectoPct,
    plazoAnios,
    tasasCAE:                  CAE_OPTIONS,
    valorUF:                   store.UF,
    tipoCalculoBono:           regla.tipoCalculoBono,
    pieConjuntosPct:           regla.pieConjuntosPct,
    arriendosMensualesCLP:     [0, 0, 0],
    plusvaliaAnual:            0.02,
  }
}

function _pct(n) {
  const v = Math.round(parseFloat(n) * 1000) / 10
  return v.toFixed(1).replace(/\.0$/, '') + '%'
}

// ── Render del panel ──────────────────────────────────────────────────────────

function _renderPanel(r, piePct, plazoAnios) {
  const { project, depto, secundarios } = _state

  const parts = [
    `${project.nombre} · DP ${depto.dp}${depto.tipologia ? ' ' + depto.tipologia : ''}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp}`)
  ]
  document.getElementById('cp-header-title').textContent = parts.join(' + ')

  document.getElementById('cp-body').innerHTML =
    _sValores(r, depto, secundarios) +
    _sPlanPago(r) +
    (r.pieCreditoDirectoUF > 0 ? _sCreditoDirecto(r) : '') +
    _sCreditoHip(r, plazoAnios)
}

// ── Sección: Valores ──────────────────────────────────────────────────────────

function _sValores(r, depto, secundarios) {
  const descTotal = r.precioListaDepto > 0
    ? 1 - r.precioDescDepto / r.precioListaDepto
    : 0

  const deptoRow = `
    <tr>
      <td class="cp-val-unit">DP ${H(String(depto.dp))}${depto.tipologia ? ' &mdash; ' + H(depto.tipologia) : ''}</td>
      <td>${fmt.uf2(r.precioListaDepto)}</td>
      <td>${descTotal > 0.0001
        ? `<span class="cp-val-dcto">&minus;${_pct(descTotal)}</span>`
        : '<span class="cp-val-nd">&mdash;</span>'}</td>
      <td class="cp-val-final">${fmt.uf2(r.precioDescDepto)}</td>
    </tr>`

  const secRows = secundarios.map(s => `
    <tr>
      <td class="cp-val-unit">${s.tipologia ? H(s.tipologia) + ' ' : ''}DP ${H(String(s.dp))}</td>
      <td>${fmt.uf2(s.precio_uf)}</td>
      <td><span class="cp-val-nd">&mdash;</span></td>
      <td class="cp-val-final">${fmt.uf2(s.precio_uf)}</td>
    </tr>`).join('')

  return `
  <div class="cp-section">
    <div class="cp-section-title">Valores</div>
    <div class="cp-section-body">
      <table class="cp-val-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Dcto.</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${deptoRow}${secRows}
          <tr class="cp-val-total">
            <td>Total</td>
            <td>${fmt.uf2(r.precioListaTotal)}</td>
            <td></td>
            <td class="cp-val-final">
              ${fmt.uf2(r.valorVentaUF)}<br>
              <small class="cp-val-clp">${fmt.pesos(r.valorVentaCLP)}</small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`
}

// ── Sección: Plan de Pago ─────────────────────────────────────────────────────

function _sPlanPago(r) {
  let rows = ''

  rows += `
    <div class="cp-plan-row">
      <span class="cp-plan-lbl"><strong>Pie total</strong> <span class="cp-plan-pct">${_pct(r.piePct)}</span></span>
      <span class="cp-plan-val">${fmt.uf2(r.pieTotalUF)}<small>${fmt.pesos(r.pieTotalUF * r.valorUF)}</small></span>
    </div>`

  rows += `
    <div class="cp-plan-row cp-plan-sub">
      <span class="cp-plan-lbl">Reserva</span>
      <span class="cp-plan-val">${fmt.uf2(r.reservaUF)}<small>${fmt.pesos(r.reservaUF * r.valorUF)}</small></span>
    </div>`

  if (r.upfrontUF > 0) {
    rows += `
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Upfront a la promesa <span class="cp-plan-pct">${_pct(r.upfrontPct)}</span></span>
        <span class="cp-plan-val">${fmt.uf2(r.upfrontUF)}<small>${fmt.pesos(r.upfrontUF * r.valorUF)}</small></span>
      </div>`
  }

  if (r.cuotasPieN > 0 && r.saldoPieUF > 0) {
    rows += `
      <div class="cp-plan-row cp-plan-sub">
        <span class="cp-plan-lbl">Saldo pie &mdash; ${r.cuotasPieN} cuotas &times; ${fmt.uf2(r.valorCuotaPieUF)}/mes</span>
        <span class="cp-plan-val">${fmt.uf2(r.saldoPieUF)}<small>${fmt.pesos(r.saldoPieCLP)}</small></span>
      </div>`
  }

  if (r.piePeriodoConstruccionUF > 0) {
    const pctConst = r.valorVentaUF > 0 ? r.piePeriodoConstruccionUF / r.valorVentaUF : 0
    rows += `
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Pie período construcción <span class="cp-plan-pct">${_pct(pctConst)}</span></span>
        <span class="cp-plan-val">${fmt.uf2(r.piePeriodoConstruccionUF)}<small>${fmt.pesos(r.piePeriodoConstruccionCLP)}</small></span>
      </div>`
  }

  if (r.cuotonUF > 0) {
    rows += `
      <div class="cp-plan-row">
        <span class="cp-plan-lbl">Cuotón</span>
        <span class="cp-plan-val">${fmt.uf2(r.cuotonUF)}<small>${fmt.pesos(r.cuotonCLP)}</small></span>
      </div>`
  }

  const pctTotalPie = r.valorVentaUF > 0 ? r.totalPieInmobUF / r.valorVentaUF : 0
  rows += `
    <div class="cp-plan-row cp-plan-total">
      <span class="cp-plan-lbl cp-plan-lbl--total">Total pie a inmobiliaria <span class="cp-plan-pct">${_pct(pctTotalPie)}</span></span>
      <span class="cp-plan-val cp-plan-val--total">${fmt.uf2(r.totalPieInmobUF)}<small>${fmt.pesos(r.totalPieInmobUF * r.valorUF)}</small></span>
    </div>`

  if (r.bonoPieUF > 0) {
    rows += `
      <div class="cp-plan-row cp-plan-aporte">
        <span class="cp-plan-lbl cp-plan-lbl--aporte">Aporte inmobiliaria <span class="cp-plan-pct">${_pct(r.aportePct)}</span></span>
        <span class="cp-plan-val cp-plan-val--aporte">${fmt.uf2(r.bonoPieUF)}<small>${fmt.pesos(r.bonoPieUF * r.valorUF)}</small></span>
      </div>`
  }

  return `
  <div class="cp-section">
    <div class="cp-section-title">Plan de Pago</div>
    <div class="cp-section-body">
      <div class="cp-plan-rows">${rows}</div>
    </div>
  </div>`
}

// ── Sección: Crédito Directo ──────────────────────────────────────────────────

function _sCreditoDirecto(r) {
  const pctDir = r.valorVentaUF > 0 ? r.pieCreditoDirectoUF / r.valorVentaUF : 0
  return `
  <div class="cp-section">
    <div class="cp-section-title">Crédito Directo Inmobiliaria</div>
    <div class="cp-section-body">
      <div class="cp-plan-row" style="border-bottom:none">
        <span class="cp-plan-lbl">Financiamiento directo <span class="cp-plan-pct">${_pct(pctDir)} &times; valor de venta</span></span>
        <span class="cp-plan-val">${fmt.uf2(r.pieCreditoDirectoUF)}<small>${fmt.pesos(r.pieCreditoDirectoCLP)}</small></span>
      </div>
    </div>
  </div>`
}

// ── Sección: Crédito Hipotecario ──────────────────────────────────────────────

function _sCreditoHip(r, plazoAnios) {
  const ltvPct = r.tasacionUF > 0 ? r.creditoHipFinalUF / r.tasacionUF : 0

  const rows = r.escenarios.map((esc, i) => {
    const rentaMin = esc.cuotaMensualCLP / 0.25
    return `
      <tr${i === 1 ? ' class="cp-esc-highlight"' : ''}>
        <td class="cp-esc-cae">CAE ${(esc.cae * 100).toFixed(1).replace(/\.0$/, '')}%</td>
        <td class="cp-esc-div">${fmt.pesos(esc.cuotaMensualCLP)}</td>
        <td class="cp-esc-uf">${fmt.uf2(esc.cuotaMensualUF)}</td>
        <td>${fmt.pesos(rentaMin)}</td>
      </tr>`
  }).join('')

  return `
  <div class="cp-section">
    <div class="cp-section-title">Crédito Hipotecario &middot; ${plazoAnios} años</div>
    <div class="cp-section-body">
      <div class="cp-hip-summary">
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">Tasación banco</span>
          <span class="cp-hip-cell-val">${fmt.uf2(r.tasacionUF)}</span>
          <span class="cp-hip-cell-sub">${fmt.pesos(r.tasacionCLP)}</span>
        </div>
        <div class="cp-hip-cell">
          <span class="cp-hip-cell-lbl">LTV</span>
          <span class="cp-hip-cell-val">${_pct(ltvPct)}</span>
          <span class="cp-hip-cell-sub">&times; tasación</span>
        </div>
        <div class="cp-hip-cell cp-hip-main">
          <span class="cp-hip-cell-lbl">Crédito hipotecario</span>
          <span class="cp-hip-cell-val">${fmt.uf2(r.creditoHipFinalUF)}</span>
          <span class="cp-hip-cell-sub">${fmt.pesos(r.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="cp-esc-tbl">
        <thead>
          <tr><th>CAE</th><th>Dividendo / mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`
}

// ── Calculadora básica (fallback) ─────────────────────────────────────────────

function _openBasicCalc(uf, label) {
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-basic').style.display = ''
  document.getElementById('c-precio').value = uf
  cotizLabel = label || ''
  const info = document.getElementById('c-prop-info')
  info.innerHTML = `📦 ${H(cotizLabel)}`
  info.style.display = 'block'
  window.openModule('cotiz')
  calcCotiz()
}

export function syncPie(src) {
  const r = document.getElementById('c-pie-r')
  const n = document.getElementById('c-pie-n')
  if (src === 'r') n.value = r.value; else r.value = n.value
  document.getElementById('pie-lbl').textContent = r.value + '%'
  calcCotiz()
}

export function calcCotiz() {
  const precioUF = parseFloat(document.getElementById('c-precio').value) || 0
  const piePct   = parseFloat(document.getElementById('c-pie-n').value) || 20
  const plazo    = parseFloat(document.getElementById('c-plazo').value) || 25
  const tasa     = parseFloat(document.getElementById('c-tasa').value) || 5
  const gc       = parseFloat(document.getElementById('c-gc').value) || 0
  document.getElementById('pie-lbl').textContent = piePct + '%'
  const res = document.getElementById('c-results')
  if (!precioUF) {
    res.innerHTML = `<div class="empty-tool"><div class="ei">📊</div><p>Ingresa el precio para simular</p></div>`
    return
  }
  const pieUF     = precioUF * piePct / 100
  const creditoUF = precioUF - pieUF
  const r = tasa / 100 / 12, n = plazo * 12
  const divUF    = creditoUF * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const gcUF     = gc / store.UF
  const rentaMin = divUF / 0.25
  const rentaGC  = (divUF + gcUF) / 0.25
  const plazos   = [15, 20, 25, 30]
  res.innerHTML = `<div class="cotiz-card">
    ${cotizLabel ? `<div style="font-size:12px;font-weight:600;color:var(--brand);margin-bottom:14px">📦 ${H(cotizLabel)}</div>` : ''}
    <div class="rc-hero">
      <div class="rc-big">${fmt.pesos(divUF * store.UF)}</div>
      <div class="rc-lbl">Dividendo mensual estimado</div>
      <div class="rc-pesos">${fmt.uf1(divUF)} · ${plazo} años al ${tasa}%</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${fmt.uf(precioUF)}</span><span class="rcl">Precio propiedad</span><span class="rcp">${fmt.pesos(precioUF * store.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${fmt.uf(pieUF)} (${piePct}%)</span><span class="rcl">Pie inicial</span><span class="rcp">${fmt.pesos(pieUF * store.UF)}</span></div>
      <div class="rc-cell"><span class="rcv">${fmt.uf(creditoUF)}</span><span class="rcl">Monto crédito</span><span class="rcp">${fmt.pesos(creditoUF * store.UF)}</span></div>
      <div class="rc-cell hi"><span class="rcv">${fmt.pesos(rentaMin * store.UF)}</span><span class="rcl">Renta mínima necesaria</span><span class="rcp">${gc ? `Con GC: ${fmt.pesos(rentaGC * store.UF)}` : 'Regla 25%'}</span></div>
    </div>
    <div class="rc-tbl-title">Comparativa por plazo · Pie ${piePct}% · Tasa ${tasa}%</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th><th>Total pagado</th></tr></thead>
      <tbody>${plazos.map(py => {
        const nn = py * 12
        const d  = creditoUF * r * Math.pow(1 + r, nn) / (Math.pow(1 + r, nn) - 1)
        return `<tr class="${py == plazo ? 'tr-hl' : ''}"><td>${py} años</td><td><strong>${fmt.pesos(d * store.UF)}</strong></td><td>${fmt.uf1(d)}</td><td>${fmt.pesos(d / 0.25 * store.UF)}</td><td>${fmt.uf(d * nn)}</td></tr>`
      }).join('')}</tbody>
    </table>
    ${gc ? `<p style="font-size:11px;color:var(--g400);margin-top:10px;font-style:italic">* GC de ${fmt.pesos(gc)}/mes incluidos en renta necesaria</p>` : ''}
  </div>`
}

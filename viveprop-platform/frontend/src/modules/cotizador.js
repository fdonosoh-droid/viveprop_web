import { store } from '../state/store.js';
import { H, fmt } from '../utils/format.js';
import { parseCCForCotizador } from '../utils/cc_parser.js';
import { calcularCotizacion, getReglaInmobiliaria, PLAZO_DEFAULT, CAE_OPTIONS, PIE_DEFAULT } from '../utils/calc_cotizador.js';

// ── Estado panel completo ─────────────────────────────────────────────────────

let _state = null;   // { project, depto, secundarios, parsedCC, regla, reservaCLP }
let cotizLabel = ''; // para calculadora básica

// ── Entrada principal desde primario.js ──────────────────────────────────────

export function cotizFromProp(arg, legacyLabel) {
  if (typeof arg === 'number') {
    _openBasicCalc(arg, legacyLabel)
    return
  }

  try {
    const { project, depto, secundarios = [] } = arg

    console.log('[Cotizador] cotizFromProp', { project, depto, secundarios })

    const cc       = store.CC_DATA[project.id] || null
    const parsedCC = parseCCForCotizador(cc, project.inmobiliaria)
    const regla    = getReglaInmobiliaria(project.inmobiliaria)

    const reservaCLP = parsedCC.reservaUF > 0
      ? Math.round(parsedCC.reservaUF * store.UF)
      : parsedCC.reservaCLP

    _state = { project, depto, secundarios, parsedCC, regla, reservaCLP, cliente: null }

    _initClientForm()

    document.getElementById('cotiz-basic').style.display = 'none'
    document.getElementById('cotiz-client-form').style.display = 'flex'
    document.getElementById('cotiz-panel').style.display = 'none'
    window.openModule('cotiz')
  } catch (err) {
    console.error('[Cotizador] Error en cotizFromProp:', err)
    document.getElementById('cotiz-basic').style.display = 'none'
    document.getElementById('cotiz-client-form').style.display = 'none'
    document.getElementById('cotiz-panel').style.display = 'flex'
    window.openModule('cotiz')
    document.getElementById('cp-results').innerHTML =
      `<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${H(String(err))}\n\n${H(err.stack || '')}</div>`
  }
}

// ── Recálculo reactivo ────────────────────────────────────────────────────────

export function recalcCotizPanel() {
  if (!_state) return

  try {
    const params = _readParams()
    const input  = _buildInput(params)
    const result = calcularCotizacion(input)

    console.log('[Cotizador] Input:', input)
    console.log('[Cotizador] Resultado:', result)

    _renderPanel(result, params)
  } catch (err) {
    console.error('[Cotizador] Error en recalcCotizPanel:', err)
    document.getElementById('cp-results').innerHTML =
      `<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${H(String(err))}\n\n${H(err.stack || '')}</div>`
  }
}

export function volverDesdeCotiz() {
  _state = null
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-basic').style.display = ''
  window.openModule('pri')
}

// ── Inicialización del formulario de parámetros ───────────────────────────────

function _pct100(frac) {
  return +((frac ?? 0) * 100).toFixed(2)
}

// ── Formulario cliente/corredor ───────────────────────────────────────────────

function _initClientForm() {
  const { project, depto, secundarios } = _state

  const parts = [
    `${project.nombre} · DP ${depto.dp}${depto.tipologia ? ' ' + depto.tipologia : ''}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp}`)
  ]
  document.getElementById('ccf-header-title').textContent = parts.join(' + ')

  const totalUF = depto.precio_uf + secundarios.reduce((s, u) => s + u.precio_uf, 0)
  const lines = [
    `DP ${depto.dp}${depto.tipologia ? ' — ' + depto.tipologia : ''} · ${fmt.uf2(depto.precio_uf)}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp} · ${fmt.uf2(s.precio_uf)}`)
  ]
  document.getElementById('ccf-prop-summary').innerHTML =
    `<div class="ccf-prop-lines">${lines.map(l => `<div class="ccf-prop-line">${H(l)}</div>`).join('')}</div>` +
    `<div class="ccf-prop-total">Total precio lista: <strong>${fmt.uf2(totalUF)}</strong></div>`

  // Limpiar campos cliente
  ;['ccf-nombre', 'ccf-rut', 'ccf-email', 'ccf-tel'].forEach(id => {
    const el = document.getElementById(id)
    if (el) { el.value = ''; el.classList.remove('cp-input--err') }
  })
  const obj = document.getElementById('ccf-objetivo')
  if (obj) { obj.value = ''; obj.classList.remove('cp-input--err') }
  document.querySelectorAll('.ccf-err').forEach(el => { el.textContent = '' })

  // Pre-rellenar corredor desde localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('_corredor') || '{}')
    if (saved.nombre) document.getElementById('ccf-cor-nombre').value = saved.nombre
    if (saved.email)  document.getElementById('ccf-cor-email').value  = saved.email
    if (saved.tel)    document.getElementById('ccf-cor-tel').value    = saved.tel
  } catch {}
}

function _validarRut(rut) {
  const clean = rut.replace(/[.\s]/g, '').toUpperCase()
  if (!/^\d{7,8}-?[0-9K]$/.test(clean)) return false
  const normalized = clean.replace('-', '')
  const body = normalized.slice(0, -1)
  const dv   = normalized.slice(-1)
  let sum = 0, mul = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul
    mul = mul === 7 ? 2 : mul + 1
  }
  const r = 11 - (sum % 11)
  const expected = r === 11 ? '0' : r === 10 ? 'K' : String(r)
  return dv === expected
}

function _validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

function _validarTelefono(tel) {
  const clean = tel.replace(/[\s\-\(\)\.]/g, '')
  return /^(\+?56)?9\d{8}$/.test(clean) || /^\+?56[2-9]\d{7}$/.test(clean)
}

function _setFieldError(id, msg) {
  const el  = document.getElementById(id)
  const err = document.getElementById(id + '-err')
  if (el)  el.classList.toggle('cp-input--err', !!msg)
  if (err) err.textContent = msg || ''
}

export function clearCCFError(id) {
  _setFieldError(id, '')
}

export function formatRutInput(id) {
  const el = document.getElementById(id)
  if (!el) return
  const raw = el.value.replace(/[^\dkK]/g, '').toUpperCase()
  if (raw.length > 1) {
    const body = raw.slice(0, -1)
    const dv   = raw.slice(-1)
    el.value   = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv
  }
  _setFieldError(id, '')
}

export function submitClientForm() {
  if (!_state) return

  let ok = true
  const val = id => (document.getElementById(id)?.value || '').trim()

  const nombre = val('ccf-nombre')
  if (nombre.length < 2) { _setFieldError('ccf-nombre', 'Ingresa el nombre completo'); ok = false }

  const rut = val('ccf-rut')
  if (!rut) {
    _setFieldError('ccf-rut', 'Ingresa el RUT'); ok = false
  } else if (!_validarRut(rut)) {
    _setFieldError('ccf-rut', 'RUT inválido — verifica el dígito verificador'); ok = false
  }

  const email = val('ccf-email')
  if (!email) {
    _setFieldError('ccf-email', 'Ingresa el email'); ok = false
  } else if (!_validarEmail(email)) {
    _setFieldError('ccf-email', 'Formato de email inválido'); ok = false
  }

  const tel = val('ccf-tel')
  if (!tel) {
    _setFieldError('ccf-tel', 'Ingresa el teléfono'); ok = false
  } else if (!_validarTelefono(tel)) {
    _setFieldError('ccf-tel', 'Formato inválido — ej: +56 9 1234 5678'); ok = false
  }

  const objetivo = val('ccf-objetivo')
  if (!objetivo) { _setFieldError('ccf-objetivo', 'Selecciona un objetivo'); ok = false }

  const corNombre = val('ccf-cor-nombre')
  if (corNombre.length < 2) { _setFieldError('ccf-cor-nombre', 'Ingresa el nombre del corredor'); ok = false }

  const corEmail = val('ccf-cor-email')
  if (!corEmail) {
    _setFieldError('ccf-cor-email', 'Ingresa el email del corredor'); ok = false
  } else if (!_validarEmail(corEmail)) {
    _setFieldError('ccf-cor-email', 'Formato de email inválido'); ok = false
  }

  const corTel = val('ccf-cor-tel')
  if (!corTel) {
    _setFieldError('ccf-cor-tel', 'Ingresa el teléfono del corredor'); ok = false
  } else if (!_validarTelefono(corTel)) {
    _setFieldError('ccf-cor-tel', 'Formato inválido — ej: +56 9 1234 5678'); ok = false
  }

  if (!ok) return

  try {
    localStorage.setItem('_corredor', JSON.stringify({ nombre: corNombre, email: corEmail, tel: corTel }))
  } catch {}

  _state.cliente = { nombre, rut, email, tel, objetivo, corNombre, corEmail, corTel }

  _state.cotizId = _genCotizId()
  _initParamsGrid(_state.parsedCC)
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'flex'
  recalcCotizPanel()
}

function _initParamsGrid(parsedCC) {
  const pie     = Math.round((parsedCC.piePctDefault ?? PIE_DEFAULT) * 100)
  const dcto    = _pct100((parsedCC.descuentoDepto ?? 0) + (parsedCC.descuentoAdicional ?? 0))
  const aporte  = _pct100(parsedCC.aporteInmobiliario)
  const cuotas  = parsedCC.cuotasPieN ?? 0
  const piecst  = _pct100(parsedCC.pieConstPct)
  const cuoton  = _pct100(parsedCC.cuotonPct)
  const upfront = _pct100(parsedCC.upfrontPct)
  const cdir    = _pct100(parsedCC.creditoDirectoPct)
  const [c1, c2, c3] = CAE_OPTIONS.map(c => _pct100(c))

  const cuotasLbl = `Cuotas pie${cuotas > 0 ? ` <span class="cp-fg-base">base ${cuotas}</span>` : ''}`
  const cuotonLbl = `Cuotón %${cuoton === 0 ? ' <span class="cp-fg-noapl">no aplica</span>' : ''}`

  const f = (lbl, id, val, min, max, step) =>
    `<div class="cp-fg"><label class="cp-fg-lbl">${lbl}</label>` +
    `<input id="${id}" class="cp-input" type="number" min="${min}" max="${max}" step="${step}" value="${val}" onchange="recalcCotizPanel()"></div>`

  document.getElementById('cp-params-grid').innerHTML = `
    <div class="cp-section-title">Parámetros de cotización</div>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${f('Pie %',           'cpg-pie',      pie,          0, 100, 1)}
        ${f('Plazo (años)',    'cpg-plazo',    PLAZO_DEFAULT, 5,  30, 1)}
        ${f('Dcto. depto %',  'cpg-dcto',     dcto,          0, 100, 0.1)}
        ${f('Aporte inmob %', 'cpg-aporte',   aporte,        0, 100, 0.1)}
      </div>
      <div class="cp-form-row cp-form-row--4">
        ${f(cuotasLbl,        'cpg-cuotas',   cuotas,  0,  48, 1)}
        ${f('Pie const %',    'cpg-piecst',   piecst,  0, 100, 0.1)}
        ${f(cuotonLbl,        'cpg-cuoton',   cuoton,  0, 100, 0.1)}
        ${f('Upfront %',      'cpg-upfront',  upfront, 0, 100, 0.1)}
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${f('Crédito directo %',  'cpg-cdir',      cdir, 0, 100, 0.1)}
        ${f('Plusvalía anual %',  'cpg-plusvalia',  2,   0,  20, 0.1)}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${f('CAE escenario 1', 'cpg-cae1', c1, 0, 20, 0.1)}
        ${f('CAE escenario 2', 'cpg-cae2', c2, 0, 20, 0.1)}
        ${f('CAE escenario 3', 'cpg-cae3', c3, 0, 20, 0.1)}
      </div>
    </div>`
}

// ── Lectura del formulario ────────────────────────────────────────────────────

function _readParams() {
  const n = id => { const v = parseFloat(document.getElementById(id)?.value); return isNaN(v) ? 0 : v }
  return {
    pie:       n('cpg-pie')       || PIE_DEFAULT * 100,
    plazo:     n('cpg-plazo')     || PLAZO_DEFAULT,
    dcto:      n('cpg-dcto'),
    aporte:    n('cpg-aporte'),
    cuotas:    n('cpg-cuotas'),
    piecst:    n('cpg-piecst'),
    cuoton:    n('cpg-cuoton'),
    upfront:   n('cpg-upfront'),
    cdir:      n('cpg-cdir'),
    plusvalia: n('cpg-plusvalia') || 2,
    cae1:      n('cpg-cae1')     || 4,
    cae2:      n('cpg-cae2')     || 4.5,
    cae3:      n('cpg-cae3')     || 5,
  }
}

// ── Construcción del input para calcularCotizacion ────────────────────────────

function _buildInput(params) {
  const { reservaCLP, regla, depto, secundarios } = _state
  return {
    precioListaDepto:          depto.precio_uf,
    descuentoPct:              params.dcto / 100,
    descuentoAdicionalPct:     0,
    bonoPiePct:                params.aporte / 100,
    reservaCLP,
    preciosConjuntos:          secundarios.map(s => s.precio_uf),
    piePct:                    params.pie / 100,
    upfrontPct:                params.upfront / 100,
    cuotasPieN:                params.cuotas,
    cuotonPct:                 params.cuoton / 100,
    piePeriodoConstruccionPct: params.piecst / 100,
    pieCreditoDirectoPct:      params.cdir / 100,
    plazoAnios:                params.plazo,
    tasasCAE:                  [params.cae1 / 100, params.cae2 / 100, params.cae3 / 100],
    valorUF:                   store.UF,
    tipoCalculoBono:           regla.tipoCalculoBono,
    pieConjuntosPct:           regla.pieConjuntosPct,
    arriendosMensualesCLP:     [0, 0, 0],
    plusvaliaAnual:            params.plusvalia / 100,
  }
}

function _pct(n) {
  const v = Math.round(parseFloat(n) * 1000) / 10
  return v.toFixed(1).replace(/\.0$/, '') + '%'
}

// ── Render del panel ──────────────────────────────────────────────────────────

function _renderPanel(r, params) {
  const { project, depto, secundarios } = _state

  const parts = [
    `${project.nombre} · DP ${depto.dp}${depto.tipologia ? ' ' + depto.tipologia : ''}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp}`)
  ]
  document.getElementById('cp-header-title').textContent = parts.join(' + ')

  document.getElementById('cp-results').innerHTML =
    _sValores(r, depto, secundarios) +
    _sPlanPago(r) +
    (r.pieCreditoDirectoUF > 0 ? _sCreditoDirecto(r) : '') +
    _sCreditoHip(r, params.plazo)
  _buildPrintDoc(r, params)
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

// ── Documento imprimible ─────────────────────────────────────────────────────

function _genCotizId() {
  const year = new Date().getFullYear()
  const key  = `_cotiz_counter_${year}`
  const next = (parseInt(localStorage.getItem(key) || '0') + 1)
  try { localStorage.setItem(key, String(next)) } catch {}
  return `COT-${year}-${String(next).padStart(4, '0')}`
}

function _buildPrintDoc(r, params) {
  const el = document.getElementById('cotiz-print-doc')
  if (!el || !_state?.cliente) return

  const { project, depto, secundarios, cliente, cotizId } = _state
  const now     = new Date()
  const dateStr = now.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  const OBJETIVO = { vivienda: 'Vivienda propia', inversion: 'Inversión / arriendo', segunda: 'Segunda vivienda', subsidio: 'Subsidio habitacional' }

  const unitLines = [
    `${depto.tipologia ? depto.tipologia + ' ' : ''}DP ${depto.dp} · ${fmt.uf2(depto.precio_uf)}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp} · ${fmt.uf2(s.precio_uf)}`)
  ].map(l => `<div class="prd-unit-line">${H(l)}</div>`).join('')

  const descTotal = r.precioListaDepto > 0 ? 1 - r.precioDescDepto / r.precioListaDepto : 0
  const deptoRow  = `<tr>
    <td>${H(String(depto.dp))}${depto.tipologia ? ' — ' + H(depto.tipologia) : ''}</td>
    <td>${fmt.uf2(r.precioListaDepto)}</td>
    <td>${descTotal > 0.0001 ? '−' + _pct(descTotal) : '—'}</td>
    <td>${fmt.uf2(r.precioDescDepto)}</td>
  </tr>`
  const secRows = secundarios.map(s => `<tr>
    <td>${s.tipologia ? H(s.tipologia) + ' ' : ''}DP ${H(String(s.dp))}</td>
    <td>${fmt.uf2(s.precio_uf)}</td><td>—</td>
    <td>${fmt.uf2(s.precio_uf)}</td>
  </tr>`).join('')

  let planRows = ''
  planRows += `<tr><td><strong>Pie total</strong> ${_pct(r.piePct)}</td><td>${fmt.uf2(r.pieTotalUF)}</td><td>${fmt.pesos(r.pieTotalUF * r.valorUF)}</td></tr>`
  planRows += `<tr class="prd-tbl-sub"><td>Reserva</td><td>${fmt.uf2(r.reservaUF)}</td><td>${fmt.pesos(r.reservaUF * r.valorUF)}</td></tr>`
  if (r.upfrontUF > 0)
    planRows += `<tr class="prd-tbl-sub"><td>Upfront ${_pct(r.upfrontPct)}</td><td>${fmt.uf2(r.upfrontUF)}</td><td>${fmt.pesos(r.upfrontUF * r.valorUF)}</td></tr>`
  if (r.cuotasPieN > 0 && r.saldoPieUF > 0)
    planRows += `<tr class="prd-tbl-sub"><td>Saldo pie — ${r.cuotasPieN} cuotas × ${fmt.uf2(r.valorCuotaPieUF)}/mes</td><td>${fmt.uf2(r.saldoPieUF)}</td><td>${fmt.pesos(r.saldoPieCLP)}</td></tr>`
  if (r.piePeriodoConstruccionUF > 0) {
    const pctConst = r.valorVentaUF > 0 ? r.piePeriodoConstruccionUF / r.valorVentaUF : 0
    planRows += `<tr><td>Pie período construcción ${_pct(pctConst)}</td><td>${fmt.uf2(r.piePeriodoConstruccionUF)}</td><td>${fmt.pesos(r.piePeriodoConstruccionCLP)}</td></tr>`
  }
  if (r.cuotonUF > 0)
    planRows += `<tr><td>Cuotón</td><td>${fmt.uf2(r.cuotonUF)}</td><td>${fmt.pesos(r.cuotonCLP)}</td></tr>`
  const pctTotalPie = r.valorVentaUF > 0 ? r.totalPieInmobUF / r.valorVentaUF : 0
  planRows += `<tr class="prd-tbl-total"><td><strong>Total pie a inmobiliaria</strong> ${_pct(pctTotalPie)}</td><td>${fmt.uf2(r.totalPieInmobUF)}</td><td>${fmt.pesos(r.totalPieInmobUF * r.valorUF)}</td></tr>`
  if (r.bonoPieUF > 0)
    planRows += `<tr class="prd-tbl-aporte"><td>Aporte inmobiliaria ${_pct(r.aportePct)}</td><td>${fmt.uf2(r.bonoPieUF)}</td><td>${fmt.pesos(r.bonoPieUF * r.valorUF)}</td></tr>`

  let cdirHtml = ''
  if (r.pieCreditoDirectoUF > 0) {
    const pctDir = r.valorVentaUF > 0 ? r.pieCreditoDirectoUF / r.valorVentaUF : 0
    cdirHtml = `<div class="prd-section">
      <div class="prd-section-title">Crédito Directo Inmobiliaria</div>
      <table class="prd-tbl"><tbody>
        <tr><td>Financiamiento directo ${_pct(pctDir)} × valor venta</td><td>${fmt.uf2(r.pieCreditoDirectoUF)}</td><td>${fmt.pesos(r.pieCreditoDirectoCLP)}</td></tr>
      </tbody></table>
    </div>`
  }

  const ltvPct  = r.tasacionUF > 0 ? r.creditoHipFinalUF / r.tasacionUF : 0
  const escRows = r.escenarios.map((esc, i) => {
    const rentaMin = esc.cuotaMensualCLP / 0.25
    return `<tr${i === 1 ? ' class="prd-esc-hl"' : ''}>
      <td>CAE ${(esc.cae * 100).toFixed(1).replace(/\.0$/, '')}%</td>
      <td>${fmt.pesos(esc.cuotaMensualCLP)}</td>
      <td>${fmt.uf2(esc.cuotaMensualUF)}</td>
      <td>${fmt.pesos(rentaMin)}</td>
    </tr>`
  }).join('')

  el.innerHTML = `
  <div class="prd-wrap">
    <div class="prd-header">
      <img src="/images/logo.png" alt="ViveProp" class="prd-logo">
      <div class="prd-header-mid">COTIZACIÓN</div>
      <div class="prd-header-right">
        <div class="prd-cot-num">${H(cotizId)}</div>
        <div class="prd-cot-date">${dateStr}</div>
      </div>
    </div>

    <div class="prd-meta-row">
      <div class="prd-meta-block">
        <div class="prd-meta-title">Proyecto</div>
        <div class="prd-meta-main">${H(project.nombre)}</div>
        <div class="prd-meta-sub">${H(project.inmobiliaria)}${project.comuna ? ' · ' + H(project.comuna) : ''}</div>
        <div class="prd-units-list">${unitLines}</div>
      </div>
      <div class="prd-meta-block">
        <div class="prd-meta-title">Cliente</div>
        <div class="prd-meta-main">${H(cliente.nombre)}</div>
        <div class="prd-meta-sub">RUT ${H(cliente.rut)}</div>
        <div class="prd-meta-sub">${H(cliente.email)}</div>
        <div class="prd-meta-sub">${H(cliente.tel)}</div>
        <div class="prd-meta-obj">${OBJETIVO[cliente.objetivo] || H(cliente.objetivo)}</div>
      </div>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Valores</div>
      <table class="prd-tbl">
        <thead><tr><th>Unidad</th><th>Precio lista</th><th>Descuento</th><th>Valor venta</th></tr></thead>
        <tbody>
          ${deptoRow}${secRows}
          <tr class="prd-tbl-total"><td>Total</td><td>${fmt.uf2(r.precioListaTotal)}</td><td></td><td>${fmt.uf2(r.valorVentaUF)} <small>(${fmt.pesos(r.valorVentaCLP)})</small></td></tr>
        </tbody>
      </table>
    </div>

    <div class="prd-section">
      <div class="prd-section-title">Plan de Pago</div>
      <table class="prd-tbl">
        <thead><tr><th>Concepto</th><th>UF</th><th>$</th></tr></thead>
        <tbody>${planRows}</tbody>
      </table>
    </div>

    ${cdirHtml}

    <div class="prd-section">
      <div class="prd-section-title">Crédito Hipotecario · ${params.plazo} años</div>
      <div class="prd-hip-summary">
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Tasación banco</span>
          <span class="prd-hip-val">${fmt.uf2(r.tasacionUF)}</span>
          <span class="prd-hip-sub">${fmt.pesos(r.tasacionCLP)}</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">LTV</span>
          <span class="prd-hip-val">${_pct(ltvPct)}</span>
          <span class="prd-hip-sub">× tasación</span>
        </div>
        <div class="prd-hip-cell">
          <span class="prd-hip-lbl">Crédito hipotecario</span>
          <span class="prd-hip-val">${fmt.uf2(r.creditoHipFinalUF)}</span>
          <span class="prd-hip-sub">${fmt.pesos(r.creditoHipFinalCLP)}</span>
        </div>
      </div>
      <table class="prd-tbl">
        <thead><tr><th>CAE</th><th>Dividendo/mes</th><th>Dividendo UF</th><th>Renta mínima</th></tr></thead>
        <tbody>${escRows}</tbody>
      </table>
    </div>

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${H(cliente.corNombre)} · ${H(cliente.corEmail)} · ${H(cliente.corTel)}
      </div>
      <div class="prd-disclaimer">
        Cotización referencial — no constituye oferta formal de venta. Valores UF calculados al ${dateStr} (1 UF = ${fmt.pesos(r.valorUF)}). Los dividendos son estimaciones según escenarios de tasa CAE indicados y pueden variar según condiciones del banco y perfil del solicitante.
      </div>
    </div>
  </div>`
}

export function printCotiz() {
  if (!_state?.cliente) return
  window.print()
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

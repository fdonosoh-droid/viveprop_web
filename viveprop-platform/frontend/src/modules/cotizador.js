import { store } from '../state/store.js';
import { H, fmt } from '../utils/format.js';
import { parseCCForCotizador } from '../utils/cc_parser.js';
import { calcularCotizacion, getReglaInmobiliaria, PLAZO_DEFAULT, CAE_OPTIONS, PIE_DEFAULT } from '../utils/calc_cotizador.js';

// ── Estado panel completo ─────────────────────────────────────────────────────

let _state       = null;   // { project, depto, secundarios, parsedCC, regla, reservaCLP }
let _recotizarMode = false;
let _lastR       = null
let _lastParams  = null

// ── Entrada principal desde primario.js ──────────────────────────────────────

export function cotizFromProp(arg) {
  try {
    const { project, depto, secundarios = [] } = arg

    console.log('[Cotizador] cotizFromProp', { project, depto, secundarios })

    const cc       = store.CC_DATA[project.id] || null
    const parsedCC = parseCCForCotizador(cc, project.inmobiliaria, depto)
    const regla    = getReglaInmobiliaria(project.inmobiliaria)

    const reservaCLP = parsedCC.reservaUF > 0
      ? Math.round(parsedCC.reservaUF * store.UF)
      : parsedCC.reservaCLP

    _state = { project, depto, secundarios, parsedCC, regla, reservaCLP, cliente: null }

    _initClientForm()

    document.getElementById('cotiz-cascade').style.display = 'none'
    document.getElementById('cotiz-client-form').style.display = 'flex'
    document.getElementById('cotiz-params-step').style.display = 'none'
    document.getElementById('cotiz-panel').style.display = 'none'
    window.openModule('cotiz')
  } catch (err) {
    console.error('[Cotizador] Error en cotizFromProp:', err)
    document.getElementById('cotiz-cascade').style.display = 'none'
    document.getElementById('cotiz-client-form').style.display = 'none'
    document.getElementById('cotiz-params-step').style.display = 'none'
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

export function cancelarCotizacion() {
  _state = null
  _recotizarMode = false
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-params-step').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-cascade').style.display = ''
  window.openModule('sec')
}

export function volverDesdeCotiz() {
  const isSecundario = _state?.project?.id?.startsWith('sec-')
  const saved = !isSecundario && _state ? {
    pid:      _state.project?.id,
    dp:       _state.depto?.dp,
    extraDps: (_state.secundarios ?? []).map(s => s.dp)
  } : null
  _state = null
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-params-step').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-cascade').style.display = ''
  window.openModule(isSecundario ? 'sec' : 'pri')
  if (saved?.pid) window.reopenWithUnit(saved.pid, saved.dp, saved.extraDps)
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

  // Limpiar campos corredor (siempre para nueva cotización)
  ;['ccf-cor-nombre', 'ccf-cor-email', 'ccf-cor-tel'].forEach(id => {
    const el = document.getElementById(id)
    if (el) { el.value = ''; el.classList.remove('cp-input--err') }
  })

  // Si es recotización, pre-rellenar corredor Y datos del último cliente
  if (_recotizarMode) {
    try {
      const saved = JSON.parse(localStorage.getItem('_corredor') || '{}')
      if (saved.nombre) document.getElementById('ccf-cor-nombre').value = saved.nombre
      if (saved.email)  document.getElementById('ccf-cor-email').value  = saved.email
      if (saved.tel)    document.getElementById('ccf-cor-tel').value    = saved.tel
    } catch {}
    try {
      const uc = JSON.parse(localStorage.getItem('_ultimo_cliente') || '{}')
      if (uc.nombre)   { const el = document.getElementById('ccf-nombre');   if (el) el.value = uc.nombre }
      if (uc.rut)      { const el = document.getElementById('ccf-rut');      if (el) el.value = uc.rut }
      if (uc.email)    { const el = document.getElementById('ccf-email');    if (el) el.value = uc.email }
      if (uc.tel)      { const el = document.getElementById('ccf-tel');      if (el) el.value = uc.tel }
      if (uc.objetivo) { const el = document.getElementById('ccf-objetivo'); if (el) el.value = uc.objetivo }
    } catch {}
  }
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

// Llamar en onblur — formatea al perder el foco, no mientras se escribe
export function formatTelInput(id) {
  const el = document.getElementById(id)
  if (!el || !el.value.trim()) return
  let d = el.value.replace(/\D/g, '')
  // Quitar código de país 56 si el usuario lo incluyó
  if (d.startsWith('56') && d.length > 9) d = d.slice(2)
  // Mínimo 8 dígitos para formatear
  if (d.length < 8) return
  d = d.slice(0, 9)
  el.value = '+56' + d[0] + ' ' + d.slice(1, 5) + ' ' + d.slice(5)
}

export function formatCLPInput(id) {
  const el = document.getElementById(id)
  if (!el) return
  const digits = el.value.replace(/\D/g, '')
  el.value = digits ? '$' + parseInt(digits, 10).toLocaleString('es-CL') : ''
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
  try {
    localStorage.setItem('_ultimo_cliente', JSON.stringify({ nombre, rut, email, tel, objetivo }))
  } catch {}

  _state.cliente = { nombre, rut, email, tel, objetivo, corNombre, corEmail, corTel }

  _state.cotizId = _genCotizId()
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-params-step').style.display = 'flex'
  _initParamsGrid(_state.parsedCC)
  _recotizarMode = false
}

export function volverDesdeParams() {
  document.getElementById('cotiz-params-step').style.display = 'none'
  document.getElementById('cotiz-client-form').style.display = 'flex'
}

export function submitParamsStep() {
  const clp = id => { const raw = (document.getElementById(id)?.value || '').replace(/\D/g, ''); return parseInt(raw, 10) || 0 }

  if (_state?.cliente?.objetivo === 'inversion') {
    const arr1 = clp('cpg-arriendo1')
    const arr2 = clp('cpg-arriendo2')
    const arr3 = clp('cpg-arriendo3')
    const errEl = document.getElementById('cpg-arriendo-err')
    if (!arr1 || !arr2 || !arr3) {
      if (errEl) errEl.style.display = ''
      return
    }
    if (errEl) errEl.style.display = 'none'
    try { localStorage.setItem('_arriendos', JSON.stringify({ arr1, arr2, arr3 })) } catch {}
  }

  document.getElementById('cotiz-params-step').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'flex'
  recalcCotizPanel()
}

export function volverAParams() {
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-params-step').style.display = 'flex'
}

function _initParamsGrid(parsedCC) {
  const dcto    = _pct100((parsedCC.descuentoDepto ?? 0) + (parsedCC.descuentoAdicional ?? 0))
  const aporte  = _pct100(parsedCC.aporteInmobiliario)
  const cuotas  = parsedCC.cuotasPieN ?? 0
  const piecst  = _pct100(parsedCC.pieConstPct)
  const cuoton  = _pct100(parsedCC.cuotonPct)
  const upfront = _pct100(parsedCC.upfrontPct)
  const cdir    = _pct100(parsedCC.creditoDirectoPct)
  const [c1, c2, c3] = CAE_OPTIONS.map(c => _pct100(c))
  const isUsada     = _state.project.id.startsWith('sec-')
  const pieBase  = Math.round((parsedCC.piePctDefault ?? PIE_DEFAULT) * 100)
  const pie      = isUsada ? pieBase : Math.max(0, pieBase - aporte)

  // Set title in params step header
  const { project, depto, secundarios } = _state
  const titleParts = [
    `${project.nombre} · DP ${depto.dp}${depto.tipologia ? ' ' + depto.tipologia : ''}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp}`)
  ]
  document.getElementById('cps-header-title').textContent = titleParts.join(' + ')

  // Locked field (from CC — read-only display + hidden input for _readParams)
  const locked = (lbl, id, val) =>
    `<div class="cp-fg"><label class="cp-fg-lbl">${lbl}</label>` +
    `<input id="${id}" class="cp-input cp-input--locked" type="text" value="${val}%" disabled></div>`

  // Dropdown field
  const dd = (lbl, id, options, val, fmtLbl) => {
    const numVal = parseFloat(val)
    const hasMatch = options.some(o => parseFloat(o) === numVal)
    const allOpts = hasMatch ? options : [...options, numVal].sort((a, b) => a - b)
    const opts = allOpts.map(o =>
      `<option value="${o}"${parseFloat(o) === numVal ? ' selected' : ''}>${fmtLbl(o)}</option>`
    ).join('')
    return `<div class="cp-fg"><label class="cp-fg-lbl">${lbl}</label>` +
           `<select id="${id}" class="cp-input cp-select">${opts}</select></div>`
  }

  // Text input field
  const txt = (lbl, id, val) =>
    `<div class="cp-fg"><label class="cp-fg-lbl">${lbl}</label>` +
    `<input id="${id}" class="cp-input" type="number" min="0" step="any" value="${val}"></div>`
  const arrTxt = (lbl, id, val) => {
    const disp = val ? '$' + Number(val).toLocaleString('es-CL') : ''
    return `<div class="cp-fg"><label class="cp-fg-lbl">${lbl}</label>` +
      `<input id="${id}" class="cp-input" type="text" value="${disp}" oninput="formatCLPInput('${id}')" placeholder="$0"></div>`
  }

  const cuotasLbl = `Cuotas Pie${cuotas > 0 ? ` <span class="cp-fg-base">base ${cuotas}</span>` : ''}`
  const cuotonLbl = `Cuotón %${cuoton === 0 ? ' <span class="cp-fg-noapl">no aplica</span>' : ''}`

  const pieOpts   = [0, 5, 10, 15, 20, 25, 30, 35, 40]
  const cuotasOpts= [0, 6, 12, 18, 24, 30, 36, 48, 60]
  const cuotonOpts= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const plazoOpts = [5, 10, 15, 20, 25, 30]
  const caeOpts   = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0]

  const isInversion = _state.cliente?.objetivo === 'inversion'
  const savedArr    = _loadArr()

  document.getElementById('cps-params-grid').innerHTML = `
    <div class="cp-section-title">Configuración de cotización</div>
    <p class="cps-nota">Los campos en gris se leen desde condiciones comerciales y no son editables.</p>
    <div class="cp-params-body">
      <div class="cp-form-row cp-form-row--4">
        ${locked('Descuento (%)',          'cpg-dcto',    dcto)}
        ${locked(isUsada ? 'Aporte Vendedor (%)' : 'Aporte Inmobiliaria (%)', 'cpg-aporte', aporte)}
        ${dd('% de Pie',    'cpg-pie',    pieOpts,    pie,    v => v + '%')}
        ${isUsada
          ? locked('Cuotas Pie', 'cpg-cuotas', 1)
          : dd(cuotasLbl, 'cpg-cuotas', cuotasOpts, cuotas, v => v === 0 ? 'Sin cuotas' : v + ' cuotas')}
      </div>
      ${!isUsada ? `<div class="cp-form-row cp-form-row--4">
        ${locked('Pie Construcción (%)',  'cpg-piecst', piecst)}
        ${dd(cuotonLbl, 'cpg-cuoton', cuotonOpts, cuoton, v => v + '%')}
        ${locked('Crédito Directo (%)',   'cpg-cdir',   cdir)}
        ${txt('Upfront Promesa (%)', 'cpg-upfront', upfront)}
      </div>` : ''}
      <div class="cp-form-row cp-form-row--3">
        ${txt('Plusvalía anual (%)', 'cpg-plusvalia', 2)}
        ${dd('Plazo', 'cpg-plazo', plazoOpts, PLAZO_DEFAULT, v => v + ' años')}
        <div class="cp-fg"></div>
      </div>
      <div class="cp-form-row cp-form-row--3">
        ${dd('Escenario 1 CAE', 'cpg-cae1', caeOpts, c1, v => v.toFixed(1) + '%')}
        ${dd('Escenario 2 CAE', 'cpg-cae2', caeOpts, c2, v => v.toFixed(1) + '%')}
        ${dd('Escenario 3 CAE', 'cpg-cae3', caeOpts, c3, v => v.toFixed(1) + '%')}
      </div>
      ${isInversion ? `
      <div class="cp-form-row cp-form-row--3" id="cpg-arriendo-row">
        ${arrTxt('Arriendo est. Esc. 1 ($/mes)', 'cpg-arriendo1', savedArr.arr1)}
        ${arrTxt('Arriendo est. Esc. 2 ($/mes)', 'cpg-arriendo2', savedArr.arr2)}
        ${arrTxt('Arriendo est. Esc. 3 ($/mes)', 'cpg-arriendo3', savedArr.arr3)}
      </div>
      <div id="cpg-arriendo-err" style="display:none;color:#991B1B;font-size:12px;padding:2px 0 4px 4px">Ingresa los arriendos estimados para los 3 escenarios</div>
      ` : ''}
    </div>`
}

function _loadArr() {
  if (!_recotizarMode) return { arr1: '', arr2: '', arr3: '' }
  try {
    const s = JSON.parse(localStorage.getItem('_arriendos') || '{}')
    return { arr1: s.arr1 ?? '', arr2: s.arr2 ?? '', arr3: s.arr3 ?? '' }
  } catch { return { arr1: '', arr2: '', arr3: '' } }
}

// ── Lectura del formulario ────────────────────────────────────────────────────

function _readParams() {
  const n   = id => { const v = parseFloat(document.getElementById(id)?.value); return isNaN(v) ? 0 : v }
  const clp = id => { const raw = (document.getElementById(id)?.value || '').replace(/\D/g, ''); return parseInt(raw, 10) || 0 }
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
    arriendo1: clp('cpg-arriendo1'),
    arriendo2: clp('cpg-arriendo2'),
    arriendo3: clp('cpg-arriendo3'),
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
    arriendosMensualesCLP:     [params.arriendo1, params.arriendo2, params.arriendo3],
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
    _sCreditoHip(r, params.plazo) +
    (_state.cliente?.objetivo === 'inversion' ? _sInversion(r) : '')
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

  if (r.reservaUF > 0.001) rows += `
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

// ── Sección: Análisis de Inversión ────────────────────────────────────────────

function _sInversion(r) {
  const caes = r.escenarios.map(e => `CAE ${(e.cae * 100).toFixed(1).replace(/\.0$/, '')}%`)
  const header = caes.map(c => `<th>${c}</th>`).join('')
  const row = (lbl, vals) =>
    `<tr><td>${lbl}</td>${vals.map(v => `<td>${v}</td>`).join('')}</tr>`
  return `
  <div class="cp-section">
    <div class="cp-section-title">Análisis de Inversión &middot; 5 años</div>
    <div class="cp-section-body">
      <table class="cp-inv-tbl">
        <thead><tr><th>Concepto</th>${header}</tr></thead>
        <tbody>
          ${row('Precio de venta año 5 ($)',  r.escenarios.map(() => fmt.pesos(r.precioVentaAnio5CLP)))}
          ${row('Pie pagado ($)',              r.escenarios.map(() => fmt.pesos(r.piePagadoCLP)))}
          ${row('Flujo acumulado ($)',         r.escenarios.map(e => fmt.pesos(e.flujoAcumuladoCLP)))}
          ${row('Cap Rate anual',              r.escenarios.map(e => _pct(e.capRate)))}
          ${row('ROI s/pie 5 años',            r.escenarios.map(e => _pct(e.roi5Anios)))}
          ${row('ROI anual compuesto',         r.escenarios.map(e => _pct(e.roiAnual)))}
        </tbody>
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
  _lastR = r
  _lastParams = params
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
  if (r.reservaUF > 0.001) planRows += `<tr class="prd-tbl-sub"><td>Reserva</td><td>${fmt.uf2(r.reservaUF)}</td><td>${fmt.pesos(r.reservaUF * r.valorUF)}</td></tr>`
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
        <div class="prd-meta-sub">${[project.inmobiliaria && H(project.inmobiliaria), project.comuna && H(project.comuna)].filter(Boolean).join(' · ')}</div>
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

    ${cliente.objetivo === 'inversion' ? `
    <div class="prd-section">
      <div class="prd-section-title">Análisis de Inversión · 5 años</div>
      <table class="prd-inv-tbl">
        <thead>
          <tr>
            <th>Concepto</th>
            ${r.escenarios.map(e => `<th>CAE ${(e.cae*100).toFixed(1).replace(/\.0$/,'')}%</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr><td>Precio de venta año 5 ($)</td>${r.escenarios.map(() => `<td>${fmt.pesos(r.precioVentaAnio5CLP)}</td>`).join('')}</tr>
          <tr><td>Pie pagado ($)</td>${r.escenarios.map(() => `<td>${fmt.pesos(r.piePagadoCLP)}</td>`).join('')}</tr>
          <tr><td>Flujo acumulado ($)</td>${r.escenarios.map(e => `<td>${fmt.pesos(e.flujoAcumuladoCLP)}</td>`).join('')}</tr>
          <tr><td>Cap Rate anual</td>${r.escenarios.map(e => `<td>${_pct(e.capRate)}</td>`).join('')}</tr>
          <tr><td>ROI s/pie 5 años</td>${r.escenarios.map(e => `<td>${_pct(e.roi5Anios)}</td>`).join('')}</tr>
          <tr><td>ROI anual compuesto</td>${r.escenarios.map(e => `<td>${_pct(e.roiAnual)}</td>`).join('')}</tr>
        </tbody>
      </table>
    </div>` : ''}

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${H(cliente.corNombre)} · ${H(cliente.corEmail)} · ${H(cliente.corTel)}
      </div>
      <div class="prd-disclaimer">
        Esta cotización es referencial y ha sido elaborada para apoyarte en la evaluación de esta oportunidad inmobiliaria, considerando las condiciones comerciales vigentes informadas por la inmobiliaria a la fecha de emisión. La información aquí contenida es de carácter referencial y puede experimentar variaciones en valores, beneficios o condiciones comerciales según lo que finalmente defina la inmobiliaria para cada caso. Asimismo, los montos expresados en UF están sujetos a la variación del índice oficial publicado por el Banco Central de Chile, y las condiciones de financiamiento hipotecario dependerán de la evaluación y aprobación de la entidad financiera respectiva. Cotización emitida el ${dateStr}.
      </div>
    </div>
  </div>`
}

function _buildPrintDocResumen(r) {
  const el = document.getElementById('cotiz-print-doc')
  if (!el || !_state?.cliente || !r) return

  const { project, depto, secundarios, cliente, cotizId } = _state
  const now     = new Date()
  const dateStr = now.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
  const OBJETIVO = { vivienda: 'Vivienda propia', inversion: 'Inversión / arriendo', segunda: 'Segunda vivienda', subsidio: 'Subsidio habitacional' }

  const unitLines = [
    `${depto.tipologia ? depto.tipologia + ' ' : ''}DP ${depto.dp} · ${fmt.uf2(depto.precio_uf)}`,
    ...secundarios.map(s => `${s.tipologia ? s.tipologia + ' ' : ''}DP ${s.dp} · ${fmt.uf2(s.precio_uf)}`)
  ].map(l => `<div class="prd-unit-line">${H(l)}</div>`).join('')

  const deptoLabel = `${H(String(depto.dp))}${depto.tipologia ? ' (' + H(depto.tipologia) + ')' : ''}`
  const deptoRow = `<tr>
    <td>${deptoLabel}</td>
    <td class="ta-r">${fmt.uf2(r.precioDescDepto)}</td>
    <td class="ta-r">${fmt.pesos(r.precioDescDepto * r.valorUF)}</td>
  </tr>`
  const secRows = secundarios.map(s => `<tr>
    <td>${s.tipologia ? H(s.tipologia) + ' ' : ''}DP ${H(String(s.dp))}</td>
    <td class="ta-r">${fmt.uf2(s.precio_uf)}</td>
    <td class="ta-r">${fmt.pesos(s.precio_uf * r.valorUF)}</td>
  </tr>`).join('')

  const totalUF    = r.valorVentaUF
  const pieResumenUF = r.pieTotalUF + (r.bonoPieUF || 0)
  const _pct2      = v => totalUF > 0 ? (v / totalUF * 100).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '—'

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
        <div class="prd-meta-sub">${[project.inmobiliaria && H(project.inmobiliaria), project.comuna && H(project.comuna)].filter(Boolean).join(' · ')}</div>
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
      <table class="prd-tbl prd-res-tbl">
        <thead><tr><th>Unidad</th><th class="ta-r">UF</th><th class="ta-r">$</th></tr></thead>
        <tbody>
          ${deptoRow}${secRows}
          <tr class="prd-tbl-total">
            <td><strong>Total</strong></td>
            <td class="ta-r"><strong>${fmt.uf2(totalUF)}</strong></td>
            <td class="ta-r"><strong>${fmt.pesos(totalUF * r.valorUF)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="prd-section">
      <table class="prd-tbl prd-res-tbl">
        <thead><tr><th>Concepto</th><th class="ta-r">UF</th><th class="ta-r">%</th><th class="ta-r">$</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>Pie</strong></td>
            <td class="ta-r"><strong>${fmt.uf2(pieResumenUF)}</strong></td>
            <td class="ta-r">${_pct2(pieResumenUF)}</td>
            <td class="ta-r"><strong>${fmt.pesos(pieResumenUF * r.valorUF)}</strong></td>
          </tr>
          <tr class="prd-tbl-total">
            <td><strong>Crédito Hipotecario</strong></td>
            <td class="ta-r"><strong>${fmt.uf2(r.creditoHipFinalUF)}</strong></td>
            <td class="ta-r">${_pct2(totalUF - pieResumenUF)}</td>
            <td class="ta-r"><strong>${fmt.pesos(r.creditoHipFinalUF * r.valorUF)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="prd-footer">
      <div class="prd-corredor">
        <strong>Corredor:</strong> ${H(cliente.corNombre)} · ${H(cliente.corEmail)} · ${H(cliente.corTel)}
      </div>
      <div class="prd-disclaimer">
        Esta cotización es referencial y ha sido elaborada para apoyarte en la evaluación de esta oportunidad inmobiliaria, considerando las condiciones comerciales vigentes informadas por la inmobiliaria a la fecha de emisión. La información aquí contenida es de carácter referencial y puede experimentar variaciones en valores, beneficios o condiciones comerciales según lo que finalmente defina la inmobiliaria para cada caso. Asimismo, los montos expresados en UF están sujetos a la variación del índice oficial publicado por el Banco Central de Chile, y las condiciones de financiamiento hipotecario dependerán de la evaluación y aprobación de la entidad financiera respectiva. Cotización emitida el ${dateStr}.
      </div>
    </div>
  </div>`
}

export function printCotiz() {
  if (!_state?.cliente) return
  document.getElementById('cotiz-print-modal').style.display = 'flex'
}

export function closePrintModal() {
  document.getElementById('cotiz-print-modal').style.display = 'none'
}

export function printCotizMode(mode) {
  closePrintModal()
  if (mode === 'resumen') _buildPrintDocResumen(_lastR)
  else _buildPrintDoc(_lastR, _lastParams)
  requestAnimationFrame(() => window.print())
}

export function cotizSecProp(propId) {
  try {
    const p = store.STOCK.find(x => x.id === propId)
    if (!p) return

    const precio_uf = parseFloat((p.precioSinBono || '0').replace(/\./g, '').replace(',', '.')) || 0

    const project = {
      id:           `sec-${propId}`,
      nombre:       p.condominio || p.direccion || '—',
      inmobiliaria: '',
      comuna:       p.comuna || '',
    }
    const depto = {
      dp:         p.dp || '—',
      precio_uf,
      tipologia:  p.tipologia || '',
      disponible: true,
    }
    const parsedCC = {
      descuentoDepto:     0,
      descuentoAdicional: 0,
      aporteInmobiliario: (p.bonoPct || 0) / 100,
      reservaCLP:         0,
      reservaUF:          0,
      cuotasPieN:         1,
      upfrontPct:         0,
      piePctDefault:      0.20,
      pieConstPct:        0,
      creditoDirectoPct:  0,
      cuotonPct:          0,
      tipoEntrega:        'Usada',
      nota:               '',
    }
    const regla = getReglaInmobiliaria('')
    _state = { project, depto, secundarios: [], parsedCC, regla, reservaCLP: 0, cliente: null }
    _initClientForm()
    document.getElementById('cotiz-cascade').style.display = 'none'
    document.getElementById('cotiz-client-form').style.display = 'flex'
    document.getElementById('cotiz-params-step').style.display = 'none'
    document.getElementById('cotiz-panel').style.display = 'none'
    window.openModule('cotiz')
  } catch (err) {
    console.error('[Cotizador] Error en cotizSecProp:', err)
    document.getElementById('cotiz-cascade').style.display = 'none'
    document.getElementById('cotiz-client-form').style.display = 'none'
    document.getElementById('cotiz-params-step').style.display = 'none'
    document.getElementById('cotiz-panel').style.display = 'flex'
    window.openModule('cotiz')
    document.getElementById('cp-results').innerHTML =
      `<div style="background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:20px;color:#991B1B;font-family:monospace;font-size:13px;white-space:pre-wrap">${H(String(err))}</div>`
  }
}

export function nuevaCotizacion() {
  _state = null
  _recotizarMode = false
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-params-step').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-cascade').style.display = ''
  window.cascReset()
  window.openModule('cotiz')
}

export function recotizar() {
  _state = null
  _recotizarMode = true
  document.getElementById('cotiz-client-form').style.display = 'none'
  document.getElementById('cotiz-params-step').style.display = 'none'
  document.getElementById('cotiz-panel').style.display = 'none'
  document.getElementById('cotiz-cascade').style.display = ''
  window.cascReset()
  window.openModule('cotiz')
}


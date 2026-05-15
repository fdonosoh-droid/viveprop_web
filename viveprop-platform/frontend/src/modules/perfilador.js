import { store } from '../state/store.js';
import { fmt } from '../utils/format.js';

let _perfilMax = null;
let _perfilNeedsBonoPie = false;

// ── Motor de evaluación (portado de cotizador-web-mp/evaluation-engine.ts) ───

function _evaluar(data) {
  const {
    rentaLiquida = 0, ingresosVariables = 0, otrosIngresos = 0,
    cuotasCreditos = 0, pagoTarjetas = 0, otrasDeudas = 0,
    pieDisponible = 0, plazo = 25, tasa = 4.5, morosidad = false,
  } = data

  const ingresoEvaluable = rentaLiquida + ingresosVariables * 0.5 + otrosIngresos
  const cargaSinHip      = cuotasCreditos + pagoTarjetas + otrasDeudas
  const razones = []
  let resultado = 'apto'

  if (morosidad) {
    resultado = 'no_apto'
    razones.push('Presenta morosidades o protestos vigentes')
  }

  if (!ingresoEvaluable) {
    return { resultado: 'no_apto', razones: ['Sin ingresos registrados'],
      sinPie: !pieDisponible,
      ingresoEvaluable: 0, cargaSinHip: 0, rciActual: 0,
      dividendoMax: 0, creditoMax: 0, propMaxCLP: 0, propMaxUF: 0 }
  }

  const rciActual = cargaSinHip / ingresoEvaluable
  if (rciActual > 0.50) {
    resultado = 'no_apto'
    razones.push(`Carga mensual actual (${(rciActual * 100).toFixed(0)}%) supera el 50% del ingreso evaluable`)
  }

  const divMax1    = ingresoEvaluable * 0.30
  const divMax2    = ingresoEvaluable * 0.50 - cargaSinHip
  const dividendoMax = Math.max(0, Math.min(divMax1, divMax2))

  if (dividendoMax <= 0 && resultado === 'apto') {
    resultado = 'no_apto'
    razones.push('Sin capacidad de pago disponible para un dividendo')
  }

  const divRatio    = ingresoEvaluable > 0 ? dividendoMax / ingresoEvaluable : 0
  const cargaTotal  = ingresoEvaluable > 0 ? (cargaSinHip + dividendoMax) / ingresoEvaluable : 0
  if (resultado === 'apto' && (divRatio > 0.25 || cargaTotal > 0.45)) {
    resultado = 'apto_con_condiciones'
    razones.push('Relación dividendo/ingreso en zona de tolerancia (25–30%)')
  }

  if (resultado === 'apto') razones.push('Cumple todos los criterios de evaluación')

  const r      = tasa / 100 / 12
  const n      = plazo * 12
  const factor = r > 0 ? (1 - Math.pow(1 + r, -n)) / r : n
  const creditoMax = dividendoMax * factor

  const propMaxPorPie = pieDisponible > 0 ? pieDisponible / 0.20 : 0
  const propMaxPorLtv = creditoMax / 0.80
  const propMaxCLP    = propMaxPorPie > 0
    ? Math.min(propMaxPorPie, propMaxPorLtv)
    : propMaxPorLtv
  const propMaxUF = store.UF > 0 ? propMaxCLP / store.UF : 0

  return { resultado, razones, sinPie: !pieDisponible, ingresoEvaluable, cargaSinHip, rciActual, dividendoMax, creditoMax, propMaxCLP, propMaxUF }
}

// ── Cálculo y render ─────────────────────────────────────────────────────────

export function calcPerfil() {
  const n = id => parseFloat(document.getElementById(id)?.value || '') || 0
  const b = id => document.getElementById(id)?.checked || false

  const data = {
    rentaLiquida:      n('p-renta'),
    ingresosVariables: n('p-variables'),
    otrosIngresos:     n('p-otros-ing'),
    cuotasCreditos:    n('p-cuotas'),
    pagoTarjetas:      n('p-tarjetas'),
    otrasDeudas:       n('p-otras-deudas'),
    pieDisponible:     n('p-ahorro'),
    plazo:             n('p-plazo') || 25,
    tasa:              n('p-tasa')  || 4.5,
    morosidad:         b('p-morosidad'),
  }

  const res  = document.getElementById('p-results')
  const btns = document.getElementById('p-btns')
  btns.style.display = 'none'

  if (!data.rentaLiquida) {
    res.innerHTML = `<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente para evaluar su capacidad</p></div>`
    return
  }

  const ev = _evaluar(data)
  _perfilMax = ev.resultado !== 'no_apto' && ev.propMaxUF > 0 ? ev.propMaxUF : null
  _perfilNeedsBonoPie = ev.sinPie || false

  const BADGE = {
    apto:                 { cls: 'pf-badge--apto',   label: '✓ Apto' },
    apto_con_condiciones: { cls: 'pf-badge--cond',   label: '⚠ Apto con condiciones' },
    no_apto:              { cls: 'pf-badge--noapto',  label: '✗ No apto' },
  }
  const badge = BADGE[ev.resultado] || BADGE.no_apto
  const pct   = v => (v * 100).toFixed(1).replace(/\.0$/, '') + '%'
  const uf    = store.UF || 1

  res.innerHTML = `
  <div class="perfil-card">
    <div class="pf-status-row">
      <span class="pf-badge ${badge.cls}">${badge.label}</span>
      ${ev.sinPie ? `<span class="pf-badge pf-badge--sinpie">⚠ Sin pie en efectivo — se mostrarán proyectos con bono pie</span>` : ''}
      <ul class="pf-razones">${ev.razones.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    <div class="rc-hero">
      <div class="rc-big">${ev.propMaxUF > 0 ? fmt.uf(ev.propMaxUF) : '—'}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${ev.propMaxCLP > 0 ? fmt.pesos(ev.propMaxCLP) : '—'}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell">
        <span class="rcv">${fmt.pesos(ev.ingresoEvaluable)}</span>
        <span class="rcl">Ingreso evaluable / mes</span>
        <span class="rcp">Renta + 50% variables + otros</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${fmt.pesos(ev.dividendoMax)}</span>
        <span class="rcl">Dividendo máximo / mes</span>
        <span class="rcp">${ev.ingresoEvaluable > 0 ? pct(ev.dividendoMax / ev.ingresoEvaluable) : '—'} del ingreso</span>
      </div>
      <div class="rc-cell">
        <span class="rcv">${fmt.uf(ev.creditoMax / uf)}</span>
        <span class="rcl">Crédito hipotecario máx.</span>
        <span class="rcp">${fmt.pesos(ev.creditoMax)}</span>
      </div>
      <div class="rc-cell${ev.rciActual > 0.40 ? ' warn' : ''}">
        <span class="rcv">${pct(ev.rciActual)}</span>
        <span class="rcl">Carga actual sin hipoteca</span>
        <span class="rcp">Límite: 50%</span>
      </div>
    </div>
  </div>`

  if (_perfilMax) btns.style.display = 'flex'
}

// ── Búsqueda desde perfilador ─────────────────────────────────────────────────

export function searchFromPerfil(mod) {
  if (!_perfilMax) return
  window._perfilNeedsBonoPie = _perfilNeedsBonoPie
  if (mod === 'sec') {
    window._secMaxUF = _perfilMax
    window.secFilter()
    window.openModule('sec')
    showBudgetBanner('sec')
  } else {
    window._priMaxUF = _perfilMax
    window.priFilter()
    window.openModule('pri')
    showBudgetBanner('pri')
  }
}

export function showBudgetBanner(mod) {
  document.getElementById('bb-' + mod)?.remove()
  const b = document.createElement('div')
  b.id = 'bb-' + mod
  b.className = 'filter-strip'
  b.style.cssText = 'background:#FFFBEB;border-bottom:1px solid #FCD34D;'
  b.innerHTML = `<span style="font-size:13px;color:#92400E">👤 Presupuesto máximo: <strong>${fmt.uf(_perfilMax)}</strong>${_perfilNeedsBonoPie ? ' · Mostrando solo proyectos con bono pie' : ''}</span>
    <button class="btn-clear-budget" onclick="clearBudget('${mod}')">✕ Limpiar filtro</button>`
  const m = document.getElementById('mod-' + mod)
  m.insertBefore(b, m.querySelector('.filter-strip'))
}

export function clearBudget(mod) {
  window._perfilNeedsBonoPie = false
  if (mod === 'sec') { window._secMaxUF = null; window.secFilter() }
  else               { window._priMaxUF = null; window.priFilter() }
  document.getElementById('bb-' + mod)?.remove()
}

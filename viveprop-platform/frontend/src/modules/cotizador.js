import { store } from '../state/store.js';
import { H, fmt } from '../utils/format.js';
import { parseCCForCotizador } from '../utils/cc_parser.js';
import { calcularCotizacion, getReglaInmobiliaria, PLAZO_DEFAULT, CAE_OPTIONS, PIE_DEFAULT } from '../utils/calc_cotizador.js';

let cotizLabel = '';

/**
 * Punto de entrada desde primario.js al hacer click en "Cotizar".
 *
 * Nueva firma:  cotizFromProp({ project, depto, secundarios })
 * Legacy (Sprint 2 → eliminar en Sprint 3): cotizFromProp(totalUF, label)
 */
export function cotizFromProp(arg, legacyLabel) {
  if (typeof arg === 'number') {
    _openBasicCalc(arg, legacyLabel)
    return
  }

  const { project, depto, secundarios = [] } = arg

  // ── Parsear condiciones comerciales ───────────────────────────────────────
  const cc       = store.CC_DATA[project.id] || null
  const parsedCC = parseCCForCotizador(cc, project.inmobiliaria)
  const regla    = getReglaInmobiliaria(project.inmobiliaria)

  // Reserva: TOCTOC la almacena en UF; otros la guardan en CLP
  const reservaCLP = parsedCC.reservaUF > 0
    ? Math.round(parsedCC.reservaUF * store.UF)
    : parsedCC.reservaCLP

  // ── Construir InputCotizacion ──────────────────────────────────────────────
  const input = {
    precioListaDepto:          depto.precio_uf,
    descuentoPct:              parsedCC.descuentoDepto,
    descuentoAdicionalPct:     parsedCC.descuentoAdicional || 0,
    bonoPiePct:                parsedCC.aporteInmobiliario,
    reservaCLP,
    preciosConjuntos:          secundarios.map(s => s.precio_uf),
    piePct:                    parsedCC.piePctDefault ?? PIE_DEFAULT,
    upfrontPct:                parsedCC.upfrontPct || 0,
    cuotasPieN:                parsedCC.cuotasPieN,
    cuotonPct:                 parsedCC.cuotonPct || 0,
    piePeriodoConstruccionPct: parsedCC.pieConstPct,
    pieCreditoDirectoPct:      parsedCC.creditoDirectoPct,
    plazoAnios:                PLAZO_DEFAULT,
    tasasCAE:                  CAE_OPTIONS,
    valorUF:                   store.UF,
    tipoCalculoBono:           regla.tipoCalculoBono,
    pieConjuntosPct:           regla.pieConjuntosPct,
    arriendosMensualesCLP:     [0, 0, 0],
    plusvaliaAnual:            0.02,
  }

  const result = calcularCotizacion(input)

  // Sprint 2: loguear a consola para verificación
  console.log('[Cotizador] InputCotizacion:', input)
  console.log('[Cotizador] Resultado:', result)

  // Mientras Sprint 3 no tenga panel propio: abrir calculadora básica con valor de venta
  const label = [
    `${project.nombre} DP ${depto.dp}`,
    ...secundarios.map(s => `${s.tipologia} DP ${s.dp}`),
  ].join(' + ')
  _openBasicCalc(result.valorVentaUF, label)
}

function _openBasicCalc(uf, label) {
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
  const pieUF    = precioUF * piePct / 100
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

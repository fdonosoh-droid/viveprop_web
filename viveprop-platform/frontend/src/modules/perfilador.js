import { store } from '../state/store.js';
import { fmt } from '../utils/format.js';

let _perfilMax = null;

export function calcPerfil() {
  const renta  = parseFloat(document.getElementById('p-renta').value) || 0;
  const ahorro = parseFloat(document.getElementById('p-ahorro').value) || 0;
  const deudas = parseFloat(document.getElementById('p-deudas').value) || 0;
  const plazo  = parseFloat(document.getElementById('p-plazo').value) || 25;
  const tasa   = parseFloat(document.getElementById('p-tasa').value) || 5;
  const res    = document.getElementById('p-results');
  document.getElementById('p-btns').style.display = 'none';

  if (!renta) {
    res.innerHTML = `<div class="empty-tool"><div class="ei">👤</div><p>Ingresa la renta líquida del cliente</p></div>`;
    return;
  }
  const r = tasa / 100 / 12, n = plazo * 12;
  const divMax = renta * 0.25 - deudas;
  if (divMax <= 0) {
    res.innerHTML = `<div class="warn-card">⚠️ Las deudas mensuales superan la capacidad de pago del 25% de la renta.</div>`;
    return;
  }
  const factor = (Math.pow(1+r,n) - 1) / (r * Math.pow(1+r,n));
  const creditoUF = divMax * factor / store.UF;
  const ahorroUF  = ahorro / store.UF;
  const precioMax = Math.min(creditoUF / 0.80, creditoUF + ahorroUF);
  const pieReq    = precioMax * 0.20;
  const pieFalta  = Math.max(0, pieReq - ahorroUF);
  _perfilMax = precioMax;

  const plazos = [15, 20, 25, 30];
  res.innerHTML = `<div class="perfil-card">
    <div class="rc-hero">
      <div class="rc-big">${fmt.uf(precioMax)}</div>
      <div class="rc-lbl">Precio máximo de propiedad</div>
      <div class="rc-pesos">${fmt.pesos(precioMax * store.UF)}</div>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><span class="rcv">${fmt.pesos(divMax)}</span><span class="rcl">Dividendo máximo / mes</span></div>
      <div class="rc-cell"><span class="rcv">${fmt.uf(creditoUF)}</span><span class="rcl">Crédito hipotecario máx.</span></div>
      <div class="rc-cell"><span class="rcv">${fmt.uf(pieReq)}</span><span class="rcl">Pie requerido (20%)</span></div>
      <div class="rc-cell ${pieFalta > 0 ? 'warn' : 'ok'}">
        <span class="rcv">${pieFalta > 0 ? '⚠️ Faltan ' + fmt.uf(pieFalta) : '✅ Ahorro suficiente'}</span>
        <span class="rcl">${fmt.uf(ahorroUF)} disponible</span>
      </div>
    </div>
    <div class="rc-tbl-title">Simulación por plazo · Tasa ${tasa}% anual</div>
    <table class="rctbl">
      <thead><tr><th>Plazo</th><th>Dividendo/mes</th><th>Crédito máx.</th><th>Precio máx.</th></tr></thead>
      <tbody>${plazos.map(py => {
        const nn = py * 12;
        const ff = (Math.pow(1+r,nn) - 1) / (r * Math.pow(1+r,nn));
        const crd = divMax * ff / store.UF;
        const pm  = Math.min(crd / 0.80, crd + ahorroUF);
        return `<tr class="${py == plazo ? 'tr-hl' : ''}"><td>${py} años</td><td>${fmt.pesos(divMax)}</td><td>${fmt.uf(crd)}</td><td><strong>${fmt.uf(pm)}</strong></td></tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
  document.getElementById('p-btns').style.display = 'flex';
}

export function searchFromPerfil(mod) {
  if (!_perfilMax) return;
  if (mod === 'sec') {
    window._secMaxUF = _perfilMax;
    window.secFilter();
    window.openModule('sec');
    showBudgetBanner('sec');
  } else {
    window._priMaxUF = _perfilMax;
    window.priFilter();
    window.openModule('pri');
    showBudgetBanner('pri');
  }
}

export function showBudgetBanner(mod) {
  document.getElementById('bb-' + mod)?.remove();
  const b = document.createElement('div');
  b.id = 'bb-' + mod;
  b.className = 'filter-strip';
  b.style.cssText = 'background:#FFFBEB;border-bottom:1px solid #FCD34D;';
  b.innerHTML = `<span style="font-size:13px;color:#92400E">👤 Filtrando por presupuesto: <strong>${fmt.uf(_perfilMax)}</strong></span>
    <button class="btn-clear-budget" onclick="clearBudget('${mod}')">✕ Limpiar filtro</button>`;
  const m = document.getElementById('mod-' + mod);
  m.insertBefore(b, m.querySelector('.filter-strip'));
}

export function clearBudget(mod) {
  if (mod === 'sec') { window._secMaxUF = null; window.secFilter(); }
  else               { window._priMaxUF = null; window.priFilter(); }
  document.getElementById('bb-' + mod)?.remove();
}

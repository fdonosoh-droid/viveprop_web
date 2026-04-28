import { store, PER_PAGE } from '../state/store.js';
import { H, fmt, isExtra } from '../utils/format.js';
import { mcBuild, mcGetSelected } from '../components/filters.js';
import { initPriMapG, renderPriMapG, priMapShow, getPriMapG, setPriViewRef } from '../components/map.js';
import { cotizFromProp } from './cotizador.js';

const PRI_PER_PAGE = PER_PAGE;
const CC_INMOBS = ['INGEVEC', 'RVC', 'TOCTOC', 'URMENETA', 'MAESTRA'];

let priFilt = [], priMaxUF = null, priPg = 1, priView = 'lista';
let _currentProject = null, _selectedUnit = null;
let _pmGalPhotos = [], _pmGalIdx = 0;

function getCCFiles(inmob) {
  if (!inmob) return [];
  return CC_INMOBS.some(k => inmob.toUpperCase().includes(k)) ? [1] : [];
}

export function priInit() {
  if (!store.PROJECTS.length) {
    document.getElementById('pri-grid').innerHTML =
      `<div class="empty-g"><div class="eg-ico">🏗️</div><p>No se pudo cargar los proyectos. Verificar backend.</p></div>`;
    return;
  }
  const comunas = [...new Set(store.PROJECTS.map(p => p.comuna).filter(Boolean))].sort();
  mcBuild('pri', comunas);
  document.getElementById('pri-mc-input').addEventListener('blur', () => window.mcClose('pri'));
  priFilter();
}

export function priFilter() {
  if (!store.PROJECTS.length) return;
  const q          = (document.getElementById('pri-search')?.value || '').toLowerCase();
  const comunas    = mcGetSelected('pri');
  const ent        = document.getElementById('pri-entrega')?.value || '';
  const pmin       = parseFloat(document.getElementById('pri-precio-min')?.value) || 0;
  const pmax       = parseFloat(document.getElementById('pri-precio-max')?.value) || 0;
  const activeDorm = [...document.querySelectorAll('[data-grp="pri-dorm"].active')].map(b => parseInt(b.dataset.val));
  const activeBanos = [...document.querySelectorAll('[data-grp="pri-bano"].active')].map(b => parseInt(b.dataset.val));
  const priEst     = document.getElementById('pri-est')?.checked || false;
  const priBod     = document.getElementById('pri-bod')?.checked || false;
  priMaxUF         = window._priMaxUF || null;

  priFilt = store.PROJECTS.filter(p => {
    let disp = (p.unidades || []).filter(u => u.disponible && !isExtra(u.tipologia));
    if (!disp.length) return false;
    if (q && !`${p.nombre || ''} ${p.inmobiliaria || ''} ${p.comuna || ''}`.toLowerCase().includes(q)) return false;
    if (comunas.size && !comunas.has(p.comuna)) return false;
    if (ent && !p.entrega?.toLowerCase().includes(ent.toLowerCase())) return false;
    if (priEst && !(p.unidades || []).some(u => u.disponible && /estac|parking|reja/i.test(u.tipologia || ''))) return false;
    if (priBod && !(p.unidades || []).some(u => u.disponible && /bode/i.test(u.tipologia || ''))) return false;
    if (activeDorm.length) {
      disp = disp.filter(u => { const nd = parseInt(u.dormitorios) || 0; return activeDorm.some(d => d === 4 ? nd >= 4 : nd === d); });
      if (!disp.length) return false;
    }
    if (activeBanos.length) {
      disp = disp.filter(u => { const nb = parseInt(u.banos) || 0; return activeBanos.some(b => b === 3 ? nb >= 3 : nb === b); });
      if (!disp.length) return false;
    }
    const desde = Math.min(...disp.map(u => u.precio_uf).filter(x => x > 0));
    if (pmin && desde < pmin) return false;
    if (pmax && desde > pmax) return false;
    if (priMaxUF && !disp.some(u => u.precio_uf <= priMaxUF)) return false;
    return true;
  });
  priPg = 1;
  priRender();
  if (priView === 'mapa') renderPriMapG(priFilt);
}

export function priPage(d) {
  const pages = Math.max(1, Math.ceil(priFilt.length / PRI_PER_PAGE));
  priPg = Math.min(Math.max(1, priPg + d), pages);
  priRender();
  document.getElementById('pri-gondola-wrap').scrollTop = 0;
}

export function priRender() {
  const grid  = document.getElementById('pri-grid');
  const total = priFilt.length;
  const pages = Math.max(1, Math.ceil(total / PRI_PER_PAGE));
  if (priPg > pages) priPg = pages;
  document.getElementById('pri-count').textContent = `${total.toLocaleString('es-CL')} proyecto${total !== 1 ? 's' : ''}`;
  document.getElementById('pri-pager').textContent = `Pág. ${priPg} / ${pages}`;
  document.getElementById('pri-prev').disabled = priPg <= 1;
  document.getElementById('pri-next').disabled = priPg >= pages;

  const pillEl = document.getElementById('tb-stats');
  if (pillEl) pillEl.textContent = `${total.toLocaleString('es-CL')} proyectos · ${store.PROJECTS.length.toLocaleString('es-CL')} total`;

  if (!total) {
    grid.innerHTML = `<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin proyectos para los filtros seleccionados</p></div>`;
    return;
  }
  const slice = priFilt.slice((priPg - 1) * PRI_PER_PAGE, priPg * PRI_PER_PAGE);
  grid.innerHTML = slice.map(p => {
    const dispMain = (p.unidades || []).filter(u => u.disponible && !isExtra(u.tipologia));
    const precios  = dispMain.map(u => u.precio_uf).filter(x => x > 0);
    const desde    = precios.length ? Math.min(...precios) : 0;
    const hasta    = precios.length ? Math.max(...precios) : 0;
    const portada  = p.foto_portada || '';
    const tips     = [...new Set(dispMain.map(u => {
      const d = parseInt(u.dormitorios) || 0;
      return d === 0 ? 'Estudio' : d + 'D';
    }))].sort().slice(0, 3).join(', ');
    const m2min = dispMain.reduce((a, u) => u.m2_interior && u.m2_interior < a ? u.m2_interior : a, 9999);
    const m2str = m2min < 9999 ? m2min.toFixed(0) + ' m²' : '—';
    const hasCC = store.CC_DATA[p.id] || getCCFiles(p.inmobiliaria).length;
    return `<div class="proj-card" onclick="openProject('${H(p.id)}')">
      <div class="prj-img" style="${portada ? `background-image:url('${portada}');background-size:cover;background-position:center` : ''}">
        ${!portada ? `<div class="prj-img-icon">🏗️</div>` : ''}
        <span class="prj-badge">Nuevo</span>
        ${p.entrega ? `<span class="prj-entrega">${H(p.entrega)}</span>` : ''}
      </div>
      <div class="prj-body">
        <div class="prj-row1">
          <div class="prj-name">${H(p.nombre)}</div>
          <span class="prj-new-badge">${dispMain.length} uds</span>
        </div>
        <div class="prj-sub">${H(p.inmobiliaria || '—')}${p.comuna ? ' · ' + H(p.comuna) : ''}</div>
        ${p.direccion ? `<div class="prj-addr">📍 ${H(p.direccion)}</div>` : '<div style="margin-bottom:9px"></div>'}
        <div class="prj-stats">
          <div class="prj-stat"><div class="prj-stat-v">${tips || '—'}</div><div class="prj-stat-l">Tipología</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${m2str}</div><div class="prj-stat-l">M² desde</div></div>
          <div class="prj-stat"><div class="prj-stat-v">${dispMain.length}</div><div class="prj-stat-l">Disponibles</div></div>
        </div>
        <div class="prj-price-row">
          <span class="prj-uf">${desde ? 'UF ' + desde.toLocaleString('es-CL', { maximumFractionDigits: 0 }) : '—'}</span>
          ${hasta > desde ? `<span class="prj-hasta">— ${hasta.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>` : ''}
        </div>
        <div class="prj-actions">
          <button class="btn-ficha-card" onclick="event.stopPropagation();openProject('${H(p.id)}')">Ver proyecto →</button>
          ${hasCC ? `<span class="prj-cc-badge">📋 Cond. Com.</span>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

export function setPriView(v) {
  priView = v;
  setPriViewRef(v);
  document.getElementById('pri-btn-lista').classList.toggle('active', v === 'lista');
  document.getElementById('pri-btn-mapa').classList.toggle('active', v === 'mapa');
  const gw = document.getElementById('pri-gondola-wrap');
  const mw = document.getElementById('pri-map-wrap');
  const pw = document.getElementById('pri-pager-wrap');
  gw.style.display = v === 'lista' ? '' : 'none';
  mw.style.display = v === 'mapa' ? 'flex' : 'none';
  if (pw) pw.style.display = v === 'lista' ? 'flex' : 'none';
  if (v === 'mapa') {
    initPriMapG();
    const m = getPriMapG();
    setTimeout(() => m && m.invalidateSize(), 120);
    renderPriMapG(priFilt);
  }
}

export function pmTab(name) {
  ['gal', 'map', 'units', 'cc'].forEach(t => {
    const tab  = document.getElementById('pm-tab-' + t);
    const pane = document.getElementById('pm-pane-' + t);
    if (tab)  tab.classList.toggle('active', t === name);
    if (pane) pane.style.display = t === name ? 'flex' : 'none';
  });
  if (name === 'map') priMapShow(_currentProject);
}

function renderProjSummary(p) {
  const all      = p.unidades || [];
  const dispMain = all.filter(u => u.disponible && !isExtra(u.tipologia));
  const precios  = dispMain.map(u => u.precio_uf).filter(x => x > 0);
  const desde    = precios.length ? Math.min(...precios) : 0;
  const hasta    = precios.length ? Math.max(...precios) : 0;
  const m2vals   = dispMain.map(u => u.m2_interior).filter(x => x > 0);
  const m2min    = m2vals.length ? Math.min(...m2vals) : 0;
  const m2max    = m2vals.length ? Math.max(...m2vals) : 0;
  const tips     = [...new Set(dispMain.map(u => { const d = parseInt(u.dormitorios) || 0; return d === 0 ? 'Estudio' : d + 'D'; }))].sort();
  const uf       = v => v.toLocaleString('es-CL', { maximumFractionDigits: 0 });
  const precioStr = desde ? (hasta > desde ? `UF ${uf(desde)} – ${uf(hasta)}` : `UF ${uf(desde)}`) : ' — ';
  const m2Str    = m2min ? (m2max > m2min ? `${m2min.toFixed(0)} – ${m2max.toFixed(0)} m²` : `${m2min.toFixed(0)} m²`) : ' — ';

  const addr = [p.direccion, p.comuna].filter(Boolean).join(', ');
  let html = '';
  if (addr) {
    html += `<div class="pm-addr-bar">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <span>${H(addr)}</span>
      ${p.entrega ? `<span style="margin-left:auto;background:#E0E7FF;color:#3D3EA8;border-radius:4px;padding:1px 7px;font-size:10px;font-weight:700">${H(p.entrega)}</span>` : ''}
    </div>`;
  }

  html += `<div class="pm-stats-grid">
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Disponibles</span>
      <span class="pm-stat-card-val">${dispMain.length}</span>
      <span class="pm-stat-card-sub">unidades</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Tipologías</span>
      <span class="pm-stat-card-val" style="font-size:${tips.length > 3 ? '11px' : '15px'}">${tips.join(', ') || '—'}</span>
      <span class="pm-stat-card-sub">${tips.length} tipo${tips.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">M² útil</span>
      <span class="pm-stat-card-val" style="font-size:${m2max > m2min ? '11px' : '15px'}">${m2Str}</span>
      <span class="pm-stat-card-sub">${m2min ? 'interior' : ''}</span>
    </div>
    <div class="pm-stat-card">
      <span class="pm-stat-card-lbl">Precio</span>
      <span class="pm-stat-card-val" style="font-size:${hasta > desde ? '11px' : '15px'}">${precioStr}</span>
      <span class="pm-stat-card-sub">${desde ? 'en UF' : ''}</span>
    </div>
  </div>`;

  const pisos   = [...new Set(dispMain.map(u => parseInt(u.piso)).filter(x => x > 0))].sort((a, b) => a - b);
  const orients = [...new Set(dispMain.map(u => (u.orientacion || '').trim()).filter(Boolean))];
  const terrazas = dispMain.map(u => u.m2_terraza).filter(x => x > 0);
  const pills = [];
  if (pisos.length > 0) {
    const pisStr = pisos.length === 1 ? `Piso ${pisos[0]}` : `Pisos ${pisos[0]} – ${pisos[pisos.length - 1]}`;
    pills.push(`<div class="pm-detail-pill"><strong>${pisStr}</strong></div>`);
  }
  if (orients.length > 0) {
    pills.push(`<div class="pm-detail-pill">🧭 <strong>${orients.slice(0, 3).join(' · ')}</strong></div>`);
  }
  if (terrazas.length > 0) {
    const tMin = Math.min(...terrazas).toFixed(0);
    pills.push(`<div class="pm-detail-pill">🌿 Terraza desde <strong>${tMin} m²</strong></div>`);
  }
  if (pills.length) {
    html += `<div class="pm-detail-row">${pills.join('')}</div>`;
  }

  const estac     = all.filter(u => isExtra(u.tipologia) && /estac|parking/i.test(u.tipologia || ''));
  const bodeg     = all.filter(u => isExtra(u.tipologia) && /bode/i.test(u.tipologia || ''));
  const dispEstac = estac.filter(u => u.disponible);
  const dispBodeg = bodeg.filter(u => u.disponible);
  const extrasCards = [];
  if (estac.length > 0) {
    const pEstac = dispEstac.map(u => u.precio_uf).filter(x => x > 0);
    const pMinE  = pEstac.length ? Math.min(...pEstac) : 0;
    extrasCards.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">🅿️</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Estacionamiento</span>
        <span class="pm-extra-val">${dispEstac.length} disp.</span>
        <span class="pm-extra-sub">${pMinE ? `Desde UF ${uf(pMinE)}` : `${estac.length} en total`}</span>
      </div>
    </div>`);
  }
  if (bodeg.length > 0) {
    const pBodeg = dispBodeg.map(u => u.precio_uf).filter(x => x > 0);
    const pMinB  = pBodeg.length ? Math.min(...pBodeg) : 0;
    extrasCards.push(`<div class="pm-extra-card">
      <span class="pm-extra-ico">📦</span>
      <div class="pm-extra-info">
        <span class="pm-extra-lbl">Bodega</span>
        <span class="pm-extra-val">${dispBodeg.length} disp.</span>
        <span class="pm-extra-sub">${pMinB ? `Desde UF ${uf(pMinB)}` : `${bodeg.length} en total`}</span>
      </div>
    </div>`);
  }
  if (extrasCards.length) {
    html += `<div class="pm-extras-row">${extrasCards.join('')}</div>`;
  }

  const cc = store.CC_DATA[p.id];
  if (cc && cc.campos && cc.campos.length) {
    const PRIO = ['Dcto. depto.', 'Descuento Base', 'Reserva', 'Valor reserva', 'Tipo de entrega', 'Pie período const.', '% cuotas const.', 'Cuotas pie', 'Financiamiento', 'Descuento RVC', 'Bono pie', 'Descuento'];
    const preview = [];
    for (const lbl of PRIO) {
      const found = cc.campos.find(([l]) => l === lbl);
      if (found) preview.push(found);
      if (preview.length === 6) break;
    }
    if (preview.length < 6) cc.campos.filter(([l]) => !preview.find(([pl]) => pl === l)).slice(0, 6 - preview.length).forEach(f => preview.push(f));
    html += `<div class="pm-cc-preview">
      <div class="pm-cc-preview-hdr">
        <span class="pm-cc-preview-title">📋 Condiciones Comerciales</span>
        <button class="pm-cc-preview-link" onclick="pmTab('cc')">Ver completo →</button>
      </div>
      <div class="pm-cc-preview-grid">
        ${preview.map(([lbl, val]) => `<div class="pm-cc-prev-field">
          <span class="pm-cc-prev-lbl">${H(lbl)}</span>
          <span class="pm-cc-prev-val">${H(val)}</span>
        </div>`).join('')}
      </div>
      ${cc.nota ? `<div class="pm-cc-nota">${H(cc.nota)}</div>` : ''}
    </div>`;
  }

  document.getElementById('pm-proj-summary').innerHTML = html;
}

export function renderCC(pid) {
  const inner = document.getElementById('pm-cc-inner');
  const d = store.CC_DATA[pid] || null;
  if (!d) {
    inner.innerHTML = `<p class="pm-cc-empty">Sin condiciones comerciales disponibles para este proyecto.</p>`;
    return;
  }
  let html = `<div class="pm-cc-titulo">${H(d.titulo || 'Condiciones Comerciales')}</div>`;
  if (d.campos && d.campos.length) {
    const short = d.campos.filter(([, v]) => v.length <= 60);
    const long  = d.campos.filter(([, v]) => v.length > 60);
    if (short.length) {
      html += `<div class="pm-cc-section-lbl">Condiciones de venta</div>`;
      html += `<div class="pm-cc-grid">`;
      short.forEach(([lbl, val]) => {
        html += `<div class="pm-cc-field"><span class="pm-cc-lbl">${H(lbl)}</span><span class="pm-cc-val">${H(val)}</span></div>`;
      });
      html += `</div>`;
    }
    if (long.length) {
      html += `<div class="pm-cc-section-lbl">Información adicional</div>`;
      long.forEach(([lbl, val]) => {
        html += `<div style="margin-bottom:8px;background:#F7F8FC;border-radius:8px;padding:9px 12px">`;
        html += `<div class="pm-cc-lbl">${H(lbl)}</div>`;
        html += `<div class="pm-cc-val-long">${H(val)}</div>`;
        html += `</div>`;
      });
    }
  }
  if (d.tabla) {
    html += `<div class="pm-cc-section-lbl">${d.tabla.headers[0] === 'Tipología' ? 'Tipologías' : 'Oportunidades'}</div>`;
    html += `<table class="pm-cc-tbl"><thead><tr>`;
    d.tabla.headers.forEach(h => { html += `<th>${H(h)}</th>`; });
    html += `</tr></thead><tbody>`;
    d.tabla.rows.forEach(row => {
      html += `<tr>`;
      row.forEach(cell => { html += `<td>${H(cell || '—')}</td>`; });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
  }
  if (d.nota) {
    html += `<div style="margin-top:14px;background:#EEF2FF;border-left:3px solid #3D3EA8;padding:9px 12px;border-radius:0 8px 8px 0;font-size:11.5px;color:#3D3EA8;line-height:1.5">${H(d.nota)}</div>`;
  }
  inner.innerHTML = html;
}

export function openProject(pid) {
  const p = store.PROJECTS.find(x => x.id === pid);
  if (!p) return;
  _currentProject = p;
  _selectedUnit   = null;

  document.getElementById('pm-title').textContent = p.nombre;
  document.getElementById('pm-sub').textContent =
    [p.inmobiliaria, p.comuna, p.entrega ? 'Entrega ' + p.entrega : ''].filter(Boolean).join(' · ');

  pmTab('gal');
  renderProjSummary(p);

  _pmGalPhotos = p.fotos || [];
  _pmGalIdx = 0;
  const gImg   = document.getElementById('pm-gal-img');
  const gSpin  = document.getElementById('pm-gal-spin');
  const gNo    = document.getElementById('pm-gal-nophoto');
  const gThumb = document.getElementById('pm-gal-thumbs');
  const gCount = document.getElementById('pm-gal-counter');
  gSpin.style.display = 'none';
  if (_pmGalPhotos.length) {
    gNo.style.display = 'none';
    pmShowGalPhoto(0);
    gThumb.innerHTML = _pmGalPhotos.map((src, i) =>
      `<img src="${src}" onclick="pmShowGalPhoto(${i})" ${i === 0 ? 'class="active"' : ''}>`
    ).join('');
  } else {
    gImg.style.display = 'none';
    gNo.style.display = 'flex';
    gThumb.innerHTML = '';
    gCount.style.display = 'none';
    document.getElementById('pm-gal-prev').disabled = true;
    document.getElementById('pm-gal-next').disabled = true;
  }

  const pdfs = p.pdfs || [];
  document.getElementById('pm-pdf-list').innerHTML = pdfs.length
    ? pdfs.map(f => `<a class="pm-pdf-item" href="${f.path}" target="_blank" rel="noopener">
        <span class="pm-pdf-icon">📄</span>
        <span class="pm-pdf-name">${H(f.nombre)}</span>
        <span style="font-size:11px;color:var(--g400);flex-shrink:0">Abrir →</span>
      </a>`).join('')
    : '';

  const ccTab    = document.getElementById('pm-tab-cc');
  const hasCC    = store.CC_DATA[p.id];
  const hasCCFiles = getCCFiles(p.inmobiliaria).length > 0;
  if (hasCC || hasCCFiles) {
    ccTab.style.display = '';
    renderCC(p.id);
  } else {
    ccTab.style.display = 'none';
  }

  const dispMain = (p.unidades || []).filter(u => u.disponible && !isExtra(u.tipologia));
  document.getElementById('pm-units-body').innerHTML = dispMain.map(u => `
    <tr>
      <td>${H(u.dp)}</td>
      <td>${H(u.tipologia)}</td>
      <td>${H(u.piso || '—')}</td>
      <td>${u.m2_interior ? u.m2_interior.toFixed(1) + ' m²' : '—'}</td>
      <td>${u.m2_terraza ? u.m2_terraza.toFixed(1) + ' m²' : '—'}</td>
      <td>${H(u.orientacion || '—')}</td>
      <td class="td-precio">${fmt.uf(u.precio_uf)}</td>
      <td><button class="btn-elegir" onclick="selectProjUnit('${H(u.dp)}')">Elegir</button></td>
    </tr>`).join('') || '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--g400)">Sin unidades disponibles</td></tr>';

  document.getElementById('pm-step1').style.display = '';
  document.getElementById('pm-step2').classList.remove('visible');
  document.getElementById('proj-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function pmShowGalPhoto(i) {
  _pmGalIdx = Math.max(0, Math.min(i, _pmGalPhotos.length - 1));
  const img = document.getElementById('pm-gal-img');
  img.src = _pmGalPhotos[_pmGalIdx];
  img.style.display = 'block';
  const cnt = document.getElementById('pm-gal-counter');
  cnt.style.display = 'block';
  cnt.textContent = `${_pmGalIdx + 1} / ${_pmGalPhotos.length}`;
  document.getElementById('pm-gal-prev').disabled = _pmGalIdx === 0;
  document.getElementById('pm-gal-next').disabled = _pmGalIdx === _pmGalPhotos.length - 1;
  document.querySelectorAll('#pm-gal-thumbs img').forEach((t, j) => t.classList.toggle('active', j === _pmGalIdx));
  document.getElementById('pm-gal-thumbs').children[_pmGalIdx]?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
}

export function pmGalNav(d) { pmShowGalPhoto(_pmGalIdx + d); }

export function closeProjModal() {
  document.getElementById('proj-modal').classList.remove('open');
  document.body.style.overflow = '';
  _currentProject = null;
  _selectedUnit   = null;
}

export function selectProjUnit(dp) {
  const p = _currentProject;
  const u = (p.unidades || []).find(x => x.dp === dp);
  if (!u) return;
  _selectedUnit = u;
  document.getElementById('pm-sel-title').textContent =
    `DP ${u.dp} · ${u.tipologia}${u.piso ? ' · Piso ' + u.piso : ''}`;
  document.getElementById('pm-sel-detail').textContent =
    [u.m2_interior ? u.m2_interior.toFixed(1) + ' m² útil' : '',
     u.m2_terraza  ? u.m2_terraza.toFixed(1)  + ' m² terraza' : '',
     u.orientacion || ''].filter(Boolean).join(' · ');
  const extras     = (p.unidades || []).filter(x => x.disponible && isExtra(x.tipologia));
  const extrasWrap = document.getElementById('pm-extras-wrap');
  const extrasList = document.getElementById('pm-extras-list');
  if (extras.length) {
    extrasWrap.style.display = '';
    extrasList.innerHTML = extras.map(e => `
      <label class="extra-row" onclick="pmUpdateTotal()">
        <input type="checkbox" value="${e.precio_uf}" data-dp="${H(e.dp)}" data-label="${H(e.tipologia)} DP ${H(e.dp)}">
        <span class="extra-label">${H(e.tipologia)} — DP ${H(e.dp)}</span>
        <span class="extra-price">${fmt.uf(e.precio_uf)}</span>
      </label>`).join('');
  } else {
    extrasWrap.style.display = 'none';
    extrasList.innerHTML = '';
  }
  pmUpdateTotal();
  document.getElementById('pm-step1').style.display = 'none';
  document.getElementById('pm-step2').classList.add('visible');
}

export function pmUpdateTotal() {
  if (!_selectedUnit) return;
  let total = _selectedUnit.precio_uf || 0;
  document.querySelectorAll('#pm-extras-list input[type=checkbox]:checked').forEach(cb => {
    total += parseFloat(cb.value) || 0;
  });
  document.getElementById('pm-total-val').textContent = fmt.uf(total);
}

export function pmBack() {
  document.getElementById('pm-step1').style.display = '';
  document.getElementById('pm-step2').classList.remove('visible');
  _selectedUnit = null;
}

export function pmCotizar() {
  if (!_selectedUnit || !_currentProject) return;
  let total = _selectedUnit.precio_uf || 0;
  const labels = [`${_currentProject.nombre} DP ${_selectedUnit.dp}`];
  document.querySelectorAll('#pm-extras-list input[type=checkbox]:checked').forEach(cb => {
    total += parseFloat(cb.value) || 0;
    labels.push(cb.dataset.label);
  });
  closeProjModal();
  cotizFromProp(total, labels.join(' + '));
}

export function toggleDormPill(btn) { btn.classList.toggle('active'); priFilter(); }

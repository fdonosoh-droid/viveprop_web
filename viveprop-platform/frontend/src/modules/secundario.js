import { store, PER_PAGE } from '../state/store.js';
import { H, parseNum, fmt, eLbl, estadoBadgeStyle, parseTipologia, estadoMatch } from '../utils/format.js';
import { mcBuild, mcGetSelected } from '../components/filters.js';
import { proxyImg, initMap, getSecMap, renderMap, setSecViewRef } from '../components/map.js';

let secFilt = [], secPg = 1, secView = 'lista';
let _cardPhotoCache = {}, _cardImgObserver = null;
let dpPhotos = [], dpIdx = 0, currentProp = null, currentApiData = null;
let _currentVideoUrl = '';

// Exponer estado al perfilador
export function setSecMaxUF(v) { window._secMaxUF = v; }
export function getSecMaxUF()  { return window._secMaxUF || null; }

export function secInit() {
  if (!store.STOCK.length) {
    document.getElementById('sec-grid').innerHTML =
      `<div class="empty-g"><div class="eg-ico">⚠️</div><p>No se pudo cargar el stock. Verificar backend.</p></div>`;
    return;
  }
  const comunas = [...new Set(store.STOCK.map(p => p.comuna).filter(Boolean))].sort();
  mcBuild('sec', comunas);
  document.getElementById('sec-mc-input').addEventListener('blur', () => window.mcClose('sec'));
  secFilter();
}

export function secFilter() {
  if (!store.STOCK.length) return;
  const q          = (document.getElementById('sec-search')?.value || document.getElementById('sec-search-top')?.value || '').toLowerCase();
  const comunas    = mcGetSelected('sec');
  const pmin       = parseFloat(document.getElementById('sec-precio-min')?.value) || 0;
  const pmax       = parseFloat(document.getElementById('sec-precio-max')?.value) || 0;
  const op         = document.getElementById('sec-op')?.checked || false;
  const est        = document.getElementById('sec-est')?.checked || false;
  const bod        = document.getElementById('sec-bod')?.checked || false;
  const activeDorms = [...document.querySelectorAll('[data-grp="sec-dorm"].active')].map(b => parseInt(b.dataset.val));
  const activeBanos = [...document.querySelectorAll('[data-grp="sec-bano"].active')].map(b => parseInt(b.dataset.val));
  const cbAll      = [...document.querySelectorAll('.sec-estado-cb')];
  const checkedVals = cbAll.filter(c => c.checked).map(c => c.value);
  const allChecked  = checkedVals.length === cbAll.length;
  const secMaxUF    = window._secMaxUF || null;
  const needsBonoPie = window._perfilNeedsBonoPie || false;

  secFilt = store.STOCK.filter(p => {
    if (q && !`${p.condominio||''} ${p.direccion||''} ${p.comuna||''}`.toLowerCase().includes(q)) return false;
    if (comunas.size && !comunas.has(p.comuna)) return false;
    if (op && !p.oportunidad) return false;
    if (est && (!p.est || p.est === '0')) return false;
    if (bod && (!p.bod || p.bod === '0')) return false;
    if (!allChecked) { if (!checkedVals.some(v => estadoMatch(p.estado, v))) return false; }
    const { dorm, banos } = parseTipologia(p.tipologia);
    if (activeDorms.length && !activeDorms.some(d => d === 4 ? dorm >= 4 : dorm === d)) return false;
    if (activeBanos.length && !activeBanos.some(b => b === 3 ? banos >= 3 : banos === b)) return false;
    const uf = parseFloat((p.precioSinBono || '0').replace(/\./g, '').replace(',', '.'));
    if (pmin && uf < pmin) return false;
    if (pmax && uf > pmax) return false;
    if (secMaxUF && uf > secMaxUF) return false;
    if (needsBonoPie && !(p.bonoPct > 0)) return false;
    return true;
  });
  secPg = 1;
  if (secView === 'mapa') renderMap(secFilt);
  else secRender();
}

export function secRender() {
  const grid  = document.getElementById('sec-grid');
  const total = secFilt.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (secPg > pages) secPg = pages;
  document.getElementById('sec-count').textContent = `${total.toLocaleString('es-CL')} propiedad${total !== 1 ? 'es' : ''}`;
  document.getElementById('sec-pager').textContent = `Pág. ${secPg} / ${pages}`;
  document.getElementById('sec-prev').disabled = secPg <= 1;
  document.getElementById('sec-next').disabled = secPg >= pages;
  const totalStock  = store.STOCK.length;
  const dispCount   = store.STOCK.filter(p => (p.estado || '').toLowerCase().includes('lista para arrendar')).length;
  const pillEl = document.getElementById('tb-stats');
  if (pillEl) pillEl.textContent = `${dispCount.toLocaleString('es-CL')} disponibles · ${totalStock.toLocaleString('es-CL')} total`;

  const slice = secFilt.slice((secPg - 1) * PER_PAGE, secPg * PER_PAGE);
  if (!slice.length) {
    grid.innerHTML = `<div class="empty-g"><div class="eg-ico">🔍</div><p>Sin propiedades para los filtros seleccionados</p></div>`;
    return;
  }
  grid.innerHTML = slice.map(p => {
    const uf = parseFloat((p.precioSinBono || '0').replace(/\./g, '').replace(',', '.'));
    const bono = p.bonoPct > 0;
    const m2   = p.m2interior || p.m2total || '—';
    const orient = p.orientacion && p.orientacion !== '-' ? p.orientacion : '—';
    const estadoLbl   = eLbl(p.estado);
    const estadoStyle = estadoBadgeStyle(p.estado);
    return `<div class="prop-card">
      <div class="pc-img" id="pcimg-${p.id}">
        <div class="pc-img-icon">🏢</div>
        ${p.video ? `<div class="pc-vid-badge">▶ Video</div>` : ''}
        <div class="pc-foto-count" id="pcfc-${p.id}" style="display:none"></div>
      </div>
      <div class="pc-body">
        <div class="pc-row1">
          <div class="pc-name">${H(p.condominio)}</div>
          <div class="pc-estado-badge" style="${estadoStyle}">${estadoLbl}</div>
        </div>
        <div class="pc-sub">DP ${H(p.dp || '—')} · ${H(p.comuna || '—')}</div>
        <div class="pc-addr">📍 ${H(p.direccion || '—')}</div>
        <div class="pc-stats">
          <div class="pc-stat"><div class="pc-stat-v">${H(p.tipologia || '—')}</div><div class="pc-stat-l">Tipo</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${H(m2)} m²</div><div class="pc-stat-l">Superficie</div></div>
          <div class="pc-stat"><div class="pc-stat-v">${H(orient)}</div><div class="pc-stat-l">Orient.</div></div>
        </div>
        <div class="pc-price-row">
          <span class="pc-uf">${uf ? 'UF ' + uf.toLocaleString('es-CL', {maximumFractionDigits:0}) : '—'}</span>
          ${bono ? `<span class="pc-bono-badge">✅ Bono ${p.bonoPct}%</span>` : ''}
        </div>
        <div class="pc-actions">
          <button class="btn-ficha-card" onclick="openSecDetail('${H(p.id)}')">Ver ficha →</button>
          ${p.video ? `<button class="btn-video-card" onclick="event.stopPropagation();openVideo('${H(p.video)}')">▶ Video</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('');

  if (_cardImgObserver) _cardImgObserver.disconnect();
  _cardImgObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id.replace('pcimg-', '');
      loadCardPhoto(id);
      _cardImgObserver.unobserve(e.target);
    });
  }, { rootMargin: '150px' });
  slice.forEach(p => {
    const el = document.getElementById('pcimg-' + p.id);
    if (el) _cardImgObserver.observe(el);
  });
}

async function loadCardPhoto(propId) {
  const el = document.getElementById('pcimg-' + propId);
  if (!el) return;
  if (_cardPhotoCache[propId]) { applyCardPhoto(el, _cardPhotoCache[propId]); return; }
  try {
    const json = await (await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${propId}?list=1`)).json();
    const d = json.data?.[0];
    const fotos = (d?.fotos_originales?.length ? d.fotos_originales : d?.fotos) || [];
    if (fotos.length) {
      _cardPhotoCache[propId] = fotos[0];
      const el2 = document.getElementById('pcimg-' + propId);
      if (el2) applyCardPhoto(el2, fotos[0], fotos.length);
    }
  } catch {}
}

function applyCardPhoto(el, url, fotoCount) {
  const clean = url.replace(/^https?:\/\//, '');
  const proxy = `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&output=jpg&q=75&w=400&h=200&fit=cover`;
  el.style.backgroundImage = `url('${proxy}')`;
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center';
  const icon = el.querySelector('.pc-img-icon');
  if (icon) icon.style.display = 'none';
  if (fotoCount > 1) {
    const idMatch = el.id.match(/pcimg-(.+)/);
    if (idMatch) {
      const fc = document.getElementById('pcfc-' + idMatch[1]);
      if (fc) { fc.textContent = '📷 ' + fotoCount; fc.style.display = ''; }
    }
  }
}

export function secPage(d) {
  const pages = Math.max(1, Math.ceil(secFilt.length / PER_PAGE));
  secPg = Math.min(Math.max(1, secPg + d), pages);
  secRender();
  document.getElementById('mod-sec').querySelector('.gondola-wrap').scrollTop = 0;
}

export function setSecView(v) {
  secView = v;
  setSecViewRef(v);
  document.getElementById('btn-lista').classList.toggle('active', v === 'lista');
  document.getElementById('btn-mapa').classList.toggle('active', v === 'mapa');
  const gw    = document.getElementById('sec-gondola-wrap');
  const mw    = document.getElementById('sec-map-wrap');
  const pager = document.querySelector('#mod-sec .pager');
  gw.style.display = v === 'lista' ? '' : 'none';
  mw.style.display = v === 'mapa' ? 'flex' : 'none';
  if (pager) pager.style.display = v === 'lista' ? 'flex' : 'none';
  if (v === 'mapa') {
    initMap();
    setTimeout(() => getSecMap().invalidateSize(), 120);
    renderMap(secFilt);
  }
}

// ── Detail Modal ────────────────────────────────────────────────────────────
export async function openDetail(id) {
  currentProp = store.STOCK.find(x => x.id === id) || null;
  if (!currentProp) return;
  document.getElementById('detail-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  dpPhotos = []; dpIdx = 0;
  document.getElementById('dp-nophoto')?.remove();
  document.getElementById('dp-img').style.display = 'none';
  document.getElementById('dp-spin').style.display = 'flex';
  document.getElementById('dp-counter').style.display = 'none';
  document.getElementById('dp-thumbs').innerHTML = '';
  document.getElementById('dp-prev').disabled = true;
  document.getElementById('dp-next').disabled = true;
  document.getElementById('detail-content').innerHTML =
    '<div style="color:var(--g500);text-align:center;padding:30px">Cargando información…</div>';
  const p = currentProp;
  try {
    const _json = await (await fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${p.id}?list=1`)).json();
    currentApiData = _json.data?.[0] || null;
  } catch { currentApiData = null; }
  const fotos = ((currentApiData?.fotos_originales?.length ? currentApiData.fotos_originales : currentApiData?.fotos) || []);
  if (fotos.length) {
    dpPhotos = fotos;
    document.getElementById('dp-spin').style.display = 'none';
    showDpPhoto(0);
    document.getElementById('dp-thumbs').innerHTML = fotos.map((u, i) => {
      const c = u.replace(/^https?:\/\//, '');
      return `<img src="https://images.weserv.nl/?url=${encodeURIComponent(c)}&output=jpg&q=70&w=120" onclick="showDpPhoto(${i})" ${i === 0 ? 'class="active"' : ''}>`;
    }).join('');
  } else {
    document.getElementById('dp-spin').style.display = 'none';
    const dp  = document.querySelector('.detail-photos');
    const msg = document.createElement('div');
    msg.id = 'dp-nophoto';
    msg.style.cssText = 'color:rgba(255,255,255,.4);font-size:14px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none';
    msg.textContent = 'Sin fotos disponibles';
    dp.appendChild(msg);
  }
  renderDetailContent(p, currentApiData);
}

export function openSecDetail(id) { openDetail(id); }

export function showDpPhoto(i) {
  dpIdx = Math.max(0, Math.min(i, dpPhotos.length - 1));
  const img   = document.getElementById('dp-img');
  const clean = dpPhotos[dpIdx].replace(/^https?:\/\//, '');
  img.src = `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&output=jpg&q=88&w=900`;
  img.style.display = 'block';
  document.getElementById('dp-counter').style.display = 'block';
  document.getElementById('dp-counter').textContent = `${dpIdx + 1} / ${dpPhotos.length}`;
  document.getElementById('dp-prev').disabled = dpIdx === 0;
  document.getElementById('dp-next').disabled = dpIdx === dpPhotos.length - 1;
  document.querySelectorAll('.dp-thumbs img').forEach((t, j) => t.classList.toggle('active', j === dpIdx));
  document.getElementById('dp-thumbs').children[dpIdx]?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
}

export function navDp(d) { showDpPhoto(dpIdx + d); }

function renderDetailContent(p, api) {
  const precio    = parseNum(p.precioSinBono);
  const m2t       = parseNum(p.m2total) || parseNum(api?.superficie);
  const m2i       = parseNum(p.m2interior) || parseNum(api?.m2_utiles);
  const m2terr    = parseNum(p.m2terraza) || parseNum(api?.m2_terraza);
  const dorms     = api?.dormitorios ?? '';
  const banios    = api?.banios ?? '';
  const piso      = api?.piso ?? '';
  const ggcc      = api?.unitggcc?.monto || api?.ggcc || '';
  const ytId      = api?.youtube_video_id || '';
  const espacios  = api?.espacios || '';
  const finishes  = api?.building_finishes || [];
  const oport     = (p.oportunidad || '').toLowerCase().includes('oportunidad');
  const amenitiesList = espacios ? espacios.split(',').map(s => s.trim()).filter(Boolean) : [];

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-top">
      <div>
        <div class="detail-title">${H(p.condominio || p.direccion || '—')}</div>
        <div class="detail-addr">📍 ${H(p.direccion || '—')} · ${H(p.comuna || '')}${p.dp ? ' · DP ' + H(p.dp) : ''}</div>
      </div>
      <div class="detail-badges">
        ${oport ? '<span style="background:#FEF3C7;color:#92400e;border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700">⭐ Oportunidad</span>' : ''}
      </div>
    </div>
    <div class="dt-section">Características</div>
    <div class="specs-grid">
      <div class="spec-card"><div class="sv">${H(p.tipologia || '—')}</div><div class="sl">Tipología</div></div>
      ${m2t ? `<div class="spec-card"><div class="sv">${m2t.toFixed(1)} m²</div><div class="sl">Sup. total</div></div>` : ''}
      ${m2i && m2i !== m2t ? `<div class="spec-card"><div class="sv">${m2i.toFixed(1)} m²</div><div class="sl">M² útiles</div></div>` : ''}
      ${m2terr ? `<div class="spec-card"><div class="sv">${m2terr.toFixed(1)} m²</div><div class="sl">Terraza</div></div>` : ''}
      ${dorms !== '' ? `<div class="spec-card"><div class="sv">${dorms} 🛏</div><div class="sl">Dormitorios</div></div>` : ''}
      ${banios !== '' ? `<div class="spec-card"><div class="sv">${banios} 🚿</div><div class="sl">Baños</div></div>` : ''}
      ${piso !== '' ? `<div class="spec-card"><div class="sv">Piso ${piso}</div><div class="sl">Nivel</div></div>` : ''}
      ${p.orientacion && p.orientacion !== '-' ? `<div class="spec-card"><div class="sv">${H(p.orientacion)}</div><div class="sl">Orientación</div></div>` : ''}
      ${p.est && p.est !== '0' ? `<div class="spec-card"><div class="sv">🚗 Incluido</div><div class="sl">Estacionamiento</div></div>` : ''}
      ${p.bod && p.bod !== '0' ? `<div class="spec-card"><div class="sv">📦 Incluida</div><div class="sl">Bodega</div></div>` : ''}
      ${p.anio ? `<div class="spec-card"><div class="sv">${H(p.anio)}</div><div class="sl">Año</div></div>` : ''}
      ${ggcc ? `<div class="spec-card"><div class="sv">$${Number(ggcc).toLocaleString('es-CL')}</div><div class="sl">Gastos comunes</div></div>` : ''}
    </div>
    <div class="dt-section">Precio y condición comercial</div>
    <div class="price-block">
      <div class="dp-price-card">
        <div class="pc-label">Precio sin bono pie</div>
        <div class="pc-value">${precio ? precio.toLocaleString('es-CL', {maximumFractionDigits:0}) + ' UF' : '—'}</div>
        ${precio ? `<div class="pc-sub">$${Math.round(precio * store.UF).toLocaleString('es-CL')}</div>` : ''}
      </div>
      ${p.bonoPct > 0 ? `
      <div class="bono-card">
        <div class="bc-label">✅ Acepta Bono Pie</div>
        <div class="bc-value">${p.bonoPct}%</div>
        ${parseNum(p.bonoUF) ? `<div class="bc-sub">${parseNum(p.bonoUF).toLocaleString('es-CL', {maximumFractionDigits:0})} UF de financiamiento</div>` : ''}
      </div>` : ''}
    </div>
    ${amenitiesList.length ? `
    <div class="dt-section">Amenidades del edificio</div>
    <div class="dt-amenities">${amenitiesList.map(a => `<span class="dt-amenity">${H(a)}</span>`).join('')}</div>` : ''}
    ${finishes.length ? `
    <div class="dt-section">Terminaciones</div>
    <div class="dt-finishes">${finishes.map(f => {
      const parts = String(f).split(':');
      const k = parts[0]?.trim() || '';
      const v = parts.slice(1).join(':').trim() || '';
      return `<div class="dt-finish-row"><div class="dt-finish-k">${H(k)}</div><div class="dt-finish-v">${H(v)}</div></div>`;
    }).join('')}</div>` : ''}
    ${ytId ? `
    <div class="dt-section">Video de la propiedad</div>
    <div class="dt-yt-wrap">
      <iframe src="https://www.youtube-nocookie.com/embed/${H(ytId)}?rel=0&playsinline=1"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
        allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>` : ''}
    ${p.video && !ytId ? `
    <div class="dt-section">Video de la propiedad</div>
    <div style="margin:4px 0 12px">
      <button onclick="openVideo('${H(p.video)}')" style="background:#DC2626;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer">▶ Ver video</button>
    </div>` : ''}
    ${buildingUnitsHTML(p)}
    <div class="detail-actions">
      <button class="btn-cotiz-detail" onclick="closeDetail();cotizSecProp('${H(p.id)}')">📊 Cotizar</button>
      ${p.video ? `<button class="btn-fotos" onclick="openVideo('${H(p.video)}')" style="background:#DC2626;color:#fff">▶ Ver video</button>` : ''}
      <button class="btn-fotos" style="background:var(--green)" onclick="shareProperty('${H(p.id)}')">📤 Compartir</button>
    </div>
    <div class="detail-actions" style="margin-top:8px;border-top:none;padding-top:0">
      <button class="btn-ficha" onclick="printFicha()">📄 Ficha PDF</button>
      ${dpPhotos.length ? `<button class="btn-fotos" id="btn-dl-fotos" onclick="downloadPhotos()">📥 Fotos (${dpPhotos.length})</button>` : ''}
    </div>`;
}

function buildingUnitsHTML(current) {
  const key = current.condominio || current.direccion;
  if (!key || !store.STOCK.length) return '';
  const others = store.STOCK.filter(p => p.id !== current.id && (p.condominio || p.direccion) === key);
  if (!others.length) return '';
  const rows = others.map(p => {
    const pr   = parseNum(p.precioSinBono);
    const m2   = parseNum(p.m2total) || parseNum(p.m2interior);
    const parts = [];
    if (p.dp) parts.push('DP ' + p.dp);
    if (m2)   parts.push(m2.toFixed(0) + ' m²');
    if (p.orientacion && p.orientacion !== '-') parts.push(p.orientacion);
    return `<div class="unit-row" onclick="closeDetail();openDetail('${H(p.id)}')">
      <div class="ur-tipo">${H(p.tipologia || '—')}</div>
      <div class="ur-info">${parts.join(' · ')}</div>
      <div class="ur-price">${pr ? pr.toLocaleString('es-CL', {maximumFractionDigits:0}) + ' UF' : '—'}</div>
    </div>`;
  }).join('');
  return `<div class="building-units">
    <div class="building-units-title">Otras unidades en este edificio <span>${others.length}</span></div>
    ${rows}
  </div>`;
}

export function closeDetail() {
  document.getElementById('detail-modal').classList.remove('open');
  document.body.style.overflow = '';
  dpPhotos = []; dpIdx = 0; currentProp = null; currentApiData = null;
  document.getElementById('dp-nophoto')?.remove();
}

export function shareProperty(id) {
  const p = currentProp;
  if (!p) return;
  const precio = parseNum(p.precioSinBono);
  const m2 = parseNum(p.m2total) || parseNum(p.m2interior);
  const lines = [
    `🏢 *${p.condominio || p.direccion}*`,
    `📍 ${p.direccion}${p.dp ? ' · DP ' + p.dp : ''} · ${p.comuna}`,
    `📐 ${m2 ? m2.toFixed(0) + ' m²' : ''} · ${p.tipologia || ''}`,
    p.est && p.est !== '0' ? '🚗 Estacionamiento incluido' : '',
    p.bod && p.bod !== '0' ? '📦 Bodega incluida' : '',
    precio ? `💰 ${precio.toLocaleString('es-CL', {maximumFractionDigits:0})} UF` : '',
    p.bonoPct > 0 ? `✅ Acepta Bono Pie ${p.bonoPct}%` : '',
    p.video ? `\n▶ Video: ${p.video}` : '',
  ].filter(Boolean).join('\n');
  const wsp   = `https://wa.me/?text=${encodeURIComponent(lines)}`;
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:700;display:flex;align-items:center;justify-content:center;padding:20px';
  modal.innerHTML = `<div style="background:#fff;border-radius:16px;padding:24px;max-width:480px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,.2)">
    <div style="font-size:15px;font-weight:800;color:var(--g900);margin-bottom:12px">📤 Compartir con cliente</div>
    <textarea id="share-txt" readonly style="width:100%;height:160px;border:1.5px solid var(--g200);border-radius:8px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;resize:none;color:var(--g800)">${lines}</textarea>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button onclick="navigator.clipboard.writeText(document.getElementById('share-txt').value).then(()=>{this.textContent='✅ Copiado!';setTimeout(()=>{this.textContent='📋 Copiar texto'},2000)})" style="flex:1;height:38px;background:var(--brand-l);color:var(--brand);border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer">📋 Copiar texto</button>
      <a href="${wsp}" target="_blank" style="flex:1;height:38px;background:#25D366;color:#fff;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center">💬 WhatsApp</a>
      <button onclick="this.closest('[style]').remove()" style="height:38px;width:38px;background:var(--g100);color:var(--g600);border:none;border-radius:8px;font-size:16px;cursor:pointer">✕</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

export async function downloadPhotos() {
  if (!dpPhotos.length) return;
  const btn = document.getElementById('btn-dl-fotos');
  const overlay = document.getElementById('loading-overlay');
  const msg = document.getElementById('loading-msg');
  const bar = document.getElementById('loading-bar');
  btn.classList.add('loading'); btn.textContent = '⏳ Descargando…';
  overlay.classList.add('show'); bar.style.width = '0%';
  const zip    = new JSZip();
  const folder = zip.folder('fotos-propiedad');
  const total  = dpPhotos.length;
  async function fetchPhoto(url) {
    try { const r = await fetch(proxyImg(url)); if (r.ok) return await r.blob(); } catch {}
    try { const r = await fetch(url, { mode: 'cors' }); if (r.ok) return await r.blob(); } catch {}
    return null;
  }
  let ok = 0;
  for (let i = 0; i < total; i++) {
    msg.textContent = `Descargando foto ${i+1} de ${total}…`;
    bar.style.width = `${Math.round((i/total)*90)}%`;
    const blob = await fetchPhoto(dpPhotos[i]);
    if (blob) { const ext = blob.type.includes('png') ? 'png' : 'jpg'; folder.file(`foto-${String(i+1).padStart(2,'0')}.${ext}`, blob); ok++; }
  }
  msg.textContent = 'Generando ZIP…'; bar.style.width = '95%';
  const content = await zip.generateAsync({ type: 'blob' });
  bar.style.width = '100%';
  if (ok === 0) {
    alert('No se pudieron descargar las fotos.');
    overlay.classList.remove('show'); btn.classList.remove('loading');
    btn.textContent = `📥 Descargar Fotos (${dpPhotos.length})`; return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = `fotos-${(currentProp?.condominio || currentProp?.direccion || 'propiedad').replace(/[^a-zA-Z0-9]/g, '-')}.zip`;
  a.click();
  setTimeout(() => { overlay.classList.remove('show'); btn.classList.remove('loading'); btn.textContent = `📥 Descargar Fotos (${dpPhotos.length})`; }, 800);
}

export async function printFicha() {
  if (!currentProp) return;
  const p = currentProp, api = currentApiData;
  const btn = document.querySelector('.btn-ficha');
  const origText = btn.textContent;
  btn.textContent = '⏳ Generando PDF…'; btn.disabled = true;
  const precio  = parseNum(p.precioSinBono);
  const m2t     = parseNum(p.m2total) || parseNum(api?.superficie);
  const m2i     = parseNum(p.m2interior) || parseNum(api?.m2_utiles);
  const m2terr  = parseNum(p.m2terraza) || parseNum(api?.m2_terraza);
  const dorms   = api?.dormitorios ?? '';
  const banios  = api?.banios ?? '';
  const piso    = api?.piso ?? '';
  const ggcc    = api?.unitggcc?.monto || api?.ggcc || '';
  const amenitiesList = (api?.espacios || '').split(',').map(s => s.trim()).filter(Boolean);
  const finishes = api?.building_finishes || [];
  const nombre   = (p.condominio || p.direccion || 'propiedad').replace(/[^a-zA-Z0-9]/g, '-');
  const date     = new Date().toLocaleDateString('es-CL', { day:'2-digit', month:'long', year:'numeric' });

  async function imgToBase64(url) {
    for (const src of [proxyImg(url), url]) {
      try {
        const r = await fetch(src); if (!r.ok) continue;
        const blob = await r.blob();
        return await new Promise(res => { const fr = new FileReader(); fr.onload = e => res(e.target.result); fr.readAsDataURL(blob); });
      } catch {}
    }
    return null;
  }
  btn.textContent = '⏳ Cargando logo…';
  const logoB64  = await imgToBase64('images/logo.png');
  btn.textContent = '⏳ Cargando fotos…';
  const photoData = await Promise.all(dpPhotos.slice(0, 5).map(imgToBase64));
  const photos = photoData.filter(Boolean);
  btn.textContent = '⏳ Generando PDF…';
  if (!window.jspdf) { alert('jsPDF no disponible.'); btn.textContent = origText; btn.disabled = false; return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = 210, PH = 297, M = 10, CW = 190;
  const ind = [67,56,202], muted = [107,114,128], bg = [249,250,251], white = [255,255,255], dark = [17,24,39], green = [5,150,105], greenBg = [209,250,229];
  const setFill = rgb => doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setTxt  = rgb => doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  const roundRect = (x, y, w, h, r, c) => { setFill(c); doc.roundedRect(x, y, w, h, r, r, 'F'); };
  const sectionTitle = (label, y) => { setFill([229,231,235]); doc.rect(M, y, CW, 0.3, 'F'); doc.setFontSize(7.5); doc.setFont('helvetica','bold'); setTxt(muted); doc.text(label.toUpperCase(), M, y+4.5); return y+8; };
  let y = 0;
  setFill(ind); doc.rect(0, 0, PW, 22, 'F');
  if (logoB64) { roundRect(M-1, 3, 44, 15, 2.5, white); doc.addImage(logoB64, 'PNG', M+1, 5, 40, 7.4, undefined, 'FAST'); }
  else { doc.setFont('helvetica','bold'); doc.setFontSize(16); setTxt(white); doc.text('ViveProp', M, 14); }
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); setTxt([200,200,230]);
  doc.text('Ficha de Propiedad', PW-M, 10, {align:'right'});
  doc.text(date, PW-M, 16, {align:'right'});
  y = 22;
  setFill([238,242,255]); doc.rect(0, y, PW, 32, 'F');
  doc.setFont('helvetica','bold'); doc.setFontSize(15); setTxt(dark);
  const title = p.condominio || p.direccion || '—';
  doc.text(title.length > 38 ? title.slice(0,36)+'…' : title, M, y+11);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); setTxt(muted);
  const addr = `${p.direccion||'—'} · ${p.comuna||''}${p.dp?' · DP '+p.dp:''}`;
  doc.text(addr.length > 55 ? addr.slice(0,53)+'…' : addr, M, y+18);
  doc.setFont('helvetica','bold'); doc.setFontSize(20); setTxt(ind);
  doc.text(precio ? precio.toLocaleString('es-CL',{maximumFractionDigits:0})+' UF':'—', PW-M, y+13, {align:'right'});
  doc.setFontSize(8); setTxt(muted); doc.setFont('helvetica','normal');
  doc.text('Precio sin bono pie', PW-M, y+8, {align:'right'});
  if (p.bonoPct > 0) { roundRect(PW-M-42, y+18, 42, 9, 2, greenBg); doc.setFont('helvetica','bold'); doc.setFontSize(8); setTxt(green); doc.text(`Acepta Bono Pie ${p.bonoPct}%`, PW-M-21, y+23.5, {align:'center'}); }
  y += 34;
  if (photos.length) {
    const heroH = 52, smlH = 25, gap = 2, heroW = photos.length > 1 ? 118 : CW, smlW = CW - heroW - gap;
    try { doc.addImage(photos[0], 'JPEG', M, y, heroW, heroH, undefined, 'FAST'); } catch {}
    if (photos[1]) try { doc.addImage(photos[1], 'JPEG', M+heroW+gap, y, smlW, smlH, undefined, 'FAST'); } catch {}
    if (photos[2]) try { doc.addImage(photos[2], 'JPEG', M+heroW+gap, y+smlH+gap, smlW, heroH-smlH-gap, undefined, 'FAST'); } catch {}
    y += heroH + gap;
    if (photos[3] || photos[4]) {
      const rW = photos[4] ? (CW-gap)/2 : CW;
      if (photos[3]) try { doc.addImage(photos[3], 'JPEG', M, y, rW, 32, undefined, 'FAST'); } catch {}
      if (photos[4]) try { doc.addImage(photos[4], 'JPEG', M+rW+gap, y, rW, 32, undefined, 'FAST'); } catch {}
      y += 34;
    }
  }
  y += 4; y = sectionTitle('Características', y);
  const specs = [
    p.tipologia    ? {v:p.tipologia, l:'Tipología'} : null,
    m2t            ? {v:m2t.toFixed(0)+' m²', l:'Superficie'} : null,
    m2i            ? {v:m2i.toFixed(0)+' m²', l:'Sup. interior'} : null,
    m2terr         ? {v:m2terr.toFixed(0)+' m²', l:'Terraza'} : null,
    dorms !== ''   ? {v:dorms+' dorm.', l:'Dormitorios'} : null,
    banios !== ''  ? {v:banios+' baños', l:'Baños'} : null,
    piso !== ''    ? {v:'Piso '+piso, l:'Nivel'} : null,
    p.orientacion && p.orientacion !== '-' ? {v:p.orientacion, l:'Orientación'} : null,
    p.est && p.est !== '0' ? {v:'Incluido', l:'Estacionamiento'} : null,
    p.bod && p.bod !== '0' ? {v:'Incluida', l:'Bodega'} : null,
    p.anio         ? {v:p.anio, l:'Año'} : null,
    ggcc           ? {v:'$'+Number(ggcc).toLocaleString('es-CL'), l:'GC/mes'} : null,
  ].filter(Boolean);
  const cols = 4, chipW = (CW-(cols-1)*3)/cols, chipH = 14;
  specs.forEach((s, i) => {
    const col = i % cols, row = Math.floor(i / cols), cx = M+col*(chipW+3), cy = y+row*(chipH+3);
    roundRect(cx, cy, chipW, chipH, 2, bg);
    doc.setFont('helvetica','bold'); doc.setFontSize(9); setTxt(dark);
    doc.text(String(s.v).slice(0,18), cx+chipW/2, cy+6.5, {align:'center'});
    doc.setFont('helvetica','normal'); doc.setFontSize(7); setTxt(muted);
    doc.text(s.l, cx+chipW/2, cy+11, {align:'center'});
  });
  y += Math.ceil(specs.length/cols)*(chipH+3)+4;
  setFill(ind); doc.rect(0, PH-16, PW, 16, 'F');
  if (logoB64) { roundRect(M-1, PH-14, 33, 11, 2, white); doc.addImage(logoB64, 'PNG', M+1, PH-12.5, 29, 5.4, undefined, 'FAST'); }
  else { doc.setFont('helvetica','bold'); doc.setFontSize(11); setTxt(white); doc.text('ViveProp', M, PH-7); }
  doc.setFont('helvetica','normal'); doc.setFontSize(8); setTxt([200,200,230]);
  doc.text('www.viveprop.cl · Stock de propiedades en gestión', PW-M, PH-7, {align:'right'});
  doc.save(`ficha-${nombre}.pdf`);
  btn.textContent = origText; btn.disabled = false;
}

export function openVideo(url) {
  _currentVideoUrl = url;
  const wrap   = document.getElementById('video-player-wrap');
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);
  if (ytMatch) {
    wrap.style.paddingTop = '56.25%';
    wrap.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&playsinline=1"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share"
      allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
      style="position:absolute;inset:0;width:100%;height:100%;border:none"></iframe>`;
  } else {
    wrap.style.paddingTop = '0';
    wrap.innerHTML = `<video controls autoplay playsinline
      style="width:100%;max-height:75vh;display:block;border-radius:12px"
      src="${H(url)}">Tu navegador no soporta reproducción de video.</video>`;
  }
  document.getElementById('video-copy-btn').textContent = '🔗 Copiar enlace para cliente';
  document.getElementById('video-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

export function copyVideoLink() {
  const btn = document.getElementById('video-copy-btn');
  navigator.clipboard.writeText(_currentVideoUrl).then(() => {
    btn.textContent = '✅ Enlace copiado';
    setTimeout(() => { btn.textContent = '🔗 Copiar enlace para cliente'; }, 2500);
  }).catch(() => { prompt('Copia este enlace:', _currentVideoUrl); });
}

export function closeVideo() {
  document.getElementById('video-modal').style.display = 'none';
  document.getElementById('video-player-wrap').innerHTML = '';
  document.body.style.overflow = '';
}

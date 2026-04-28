import { store } from '../state/store.js';
import { H, parseNum, ESTADO_COLORS, eLbl } from '../utils/format.js';

// ── Instancias Leaflet ──────────────────────────────────────────────────────
let _map = null, _cluster = null;
let _priMapG = null, _priClusterG = null;
export let _priMap = null, _priMarker = null;

export function setPriMap(m) { _priMap = m; }
export function setPriMarker(mk) { _priMarker = mk; }

// ── Helpers ─────────────────────────────────────────────────────────────────
export function getCoords(p) {
  const key = `${p.direccion}|${p.comuna}`;
  if (store._GC[key] !== undefined) return store._GC[key];
  try {
    const lc = JSON.parse(localStorage.getItem('_geo_cache') || '{}');
    if (lc[key] !== undefined) return lc[key];
  } catch {}
  return undefined;
}

export function makeIcon(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="6" fill="white"/></svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [28,36], iconAnchor: [14,36], popupAnchor: [0,-36] });
}

export function proxyImg(url) {
  if (!url) return '';
  const clean = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&output=jpg&q=88`;
}

export function applyMapPhoto(id, url) {
  const clean = url.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&output=jpg&q=80&w=540&h=296&fit=cover`;
}

// ── Mapa Secundario ─────────────────────────────────────────────────────────
export function initMap() {
  if (_map) return;
  _map = L.map('sec-map', { zoomControl: true }).setView([-33.45, -70.65], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
  }).addTo(_map);
  _cluster = L.markerClusterGroup({ maxClusterRadius: 50, showCoverageOnHover: false });
  _map.addLayer(_cluster);
}

export function getSecMap() { return _map; }

export function renderMap(list) {
  if (!_map) return;
  _cluster.clearLayers();
  const unknown = [];
  list.forEach(p => {
    const c = getCoords(p);
    if (c) addMarker(p, c);
    else if (c === undefined) unknown.push(p);
  });
  if (unknown.length) geocodePending(unknown);
}

let _secView = 'lista';
export function setSecViewRef(v) { _secView = v; }

export function addMarker(p, coords) {
  const precio = parseNum(p.precioSinBono);
  const m2 = parseNum(p.m2total) || parseNum(p.m2interior);
  const color = ESTADO_COLORS[p.estado] || '#94A3B8';
  const estadoLbl = eLbl(p.estado);
  const cardPhotoCache = {};

  const popup = `<div class="map-popup">
    <div class="mp-photo" id="mpp-${H(p.id)}">🏢</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:${color}22;color:${color}">${estadoLbl}</span>
        ${p.bonoPct > 0 ? `<span class="mp-bono">Bono Pie ${p.bonoPct}%</span>` : ''}
      </div>
      <div class="mp-title">${H(p.condominio || p.direccion || '—')}</div>
      <div class="mp-addr">📍 ${H(p.direccion || '')}${p.comuna ? ' · ' + H(p.comuna) : ''}</div>
      <div class="mp-specs">
        ${p.tipologia ? `<span class="mp-spec">${H(p.tipologia)}</span>` : ''}
        ${m2 ? `<span class="mp-spec">${m2.toFixed(0)} m²</span>` : ''}
        ${p.orientacion && p.orientacion !== '-' ? `<span class="mp-spec">${H(p.orientacion)}</span>` : ''}
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${precio ? precio.toLocaleString('es-CL', {maximumFractionDigits:0}) + ' UF' : '—'}</span>
      </div>
      <button class="mp-btn" onclick="openSecDetail('${H(p.id)}')">Ver ficha →</button>
    </div>
  </div>`;

  const marker = L.marker(coords, { icon: makeIcon(color) });
  marker.bindPopup(popup, { className: 'lf-popup', maxWidth: 270, closeButton: false });
  marker.on('popupopen', () => {
    const el = document.getElementById('mpp-' + p.id);
    if (!el) return;
    fetch(`https://api.assetplan.cl/api/v1/property/for_sale/${p.id}?list=1`)
      .then(r => r.json()).then(json => {
        const d = json.data?.[0];
        const fotos = (d?.fotos_originales?.length ? d.fotos_originales : d?.fotos) || [];
        if (fotos.length) {
          const el2 = document.getElementById('mpp-' + p.id);
          if (el2) { const u = applyMapPhoto(p.id, fotos[0]); el2.style.backgroundImage = `url('${u}')`; el2.textContent = ''; }
        }
      }).catch(() => {});
  });
  _cluster.addLayer(marker);
}

export async function geocodePending(pending) {
  const prog = document.getElementById('geo-progress');
  const bar = document.getElementById('geo-bar');
  const msg = document.getElementById('geo-msg');
  prog.style.display = 'flex';
  let lc = {};
  try { lc = JSON.parse(localStorage.getItem('_geo_cache') || '{}'); } catch {}
  for (let i = 0; i < pending.length; i++) {
    if (_secView !== 'mapa') break;
    const p = pending[i];
    const key = `${p.direccion}|${p.comuna}`;
    msg.textContent = `Ubicando ${i+1} de ${pending.length}`;
    bar.style.width = `${Math.round(((i+1)/pending.length)*100)}%`;
    const q = encodeURIComponent(`${p.direccion}, ${p.comuna}, Santiago, Chile`);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, { headers: {'Accept-Language':'es'} });
      const data = await res.json();
      if (data[0]) { const c = [parseFloat(data[0].lat), parseFloat(data[0].lon)]; lc[key] = c; store._GC[key] = c; addMarker(p, c); }
      else lc[key] = null;
    } catch { lc[key] = null; }
    try { localStorage.setItem('_geo_cache', JSON.stringify(lc)); } catch {}
    await new Promise(r => setTimeout(r, 1200));
  }
  prog.style.display = 'none';
}

// ── Mapa Primario (grid) ────────────────────────────────────────────────────
export function initPriMapG() {
  if (_priMapG) return;
  _priMapG = L.map('pri-map', { zoomControl: true }).setView([-33.45, -70.65], 11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
  }).addTo(_priMapG);
  _priClusterG = L.markerClusterGroup({ maxClusterRadius: 50, showCoverageOnHover: false });
  _priMapG.addLayer(_priClusterG);
}

export function getPriMapG() { return _priMapG; }

let _priView = 'lista';
export function setPriViewRef(v) { _priView = v; }

export function renderPriMapG(list) {
  if (!_priMapG) return;
  _priClusterG.clearLayers();
  const unknown = [];
  list.forEach(p => {
    const c = getCoords({ direccion: p.direccion, comuna: p.comuna });
    if (c) addPriMarker(p, c);
    else if (c === undefined) unknown.push(p);
  });
  if (unknown.length) priGeocodePending(unknown);
}

export function addPriMarker(p, coords) {
  const { isExtra } = window._mapUtils || {};
  const dispMain = (p.unidades || []).filter(u => u.disponible && !/estac|bode|parking|reja|local\s/i.test(u.tipologia || ''));
  const precios = dispMain.map(u => u.precio_uf).filter(x => x > 0);
  const desde = precios.length ? Math.min(...precios) : 0;
  const hasta = precios.length ? Math.max(...precios) : 0;
  const tips = [...new Set(dispMain.map(u => { const d = parseInt(u.dormitorios) || 0; return d === 0 ? 'Estudio' : d + 'D'; }))].sort().slice(0,3).join(', ');
  const portada = p.foto_portada || '';
  const icon = L.divIcon({ className: '', html: `<div style="width:13px;height:13px;background:#F4545A;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`, iconSize: [13,13], iconAnchor: [6,6] });
  const marker = L.marker(coords, { icon });
  const popup = `<div class="map-popup">
    <div class="mp-photo" ${portada ? `style="background-image:url('${portada}')"` : ''}>${portada ? '' : '🏗️'}</div>
    <div class="mp-body">
      <div class="mp-badge-row">
        <span class="mp-badge" style="background:#FEE2E2;color:#B91C1C">Nuevo</span>
        ${p.entrega ? `<span class="mp-badge" style="background:#F3F4F6;color:#374151">${H(p.entrega)}</span>` : ''}
      </div>
      <div class="mp-title">${H(p.nombre)}</div>
      <div class="mp-inmob">${H(p.inmobiliaria || '')}</div>
      <div class="mp-addr">📍 ${H(p.direccion || '')}${p.comuna ? ' · ' + H(p.comuna) : ''}</div>
      <div class="mp-specs">
        ${tips ? `<span class="mp-spec">${tips}</span>` : ''}
        <span class="mp-spec">${dispMain.length} disponibles</span>
      </div>
      <div class="mp-price-row">
        <span class="mp-price">${desde ? 'UF ' + desde.toLocaleString('es-CL', {maximumFractionDigits:0}) : '—'}</span>
        ${hasta > desde ? `<span style="font-size:11px;color:var(--g400)">— ${hasta.toLocaleString('es-CL', {maximumFractionDigits:0})}</span>` : ''}
      </div>
      <button class="mp-btn" onclick="openProject('${H(p.id)}')">Ver proyecto →</button>
    </div>
  </div>`;
  marker.bindPopup(popup, { className: 'lf-popup', maxWidth: 270, closeButton: false });
  _priClusterG.addLayer(marker);
}

export async function priGeocodePending(pending) {
  const prog = document.getElementById('pri-geo-progress');
  const bar = document.getElementById('pri-geo-bar');
  const msg = document.getElementById('pri-geo-msg');
  prog.style.display = 'flex';
  let lc = {}; try { lc = JSON.parse(localStorage.getItem('_geo_cache') || '{}'); } catch {}
  for (let i = 0; i < pending.length; i++) {
    if (_priView !== 'mapa') break;
    const p = pending[i];
    const key = `${p.direccion}|${p.comuna}`;
    msg.textContent = `Ubicando ${i+1} de ${pending.length}`;
    bar.style.width = `${Math.round(((i+1)/pending.length)*100)}%`;
    const q = encodeURIComponent(`${p.direccion || p.nombre}, ${p.comuna || ''}, Chile`);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, { headers: {'Accept-Language':'es'} });
      const data = await res.json();
      if (data[0]) { const c = [parseFloat(data[0].lat), parseFloat(data[0].lon)]; lc[key] = c; store._GC[key] = c; addPriMarker(p, c); }
      else lc[key] = null;
    } catch { lc[key] = null; }
    try { localStorage.setItem('_geo_cache', JSON.stringify(lc)); } catch {}
    await new Promise(r => setTimeout(r, 1200));
  }
  prog.style.display = 'none';
}

// ── Mapa detalle proyecto ────────────────────────────────────────────────────
export function priMapShow(p) {
  if (!p) return;
  if (!_priMap) {
    _priMap = L.map('pm-map', { zoomControl: true }).setView([-33.45, -70.65], 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
    }).addTo(_priMap);
  } else {
    _priMap.invalidateSize();
  }
  if (_priMarker) { _priMap.removeLayer(_priMarker); _priMarker = null; }
  const coords = getCoords({ direccion: p.direccion, comuna: p.comuna });
  if (coords) {
    priPlaceMarker(p, coords);
  } else {
    priGeocodeDetail(p);
  }
  setTimeout(() => { if (_priMap) _priMap.invalidateSize(); }, 200);
}

export function priPlaceMarker(p, coords) {
  const icon = L.divIcon({ className: '', html: `<div style="width:14px;height:14px;background:var(--coral);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>`, iconSize: [14,14], iconAnchor: [7,7] });
  _priMarker = L.marker(coords, { icon }).addTo(_priMap);
  _priMarker.bindPopup(`<b>${H(p.nombre)}</b><br>${H(p.direccion || '')}${p.comuna ? ', ' + H(p.comuna) : ''}`).openPopup();
  _priMap.setView(coords, 15);
}

export async function priGeocodeDetail(p) {
  const q = encodeURIComponent(`${p.direccion || p.nombre}, ${p.comuna || ''}, Chile`);
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, { headers: {'Accept-Language':'es'} });
    const data = await res.json();
    if (data[0]) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      let lc = {}; try { lc = JSON.parse(localStorage.getItem('_geo_cache') || '{}'); } catch {}
      lc[`${p.direccion}|${p.comuna}`] = coords;
      try { localStorage.setItem('_geo_cache', JSON.stringify(lc)); } catch {}
      store._GC[`${p.direccion}|${p.comuna}`] = coords;
      priPlaceMarker(p, coords);
    }
  } catch {}
}

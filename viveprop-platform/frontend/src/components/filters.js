// Multi-select comunas y pill toggles — compartido entre secundario y primario

const _mc = { sec: new Set(), pri: new Set() };
let _mcAllSec = [], _mcAllPri = [];

export function mcBuild(mod, list) {
  if (mod === 'sec') _mcAllSec = list;
  else               _mcAllPri = list;
}

export function mcGetSelected(mod) {
  return _mc[mod];
}

export function mcFilter(mod) {
  const q = (document.getElementById(mod + '-mc-input').value || '').toLowerCase();
  const all = mod === 'sec' ? _mcAllSec : _mcAllPri;
  const sel = _mc[mod];
  const dd = document.getElementById(mod + '-mc-dropdown');
  const matches = all.filter(c => (!q || c.toLowerCase().includes(q)) && !sel.has(c));
  if (!matches.length) { dd.style.display = 'none'; return; }
  dd.innerHTML = matches.slice(0, 14).map(c =>
    `<div class="mc-opt" onmousedown="mcSelect('${mod}','${c.replace(/'/g,"\\'")}');return false">${c}</div>`
  ).join('');
  dd.style.display = 'block';
}

export function mcOpen(mod) { mcFilter(mod); }

export function mcClose(mod) {
  setTimeout(() => {
    const dd = document.getElementById(mod + '-mc-dropdown');
    if (dd) dd.style.display = 'none';
  }, 150);
}

export function mcSelect(mod, c) {
  _mc[mod].add(c);
  mcRenderTags(mod);
  document.getElementById(mod + '-mc-input').value = '';
  document.getElementById(mod + '-mc-dropdown').style.display = 'none';
  mod === 'sec' ? window.secFilter() : window.priFilter();
}

export function mcRemove(mod, c) {
  _mc[mod].delete(c);
  mcRenderTags(mod);
  mod === 'sec' ? window.secFilter() : window.priFilter();
}

export function mcRenderTags(mod) {
  document.getElementById(mod + '-mc-tags').innerHTML = [..._mc[mod]]
    .map(c => `<span class="mc-tag">${c} <span onclick="mcRemove('${mod}','${c.replace(/'/g,"\\'")}')">×</span></span>`)
    .join('');
}

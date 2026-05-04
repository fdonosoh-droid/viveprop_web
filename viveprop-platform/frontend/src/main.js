import { store } from './state/store.js';
import { api } from './api/client.js';
import { mcFilter, mcOpen, mcClose, mcSelect, mcRemove } from './components/filters.js';
import { secInit, secFilter, secPage, setSecView, openDetail, openSecDetail, showDpPhoto, navDp, closeDetail, shareProperty, downloadPhotos, printFicha, openVideo, copyVideoLink, closeVideo } from './modules/secundario.js';
import { priInit, priFilter, priPage, setPriView, openProject, closeProjModal, pmTab, renderCC, pmShowGalPhoto, pmGalNav, pmShowTipologia, selectProjUnit, pmUpdateTotal, pmBack, pmCotizar, toggleDormPill, reopenWithUnit } from './modules/primario.js';
import { calcPerfil, searchFromPerfil, showBudgetBanner, clearBudget } from './modules/perfilador.js';
import { cotizFromProp, cotizSecProp, recalcCotizPanel, volverDesdeCotiz, volverDesdeParams, submitParamsStep, volverAParams, submitClientForm, formatRutInput, formatTelInput, formatCLPInput, clearCCFError, printCotiz, nuevaCotizacion, recotizar, cancelarCotizacion } from './modules/cotizador.js';
import { cascInit, cascUpdate, cascContinuar, cascReset } from './modules/cascade.js';

const TITLES = { sec: 'Stock Secundario', pri: 'Proyectos Nuevos', perfil: 'Perfilador', cotiz: 'Cotizador' };

// ── Expose all module functions to window so inline onclick handlers work ──
Object.assign(window, {
  // navigation
  openModule,
  // filters shared
  mcFilter, mcOpen, mcClose, mcSelect, mcRemove,
  // secundario
  secFilter, secPage, setSecView,
  openDetail, openSecDetail,
  showDpPhoto, navDp, closeDetail,
  shareProperty, downloadPhotos, printFicha,
  openVideo, copyVideoLink, closeVideo,
  // pill helpers
  toggleSecPill: (btn) => { btn.classList.toggle('active'); secFilter(); },
  togglePriPill: (btn) => { btn.classList.toggle('active'); priFilter(); },
  toggleTipPill: (btn) => { btn.classList.toggle('active'); secFilter(); },
  toggleDormPill,
  // primario
  priFilter, priPage, setPriView,
  openProject, closeProjModal, pmTab, renderCC,
  pmShowGalPhoto, pmGalNav, pmShowTipologia,
  selectProjUnit, pmUpdateTotal, pmBack, pmCotizar, reopenWithUnit,
  // perfilador
  calcPerfil, searchFromPerfil, showBudgetBanner, clearBudget,
  // cotizador
  cotizFromProp, cotizSecProp,
  recalcCotizPanel, volverDesdeCotiz, volverDesdeParams, submitParamsStep, volverAParams,
  submitClientForm, formatRutInput, formatTelInput, formatCLPInput, clearCCFError, printCotiz,
  nuevaCotizacion, recotizar, cancelarCotizacion,
  // cascade
  cascUpdate, cascContinuar, cascReset,
});

function openModule(m) {
  mobFilterClose();
  document.querySelectorAll('.module').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('mod-' + m).classList.add('active');
  document.querySelector(`.snav-btn[data-m="${m}"]`).classList.add('active');
  document.getElementById('topbar-title').textContent = TITLES[m] || m;
  const sbfSec = document.getElementById('sbf-sec');
  const sbfPri = document.getElementById('sbf-pri');
  if (sbfSec) sbfSec.style.display = m === 'sec' ? '' : 'none';
  if (sbfPri) sbfPri.style.display = m === 'pri' ? '' : 'none';
  const filterBtn = document.getElementById('mob-filter-btn');
  if (filterBtn) filterBtn.style.display = (m === 'sec' || m === 'pri') ? '' : 'none';
}

// ── Keyboard shortcuts ──────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (document.getElementById('detail-modal').classList.contains('open')) {
    if (e.key === 'Escape') closeDetail();
    if (e.key === 'ArrowLeft')  navDp(-1);
    if (e.key === 'ArrowRight') navDp(1);
    return;
  }
  if (e.key === 'Escape') closeVideo();
});

document.getElementById('detail-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeDetail();
});

document.getElementById('proj-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeProjModal();
});

// ── Mobile filter drawer ────────────────────────────────────────────────────
function mobFilterOpen() {
  document.querySelectorAll('.sbf-wrap').forEach(el => {
    const hidden = el.style.display === 'none'
    if (!hidden) el.classList.add('mob-open')
  })
  document.getElementById('mob-filter-overlay').classList.add('open')
  document.body.classList.add('mob-filter-active')
}

function mobFilterClose() {
  document.querySelectorAll('.sbf-wrap').forEach(el => el.classList.remove('mob-open'))
  document.getElementById('mob-filter-overlay').classList.remove('open')
  document.body.classList.remove('mob-filter-active')
}

Object.assign(window, { mobFilterOpen, mobFilterClose })

// ── Bootstrap: load data then initialize modules ───────────────────────────
function applyUF(ufRes) {
  store.UF = ufRes.valor ?? store.UF;
  const ufFormatted = store.UF.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const ufVal  = document.getElementById('uf-val');
  const ufDate = document.getElementById('uf-date');
  const mobUf  = document.getElementById('mob-uf-chip');
  if (ufVal)  ufVal.textContent  = ufFormatted;
  if (mobUf)  mobUf.textContent  = `UF $${ufFormatted}`;
  if (ufDate && ufRes.fecha) {
    const f = new Date(ufRes.fecha);
    ufDate.textContent = f.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  }
}

async function bootstrap() {
  // Datos locales críticos — nunca deben fallar
  try {
    const [stockRes, projectsRes, ccRes, geoRes, priGeoRes] = await Promise.all([
      api.stock(),
      api.projects(),
      api.cc(),
      api.geocodes(),
      api.priGeo(),
    ]);

    store.STOCK    = stockRes ?? [];
    store.PROJECTS = projectsRes ?? [];
    store.CC_DATA  = ccRes ?? {};

    if (geoRes)    Object.assign(store._GC, geoRes);
    if (priGeoRes) Object.assign(store._GC, priGeoRes);

    try {
      const lc = JSON.parse(localStorage.getItem('_geo_cache') || '{}');
      Object.assign(store._GC, lc);
    } catch {}

  } catch (err) {
    console.error('Bootstrap data load failed:', err);
  }

  // UF es una API externa — no debe bloquear la carga si falla
  api.uf().then(applyUF).catch(err => console.warn('UF API no disponible:', err));

  secInit();
  priInit();
  cascInit();
  openModule('sec');
}

bootstrap();

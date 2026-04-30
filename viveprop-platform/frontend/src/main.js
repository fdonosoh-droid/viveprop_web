import { store } from './state/store.js';
import { api } from './api/client.js';
import { mcFilter, mcOpen, mcClose, mcSelect, mcRemove } from './components/filters.js';
import { secInit, secFilter, secPage, setSecView, openDetail, openSecDetail, showDpPhoto, navDp, closeDetail, shareProperty, downloadPhotos, printFicha, openVideo, copyVideoLink, closeVideo } from './modules/secundario.js';
import { priInit, priFilter, priPage, setPriView, openProject, closeProjModal, pmTab, renderCC, pmShowGalPhoto, pmGalNav, selectProjUnit, pmUpdateTotal, pmBack, pmCotizar, toggleDormPill, reopenWithUnit } from './modules/primario.js';
import { calcPerfil, searchFromPerfil, showBudgetBanner, clearBudget } from './modules/perfilador.js';
import { cotizFromProp, syncPie, calcCotiz, recalcCotizPanel, volverDesdeCotiz, submitClientForm, formatRutInput, clearCCFError, printCotiz } from './modules/cotizador.js';

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
  pmShowGalPhoto, pmGalNav,
  selectProjUnit, pmUpdateTotal, pmBack, pmCotizar, reopenWithUnit,
  // perfilador
  calcPerfil, searchFromPerfil, showBudgetBanner, clearBudget,
  // cotizador
  cotizFromProp, syncPie, calcCotiz,
  recalcCotizPanel, volverDesdeCotiz,
  submitClientForm, formatRutInput, clearCCFError, printCotiz,
});

function openModule(m) {
  document.querySelectorAll('.module').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('mod-' + m).classList.add('active');
  document.querySelector(`.snav-btn[data-m="${m}"]`).classList.add('active');
  document.getElementById('topbar-title').textContent = TITLES[m] || m;
  const sbfSec = document.getElementById('sbf-sec');
  const sbfPri = document.getElementById('sbf-pri');
  if (sbfSec) sbfSec.style.display = m === 'sec' ? '' : 'none';
  if (sbfPri) sbfPri.style.display = m === 'pri' ? '' : 'none';
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

// ── Bootstrap: load data then initialize modules ───────────────────────────
async function bootstrap() {
  try {
    const [ufRes, stockRes, projectsRes, ccRes, geoRes, priGeoRes] = await Promise.all([
      api.uf(),
      api.stock(),
      api.projects(),
      api.cc(),
      api.geocodes(),
      api.priGeo(),
    ]);

    store.UF       = ufRes.valor ?? store.UF;
    store.STOCK    = stockRes ?? [];
    store.PROJECTS = projectsRes ?? [];
    store.CC_DATA  = ccRes ?? {};

    // Update sidebar UF display
    const ufVal  = document.getElementById('uf-val');
    const ufDate = document.getElementById('uf-date');
    if (ufVal) ufVal.textContent = store.UF.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (ufDate && ufRes.fecha) {
      const f = new Date(ufRes.fecha);
      ufDate.textContent = f.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
    }

    // Merge geocodes into in-memory cache
    if (geoRes)    Object.assign(store._GC, geoRes);
    if (priGeoRes) Object.assign(store._GC, priGeoRes);

    // Also pull any cached coords from localStorage
    try {
      const lc = JSON.parse(localStorage.getItem('_geo_cache') || '{}');
      Object.assign(store._GC, lc);
    } catch {}

  } catch (err) {
    console.error('Bootstrap data load failed:', err);
  }

  secInit();
  priInit();
  openModule('sec');
}

bootstrap();

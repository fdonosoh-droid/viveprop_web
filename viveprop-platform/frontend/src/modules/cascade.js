import { store } from '../state/store.js';

export function cascInit() {
  const el = document.getElementById('casc-comuna')
  if (!el || !store.PROJECTS.length) return
  const comunas = [...new Set(store.PROJECTS.map(p => p.comuna).filter(Boolean))].sort()
  el.innerHTML = '<option value="">Selecciona comuna</option>' +
    comunas.map(c => `<option value="${c}">${c}</option>`).join('')
}

export function cascUpdate(level) {
  const get = id => document.getElementById(id)?.value || ''
  const set = (id, html, disabled) => {
    const el = document.getElementById(id)
    if (!el) return
    el.innerHTML = html
    el.disabled  = disabled
  }

  const comuna  = get('casc-comuna')
  const entrega = get('casc-entrega')
  const inmob   = get('casc-inmob')

  if (level === 'comuna') {
    if (comuna) {
      const entregas = [...new Set(
        store.PROJECTS.filter(p => p.comuna === comuna).map(p => p.entrega).filter(Boolean)
      )].sort()
      set('casc-entrega',
        '<option value="">Selecciona entrega</option>' +
        entregas.map(e => `<option value="${e}">${e}</option>`).join(''),
        false)
    } else {
      set('casc-entrega', '<option value="">Selecciona entrega</option>', true)
    }
    set('casc-inmob',    '<option value="">Selecciona inmobiliaria</option>', true)
    set('casc-proyecto', '<option value="">Selecciona proyecto</option>',    true)
  }

  if (level === 'entrega') {
    if (entrega) {
      const inmobs = [...new Set(
        store.PROJECTS.filter(p => p.comuna === comuna && p.entrega === entrega)
          .map(p => p.inmobiliaria).filter(Boolean)
      )].sort()
      set('casc-inmob',
        '<option value="">Selecciona inmobiliaria</option>' +
        inmobs.map(i => `<option value="${i}">${i}</option>`).join(''),
        false)
    } else {
      set('casc-inmob', '<option value="">Selecciona inmobiliaria</option>', true)
    }
    set('casc-proyecto', '<option value="">Selecciona proyecto</option>', true)
  }

  if (level === 'inmob') {
    if (inmob) {
      const proyects = store.PROJECTS.filter(p =>
        p.comuna === comuna && p.entrega === entrega && p.inmobiliaria === inmob
      )
      set('casc-proyecto',
        '<option value="">Selecciona proyecto</option>' +
        proyects.map(p => `<option value="${p.id}">${p.nombre}</option>`).join(''),
        false)
    } else {
      set('casc-proyecto', '<option value="">Selecciona proyecto</option>', true)
    }
  }

  const btn = document.getElementById('casc-continuar')
  if (btn) btn.disabled = !get('casc-proyecto')
}

export function cascContinuar() {
  const pid = document.getElementById('casc-proyecto')?.value
  if (!pid) return
  window.openProject(pid)
  window.pmTab('units')
}

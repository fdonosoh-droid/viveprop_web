// En producción (Vercel) usar VITE_API_URL. En local el proxy de Vite redirige /api → backend
const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

async function apiFetch(path) {
  const r = await fetch(BASE + path);
  if (!r.ok) throw new Error(`API ${path}: ${r.status}`);
  return r.json();
}

export const api = {
  stock:      () => apiFetch('/stock'),
  projects:   () => apiFetch('/projects'),
  cc:         () => apiFetch('/cc'),
  uf:         () => apiFetch('/uf'),
  geocodes:   () => apiFetch('/geocodes'),
  priGeo:     () => apiFetch('/pri-geocodes'),
  reloadData: () => fetch(BASE + '/data/reload', { method: 'POST' }).then(r => r.json()),
};

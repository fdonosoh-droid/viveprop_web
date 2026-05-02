async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch ${url}: ${r.status}`);
  return r.json();
}

export const api = {
  stock:      () => fetchJson('/data/stock.json'),
  projects:   () => fetchJson('/data/projects.json'),
  cc:         () => fetchJson('/data/cc.json'),
  uf:         () => fetch('https://mindicador.cl/api/uf')
                      .then(r => r.json())
                      .then(d => ({ valor: d.serie[0].valor, fecha: d.serie[0].fecha.slice(0, 10) })),
  geocodes:   () => fetchJson('/data/geocodes.json'),
  priGeo:     () => fetchJson('/data/pri_geocodes.json'),
  reloadData: () => Promise.resolve({ ok: true }),
};

export const H = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

export function parseNum(s) {
  if (!s) return null;
  const n = parseFloat(String(s).replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? null : n;
}

export const fmt = {
  uf:    n => `UF ${(+n).toLocaleString('es-CL', {minimumFractionDigits:0, maximumFractionDigits:0})}`,
  uf1:   n => `UF ${(+n).toLocaleString('es-CL', {minimumFractionDigits:1, maximumFractionDigits:1})}`,
  pesos: n => `$${Math.round(+n).toLocaleString('es-CL')}`,
};

export function eLbl(e) {
  const l = (e || '').toLowerCase();
  if (l.includes('lista para arrendar')) return 'Disponible';
  if (l.includes('re-acondicionamiento')) return 'Reacondicionando';
  if (l.includes('por desocuparse')) return 'Por desocuparse';
  if (l.includes('aviso')) return 'Aviso salida';
  if (l.includes('check-in')) return 'Prox. check-in';
  if (l.includes('arrendado')) return 'Arrendado';
  return e || '—';
}

export function estadoBadgeStyle(estado) {
  const e = (estado || '').toLowerCase();
  if (e.includes('lista para arrendar')) return 'background:#D1FAE5;color:#065F46';
  if (e.includes('desocuparse')) return 'background:#DBEAFE;color:#1D4ED8';
  if (e.includes('re-acondicionamiento') || e.includes('reacondicionando')) return 'background:#FEF3C7;color:#92400E';
  if (e.includes('aviso')) return 'background:#FEE2E2;color:#991B1B';
  if (e.includes('check-in') || e.includes('esperando')) return 'background:#EDE9FE;color:#5B21B6';
  if (e.includes('arrendado')) return 'background:#F1F5F9;color:#475569';
  return 'background:#F3F4F6;color:#374151';
}

export function parseTipologia(tip) {
  const t = (tip || '').toLowerCase();
  const dm = parseInt(t.match(/(\d+)d/)?.[1]) || 0;
  const bm = parseInt(t.match(/(\d+)b/)?.[1]) || (t.includes('estudio') ? 1 : 0);
  return { dorm: dm, banos: bm };
}

export function isExtra(tip) {
  return /estac|bode|parking|reja|local\s/i.test(tip || '');
}

export function estadoMatch(estado, val) {
  const e = (estado || '').toLowerCase();
  if (val === 'lista')     return e.includes('lista para arrendar');
  if (val === 'desocupar') return e.includes('desocuparse');
  if (val === 'reacond')   return e.includes('re-acondicionamiento') || e.includes('reacondicionando');
  if (val === 'aviso')     return e.includes('aviso');
  if (val === 'proximo')   return e.includes('check-in') || e.includes('esperando');
  if (val === 'arrendado') return e.includes('arrendado');
  return false;
}

export const ESTADO_COLORS = {
  'Lista para arrendar': '#10B981',
  'Por desocuparse':     '#2563EB',
  'Re-acondicionamiento':'#D97706',
  'Aviso salida':        '#DC2626',
  'Esperando check-in':  '#7C3AED',
  'Arrendado':           '#94A3B8',
};

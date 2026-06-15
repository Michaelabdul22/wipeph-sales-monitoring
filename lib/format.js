export function peso(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(Number(value || 0));
}

export function shortDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(value));
}

export function dateTime(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function statusClass(status) {
  const key = String(status || '').toLowerCase().replace(/\s+/g, '-');
  return `status status-${key}`;
}

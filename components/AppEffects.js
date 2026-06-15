'use client';

import { useEffect } from 'react';

function parseSortValue(value) {
  const clean = String(value || '').replace(/[₱,\s]/g, '').trim();
  const numeric = Number(clean);
  if (!Number.isNaN(numeric) && clean !== '') return numeric;
  const date = Date.parse(value);
  if (!Number.isNaN(date)) return date;
  return String(value || '').toLowerCase();
}

export default function AppEffects() {
  useEffect(() => {
    document.querySelectorAll('form').forEach(form => {
      if (form.dataset.guardReady === 'true') return;
      form.dataset.guardReady = 'true';
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) return;
        if (form.dataset.submitting === 'true') {
          event.preventDefault();
          return;
        }
        form.dataset.submitting = 'true';
        const submitter = event.submitter || form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitter) {
          submitter.dataset.originalText = submitter.tagName === 'INPUT' ? submitter.value : submitter.textContent;
          if (submitter.tagName === 'INPUT') submitter.value = 'Processing...';
          else submitter.textContent = 'Processing...';
          submitter.disabled = true;
        }
      });
    });

    document.querySelectorAll('.alert').forEach(alert => {
      if (alert.dataset.alertReady === 'true') return;
      alert.dataset.alertReady = 'true';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '×';
      button.setAttribute('aria-label', 'Close alert');
      button.className = 'alert-close';
      button.addEventListener('click', () => alert.remove());
      alert.prepend(button);
    });

    document.querySelectorAll('table').forEach(table => {
      if (table.dataset.sortReady === 'true') return;
      table.dataset.sortReady = 'true';
      table.querySelectorAll('th').forEach((th, index) => {
        th.title = th.title || 'Sort';
        th.addEventListener('click', () => {
          const tbody = table.tBodies[0];
          if (!tbody) return;
          const direction = table.dataset.sortColumn === String(index) && table.dataset.sortDirection === 'asc' ? 'desc' : 'asc';
          const rows = Array.from(tbody.rows).filter(row => row.cells[index] && !row.classList.contains('empty-db-row'));
          rows.sort((a, b) => {
            const aValue = parseSortValue(a.cells[index].innerText);
            const bValue = parseSortValue(b.cells[index].innerText);
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
          });
          rows.forEach(row => tbody.appendChild(row));
          table.dataset.sortColumn = String(index);
          table.dataset.sortDirection = direction;
        });
      });
    });
  });

  return null;
}

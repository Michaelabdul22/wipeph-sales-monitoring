'use client';

export default function PrintButton({ label = 'Print Report' }) {
  return (
    <button className="btn btn-dark print-button" type="button" onClick={() => window.print()}>
      {label}
    </button>
  );
}

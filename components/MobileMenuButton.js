'use client';

export default function MobileMenuButton() {
  return (
    <button
      className="mobile-nav-btn"
      type="button"
      onClick={() => window.WipeApp?.toggleSidebar('sidebar')}
    >
      Menu
    </button>
  );
}

import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import MobileMenuButton from './MobileMenuButton';
import NavLinks from './NavLinks';

const adminLinks = [
  ['Dashboard', '/admin/dashboard'],
  ['New Transaction', '/admin/add-sales'],
  ['Transaction Status', '/admin/monitoring'],
  ['Sales Report', '/admin/reports'],
  ['Data Management', '/admin/services'],
  ['Users Management', '/admin/users'],
  ['Account Security', '/admin/account'],
  ['Help Center', '/admin/help']
];

const staffLinks = [
  ['New Transaction', '/staff/add-sales'],
  ['Transaction Status', '/staff/monitoring'],
  ['Account Security', '/staff/account'],
  ['Help Center', '/staff/help']
];

export default async function Shell({ role, children }) {
  const user = await requireRole(role === 'admin' ? 'admin' : ['admin', 'staff']);
  const links = role === 'admin' ? adminLinks : staffLinks;

  return (
    <div className="shell">
      <div className="mobile-header">
        <MobileMenuButton />
        <div className="mobile-user-section">
          <span className="mobile-welcome">Welcome, <strong>{user.username}</strong></span>
          <Link className="mobile-logout-btn" href="/logout">Logout</Link>
        </div>
      </div>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-brand sidebar-header">
          <img src="/backgroundfrontpagelogin.png" alt="WIPE PH" />
          <h2>Wipe Philippines</h2>
          <p>{role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</p>
        </div>
        <NavLinks links={links} />
      </aside>
      <main className="main">
        <div className="topbar top-bar">
          <h1>{role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</h1>
          <div className="btn-row user-info">
            <span>Welcome, <strong>{user.username}</strong></span>
            <Link className="btn btn-primary logout-btn" href="/logout">Logout</Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

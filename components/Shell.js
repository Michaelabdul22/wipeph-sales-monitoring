import Link from 'next/link';
import { requireRole } from '@/lib/auth';

const adminLinks = [
  ['Dashboard', '/admin/dashboard'],
  ['New Transaction', '/admin/add-sales'],
  ['Transaction Status', '/admin/monitoring'],
  ['Sales Report', '/admin/reports'],
  ['Data Management', '/admin/services'],
  ['Users Management', '/admin/users'],
  ['Help Center', '/admin/help']
];

const staffLinks = [
  ['New Transaction', '/staff/add-sales'],
  ['Transaction Status', '/staff/monitoring'],
  ['Help Center', '/staff/help']
];

export default async function Shell({ role, children }) {
  const user = await requireRole(role === 'admin' ? 'admin' : ['admin', 'staff']);
  const links = role === 'admin' ? adminLinks : staffLinks;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/backgroundfrontpagelogin.png" alt="WIPE PH" />
          <h2>Wipe Philippines</h2>
          <p>{role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</p>
        </div>
        <nav className="nav">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </aside>
      <main className="main">
        <div className="topbar">
          <h1>{role === 'admin' ? 'Admin Panel' : 'Staff Panel'}</h1>
          <div className="btn-row">
            <span>Welcome, <strong>{user.username}</strong></span>
            <Link className="btn btn-primary" href="/logout">Logout</Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

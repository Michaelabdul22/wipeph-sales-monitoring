'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <nav className="nav sidebar-menu">
      {links.map(([label, href]) => (
        <Link
          key={href}
          href={href}
          className={pathname === href || pathname.startsWith(`${href}/`) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

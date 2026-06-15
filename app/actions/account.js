'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';

function accountPath(role, query = '') {
  return `${role === 'admin' ? '/admin/account' : '/staff/account'}${query}`;
}

export async function changePassword(formData) {
  const user = await requireUser();
  const currentPassword = String(formData.get('current_password') || '');
  const newPassword = String(formData.get('new_password') || '');
  const confirmPassword = String(formData.get('confirm_password') || '');

  if (newPassword.length < 8) redirect(accountPath(user.role, '?error=weak'));
  if (newPassword !== confirmPassword) redirect(accountPath(user.role, '?error=match'));

  const result = await sql`SELECT password FROM users WHERE id = ${user.id} LIMIT 1`;
  const row = result.rows[0];
  if (!row) redirect('/logout');

  const normalizedHash = String(row.password).replace('$2y$', '$2a$');
  const ok = await bcrypt.compare(currentPassword, normalizedHash);
  if (!ok) redirect(accountPath(user.role, '?error=current'));

  const nextHash = await bcrypt.hash(newPassword, 10);
  await sql`UPDATE users SET password = ${nextHash} WHERE id = ${user.id}`;
  redirect(accountPath(user.role, '?saved=1'));
}

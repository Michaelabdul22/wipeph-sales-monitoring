'use server';

import { redirect } from 'next/navigation';
import { setSession, verifyLogin } from '@/lib/auth';

export async function loginAction(_prevState, formData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const user = await verifyLogin(username, password);

  if (!user) {
    return { error: 'Invalid username or password.' };
  }

  await setSession(user);
  redirect(user.role === 'admin' ? '/admin/dashboard' : '/staff/add-sales');
}

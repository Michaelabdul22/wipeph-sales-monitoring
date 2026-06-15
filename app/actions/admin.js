'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { requireRole } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function addCategory(formData) {
  await requireRole('admin');
  const name = String(formData.get('name') || '').trim().toUpperCase();
  if (name) await sql`INSERT INTO services_category (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING`;
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function addServiceType(formData) {
  await requireRole('admin');
  const categoryId = Number(formData.get('category_id'));
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price') || 0);
  if (categoryId && name) {
    await sql`INSERT INTO service_types (category_id, name, price) VALUES (${categoryId}, ${name}, ${price})`;
  }
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function addAddon(formData) {
  await requireRole('admin');
  const categoryId = Number(formData.get('category_id'));
  const name = String(formData.get('name') || '').trim();
  const price = Number(formData.get('price') || 0);
  if (categoryId && name) {
    await sql`INSERT INTO addons (category_id, name, price) VALUES (${categoryId}, ${name}, ${price})`;
  }
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function deleteRecord(formData) {
  await requireRole('admin');
  const table = String(formData.get('table') || '');
  const id = Number(formData.get('id'));
  if (table === 'category' && id) {
    await sql`DELETE FROM services_category WHERE id = ${id}`;
  }
  if (table === 'service' && id) {
    await sql`DELETE FROM service_types WHERE id = ${id}`;
  }
  if (table === 'addon' && id) {
    await sql`DELETE FROM addons WHERE id = ${id}`;
  }
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function addUser(formData) {
  await requireRole('admin');
  const username = String(formData.get('username') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'staff');
  if (username && email && password && ['admin', 'staff'].includes(role)) {
    const hash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (username, email, password, role, status)
      VALUES (${username}, ${email}, ${hash}, ${role}, 'active')
    `;
  }
  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function archiveUser(formData) {
  await requireRole('admin');
  const id = Number(formData.get('id'));
  if (id) await sql`UPDATE users SET status = 'archived' WHERE id = ${id}`;
  revalidatePath('/admin/users');
  redirect('/admin/users');
}

export async function deleteUser(formData) {
  await requireRole('admin');
  const id = Number(formData.get('id'));
  if (id) await sql`DELETE FROM users WHERE id = ${id}`;
  revalidatePath('/admin/users');
  redirect('/admin/users');
}

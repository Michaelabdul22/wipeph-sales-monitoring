import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sql } from './db';

const COOKIE_NAME = 'wipeph_session';

function secret() {
  return process.env.AUTH_SECRET || 'dev-only-change-this-secret';
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

function encode(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

export function makeToken(user) {
  const payload = encode({
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 12
  });
  return `${payload}.${sign(payload)}`;
}

export function readToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (sign(payload) !== signature) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function currentUser() {
  const store = await cookies();
  return readToken(store.get(COOKIE_NAME)?.value);
}

export async function setSession(user) {
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function verifyLogin(username, password) {
  const result = await sql`
    SELECT id, username, password, role
    FROM users
    WHERE username = ${username} AND status = 'active'
    LIMIT 1
  `;
  const user = result.rows[0];
  if (!user) return null;
  const normalizedHash = user.password.replace('$2y$', '$2a$');
  const ok = await bcrypt.compare(password, normalizedHash);
  if (!ok) return null;
  return { id: user.id, username: user.username, role: user.role };
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect('/login?expired=1');
  return user;
}

export async function requireRole(roles) {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect('/logout');
  return user;
}

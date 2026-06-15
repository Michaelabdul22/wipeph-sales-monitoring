'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { sendOtpEmail } from '@/lib/mail';

export async function sendOtp(formData) {
  const email = String(formData.get('email') || '').trim();
  const user = await sql`SELECT id FROM users WHERE email = ${email} AND status = 'active' LIMIT 1`;
  if (!user.rows[0]) redirect('/forgot-password?error=notfound');

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await sql`UPDATE users SET otp_code = ${otp}, otp_expiry = ${expiry} WHERE email = ${email}`;
  await sendOtpEmail(email, otp);
  redirect(`/verify-otp?email=${encodeURIComponent(email)}`);
}

export async function verifyOtp(formData) {
  const email = String(formData.get('email') || '').trim();
  const otp = String(formData.get('otp') || '').trim();
  const result = await sql`
    SELECT id FROM users
    WHERE email = ${email}
      AND otp_code = ${otp}
      AND otp_expiry > NOW()
      AND status = 'active'
    LIMIT 1
  `;
  if (!result.rows[0]) redirect(`/verify-otp?email=${encodeURIComponent(email)}&error=invalid`);
  redirect(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
}

export async function resetPassword(formData) {
  const email = String(formData.get('email') || '').trim();
  const otp = String(formData.get('otp') || '').trim();
  const password = String(formData.get('password') || '');
  const confirm = String(formData.get('confirm_password') || '');
  if (!password || password !== confirm) redirect(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&error=mismatch`);

  const result = await sql`
    SELECT id FROM users
    WHERE email = ${email}
      AND otp_code = ${otp}
      AND otp_expiry > NOW()
      AND status = 'active'
    LIMIT 1
  `;
  if (!result.rows[0]) redirect('/forgot-password?error=expired');

  const hash = await bcrypt.hash(password, 10);
  await sql`UPDATE users SET password = ${hash}, otp_code = NULL, otp_expiry = NULL WHERE email = ${email}`;
  redirect('/login?reset=1');
}

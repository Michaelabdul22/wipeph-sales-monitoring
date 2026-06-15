import { sql } from '@vercel/postgres';

export { sql };

export function money(value) {
  return Number(value || 0);
}

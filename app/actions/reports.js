'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function saveReport(formData) {
  await requireRole('admin');
  const dateFrom = String(formData.get('date_from') || '');
  const dateTo = String(formData.get('date_to') || '');
  if (!dateFrom || !dateTo) redirect('/admin/reports');

  const result = await sql`
    SELECT COUNT(*)::int AS count, COALESCE(SUM(total_price), 0) AS total
    FROM transactions
    WHERE transaction_date::date BETWEEN ${dateFrom}::date AND ${dateTo}::date
      AND status IN ('Paid','Free','X deal','X Deal')
  `;
  const row = result.rows[0];

  await sql`
    INSERT INTO reports (date_from, date_to, total_sales, total_transactions)
    VALUES (${dateFrom}, ${dateTo}, ${row.total}, ${row.count})
  `;

  revalidatePath('/admin/reports');
  redirect(`/admin/reports?from=${dateFrom}&to=${dateTo}&saved=1`);
}

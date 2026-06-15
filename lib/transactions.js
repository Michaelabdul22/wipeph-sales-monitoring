import { sql } from './db';

export async function nextTransactionId() {
  const result = await sql`
    SELECT id FROM transactions
    ORDER BY id DESC
    LIMIT 1
  `;
  const last = result.rows[0]?.id;
  const next = last ? Number(String(last).replace('WPH', '')) + 1 : 1;
  return `WPH${String(next).padStart(5, '0')}`;
}

export async function getServicesAndAddons() {
  const [categories, services, addons] = await Promise.all([
    sql`SELECT id, name FROM services_category ORDER BY name`,
    sql`
      SELECT st.id, st.category_id, st.name, st.price, sc.name AS category
      FROM service_types st
      JOIN services_category sc ON sc.id = st.category_id
      ORDER BY sc.name, st.name
    `,
    sql`
      SELECT a.id, a.category_id, a.name, a.price, sc.name AS category
      FROM addons a
      LEFT JOIN services_category sc ON sc.id = a.category_id
      ORDER BY sc.name, a.name
    `
  ]);

  return {
    categories: categories.rows,
    services: services.rows,
    addons: addons.rows
  };
}

export async function getTransactions() {
  const result = await sql`
    SELECT
      t.id,
      t.transaction_date,
      t.customer_name,
      t.total_price,
      t.amount_paid,
      t.payment_method,
      t.status,
      t.inputted_by,
      t.discount_amount,
      COALESCE(string_agg(DISTINCT sc.name, ', '), 'N/A') AS categories,
      COALESCE(string_agg(DISTINCT st.name, ', '), 'N/A') AS services,
      COALESCE((
        SELECT string_agg(a.name, ', ' ORDER BY a.name)
        FROM transaction_addons ta
        JOIN addons a ON a.id = ta.addon_id
        WHERE ta.transaction_id = t.id
      ), '-') AS addon_names
    FROM transactions t
    LEFT JOIN transaction_items ti ON ti.transaction_id = t.id
    LEFT JOIN service_types st ON st.id = ti.service_type_id
    LEFT JOIN services_category sc ON sc.id = st.category_id
    GROUP BY t.id
    ORDER BY t.transaction_date DESC
  `;

  return result.rows.map(row => {
    const total = Number(row.total_price || 0);
    const paid = Number(row.amount_paid || 0);
    const settled = ['paid', 'cancelled', 'free', 'x deal'].includes(String(row.status).toLowerCase());
    return { ...row, balance: settled ? 0 : Math.max(0, total - paid) };
  });
}

export async function getActivityLogs() {
  const result = await sql`
    SELECT transaction_id, old_status, new_status, old_amount_paid, new_amount_paid, changed_by, changed_at, note
    FROM transaction_status_history
    ORDER BY changed_at DESC, id DESC
    LIMIT 10
  `;
  return result.rows;
}

export async function dashboardStats() {
  const [today, week, month, year, total, best] = await Promise.all([
    sql`SELECT COUNT(*)::int count, COALESCE(SUM(total_price), 0) total FROM transactions WHERE transaction_date::date = CURRENT_DATE AND status IN ('Paid','Free','X deal','X Deal')`,
    sql`SELECT COUNT(*)::int count, COALESCE(SUM(total_price), 0) total FROM transactions WHERE transaction_date::date >= CURRENT_DATE - INTERVAL '7 days' AND status IN ('Paid','Free','X deal','X Deal')`,
    sql`SELECT COUNT(*)::int count, COALESCE(SUM(total_price), 0) total FROM transactions WHERE date_trunc('month', transaction_date) = date_trunc('month', CURRENT_DATE) AND status IN ('Paid','Free','X deal','X Deal')`,
    sql`SELECT COUNT(*)::int count, COALESCE(SUM(total_price), 0) total FROM transactions WHERE date_trunc('year', transaction_date) = date_trunc('year', CURRENT_DATE) AND status IN ('Paid','Free','X deal','X Deal')`,
    sql`SELECT COUNT(*)::int count, COALESCE(SUM(total_price), 0) total FROM transactions WHERE status IN ('Paid','Free','X deal','X Deal')`,
    sql`
      SELECT sc.name, COALESCE(SUM(t.total_price), 0) revenue
      FROM transaction_items ti
      JOIN transactions t ON t.id = ti.transaction_id
      JOIN service_types st ON st.id = ti.service_type_id
      JOIN services_category sc ON sc.id = st.category_id
      WHERE t.status IN ('Paid','Free','X deal','X Deal')
      GROUP BY sc.name
      ORDER BY revenue DESC
      LIMIT 1
    `
  ]);

  return {
    today: today.rows[0],
    week: week.rows[0],
    month: month.rows[0],
    year: year.rows[0],
    total: total.rows[0],
    best: best.rows[0]?.name || 'N/A'
  };
}

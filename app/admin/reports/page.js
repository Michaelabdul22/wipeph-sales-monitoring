import PageTitle from '@/components/PageTitle';
import { saveReport } from '@/app/actions/reports';
import { peso, shortDate } from '@/lib/format';
import { sql } from '@/lib/db';

export default async function ReportsPage({ searchParams }) {
  const params = await searchParams;
  const from = params?.from || new Date().toISOString().slice(0, 10);
  const to = params?.to || new Date().toISOString().slice(0, 10);

  const [summary, details, saved] = await Promise.all([
    sql`
      SELECT COUNT(*)::int AS count, COALESCE(SUM(total_price), 0) AS total
      FROM transactions
      WHERE transaction_date::date BETWEEN ${from}::date AND ${to}::date
        AND status IN ('Paid','Free','X deal','X Deal')
    `,
    sql`
      SELECT t.id, t.transaction_date, t.customer_name, t.payment_method, t.total_price,
             COALESCE(string_agg(DISTINCT sc.name, ', '), 'N/A') AS categories,
             COALESCE(string_agg(DISTINCT st.name || ' (x' || ti.quantity || ')', ', '), 'N/A') AS services
      FROM transactions t
      LEFT JOIN transaction_items ti ON ti.transaction_id = t.id
      LEFT JOIN service_types st ON st.id = ti.service_type_id
      LEFT JOIN services_category sc ON sc.id = st.category_id
      WHERE t.transaction_date::date BETWEEN ${from}::date AND ${to}::date
        AND t.status IN ('Paid','Free','X deal','X Deal')
      GROUP BY t.id
      ORDER BY t.transaction_date DESC
    `,
    sql`SELECT * FROM reports ORDER BY generated_at DESC, id DESC LIMIT 20`
  ]);

  return (
    <>
      <PageTitle title="Sales Report" subtitle="Generate, save, and print formal sales reports." />
      {params?.saved ? <div className="alert">Report saved to database history.</div> : null}
      <form action={saveReport} className="card grid grid-3">
        <label className="field">From<input className="input" name="date_from" type="date" defaultValue={from} /></label>
        <label className="field">To<input className="input" name="date_to" type="date" defaultValue={to} /></label>
        <div className="field"><span>&nbsp;</span><button className="btn btn-primary">Generate & Save</button></div>
      </form>

      <section className="card print-area" style={{ marginTop: 18 }}>
        <div className="btn-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2>WIPE PHILIPPINES</h2>
            <p>Sales Monitoring System</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3>SALES REPORT</h3>
            <p>{shortDate(from)} - {shortDate(to)}</p>
          </div>
        </div>
        <section className="grid grid-3">
          <div className="card"><strong>Covered Period</strong><p>{shortDate(from)} - {shortDate(to)}</p></div>
          <div className="card"><strong>Total Transactions</strong><p>{summary.rows[0].count}</p></div>
          <div className="card"><strong>Total Sales</strong><p>{peso(summary.rows[0].total)}</p></div>
        </section>
        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table>
            <thead><tr><th>Receipt No.</th><th>Date</th><th>Customer</th><th>Category</th><th>Services</th><th>Payment</th><th>Amount</th></tr></thead>
            <tbody>
              {details.rows.map(row => (
                <tr key={row.id}>
                  <td data-label="Receipt No.">{row.id}</td>
                  <td data-label="Date">{shortDate(row.transaction_date)}</td>
                  <td data-label="Customer">{row.customer_name}</td>
                  <td data-label="Category">{row.categories}</td>
                  <td data-label="Services">{row.services}</td>
                  <td data-label="Payment">{row.payment_method}</td>
                  <td data-label="Amount">{peso(row.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 style={{ textAlign: 'right' }}>GRAND TOTAL {peso(summary.rows[0].total)}</h3>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <h3>Saved Reports History</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Period</th><th>Total Sales</th><th>Transactions</th><th>Generated</th></tr></thead>
            <tbody>
              {saved.rows.map(row => (
                <tr key={row.id}>
                  <td data-label="ID">{row.id}</td>
                  <td data-label="Period">{shortDate(row.date_from)} - {shortDate(row.date_to)}</td>
                  <td data-label="Total">{peso(row.total_sales)}</td>
                  <td data-label="Transactions">{row.total_transactions}</td>
                  <td data-label="Generated">{shortDate(row.generated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

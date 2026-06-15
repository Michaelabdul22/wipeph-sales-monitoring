import PageTitle from '@/components/PageTitle';
import { dashboardStats, getTransactions } from '@/lib/transactions';
import { peso, dateTime, statusClass } from '@/lib/format';

export default async function DashboardPage() {
  const [stats, transactions] = await Promise.all([dashboardStats(), getTransactions()]);
  const latest = transactions.slice(0, 6);

  const cards = [
    ["Today's Sales", stats.today],
    ['Weekly Sales', stats.week],
    ['Monthly Sales', stats.month],
    ['Yearly Sales', stats.year],
    ['Total Transactions', stats.total],
    ['Best Selling Service', { total: stats.best, count: 'Most Revenue' }]
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Overview of sales and recent transaction activity." />
      <section className="grid grid-3">
        {cards.map(([label, item]) => (
          <div className="card" key={label}>
            <h3 style={{ color: '#555', textTransform: 'uppercase', fontSize: 14 }}>{label}</h3>
            <div className="stat-value">{typeof item.total === 'number' || !Number.isNaN(Number(item.total)) ? peso(item.total) : item.total}</div>
            <p style={{ color: '#777' }}>{item.count} {typeof item.count === 'number' ? 'transaction(s)' : ''}</p>
          </div>
        ))}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <h3>Recent Transactions</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {latest.map(row => (
                <tr key={row.id}>
                  <td data-label="ID">{row.id}</td>
                  <td data-label="Customer">{row.customer_name}</td>
                  <td data-label="Service">{row.categories}<br /><small>{row.services}</small></td>
                  <td data-label="Total">{peso(row.total_price)}</td>
                  <td data-label="Status"><span className={statusClass(row.status)}>{row.status}</span></td>
                  <td data-label="Date">{dateTime(row.transaction_date)}</td>
                </tr>
              ))}
              {!latest.length ? <tr><td colSpan="6">No transactions yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

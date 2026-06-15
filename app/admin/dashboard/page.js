import PageTitle from '@/components/PageTitle';
import DashboardCharts from '@/components/DashboardCharts';
import { dashboardChartData, dashboardStats, getTransactions } from '@/lib/transactions';
import { peso, dateTime, statusClass } from '@/lib/format';

export default async function DashboardPage() {
  const [stats, transactions, chartData] = await Promise.all([dashboardStats(), getTransactions(), dashboardChartData()]);
  const latest = transactions.slice(0, 6);

  const cards = [
    { label: "Today's Sales", value: peso(stats.today.total), subtitle: `${stats.today.count} transaction(s)` },
    { label: 'Weekly Sales', value: peso(stats.week.total), subtitle: `${stats.week.count} transaction(s)` },
    { label: 'Monthly Sales', value: peso(stats.month.total), subtitle: `${stats.month.count} transaction(s)` },
    { label: 'Yearly Sales', value: peso(stats.year.total), subtitle: `${stats.year.count} transaction(s)` },
    { label: 'Total Transactions', value: stats.total.count, subtitle: `${peso(stats.total.total)} total` },
    { label: 'Outstanding Balance', value: peso(stats.outstanding?.balance || 0), subtitle: `${stats.outstanding?.count || 0} pending` },
    { label: 'Today Pending', value: stats.unpaidToday, subtitle: 'unpaid / with balance' },
    { label: 'Latest Customer', value: stats.latest?.customer_name || 'N/A', subtitle: stats.latest?.id || 'No transaction' },
    { label: 'Best Selling Service', value: stats.best, subtitle: 'Most Revenue' }
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Overview of sales and recent transaction activity." />
      <section className="dashboard-grid">
        {cards.map(card => (
          <div className="card metric-card" key={card.label}>
            <div className="card-title">{card.label}</div>
            <div className="card-value">{card.value}</div>
            <div className="card-subtitle">{card.subtitle}</div>
          </div>
        ))}
      </section>

      <DashboardCharts chartData={chartData} bestSellingName={stats.best} />

      <section className="card table-container" style={{ marginTop: 20 }}>
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
              {!latest.length ? <tr><td colSpan="6"><div className="empty-state">No recent transactions yet. Saved sales will show here.</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

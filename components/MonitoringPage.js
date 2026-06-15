import { updateTransactionStatus } from '@/app/actions/sales';
import { dateTime, peso, statusClass } from '@/lib/format';
import { getActivityLogs, getTransactions } from '@/lib/transactions';

export default async function MonitoringPage() {
  const [transactions, logs] = await Promise.all([getTransactions(), getActivityLogs()]);
  const summary = transactions.reduce((acc, row) => {
    const key = String(row.status || '').toLowerCase();
    acc.total += 1;
    if (key === 'paid') acc.paid += 1;
    if (key === 'unpaid') acc.unpaid += 1;
    if (key === 'with balance') acc.withBalance += 1;
    if (key === 'cancelled') acc.cancelled += 1;
    return acc;
  }, { total: 0, paid: 0, unpaid: 0, withBalance: 0, cancelled: 0 });

  return (
    <div className="grid">
      <section className="grid grid-3 summary-grid">
        <div className="card summary-card"><strong>Total</strong><div className="stat-value">{summary.total}</div></div>
        <div className="card summary-card"><strong>Paid</strong><div className="stat-value">{summary.paid}</div></div>
        <div className="card summary-card"><strong>With Balance</strong><div className="stat-value">{summary.withBalance}</div></div>
      </section>

      <section className="card table-container">
        <h3 className="table-title">Transactions</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(row => (
                <tr key={row.id}>
                  <td data-label="ID"><strong>{row.id}</strong><br /><small>{dateTime(row.transaction_date)} · {row.inputted_by}</small></td>
                  <td data-label="Customer">{row.customer_name}</td>
                  <td data-label="Service">{row.categories}<br /><small>{row.services}</small><br /><small>Add-ons: {row.addon_names}</small></td>
                  <td data-label="Total">{peso(row.total_price)}</td>
                  <td data-label="Balance">{peso(row.balance)}</td>
                  <td data-label="Status"><span className={statusClass(row.status)}>{row.status}</span></td>
                  <td data-label="Update">
                    <form action={updateTransactionStatus} className="grid" style={{ minWidth: 180 }}>
                      <input type="hidden" name="transaction_id" value={row.id} />
                      <select className="select" name="new_status" defaultValue={row.status}>
                        <option>Paid</option>
                        <option>Unpaid</option>
                        <option>With Balance</option>
                        <option>Cancelled</option>
                        <option>X deal</option>
                      </select>
                      <input className="input" name="cash_received" type="number" step="0.01" min="0" placeholder="Cash received" />
                      <button className="btn btn-dark" type="submit">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
              {!transactions.length ? <tr><td colSpan="7"><div className="empty-state">No transactions yet. New sales will appear here.</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card table-container">
        <h3 className="table-title">Activity Log</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Change</th>
                <th>Amount</th>
                <th>By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={`${log.transaction_id}-${index}`}>
                  <td data-label="ID">{log.transaction_id}</td>
                  <td data-label="Change">{log.old_status} → {log.new_status}</td>
                  <td data-label="Amount">{peso(log.old_amount_paid)} → {peso(log.new_amount_paid)}</td>
                  <td data-label="By">{log.changed_by}</td>
                  <td data-label="Date">{dateTime(log.changed_at)}</td>
                </tr>
              ))}
              {!logs.length ? <tr><td colSpan="5"><div className="empty-state">No activity history yet. Status changes will be listed here.</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

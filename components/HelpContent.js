export default function HelpContent({ role }) {
  const admin = role === 'admin';
  return (
    <section className="card grid">
      <h2>{admin ? 'Admin Guide' : 'Staff Guide'}</h2>
      <p>
        Use this guide as a quick reference for common {admin ? 'admin' : 'staff'} tasks. Service names,
        add-ons, and prices should stay updated so transactions and reports remain accurate.
      </p>
      <div className="card">
        <h3>New Transaction</h3>
        <ul>
          <li>Select one or more service types.</li>
          <li>Add-ons appear based on the selected service category.</li>
          <li>Set payment status carefully to keep monitoring accurate.</li>
        </ul>
      </div>
      <div className="card">
        <h3>Transaction Status</h3>
        <ul>
          <li>Use Paid, Unpaid, With Balance, Cancelled, or X deal consistently.</li>
          <li>With Balance can accept additional payment until fully paid.</li>
          <li>Every status update is stored in activity history.</li>
        </ul>
      </div>
      {admin ? (
        <>
          <div className="card">
            <h3>Reports</h3>
            <ul>
              <li>Generate reports by date range.</li>
              <li>Saved report history is stored for later checking.</li>
            </ul>
          </div>
          <div className="card">
            <h3>Data and Users</h3>
            <ul>
              <li>Maintain service categories, service types, add-ons, and prices in Data Management.</li>
              <li>Create separate accounts for admin and staff users.</li>
            </ul>
          </div>
        </>
      ) : null}
    </section>
  );
}

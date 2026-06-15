import PageTitle from '@/components/PageTitle';
import { addUser, archiveUser, deleteUser } from '@/app/actions/admin';
import { requireRole } from '@/lib/auth';
import { sql } from '@/lib/db';

export default async function UsersPage({ searchParams }) {
  const params = await searchParams;
  const currentUser = await requireRole('admin');
  const users = await sql`SELECT id, username, email, role, status FROM users ORDER BY id`;

  return (
    <>
      <PageTitle title="User Management" subtitle="Create and manage admin and staff accounts." />
      {params?.saved ? <div className="alert alert-success">User account created successfully.</div> : null}
      {params?.error === 'weak' ? <div className="alert alert-danger">Password must be at least 8 characters.</div> : null}
      <form action={addUser} className="card form-container grid">
        <h3 className="form-title">Add New User Account</h3>
        <div className="grid grid-3">
          <label className="field">Username<input className="input" name="username" placeholder="Enter username" required /></label>
          <label className="field">Gmail Account<input className="input" name="email" type="email" placeholder="example@gmail.com" required /></label>
          <label className="field">Password<input className="input" name="password" type="password" placeholder="Set password" minLength="8" required /></label>
          <label className="field">Role<select className="select" name="role"><option value="admin">Admin</option><option value="staff">Staff</option></select></label>
        </div>
        <button className="btn btn-primary">Create New User Account</button>
      </form>

      <section className="card table-container" style={{ marginTop: 18 }}>
        <h3 className="table-title">Registered Users</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.rows.map(user => (
                <tr key={user.id}>
                  <td data-label="ID">{user.id}</td>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Role">{String(user.role).toUpperCase()}</td>
                  <td data-label="Status">{user.status}</td>
                  <td data-label="Actions" className="btn-row">
                    {Number(user.id) === Number(currentUser.id) ? (
                      <span style={{ color: '#777', fontWeight: 700 }}>Current account</span>
                    ) : (
                      <>
                        <form action={archiveUser}><input type="hidden" name="id" value={user.id} /><button className="btn btn-light">Archive</button></form>
                        <form action={deleteUser}><input type="hidden" name="id" value={user.id} /><button className="btn btn-danger">Delete</button></form>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {!users.rows.length ? <tr><td colSpan="6"><div className="empty-state">No registered users yet.</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

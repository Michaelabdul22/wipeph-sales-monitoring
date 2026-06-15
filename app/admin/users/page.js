import PageTitle from '@/components/PageTitle';
import { addUser, archiveUser, deleteUser } from '@/app/actions/admin';
import { sql } from '@/lib/db';

export default async function UsersPage() {
  const users = await sql`SELECT id, username, email, role, status FROM users ORDER BY id`;

  return (
    <>
      <PageTitle title="User Management" subtitle="Create and manage admin and staff accounts." />
      <form action={addUser} className="card grid">
        <h3>Add New User Account</h3>
        <div className="grid grid-3">
          <input className="input" name="username" placeholder="Username" required />
          <input className="input" name="email" type="email" placeholder="Gmail account" required />
          <input className="input" name="password" type="password" placeholder="Password" required />
          <select className="select" name="role"><option value="admin">Admin</option><option value="staff">Staff</option></select>
        </div>
        <button className="btn btn-primary">Create New User Account</button>
      </form>

      <section className="card" style={{ marginTop: 18 }}>
        <h3>Registered Users</h3>
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
                    <form action={archiveUser}><input type="hidden" name="id" value={user.id} /><button className="btn btn-light">Archive</button></form>
                    <form action={deleteUser}><input type="hidden" name="id" value={user.id} /><button className="btn btn-danger">Delete</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

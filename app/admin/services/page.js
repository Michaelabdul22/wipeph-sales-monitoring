import PageTitle from '@/components/PageTitle';
import { addAddon, addCategory, addServiceType, deleteRecord } from '@/app/actions/admin';
import { peso } from '@/lib/format';
import { sql } from '@/lib/db';

export default async function ServicesPage() {
  const [categories, services, addons] = await Promise.all([
    sql`SELECT * FROM services_category ORDER BY name`,
    sql`SELECT st.*, sc.name AS category FROM service_types st JOIN services_category sc ON sc.id = st.category_id ORDER BY sc.name, st.name`,
    sql`SELECT a.*, sc.name AS category FROM addons a JOIN services_category sc ON sc.id = a.category_id ORDER BY sc.name, a.name`
  ]);

  return (
    <>
      <PageTitle title="Data Management" subtitle="Maintain service categories, service types, and add-ons." />
      <section className="grid grid-3 management-grid">
        <form action={addCategory} className="card form-container grid">
          <h3>Add Category</h3>
          <input className="input" name="name" placeholder="Category name" required />
          <button className="btn btn-primary">Add Category</button>
        </form>
        <form action={addServiceType} className="card form-container grid">
          <h3>Add Service Type</h3>
          <select className="select" name="category_id">{categories.rows.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
          <input className="input" name="name" placeholder="Service name" required />
          <input className="input" name="price" type="number" step="0.01" placeholder="Price" required />
          <button className="btn btn-primary">Add Service</button>
        </form>
        <form action={addAddon} className="card form-container grid">
          <h3>Add Add-on</h3>
          <select className="select" name="category_id">{categories.rows.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select>
          <input className="input" name="name" placeholder="Add-on name" required />
          <input className="input" name="price" type="number" step="0.01" placeholder="Price" required />
          <button className="btn btn-primary">Add Add-on</button>
        </form>
      </section>

      <section className="card table-container" style={{ marginTop: 18 }}>
        <h3 className="table-title">Service Types</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Category</th><th>Name</th><th>Price</th><th>Action</th></tr></thead>
            <tbody>
              {services.rows.map(row => (
                <tr key={row.id}>
                  <td data-label="Category">{row.category}</td>
                  <td data-label="Name">{row.name}</td>
                  <td data-label="Price">{peso(row.price)}</td>
                  <td data-label="Action"><DeleteButton table="service" id={row.id} /></td>
                </tr>
              ))}
              {!services.rows.length ? <tr><td colSpan="4"><div className="empty-state">No service types yet. Add one using the form above.</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card table-container" style={{ marginTop: 18 }}>
        <h3 className="table-title">Add-ons</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Category</th><th>Name</th><th>Price</th><th>Action</th></tr></thead>
            <tbody>
              {addons.rows.map(row => (
                <tr key={row.id}>
                  <td data-label="Category">{row.category}</td>
                  <td data-label="Name">{row.name}</td>
                  <td data-label="Price">{peso(row.price)}</td>
                  <td data-label="Action"><DeleteButton table="addon" id={row.id} /></td>
                </tr>
              ))}
              {!addons.rows.length ? <tr><td colSpan="4"><div className="empty-state">No add-ons yet. Add-ons will appear by category.</div></td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function DeleteButton({ table, id }) {
  return (
    <form action={deleteRecord}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button className="btn btn-danger" type="submit">Delete</button>
    </form>
  );
}

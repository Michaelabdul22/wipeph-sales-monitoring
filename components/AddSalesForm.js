'use client';

import { useMemo, useState } from 'react';
import { createSale } from '@/app/actions/sales';
import { peso } from '@/lib/format';

export default function AddSalesForm({ categories, services, addons, saved, error }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedServices, setSelectedServices] = useState([]);

  const categoryById = useMemo(() => Object.fromEntries(categories.map(cat => [cat.id, cat.name])), [categories]);
  const selectedCategoryIds = useMemo(() => {
    return new Set(services.filter(service => selectedServices.includes(service.id)).map(service => service.category_id));
  }, [services, selectedServices]);

  const filteredServices = services.filter(service => {
    const text = `${service.category} ${service.name} ${service.price}`.toLowerCase();
    const matchesSearch = text.includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'all' || Number(activeCategory) === Number(service.category_id);
    return matchesSearch && matchesCategory;
  });

  const visibleAddons = addons.filter(addon => selectedCategoryIds.has(addon.category_id));

  function toggleService(id) {
    setSelectedServices(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  return (
    <form action={createSale} className="grid">
      {saved ? <div className="alert">Saved transaction: <strong>{saved}</strong></div> : null}
      {error ? <div className="alert">Please complete customer name and at least one service.</div> : null}

      <div className="card grid">
        <label className="field">
          Customer Name
          <input className="input" name="customer_name" placeholder="Full Name" required />
        </label>

        <div className="grid">
          <strong>Service Type</strong>
          <input className="input" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search service name or price..." />
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={() => setActiveCategory('all')}>All</button>
            {categories.map(category => (
              <button type="button" className="btn btn-light" key={category.id} onClick={() => setActiveCategory(String(category.id))}>
                {category.name}
              </button>
            ))}
          </div>
          <div className="service-picker">
            {filteredServices.map(service => (
              <label className="choice-card" key={service.id}>
                <input type="checkbox" name="service_type_ids" value={service.id} checked={selectedServices.includes(service.id)} onChange={() => toggleService(service.id)} />
                <strong>{service.category} {service.name}</strong>
                <span>{peso(service.price)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid">
          <strong>Add-ons</strong>
          {visibleAddons.length ? (
            <div className="addon-list">
              {visibleAddons.map(addon => (
                <label className="choice-card" key={addon.id}>
                  <input type="checkbox" name="addons" value={addon.id} />
                  <strong>{categoryById[addon.category_id] || addon.category}</strong>
                  <span>{addon.name} - {peso(addon.price)}</span>
                </label>
              ))}
            </div>
          ) : <p style={{ color: '#777' }}>Select a service to show available add-ons.</p>}
        </div>

        <div className="grid grid-3">
          <label className="field">Quantity<input className="input" name="quantity" type="number" min="1" defaultValue="1" /></label>
          <label className="field">Payment Method<select className="select" name="payment_method"><option>Cash</option><option>E-Wallet</option></select></label>
          <label className="field">Status<select className="select" name="status"><option>Paid</option><option>Unpaid</option><option>With Balance</option><option>Cancelled</option><option>X deal</option></select></label>
          <label className="field">Amount Paid<input className="input" name="amount_paid" type="number" step="0.01" min="0" defaultValue="0" /></label>
          <label className="field">Discount<input className="input" name="discount_amount" type="number" step="0.01" min="0" defaultValue="0" /></label>
        </div>

        <button className="btn btn-primary" type="submit">Save Transaction</button>
      </div>
    </form>
  );
}

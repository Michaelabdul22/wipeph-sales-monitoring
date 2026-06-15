'use client';

import { useMemo, useState } from 'react';
import { createSale } from '@/app/actions/sales';
import { peso } from '@/lib/format';

export default function AddSalesForm({ categories, services, addons, saved, error }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [status, setStatus] = useState('Paid');

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
  const selectedServiceRows = services.filter(service => selectedServices.includes(service.id));
  const selectedAddonRows = addons.filter(addon => selectedAddons.includes(addon.id) && selectedCategoryIds.has(addon.category_id));
  const servicesTotal = selectedServiceRows.reduce((sum, service) => sum + Number(service.price || 0), 0);
  const addonsTotal = selectedAddonRows.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
  const subtotal = (servicesTotal + addonsTotal) * quantity;
  const discountedTotal = Math.max(0, subtotal - discount);
  const zeroStatuses = ['Cancelled', 'X deal'];
  const finalTotal = zeroStatuses.includes(status) ? 0 : discountedTotal;
  const computedPaid = status === 'Paid' ? finalTotal : zeroStatuses.includes(status) || status === 'Unpaid' ? 0 : Math.min(amountPaid, finalTotal);
  const balance = status === 'With Balance' ? Math.max(0, finalTotal - computedPaid) : 0;

  function toggleService(id) {
    setSelectedServices(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  function toggleAddon(id) {
    setSelectedAddons(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  return (
    <form action={createSale} className="grid form-shell">
      {saved ? <div className="alert">Saved transaction: <strong>{saved}</strong></div> : null}
      {error ? <div className="alert">Please complete customer name and at least one service.</div> : null}

      <div className="card form-container grid">
        <h3 className="form-title">Transaction Details</h3>
        <label className="field">
          Customer Name
          <input className="input" name="customer_name" placeholder="Full Name" required />
        </label>

        <div className="transaction-layout">
          <div className="transaction-main grid">
        <div className="grid">
          <strong>Service Type</strong>
          <input className="input" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search service name or price..." />
          <div className="btn-row service-tabs">
            <button type="button" className="btn btn-primary" onClick={() => setActiveCategory('all')}>All</button>
            {categories.map(category => (
              <button type="button" className={`btn btn-light ${String(activeCategory) === String(category.id) ? 'active-filter' : ''}`} key={category.id} onClick={() => setActiveCategory(String(category.id))}>
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
                  <input type="checkbox" name="addons" value={addon.id} checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                  <strong>{categoryById[addon.category_id] || addon.category}</strong>
                  <span>{addon.name} - {peso(addon.price)}</span>
                </label>
              ))}
            </div>
          ) : <p style={{ color: '#777' }}>Select a service to show available add-ons.</p>}
        </div>

        <div className="grid grid-3">
          <label className="field">Quantity<input className="input" name="quantity" type="number" min="1" value={quantity} onChange={event => setQuantity(Math.max(1, Number(event.target.value || 1)))} /></label>
          <label className="field">Payment Method<select className="select" name="payment_method"><option>Cash</option><option>E-Wallet</option></select></label>
          <label className="field">Status<select className="select" name="status" value={status} onChange={event => setStatus(event.target.value)}><option>Paid</option><option>Unpaid</option><option>With Balance</option><option>Cancelled</option><option>X deal</option></select></label>
          <label className="field">Amount Paid<input className="input" name="amount_paid" type="number" step="0.01" min="0" value={amountPaid} onChange={event => setAmountPaid(Math.max(0, Number(event.target.value || 0)))} /></label>
          <label className="field">Discount<input className="input" name="discount_amount" type="number" step="0.01" min="0" value={discount} onChange={event => setDiscount(Math.max(0, Number(event.target.value || 0)))} /></label>
        </div>
          </div>

          <aside className="transaction-summary">
            <h3>Transaction Summary</h3>
            <div className="summary-lines">
              <span>Services</span><strong>{peso(servicesTotal)}</strong>
              <span>Add-ons</span><strong>{peso(addonsTotal)}</strong>
              <span>Quantity</span><strong>{quantity}</strong>
              <span>Subtotal</span><strong>{peso(subtotal)}</strong>
              <span>Discount</span><strong>- {peso(discount)}</strong>
              <span>Total</span><strong>{peso(finalTotal)}</strong>
              <span>Amount Paid</span><strong>{peso(computedPaid)}</strong>
              <span>Balance</span><strong>{peso(balance)}</strong>
            </div>
            <div className="selected-preview">
              <strong>Selected Services</strong>
              {selectedServiceRows.length ? selectedServiceRows.map(item => <small key={item.id}>{item.category} - {item.name}</small>) : <small>No service selected.</small>}
              <strong>Add-ons</strong>
              {selectedAddonRows.length ? selectedAddonRows.map(item => <small key={item.id}>{item.name}</small>) : <small>No add-on selected.</small>}
            </div>
          </aside>
        </div>

        <button className="btn btn-primary btn-save-wide" type="submit">Save Transaction</button>
      </div>
    </form>
  );
}

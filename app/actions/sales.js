'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import { nextTransactionId } from '@/lib/transactions';

function normalizeStatus(status) {
  if (status === 'With balance') return 'With Balance';
  if (status === 'X deal') return 'X deal';
  return status || 'Paid';
}

export async function createSale(formData) {
  const user = await requireUser();
  const customerName = String(formData.get('customer_name') || '').trim();
  const serviceTypeIds = formData.getAll('service_type_ids').map(Number).filter(Boolean);
  const addonIds = formData.getAll('addons').map(Number).filter(Boolean);
  const quantity = Math.max(1, Number(formData.get('quantity') || 1));
  const paymentMethod = String(formData.get('payment_method') || 'Cash');
  const status = normalizeStatus(String(formData.get('status') || 'Paid'));
  const discountAmount = Math.max(0, Number(formData.get('discount_amount') || 0));
  let amountPaid = Math.max(0, Number(formData.get('amount_paid') || 0));

  if (!customerName || serviceTypeIds.length === 0) {
    redirect(user.role === 'admin' ? '/admin/add-sales?error=missing' : '/staff/add-sales?error=missing');
  }

  let servicesTotal = 0;
  for (const serviceId of serviceTypeIds) {
    const result = await sql`SELECT price FROM service_types WHERE id = ${serviceId}`;
    if (result.rows[0]) servicesTotal += Number(result.rows[0].price);
  }

  let addonsTotal = 0;
  for (const addonId of addonIds) {
    const result = await sql`SELECT price FROM addons WHERE id = ${addonId}`;
    if (result.rows[0]) addonsTotal += Number(result.rows[0].price);
  }
  const subtotal = Math.max(0, ((servicesTotal + addonsTotal) * quantity) - discountAmount);
  const zeroStatuses = ['Free', 'Cancelled', 'X deal', 'X Deal'];
  const totalToSave = zeroStatuses.includes(status) ? 0 : subtotal;

  if (status === 'Paid') amountPaid = subtotal;
  if (zeroStatuses.includes(status)) amountPaid = 0;
  if (status === 'Unpaid') amountPaid = 0;
  if (status === 'With Balance') amountPaid = Math.min(amountPaid, subtotal);

  const transactionId = await nextTransactionId();

  await sql`
    INSERT INTO transactions (id, customer_name, total_price, amount_paid, payment_method, status, inputted_by, discount_amount)
    VALUES (${transactionId}, ${customerName}, ${totalToSave}, ${amountPaid}, ${paymentMethod}, ${status}, ${user.username}, ${discountAmount})
  `;

  for (const serviceId of serviceTypeIds) {
    await sql`
      INSERT INTO transaction_items (transaction_id, service_type_id, quantity)
      VALUES (${transactionId}, ${serviceId}, ${quantity})
    `;
  }

  for (const addonId of addonIds) {
    await sql`
      INSERT INTO transaction_addons (transaction_id, addon_id)
      VALUES (${transactionId}, ${addonId})
    `;
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/monitoring');
  revalidatePath('/staff/monitoring');
  redirect(user.role === 'admin' ? `/admin/add-sales?saved=${transactionId}` : `/staff/add-sales?saved=${transactionId}`);
}

export async function updateTransactionStatus(formData) {
  const user = await requireUser();
  const transactionId = String(formData.get('transaction_id') || '');
  const newStatus = normalizeStatus(String(formData.get('new_status') || 'Paid'));
  const cashReceived = Math.max(0, Number(formData.get('cash_received') || 0));

  const current = await sql`
    SELECT total_price, amount_paid, status FROM transactions WHERE id = ${transactionId}
  `;
  const row = current.rows[0];
  if (!row) redirect(user.role === 'admin' ? '/admin/monitoring?error=notfound' : '/staff/monitoring?error=notfound');

  const totalPrice = Number(row.total_price || 0);
  const currentPaid = Number(row.amount_paid || 0);
  let amountPaid = currentPaid;
  let statusToSave = newStatus;

  if (['Cancelled', 'X deal', 'X Deal'].includes(newStatus)) amountPaid = 0;
  if (newStatus === 'Paid') amountPaid = totalPrice;
  if (newStatus === 'Unpaid') amountPaid = 0;
  if (newStatus === 'With Balance') {
    amountPaid = Math.min(totalPrice, currentPaid + cashReceived);
    if (totalPrice > 0 && amountPaid >= totalPrice) statusToSave = 'Paid';
  }

  await sql`
    UPDATE transactions
    SET status = ${statusToSave}, amount_paid = ${amountPaid}
    WHERE id = ${transactionId}
  `;

  await sql`
    INSERT INTO transaction_status_history (transaction_id, old_status, new_status, old_amount_paid, new_amount_paid, changed_by)
    VALUES (${transactionId}, ${row.status}, ${statusToSave}, ${currentPaid}, ${amountPaid}, ${user.username})
  `;

  revalidatePath('/admin/monitoring');
  revalidatePath('/staff/monitoring');
  redirect(user.role === 'admin' ? '/admin/monitoring?updated=1' : '/staff/monitoring?updated=1');
}

import PageTitle from '@/components/PageTitle';
import AddSalesForm from '@/components/AddSalesForm';
import { getServicesAndAddons } from '@/lib/transactions';

export default async function StaffAddSalesPage({ searchParams }) {
  const data = await getServicesAndAddons();
  const params = await searchParams;
  return (
    <>
      <PageTitle title="Add New Sales" subtitle="Record a customer transaction." />
      <AddSalesForm {...data} saved={params?.saved} error={params?.error} />
    </>
  );
}

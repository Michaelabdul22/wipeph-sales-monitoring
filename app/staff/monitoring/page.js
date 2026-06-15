import PageTitle from '@/components/PageTitle';
import MonitoringPage from '@/components/MonitoringPage';

export default function StaffMonitoringPage() {
  return (
    <>
      <PageTitle title="Transaction Status" subtitle="Monitor balances, payments, and status history." />
      <MonitoringPage />
    </>
  );
}

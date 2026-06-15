import PageTitle from '@/components/PageTitle';
import MonitoringPage from '@/components/MonitoringPage';

export default function AdminMonitoringPage() {
  return (
    <>
      <PageTitle title="Transaction Status" subtitle="Monitor balances, payments, and status history." />
      <MonitoringPage />
    </>
  );
}

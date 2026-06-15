import PageTitle from '@/components/PageTitle';
import HelpContent from '@/components/HelpContent';

export default function AdminHelpPage() {
  return (
    <>
      <PageTitle title="System Guide" subtitle="Quick reference for admin workflows." />
      <HelpContent role="admin" />
    </>
  );
}

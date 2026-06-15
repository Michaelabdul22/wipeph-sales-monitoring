import PageTitle from '@/components/PageTitle';
import HelpContent from '@/components/HelpContent';

export default function StaffHelpPage() {
  return (
    <>
      <PageTitle title="System Guide" subtitle="Quick reference for staff workflows." />
      <HelpContent role="staff" />
    </>
  );
}

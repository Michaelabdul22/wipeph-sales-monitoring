import { changePassword } from '@/app/actions/account';
import PageTitle from './PageTitle';

const errorMessage = {
  weak: 'New password must be at least 8 characters.',
  match: 'New password and confirm password do not match.',
  current: 'Current password is incorrect.'
};

export default async function AccountSecurity({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <PageTitle title="Account Security" subtitle="Update your password and keep your account protected." />
      <section className="card form-container account-security">
        <h3 className="form-title">Change Password</h3>
        {params?.saved ? <div className="alert alert-success">Password updated successfully.</div> : null}
        {params?.error ? <div className="alert alert-danger">{errorMessage[params.error] || 'Unable to update password.'}</div> : null}
        <form action={changePassword} className="grid">
          <label className="field">
            Current Password
            <input className="input" name="current_password" type="password" placeholder="Enter current password" required />
          </label>
          <label className="field">
            New Password
            <input className="input" name="new_password" type="password" placeholder="At least 8 characters" minLength="8" required />
          </label>
          <label className="field">
            Confirm New Password
            <input className="input" name="confirm_password" type="password" placeholder="Repeat new password" minLength="8" required />
          </label>
          <button className="btn btn-primary btn-save-wide">Update Password</button>
        </form>
      </section>
    </>
  );
}

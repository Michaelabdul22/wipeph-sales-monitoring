import AuthCard from '@/components/AuthCard';
import { resetPassword } from '@/app/actions/password';

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  return (
    <AuthCard title="RESET PASSWORD" subtitle="Set a new account password.">
      {params?.error ? <div className="alert">Passwords do not match or OTP expired.</div> : null}
      <form action={resetPassword}>
        <input type="hidden" name="email" value={params?.email || ''} />
        <input type="hidden" name="otp" value={params?.otp || ''} />
        <label className="field">
          New Password
          <input className="input" name="password" type="password" required />
        </label>
        <label className="field">
          Confirm Password
          <input className="input" name="confirm_password" type="password" required />
        </label>
        <button className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
      </form>
    </AuthCard>
  );
}

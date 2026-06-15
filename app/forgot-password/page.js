import AuthCard from '@/components/AuthCard';
import { sendOtp } from '@/app/actions/password';

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;
  return (
    <AuthCard title="PASSWORD RESET" subtitle="Enter your Gmail account to receive a verification code.">
      {params?.error ? <div className="alert">Email was not found or reset expired.</div> : null}
      <form action={sendOtp}>
        <label className="field">
          Gmail Account
          <input className="input" name="email" type="email" placeholder="example@gmail.com" required />
        </label>
        <button className="btn btn-primary" style={{ width: '100%' }}>Send OTP</button>
      </form>
      <p style={{ marginTop: 22 }}><a href="/login">Back to login</a></p>
    </AuthCard>
  );
}

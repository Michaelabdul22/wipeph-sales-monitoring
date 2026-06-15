import AuthCard from '@/components/AuthCard';
import { verifyOtp } from '@/app/actions/password';

export default async function VerifyOtpPage({ searchParams }) {
  const params = await searchParams;
  return (
    <AuthCard title="VERIFY CODE" subtitle={`Enter the 6-digit code sent to ${params?.email || 'your Gmail'}.`}>
      {params?.error ? <div className="alert">Invalid or expired OTP. Please check your Gmail again.</div> : null}
      <form action={verifyOtp}>
        <input type="hidden" name="email" value={params?.email || ''} />
        <label className="field">
          OTP Code
          <input className="input" name="otp" inputMode="numeric" maxLength="6" placeholder="000000" required />
        </label>
        <button className="btn btn-primary" style={{ width: '100%' }}>Verify Code</button>
      </form>
      <p style={{ marginTop: 22 }}><a href="/forgot-password">Try again</a></p>
    </AuthCard>
  );
}

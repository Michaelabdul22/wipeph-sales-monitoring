import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-art">
        <img src="/background.jpg" alt="WIPE PH services" />
      </div>
      <section className="login-panel">
        <div className="login-card">
          <img className="logo" src="/backgroundfrontpagelogin.png" alt="WIPE PH logo" />
          <h1>WIPE PHILIPPINES</h1>
          <p style={{ color: '#666', fontWeight: 900, letterSpacing: 1 }}>LOGIN</p>
          <LoginForm />
          <p style={{ marginTop: 28 }}>
            <a href="/forgot-password" style={{ color: '#666', fontWeight: 700 }}>Forgot Password?</a>
          </p>
          <p style={{ marginTop: 44, color: '#bbb', fontSize: 12, fontWeight: 900, letterSpacing: 3 }}>
            FOR ADMINISTRATOR ACCESS ONLY.
          </p>
        </div>
      </section>
    </main>
  );
}

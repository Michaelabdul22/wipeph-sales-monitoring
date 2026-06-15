export default function AuthCard({ title, subtitle, children }) {
  return (
    <main className="login-page">
      <div className="login-art">
        <img src="/background.jpg" alt="WIPE PH services" />
      </div>
      <section className="login-panel">
        <div className="login-card">
          <img className="logo" src="/backgroundfrontpagelogin.png" alt="WIPE PH logo" />
          <h1>WIPE PHILIPPINES</h1>
          <p style={{ color: '#666', fontWeight: 900, letterSpacing: 1 }}>{title}</p>
          {subtitle ? <p style={{ color: '#777' }}>{subtitle}</p> : null}
          {children}
        </div>
      </section>
    </main>
  );
}

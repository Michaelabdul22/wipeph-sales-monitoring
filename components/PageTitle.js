export default function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {subtitle ? <p style={{ color: '#6f7780', marginTop: 6 }}>{subtitle}</p> : null}
    </div>
  );
}

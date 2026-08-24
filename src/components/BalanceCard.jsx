export default function BalanceCard({ icon, label, value, hint, variant = '' }) {
  return (
    <div className={`stat-card card${variant ? ` ${variant}` : ''}`}>
      <span className="stat-icon">{icon}</span>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        {hint && <span className="stat-hint">{hint}</span>}
      </div>
    </div>
  );
}

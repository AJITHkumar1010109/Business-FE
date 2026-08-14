const metrics = [
  { label: 'Page Views', value: '128,430', icon: '👁️', change: '+18%' },
  { label: 'Sessions', value: '54,210', icon: '🖥️', change: '+11%' },
  { label: 'Bounce Rate', value: '34.2%', icon: '↩️', change: '-4%' },
  { label: 'Avg. Duration', value: '3m 42s', icon: '⏱️', change: '+7%' },
]

export default function Analytics() {
  return (
    <>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Track your performance metrics</p>
      </div>

      <div className="stats-grid">
        {metrics.map(m => (
          <div className="stat-card" key={m.label}>
            <div className="stat-icon">{m.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{m.value}</span>
              <span className="stat-label">{m.label}</span>
            </div>
            <span className={`stat-change ${m.change.startsWith('-') ? 'negative' : 'positive'}`}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h2>Traffic Overview</h2></div>
        <div className="empty-state">
          <span>📊</span>
          <p>Chart visualisation coming soon</p>
        </div>
      </div>
    </>
  )
}

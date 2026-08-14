const stats = [
  { label: 'Total Revenue', value: '$48,295', change: '+12%', icon: '💰' },
  { label: 'New Orders', value: '1,284', change: '+8%', icon: '🛒' },
  { label: 'Customers', value: '9,731', change: '+5%', icon: '👥' },
  { label: 'Growth', value: '23.6%', change: '+3%', icon: '📈' },
]

const recentOrders = [
  { id: '#ORD-001', customer: 'Alice Johnson', amount: '$240', status: 'Completed' },
  { id: '#ORD-002', customer: 'Bob Smith', amount: '$185', status: 'Pending' },
  { id: '#ORD-003', customer: 'Carol White', amount: '$320', status: 'Processing' },
  { id: '#ORD-004', customer: 'David Lee', amount: '$95', status: 'Completed' },
  { id: '#ORD-005', customer: 'Eva Martinez', amount: '$560', status: 'Cancelled' },
]

export default function Dashboard({ username }: { username: string }) {
  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {username || 'User'} 👋</p>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <span className="stat-change positive">{s.change}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recent Orders</h2>
          <button className="btn-outline">View All</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`badge-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

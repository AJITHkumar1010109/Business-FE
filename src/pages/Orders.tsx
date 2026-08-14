const orders = [
  { id: '#ORD-001', customer: 'Alice Johnson', date: '2025-07-01', amount: '$240', status: 'Completed' },
  { id: '#ORD-002', customer: 'Bob Smith', date: '2025-07-02', amount: '$185', status: 'Pending' },
  { id: '#ORD-003', customer: 'Carol White', date: '2025-07-03', amount: '$320', status: 'Processing' },
  { id: '#ORD-004', customer: 'David Lee', date: '2025-07-04', amount: '$95', status: 'Completed' },
  { id: '#ORD-005', customer: 'Eva Martinez', date: '2025-07-05', amount: '$560', status: 'Cancelled' },
  { id: '#ORD-006', customer: 'Frank Brown', date: '2025-07-06', amount: '$410', status: 'Completed' },
  { id: '#ORD-007', customer: 'Grace Kim', date: '2025-07-07', amount: '$275', status: 'Pending' },
]

export default function Orders() {
  return (
    <>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Manage and track all customer orders</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Orders</h2>
          <button className="btn-outline">+ New Order</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="order-id">{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.date}</td>
                  <td>{o.amount}</td>
                  <td>
                    <span className={`badge-status ${o.status.toLowerCase()}`}>{o.status}</span>
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

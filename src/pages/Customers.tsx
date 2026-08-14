const customers = [
  { name: 'Alice Johnson', email: 'alice@example.com', orders: 12, spent: '$2,840', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', orders: 7, spent: '$1,295', status: 'Active' },
  { name: 'Carol White', email: 'carol@example.com', orders: 3, spent: '$640', status: 'Inactive' },
  { name: 'David Lee', email: 'david@example.com', orders: 19, spent: '$4,120', status: 'Active' },
  { name: 'Eva Martinez', email: 'eva@example.com', orders: 5, spent: '$980', status: 'Active' },
]

export default function Customers() {
  return (
    <>
      <div className="page-header">
        <h1>Customers</h1>
        <p>View and manage your customer base</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Customers</h2>
          <button className="btn-outline">+ Add Customer</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.email}>
                  <td className="order-id">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.orders}</td>
                  <td>{c.spent}</td>
                  <td>
                    <span className={`badge-status ${c.status.toLowerCase()}`}>{c.status}</span>
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

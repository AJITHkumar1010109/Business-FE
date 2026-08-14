const products = [
  { name: 'Wireless Headphones', category: 'Electronics', price: '$89.99', stock: 142, status: 'Active' },
  { name: 'Running Shoes', category: 'Footwear', price: '$64.99', stock: 87, status: 'Active' },
  { name: 'Coffee Maker', category: 'Appliances', price: '$49.99', stock: 0, status: 'Out of Stock' },
  { name: 'Yoga Mat', category: 'Fitness', price: '$29.99', stock: 210, status: 'Active' },
  { name: 'Desk Lamp', category: 'Furniture', price: '$34.99', stock: 55, status: 'Active' },
  { name: 'Backpack', category: 'Accessories', price: '$44.99', stock: 0, status: 'Out of Stock' },
]

export default function Products() {
  return (
    <>
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your product catalogue</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>All Products</h2>
          <button className="btn-outline">+ Add Product</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.name}>
                  <td className="order-id">{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge-status ${p.status === 'Active' ? 'completed' : 'cancelled'}`}>
                      {p.status}
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

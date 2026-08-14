import { useState, useEffect } from 'react'
import CustomerForm from '../components/CustomerForm'

interface Customer {
  id?: number
  name: string
  email: string
  phone: string
  native: string
  district: string
  address: string
  amount_received: string
  amount_balance: string
  total_amount: string
  status: 'Completed' | 'Pending'
}

const API = 'http://localhost:4000/api/customers'

export default function CustomerDetails() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; data?: Customer }>({ open: false })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchCustomers = () => {
    setLoading(true)
    fetch(API)
      .then(r => r.json())
      .then(data => { setCustomers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchCustomers() }, [])

  const handleSave = async (data: Customer) => {
    const isEdit = !!data.id
    const res = await fetch(isEdit ? `${API}/${data.id}` : API, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      fetchCustomers()
      setModal({ open: false })
      showToast(isEdit ? 'Customer updated ✅' : 'Customer added ✅')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`${API}/${deleteId}`, { method: 'DELETE' })
    if (res.ok) { fetchCustomers(); showToast('Customer deleted ✅') }
    setDeleteId(null)
  }

  const filtered = customers.filter(c =>
    [c.name, c.email, c.phone, c.native, c.district, c.address].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      {toast && <div style={s.toast}>{toast}</div>}

      <div className="page-header">
        <h1>Customer Details</h1>
        <p>Manage your customer records</p>
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button style={s.addBtn} onClick={() => setModal({ open: true })}>
          + Add Customer
        </button>
      </div>

      {/* Table */}
      <div style={s.tableWrap} className="customer-table-wrap">
        {loading ? (
          <div style={s.empty}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>No customers found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <table style={s.table}>
              <thead>
                <tr>
                  {['#', 'Name', 'Email', 'Phone', 'Native', 'District', 'Address', 'Amt Received', 'Amt Balance', 'Total Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={s.tr}>
                    <td style={s.td}>{i + 1}</td>
                    <td style={{ ...s.td, fontWeight: 600, color: 'var(--text-h)' }}>{c.name}</td>
                    <td style={s.td}>{c.email || '—'}</td>
                    <td style={s.td}>{c.phone || '—'}</td>
                    <td style={s.td}>{c.native || '—'}</td>
                    <td style={s.td}>{c.district || '—'}</td>
                    <td style={s.td}>{c.address || '—'}</td>
                    <td style={s.td}>₹{Number(c.amount_received || 0).toLocaleString()}</td>
                    <td style={s.td}>₹{Number(c.amount_balance || 0).toLocaleString()}</td>
                    <td style={s.td}>₹{Number(c.total_amount || 0).toLocaleString()}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: c.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: c.status === 'Completed' ? '#16a34a' : '#b45309' }}>
                        {c.status === 'Completed' ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={s.actions}>
                        <button style={s.editBtn} onClick={() => setModal({ open: true, data: c })}>✏️ Edit</button>
                        <button style={s.delBtn} onClick={() => setDeleteId(c.id!)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="customer-cards">
              {filtered.map((c, i) => (
                <div key={c.id} style={s.card}>
                  <div style={s.cardHead}>
                    <div style={s.cardIndex}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={s.cardName}>{c.name}</div>
                      <div style={s.cardSub}>{c.email}</div>
                    </div>
                    <span style={{ ...s.badge, background: c.status === 'Completed' ? '#dcfce7' : '#fef9c3', color: c.status === 'Completed' ? '#16a34a' : '#b45309', fontSize: '11px' }}>
                      {c.status === 'Completed' ? '✅ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                  <div style={s.cardGrid}>
                    {[
                      { label: 'Phone',        value: c.phone },
                      { label: 'District',     value: c.district },
                      { label: 'Native',       value: c.native },
                      { label: 'Total Amount', value: `₹${Number(c.total_amount || 0).toLocaleString()}` },
                      { label: 'Amt Received', value: `₹${Number(c.amount_received || 0).toLocaleString()}` },
                    ].map(({ label, value }) => (
                      <div key={label} style={s.cardRow}>
                        <span style={s.cardLabel}>{label}</span>
                        <span style={s.cardValue}>{value || '—'}</span>
                      </div>
                    ))}
                    {/* Balance Amount — highlighted */}
                    <div style={s.cardRow}>
                      <span style={s.cardLabel}>Amt Balance</span>
                      <span style={s.balanceValue}>₹{Number(c.amount_balance || 0).toLocaleString()}</span>
                    </div>
                    {/* Address full width */}
                    <div style={{ ...s.cardRow, flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
                      <span style={s.cardLabel}>Address</span>
                      <span style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>{c.address || '—'}</span>
                    </div>
                  </div>
                  <div style={s.cardActions}>
                    <button style={s.editBtn} onClick={() => setModal({ open: true, data: c })}>✏️ Edit</button>
                    <button style={s.delBtn} onClick={() => setDeleteId(c.id!)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal.open && (
        <CustomerForm
          initial={modal.data}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={s.overlay}>
          <div style={s.confirmBox}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🗑️</div>
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-h)', fontSize: '15px' }}>Delete Customer</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Are you sure? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={s.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={s.confirmDelBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  toast: {
    position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--bg-surface)', color: 'var(--text-h)', padding: '12px 24px',
    borderRadius: '10px', fontSize: '13px', fontWeight: 600, zIndex: 9999,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: '1px solid var(--border)',
  },
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '12px', marginBottom: '16px', flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px',
  },
  searchIcon: {
    position: 'absolute', left: '12px', fontSize: '14px', pointerEvents: 'none',
  },
  searchInput: {
    width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid var(--border)',
    borderRadius: '10px', fontSize: '13px', background: 'var(--bg-surface)',
    color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
  },
  addBtn: {
    padding: '10px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px',
    fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  tableWrap: {
    background: 'var(--bg-surface)', borderRadius: '14px',
    border: '1px solid var(--border)', overflow: 'auto',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontWeight: 700,
    color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase',
    letterSpacing: '0.5px', borderBottom: '1px solid var(--border)',
    background: 'var(--hover-bg)', whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  td: { padding: '12px 16px', color: 'var(--text)', verticalAlign: 'middle' },
  badge: {
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
  },
  badgeActive: { background: '#dcfce7', color: '#16a34a' },
  badgeInactive: { background: '#fee2e2', color: '#dc2626' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: {
    padding: '5px 12px', borderRadius: '7px', border: '1.5px solid var(--border)',
    background: 'var(--bg-page)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  },
  delBtn: {
    padding: '5px 12px', borderRadius: '7px', border: '1.5px solid #fecaca',
    background: '#fff0f0', color: '#dc2626', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  },
  empty: { padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' },
  card: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: '12px', overflow: 'hidden',
  },
  cardHead: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px', borderBottom: '1px solid var(--border)',
  },
  cardIndex: {
    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
    background: 'var(--accent-bg)', color: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700,
  },
  cardName: { fontSize: '14px', fontWeight: 700, color: 'var(--text-h)' },
  cardSub: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' },
  cardGrid: { padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  cardLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.4px', flexShrink: 0, paddingTop: '1px' },
  cardValue: { fontSize: '13px', color: 'var(--text)', textAlign: 'right' as const, wordBreak: 'break-word' as const, maxWidth: '65%' },
  balanceValue: {
    fontSize: '14px', fontWeight: 700, color: '#fff',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '2px 10px', borderRadius: '20px',
  },
  cardActions: {
    display: 'flex', gap: '8px', padding: '10px 14px',
    borderTop: '1px solid var(--border)',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
  },
  confirmBox: {
    background: 'var(--bg-surface)', borderRadius: '16px', padding: '28px 32px',
    textAlign: 'center', maxWidth: '300px', width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  cancelBtn: {
    padding: '8px 20px', borderRadius: '8px', border: '1.5px solid var(--border)',
    background: 'var(--bg-surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
  },
  confirmDelBtn: {
    padding: '8px 20px', borderRadius: '8px', border: 'none',
    background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
  },
}

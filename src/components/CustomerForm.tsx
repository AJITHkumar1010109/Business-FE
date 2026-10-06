import { useState } from 'react'

interface Customer {
  _id?: string
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

interface Props {
  initial?: Customer
  paymentCount?: number
  onSave: (data: Customer) => void
  onClose: () => void
}

type FieldError = Partial<Record<keyof Customer, string>>

export default function CustomerForm({ initial, paymentCount = 0, onSave, onClose }: Props) {
  const [form, setForm] = useState<Customer>(
    initial ? { ...initial } : {
      name: '', email: '', phone: '', native: '', district: '',
      address: '', amount_received: '', amount_balance: '', total_amount: '', status: 'Pending'
    }
  )
  const [errors, setErrors] = useState<FieldError>({})

  const set = (k: keyof Customer, v: string) => {
    setForm(f => {
      const updated = { ...f, [k]: v }
      if (k === 'total_amount' || k === 'amount_received') {
        const total = parseFloat(k === 'total_amount' ? v : f.total_amount) || 0
        const received = parseFloat(k === 'amount_received' ? v : f.amount_received) || 0
        const balance = total - received
        updated.amount_balance = balance.toString()
        updated.status = balance <= 0 ? 'Completed' : 'Pending'
      }
      return updated
    })
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const handlePhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 10)
    set('phone', digits)
  }

  const validate = (): boolean => {
    const e: FieldError = {}
    if (!form.name.trim())           e.name = 'Full name is required'
    if (!form.email.trim())          e.email = 'Email is required'
    if (!form.phone.trim())          e.phone = 'Phone number is required'
    else if (form.phone.length !== 10) e.phone = 'Phone must be exactly 10 digits'
    if (!form.native.trim())         e.native = 'Native is required'
    if (!form.district.trim())       e.district = 'District is required'
    if (!form.address.trim())        e.address = 'Address is required'
    if (form.amount_received === '') e.amount_received = 'Amount received is required'
    if (form.total_amount === '')    e.total_amount = 'Total amount is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => { if (validate()) onSave(form) }

  const gridFields: { key: keyof Customer; label: string; type: string }[] = [
    { key: 'name',            label: 'Full Name',       type: 'text'   },
    { key: 'email',           label: 'Email Address',   type: 'email'  },
    { key: 'native',          label: 'Native',          type: 'text'   },
    { key: 'district',        label: 'District',        type: 'text'   },
    { key: 'total_amount',    label: 'Total Amount',    type: 'number' },
    { key: 'amount_received', label: 'Amount Received', type: 'number' },
    { key: 'amount_balance',  label: 'Amount Balance',  type: 'number' },
  ]

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.header}>
          <h3 style={s.title}>{initial?._id ? '✏️ Edit Customer' : '➕ Add Customer'}</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          <div style={s.grid}>
            {gridFields.map(({ key, label, type }) => (
              <div key={key} style={s.field}>
                <label style={s.label}>{label} <span style={{ color: '#e53e3e' }}>*</span></label>
                <input
                  type={type}
                  value={form[key] as string}
                  onChange={e => set(key, e.target.value)}
                  onWheel={type === 'number' ? e => e.currentTarget.blur() : undefined}
                  disabled={key === 'amount_balance' || (key === 'amount_received' && paymentCount > 0)}
                  style={{ ...s.input, borderColor: errors[key] ? '#e53e3e' : undefined, ...((key === 'amount_balance' || (key === 'amount_received' && paymentCount > 0)) ? s.disabled : {}) }}
                  placeholder={key === 'amount_balance' ? 'Auto calculated' : `Enter ${label.toLowerCase()}`}
                  min={type === 'number' ? '0' : undefined}
                />
                {errors[key] && <span style={s.err}>{errors[key]}</span>}
              </div>
            ))}
          </div>

          {/* Phone — full width */}
          <div style={s.field}>
            <label style={s.label}>Phone Number <span style={{ color: '#e53e3e' }}>*</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => handlePhone(e.target.value)}
              style={{ ...s.input, borderColor: errors.phone ? '#e53e3e' : undefined }}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {errors.phone && <span style={s.err}>{errors.phone}</span>}
          </div>

          {/* Address — full width */}
          <div style={s.field}>
            <label style={s.label}>Address <span style={{ color: '#e53e3e' }}>*</span></label>
            <textarea
              value={form.address}
              onChange={e => set('address', e.target.value)}
              style={{ ...s.input, ...s.textarea, borderColor: errors.address ? '#e53e3e' : undefined }}
              placeholder="Enter address"
              rows={2}
            />
            {errors.address && <span style={s.err}>{errors.address}</span>}
          </div>


        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={s.saveBtn} onClick={handleSave}>
            {initial?._id ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
  },
  modal: {
    background: 'var(--bg-surface)', borderRadius: '16px', width: '100%', maxWidth: '540px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0,
  },
  title: { margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-h)' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer',
    color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '6px',
  },
  body: {
    padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px',
    overflowY: 'auto',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.4px' },
  input: {
    padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: '10px',
    fontSize: '13px', background: 'var(--bg-page)', color: 'var(--text)',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  textarea: { resize: 'vertical', fontFamily: 'inherit' },
  disabled: { opacity: 0.6, cursor: 'not-allowed', background: 'var(--hover-bg)' },
  err: { fontSize: '11px', color: '#e53e3e' },
  footer: {
    display: 'flex', gap: '10px', justifyContent: 'flex-end',
    padding: '16px 24px', borderTop: '1px solid var(--border)', flexShrink: 0,
  },
  cancelBtn: {
    padding: '9px 20px', borderRadius: '8px', border: '1.5px solid var(--border)',
    background: 'var(--bg-surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
  },
  saveBtn: {
    padding: '9px 20px', borderRadius: '8px', border: 'none',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
  },
}

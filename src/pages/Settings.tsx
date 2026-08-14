import { useState } from 'react'

export default function Settings() {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const maskedPassword = '••••••••'

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-header"><h2>Profile</h2></div>
          <div className="settings-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="John Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="john@example.com" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" defaultValue="Admin" disabled />
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Preferences</h2></div>
          <div className="settings-form">
            <div className="form-group">
              <label>Language</label>
              <select defaultValue="en">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <select defaultValue="utc">
                <option value="utc">UTC</option>
                <option value="est">EST</option>
                <option value="pst">PST</option>
              </select>
            </div>
            <div className="form-toggle">
              <span>Email Notifications</span>
              <input type="checkbox" defaultChecked id="notif" />
              <label htmlFor="notif" className="toggle" />
            </div>
            <button className="btn-primary">Save Preferences</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header"><h2>Change Password</h2></div>
        <div className="settings-form">
          {/* Old Password - disabled, view only */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Old Password</label>
            <input
              type="text"
              value={showOld ? maskedPassword : maskedPassword}
              disabled
              style={{ paddingRight: '2.5rem', letterSpacing: showOld ? 'normal' : '0.15em', background: '#f0f0f5', cursor: 'not-allowed' }}
            />
            <button type="button" onClick={() => setShowOld(p => !p)}
              style={{ position: 'absolute', right: '0.5rem', bottom: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
              {showOld ? '🙈' : '👁️'}
            </button>
          </div>

          {/* New & Confirm Password - editable */}
          {[{ label: 'New Password', show: showNew, toggle: () => setShowNew(p => !p) },
            { label: 'Confirm New Password', show: showConfirm, toggle: () => setShowConfirm(p => !p) }
          ].map(({ label, show, toggle }) => (
            <div className="form-group" key={label} style={{ position: 'relative' }}>
              <label>{label}</label>
              <input type={show ? 'text' : 'password'} placeholder="" autoComplete="new-password" style={{ paddingRight: '2.5rem' }} />
              <button type="button" onClick={toggle}
                style={{ position: 'absolute', right: '0.5rem', bottom: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                {show ? '🙈' : '👁️'}
              </button>
            </div>
          ))}
          <button className="btn-primary">Update Password</button>
        </div>
      </div>
    </>
  )
}

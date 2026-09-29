import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen: boolean
  onLogout: () => void
  userPhone: string
  userId: number
  username: string
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  onUsernameChange: (name: string) => void
}

export default function Header({ onMenuToggle, sidebarOpen, onLogout, userPhone: phone, userId, username, theme, onThemeToggle, onUsernameChange }: HeaderProps) {
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [modal, setModal] = useState<'username' | 'password' | 'logout' | 'pin' | null>(null)
  const [newPin, setNewPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [userPhone] = useState(phone)
  const [toast, setToast] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const firstLetter = (username || phone || '?')[0].toUpperCase()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/change-username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username: newUsername.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.message + ' ❌'); return }
      onUsernameChange(newUsername.trim())
      setNewUsername('')
      setModal(null)
      showToast('Username updated successfully ✅')
    } catch {
      showToast('Server error ❌')
    }
  }

  const isStrongPassword = (pwd: string) =>
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)

  const handlePasswordChange = async () => {
    if (!newPassword) { showToast('Enter a new password ❌'); return }
    if (!isStrongPassword(newPassword)) { showToast('Password must be 8+ chars with uppercase, lowercase, number & symbol ❌'); return }
    if (newPassword !== confirmPassword) { showToast('Passwords do not match ❌'); return }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: userPhone, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.message + ' ❌'); return }
      setNewPassword(''); setConfirmPassword('')
      setModal(null)
      showToast('Password updated successfully ✅')
    } catch {
      showToast('Server error ❌')
    }
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-surface)', color: 'var(--text-h)', padding: '12px 24px', borderRadius: '10px',
          fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          {toast}
        </div>
      )}

      <header className="header">
        <div className="header-left">
          <button className="menu-btn" onClick={onMenuToggle} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}>
            <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>

        </div>

        <div className="header-center">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              placeholder="Search..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              aria-label="Search"
            />
          </div>
        </div>

        <div className="header-right">
          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={themeToggleStyle}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Avatar with dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
              className="avatar"
              title={username}
              onClick={() => setDropdownOpen(o => !o)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {firstLetter}
            </div>

            {dropdownOpen && (
              <div style={dropdownStyle}>
                {/* User info */}
                <div style={userInfoStyle}>
                  <div style={avatarSmall}>{firstLetter}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-h)' }}>{username || phone}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Administrator</div>
                  </div>
                </div>

                <div style={dividerStyle} />

                <button style={menuItemStyle} onClick={() => { setDropdownOpen(false); setModal('username') }}>
                  ✏️ &nbsp; Change Username
                </button>
                <button style={menuItemStyle} onClick={() => { setDropdownOpen(false); setNewPassword(''); setConfirmPassword(''); setShowNew(false); setShowConfirm(false); setModal('password') }}>
                  🔑 &nbsp; Change Password
                </button>
                <button style={menuItemStyle} onClick={() => { setDropdownOpen(false); setNewPin(''); setPinError(''); setModal('pin') }}>
                  🔢 &nbsp; Change PIN
                </button>

                <div style={dividerStyle} />

                <button style={{ ...menuItemStyle, color: '#cc0000' }} onClick={() => { setDropdownOpen(false); setModal('logout') }}>
                  🚪 &nbsp; Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirm Modal */}
      {modal === 'logout' && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: '260px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🚪</div>
            <h3 style={{ ...modalTitle, marginBottom: '6px' }}>Logout</h3>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 16px' }}>Are you sure you want to logout?</p>
            <div style={{ ...modalBtns, justifyContent: 'center' }}>
              <button style={cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button style={{ ...confirmBtn, background: '#dc2626' }} onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Username Modal */}
      {modal === 'username' && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={modalTitle}>Change Username</h3>
            <input
              style={modalInput}
              placeholder="Enter new username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              autoFocus
            />
            <div style={modalBtns}>
              <button style={cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button style={confirmBtn} onClick={handleUsernameChange}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {modal === 'pin' && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={modalTitle}>Update Self Details PIN</h3>

            <label style={labelStyle}>New PIN</label>
            <input
              style={{ ...modalInput, letterSpacing: '8px', fontSize: '18px', textAlign: 'center' }}
              type="password" inputMode="numeric" maxLength={6}
              placeholder="● ● ● ● ● ●"
              value={newPin}
              onChange={e => { setNewPin(e.target.value.replace(/\D/g, '')); setPinError('') }}
              autoFocus
            />

            {pinError && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>{pinError}</div>}

            <div style={modalBtns}>
              <button style={cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button style={confirmBtn} onClick={async () => {
                if (newPin.length !== 6) { setPinError('PIN must be 6 digits'); return }
                const sRes = await fetch(`${import.meta.env.VITE_API_URL}/api/set-menu-pin`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, pin: newPin }),
                })
                if (sRes.ok) { setModal(null); showToast('PIN updated successfully ✅') }
                else { setPinError('Failed to update PIN ❌') }
              }}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {modal === 'password' && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={modalTitle}>Change Password</h3>

            <label style={labelStyle}>New Password</label>
            <div style={inputWrap}>
              <input style={modalInput} type={showNew ? 'text' : 'password'}
                placeholder="Enter new password" value={newPassword}
                autoComplete="new-password"
                onChange={e => setNewPassword(e.target.value)} />
              <button type="button" style={eyeBtn} onClick={() => setShowNew(v => !v)}>{showNew ? '🙈' : '👁️'}</button>
            </div>
            {newPassword && (
              <div style={{ fontSize: '12px', marginTop: '6px', color:
                isStrongPassword(newPassword) ? '#16a34a' :
                newPassword.length >= 6 ? '#ca8a04' : '#dc2626'
              }}>
                {isStrongPassword(newPassword) ? '✅ Strong password' :
                  newPassword.length >= 6 ? '⚠️ Medium — add uppercase, number & symbol' : '❌ Too weak'}
              </div>
            )}

            <label style={{ ...labelStyle, marginTop: '14px' }}>Confirm New Password</label>
            <div style={inputWrap}>
              <input style={modalInput} type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password" value={confirmPassword}
                autoComplete="new-password"
                onChange={e => setConfirmPassword(e.target.value)} />
              <button type="button" style={eyeBtn} onClick={() => setShowConfirm(v => !v)}>{showConfirm ? '🙈' : '👁️'}</button>
            </div>

            <div style={modalBtns}>
              <button style={cancelBtn} onClick={() => { setModal(null); setNewPassword(''); setConfirmPassword('') }}>Cancel</button>
              <button style={confirmBtn} onClick={handlePasswordChange}>Update</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px',
}
const inputWrap: React.CSSProperties = {
  position: 'relative', display: 'flex', alignItems: 'center',
}
const eyeBtn: React.CSSProperties = {
  position: 'absolute', right: '12px', background: 'none', border: 'none',
  cursor: 'pointer', fontSize: '16px', padding: '4px',
}
const dropdownStyle: React.CSSProperties = {
  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
  background: 'var(--bg-surface)', borderRadius: '10px', minWidth: '180px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 1000,
  padding: '6px', border: '1px solid var(--border)',
}
const userInfoStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
}
const avatarSmall: React.CSSProperties = {
  width: '30px', height: '30px', borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff', fontWeight: 700, fontSize: '12px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}
const dividerStyle: React.CSSProperties = {
  height: '1px', background: 'var(--border)', margin: '3px 0',
}
const menuItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', width: '100%',
  padding: '7px 10px', background: 'none', border: 'none',
  borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  color: 'var(--text)', textAlign: 'left',
}
const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998,
}
const modalStyle: React.CSSProperties = {
  background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px',
  width: '100%', maxWidth: '300px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
}
const modalTitle: React.CSSProperties = {
  margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: 'var(--text-h)',
}
const modalInput: React.CSSProperties = {
  width: '100%', padding: '9px 40px 9px 11px', border: '1.5px solid var(--border)',
  borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
  background: 'var(--bg-page)', color: 'var(--text)',
}
const modalBtns: React.CSSProperties = {
  display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end',
}
const cancelBtn: React.CSSProperties = {
  padding: '7px 16px', borderRadius: '7px', border: '1.5px solid var(--border)',
  background: 'var(--bg-surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
}
const confirmBtn: React.CSSProperties = {
  padding: '7px 16px', borderRadius: '7px', border: 'none',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
}
const themeToggleStyle: React.CSSProperties = {
  background: 'var(--hover-bg)', border: '1px solid var(--border)',
  borderRadius: '50%', width: '36px', height: '36px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', fontSize: '16px', flexShrink: 0,
}

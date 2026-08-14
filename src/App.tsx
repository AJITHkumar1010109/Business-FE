import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Header from './layout/header'
import Sidebar from './layout/sidebar'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Products from './pages/Products'
import Messages from './pages/Messages'
import Settings from './pages/Settings'
import CustomerDetails from './pages/CustomerDetails'
import SelfDetails from './pages/SelfDetails'
import Login from './pages/Login'
import './App.css'

const SESSION_KEY = 'biz_session'

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

export default function App() {
  const session = loadSession()
  const [isLoggedIn, setIsLoggedIn] = useState(!!session)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)
  const [userPhone, setUserPhone] = useState(session?.phone || '')
  const [userId, setUserId] = useState<number | null>(session?.userId || null)
  const [username, setUsername] = useState(session?.username || '')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('biz_theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('biz_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const handleLogin = (phone: string, id: number, name: string) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ phone, userId: id, username: name }))
    setUserPhone(phone); setUserId(id); setUsername(name); setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <AppShell
        username={username} userPhone={userPhone} userId={userId!}
        theme={theme} toggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        onUsernameChange={(name) => {
          setUsername(name)
          const s = loadSession()
          if (s) localStorage.setItem(SESSION_KEY, JSON.stringify({ ...s, username: name }))
        }}
      />
    </BrowserRouter>
  )
}

function AppShell({ username, userPhone, userId, theme, toggleTheme, sidebarOpen, setSidebarOpen, handleLogout, onUsernameChange }: {
  username: string; userPhone: string; userId: number; theme: 'light' | 'dark'
  toggleTheme: () => void; sidebarOpen: boolean; setSidebarOpen: (v: boolean | ((p: boolean) => boolean)) => void
  handleLogout: () => void; onUsernameChange: (n: string) => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [pinModal, setPinModal] = useState<'verify' | 'set' | null>(null)
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [selfUnlocked, setSelfUnlocked] = useState(false)

  // Lock self-details when navigating away
  useEffect(() => {
    if (location.pathname !== '/self-details') setSelfUnlocked(false)
  }, [location.pathname])

  const handleSelfDetailsClick = async () => {
    if (selfUnlocked) { navigate('/self-details'); return }
    // Check if PIN is set
    const res = await fetch(`http://localhost:4000/api/user/${userId}`)
    const data = await res.json()
    setPinModal(data.has_menu_pin ? 'verify' : 'set')
    setPin(''); setNewPin(''); setPinError('')
  }

  const handleVerifyPin = async () => {
    if (pin.length !== 6) { setPinError('Enter a 6-digit PIN'); return }
    const res = await fetch('http://localhost:4000/api/verify-menu-pin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, pin }),
    })
    if (res.ok) {
      setSelfUnlocked(true); setPinModal(null); navigate('/self-details')
    } else {
      const d = await res.json(); setPinError(d.message || 'Incorrect PIN')
    }
  }

  const handleSetPin = async () => {
    if (newPin.length !== 6) { setPinError('PIN must be exactly 6 digits'); return }
    const res = await fetch('http://localhost:4000/api/set-menu-pin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, pin: newPin }),
    })
    if (res.ok) {
      setSelfUnlocked(true); setPinModal(null); navigate('/self-details')
    } else {
      const d = await res.json(); setPinError(d.message || 'Failed to set PIN')
    }
  }

  const handlePinKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') pinModal === 'verify' ? handleVerifyPin() : handleSetPin()
  }

  return (
    <div className="app">
      <Header onMenuToggle={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} onLogout={handleLogout}
        userPhone={userPhone} userId={userId} username={username} theme={theme} onThemeToggle={toggleTheme}
        onUsernameChange={onUsernameChange} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} username={username}
          onSelfDetailsClick={handleSelfDetailsClick} />
        <main className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard username={username} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/customer-details" element={<CustomerDetails />} />
            <Route path="/self-details" element={selfUnlocked ? <SelfDetails /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* PIN Modal */}
      {pinModal && (
        <div style={overlay}>
          <div style={modalBox}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{pinModal === 'verify' ? '🔐' : '🔑'}</div>
            <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700, color: 'var(--text-h)' }}>
              {pinModal === 'verify' ? 'Enter PIN' : 'Set a PIN'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              {pinModal === 'verify' ? 'Enter your 6-digit PIN to access Self Details' : 'Create a 6-digit PIN to protect Self Details'}
            </p>
            <input
              type="password" inputMode="numeric" maxLength={6}
              placeholder="● ● ● ● ● ●"
              value={pinModal === 'verify' ? pin : newPin}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '')
                pinModal === 'verify' ? setPin(v) : setNewPin(v)
                setPinError('')
              }}
              onKeyDown={handlePinKey}
              autoFocus
              style={pinInput}
            />
            {pinError && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>{pinError}</div>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button style={cancelBtn} onClick={() => setPinModal(null)}>Cancel</button>
              <button style={confirmBtn} onClick={pinModal === 'verify' ? handleVerifyPin : handleSetPin}>
                {pinModal === 'verify' ? 'Unlock' : 'Set PIN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
}
const modalBox: React.CSSProperties = {
  background: 'var(--bg-surface)', borderRadius: '16px', padding: '28px 24px',
  width: '100%', maxWidth: '300px', textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid var(--border)',
}
const pinInput: React.CSSProperties = {
  width: '100%', padding: '12px', textAlign: 'center', fontSize: '22px',
  letterSpacing: '10px', border: '1.5px solid var(--border)', borderRadius: '10px',
  background: 'var(--bg-page)', color: 'var(--text-h)', outline: 'none', boxSizing: 'border-box',
}
const cancelBtn: React.CSSProperties = {
  padding: '8px 18px', borderRadius: '8px', border: '1.5px solid var(--border)',
  background: 'var(--bg-surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
}
const confirmBtn: React.CSSProperties = {
  padding: '8px 18px', borderRadius: '8px', border: 'none',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
}

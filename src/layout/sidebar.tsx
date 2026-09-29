import { NavLink } from 'react-router-dom'

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg1)" />
      {/* Chart bars */}
      <rect x="7" y="18" width="4" height="7" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="14" y="13" width="4" height="12" rx="1.5" fill="white" />
      <rect x="21" y="8" width="4" height="17" rx="1.5" fill="white" fillOpacity="0.7" />
      {/* Trend line */}
      <polyline points="9,17 16,11 23,7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
      {/* Dot */}
      <circle cx="23" cy="7" r="1.8" fill="white" />
    </svg>
  )
}

interface SidebarProps {
  open: boolean
  onClose?: () => void
  username: string
  onSelfDetailsClick: () => void
}

const navItems = [
  { icon: '🏠', label: 'Dashboard', to: '/' },
  { icon: '👤', label: 'Customer Details', to: '/customer-details' },
  // { icon: '🪪', label: 'Self Details', to: '/self-details' },
  // { icon: '📊', label: 'Analytics', to: '/analytics' },
  // { icon: '🛒', label: 'Orders', to: '/orders' },
  // { icon: '👥', label: 'Customers', to: '/customers' },
  // { icon: '📦', label: 'Products', to: '/products' },
  // { icon: '💬', label: 'Messages', to: '/messages' },
  // { icon: '⚙️', label: 'Settings', to: '/settings' },
]

export default function Sidebar({ open, onClose, username, onSelfDetailsClick }: SidebarProps) {
  const handleNavClick = (to: string, e: React.MouseEvent) => {
    if (to === '/self-details') {
      e.preventDefault()
      if (window.innerWidth < 768) onClose?.()
      onSelfDetailsClick()
      return
    }
    if (window.innerWidth < 768) onClose?.()
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Brand — always visible */}
        <div className="sidebar-brand">
          <Logo />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">BizTrack</span>
            <span className="sidebar-brand-sub">Business Suite</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <p className="nav-section-label">MAIN MENU</p>
          <ul>
            {navItems.map(item => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(item.to, e)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar sm">{(username || '?')[0].toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{username || 'User'}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </aside>
    </>
  )
}

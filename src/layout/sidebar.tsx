import { NavLink } from 'react-router-dom'

interface SidebarProps {
  open: boolean
  onClose?: () => void
  username: string
  onSelfDetailsClick: () => void
}

const navItems = [
  { icon: '🏠', label: 'Dashboard', to: '/' },
  { icon: '👤', label: 'Customer Details', to: '/customer-details' },
  { icon: '🪪', label: 'Self Details', to: '/self-details' },
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

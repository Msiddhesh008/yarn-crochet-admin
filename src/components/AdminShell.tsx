import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  MessageSquareHeart,
  Users,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
} from 'lucide-react'
import logo from '../assets/logo-transparent.png'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/content', label: 'Content', icon: FileText },
  { to: '/custom-requests', label: 'Custom requests', icon: MessageSquareHeart },
  { to: '/api-health', label: 'API Health', icon: Activity },
]

const SIDEBAR_QUOTE = 'Little hands. Big dreams.'

export function AdminShell() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('yarn-admin-sidebar') === 'collapsed'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        'yarn-admin-sidebar',
        collapsed ? 'collapsed' : 'expanded',
      )
    } catch {
      /* ignore */
    }
  }, [collapsed])

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={`shell${collapsed ? ' shell--collapsed' : ''}`}>
      {mobileOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`sidebar${mobileOpen ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
      >
        <div className="sidebar__brand">
          <img src={logo} alt="Yarn" className="sidebar__logo" />
          <button
            type="button"
            className="sidebar__collapse"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        <nav className="sidebar__nav" aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              title={link.label}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <link.icon size={18} />
              <span className="sidebar__link-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <p className="sidebar__quote">{SIDEBAR_QUOTE}</p>
        </div>
      </aside>
      <div className="shell__main">
        <header className="topbar">
          <button
            type="button"
            className="topbar__menu"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <p className="topbar__meta">Signed in as {email}</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

import {
  LayoutDashboard,
  LogOut,
  Rocket,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Rocket size={24} />
          <span>ReleaseOps</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div>
            <strong>{user?.fullName}</strong>
            <span>{user?.role}</span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={19} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
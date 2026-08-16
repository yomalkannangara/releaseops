import {
    GitBranch,
    LayoutDashboard,
    LogOut,
    Rocket,
    ScrollText,
    Server,
    TriangleAlert,
    Users,
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
                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        <Server size={19} />
                        Services
                    </NavLink>
                    <NavLink
                        to="/incidents"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        <TriangleAlert size={19} />
                        Incidents
                    </NavLink>
                    <NavLink
                        to="/deployments"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        <GitBranch size={19} />
                        Deployments
                    </NavLink>
                    {user?.role === 'ADMIN' && (
                        <>
                            <NavLink
                                to="/users"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                <Users size={19} />
                                Users
                            </NavLink>

                            <NavLink
                                to="/audit"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                <ScrollText size={19} />
                                Audit Logs
                            </NavLink>
                        </>
                    )}
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
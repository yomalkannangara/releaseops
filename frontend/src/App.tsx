import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ServicesPage } from './pages/ServicesPage'
import { IncidentsPage } from './pages/IncidentsPage'
import { DeploymentsPage } from './pages/DeploymentsPage'
import { AuditLogsPage } from './pages/AuditLogsPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="incidents" element={<IncidentsPage />} />
        <Route
          path="deployments"
          element={<DeploymentsPage />}
        />      <Route path="audit" element={<AuditLogsPage />} />
<Route path="users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}
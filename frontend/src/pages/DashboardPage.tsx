import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../api/dashboard'
import type {
  DashboardSummaryResponse,
} from '../types/api'

export function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummaryResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardSummary()
        setSummary(data)
      } catch {
        setError('Unable to load the dashboard.')
      }
    }

    void loadDashboard()
  }, [])

  if (error) {
    return <div className="page-error">{error}</div>
  }

  if (!summary) {
    return <div className="page-loading">Loading…</div>
  }

  const metrics = [
    ['Total services', summary.totalServices],
    ['Healthy services', summary.healthyServices],
    ['Open incidents', summary.openIncidents],
    ['Critical incidents', summary.criticalIncidents],
    ['Deployments today', summary.deploymentsToday],
    [
      'Failed deployments today',
      summary.failedDeploymentsToday,
    ],
  ]

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your release operations.</p>
        </div>
      </header>

      <section className="metric-grid">
        {metrics.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="content-card">
        <div className="section-heading">
          <h2>Recent deployments</h2>
        </div>

        {summary.recentDeployments.length === 0 ? (
          <p>No deployments have been recorded.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Version</th>
                  <th>Environment</th>
                  <th>Status</th>
                  <th>Triggered by</th>
                  <th>Deployed</th>
                </tr>
              </thead>

              <tbody>
                {summary.recentDeployments.map(
                  (deployment) => (
                    <tr key={deployment.id}>
                      <td>{deployment.serviceName}</td>
                      <td>{deployment.version}</td>
                      <td>{deployment.environment}</td>
                      <td>
                        <span
                          className={`status-badge status-${deployment.status.toLowerCase()}`}
                        >
                          {deployment.status}
                        </span>
                      </td>
                      <td>{deployment.triggeredBy}</td>
                      <td>
                        {new Date(
                          deployment.deployedAt,
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
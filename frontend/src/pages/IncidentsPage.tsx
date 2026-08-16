import { useEffect, useState } from 'react'
import { getIncidents } from '../api/incidents'
import type {
  IncidentResponse,
  IncidentSeverity,
  IncidentStatus,
} from '../types/api'

const statuses: IncidentStatus[] = [
  'OPEN',
  'INVESTIGATING',
  'MONITORING',
  'RESOLVED',
]

const severities: IncidentSeverity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<
    IncidentResponse[]
  >([])
  const [status, setStatus] =
    useState<IncidentStatus | ''>('')
  const [severity, setSeverity] =
    useState<IncidentSeverity | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadIncidents() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getIncidents({
          status: status || undefined,
          severity: severity || undefined,
        })

        setIncidents(response.content)
      } catch {
        setError('Unable to load incidents.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadIncidents()
  }, [status, severity])

  return (
    <div className="incidents-page">
      <header className="page-header">
        <div>
          <h1>Incidents</h1>
          <p>Track and monitor operational incidents.</p>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as IncidentStatus | '',
              )
            }
            aria-label="Filter incidents by status"
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={severity}
            onChange={(event) =>
              setSeverity(
                event.target.value as
                  | IncidentSeverity
                  | '',
              )
            }
            aria-label="Filter incidents by severity"
          >
            <option value="">All severities</option>
            {severities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="content-card">
        {isLoading && (
          <div className="page-loading">Loading…</div>
        )}

        {error && <div className="page-error">{error}</div>}

        {!isLoading && !error && incidents.length === 0 && (
          <p>No incidents found.</p>
        )}

        {!isLoading && !error && incidents.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Incident</th>
                  <th>Service</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Resolved</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>
                      <strong>{incident.title}</strong>
                    </td>
                    <td>{incident.serviceName}</td>
                    <td>
                      <span
                        className={`status-badge severity-${incident.severity.toLowerCase()}`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge incident-status-${incident.status.toLowerCase()}`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td>
                      {new Date(
                        incident.createdAt,
                      ).toLocaleString()}
                    </td>
                    <td>
                      {incident.resolvedAt
                        ? new Date(
                            incident.resolvedAt,
                          ).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { getAuditLogs } from '../api/audit'
import type { AuditLogResponse } from '../types/api'

const entityTypes = [
  'SERVICE',
  'INCIDENT',
  'DEPLOYMENT',
  'USER',
]

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogResponse[]>([])
  const [entityType, setEntityType] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getAuditLogs({
          entityType: entityType || undefined,
        })

        setLogs(response.content)
      } catch {
        setError('Unable to load audit logs.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLogs()
  }, [entityType])

  return (
    <div className="audit-page">
      <header className="page-header">
        <div>
          <h1>Audit Logs</h1>
          <p>Review important actions performed in ReleaseOps.</p>
        </div>

        <select
          className="filter-select"
          value={entityType}
          onChange={(event) =>
            setEntityType(event.target.value)
          }
        >
          <option value="">All entity types</option>

          {entityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </header>

      <section className="content-card">
        {isLoading && (
          <div className="page-loading">Loading…</div>
        )}

        {error && <div className="page-error">{error}</div>}

        {!isLoading && !error && logs.length === 0 && (
          <p>No audit logs found.</p>
        )}

        {!isLoading && !error && logs.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Details</th>
                  <th>IP address</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.actorEmail ?? 'System'}</td>

                    <td>
                      <span className="audit-action">
                        {log.action}
                      </span>
                    </td>

                    <td>{log.entityType}</td>
                    <td>{log.entityId ?? '—'}</td>

                    <td>
                      <code className="details-code">
                        {Object.keys(log.details).length > 0
                          ? JSON.stringify(log.details)
                          : '—'}
                      </code>
                    </td>

                    <td>{log.ipAddress ?? '—'}</td>

                    <td>
                      {new Date(
                        log.createdAt,
                      ).toLocaleString()}
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
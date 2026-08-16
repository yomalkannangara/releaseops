import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { getDeployments } from '../api/deployments'
import type {
  DeploymentEnvironment,
  DeploymentResponse,
  DeploymentStatus,
} from '../types/api'

const statuses: DeploymentStatus[] = [
  'PENDING',
  'IN_PROGRESS',
  'SUCCESS',
  'FAILED',
  'ROLLED_BACK',
]

const environments: DeploymentEnvironment[] = [
  'DEVELOPMENT',
  'STAGING',
  'PRODUCTION',
]

export function DeploymentsPage() {
  const [deployments, setDeployments] = useState<
    DeploymentResponse[]
  >([])
  const [status, setStatus] =
    useState<DeploymentStatus | ''>('')
  const [environment, setEnvironment] =
    useState<DeploymentEnvironment | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDeployments() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getDeployments({
          status: status || undefined,
          environment: environment || undefined,
        })

        setDeployments(response.content)
      } catch {
        setError('Unable to load deployments.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadDeployments()
  }, [status, environment])

  return (
    <div className="deployments-page">
      <header className="page-header">
        <div>
          <h1>Deployments</h1>
          <p>Review deployment history and results.</p>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | DeploymentStatus
                  | '',
              )
            }
            aria-label="Filter deployments by status"
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
            value={environment}
            onChange={(event) =>
              setEnvironment(
                event.target.value as
                  | DeploymentEnvironment
                  | '',
              )
            }
            aria-label="Filter deployments by environment"
          >
            <option value="">All environments</option>

            {environments.map((item) => (
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

        {!isLoading &&
          !error &&
          deployments.length === 0 && (
            <p>No deployments found.</p>
          )}

        {!isLoading &&
          !error &&
          deployments.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Version</th>
                    <th>Commit</th>
                    <th>Environment</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Pipeline</th>
                    <th>Deployed</th>
                  </tr>
                </thead>

                <tbody>
                  {deployments.map((deployment) => (
                    <tr key={deployment.id}>
                      <td>
                        <strong>
                          {deployment.serviceName}
                        </strong>
                      </td>

                      <td>{deployment.version}</td>

                      <td>
                        <code>{deployment.commitSha}</code>
                      </td>

                      <td>
                        <span
                          className={`environment-badge environment-${deployment.environment.toLowerCase()}`}
                        >
                          {deployment.environment}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${deployment.status.toLowerCase()}`}
                        >
                          {deployment.status}
                        </span>
                      </td>

                      <td>
                        {deployment.durationSeconds !== null
                          ? `${deployment.durationSeconds}s`
                          : '—'}
                      </td>

                      <td>
                        {deployment.pipelineUrl ? (
                          <a
                            className="table-link"
                            href={deployment.pipelineUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td>
                        {new Date(
                          deployment.deployedAt,
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
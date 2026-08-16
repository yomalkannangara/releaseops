import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ExternalLink, Plus } from 'lucide-react'
import {
  createDeployment,
  getDeployments,
  updateDeployment,
} from '../api/deployments'
import { getServices } from '../api/services'
import { useAuth } from '../auth/useAuth'
import { Modal } from '../components/ui/Modal'
import type {
  DeploymentEnvironment,
  DeploymentResponse,
  DeploymentStatus,
  ServiceResponse,
} from '../types/api'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

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
  const { user } = useAuth()
  const canManage = user?.role !== 'VIEWER'

  const [deployments, setDeployments] = useState<
    DeploymentResponse[]
  >([])
  const [services, setServices] = useState<
    ServiceResponse[]
  >([])
  const [status, setStatus] =
    useState<DeploymentStatus | ''>('')
  const [environment, setEnvironment] =
    useState<DeploymentEnvironment | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] =
    useState<number | null>(null)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)
  const [serviceId, setServiceId] = useState('')
  const [version, setVersion] = useState('')
  const [commitSha, setCommitSha] = useState('')
  const [newEnvironment, setNewEnvironment] =
    useState<DeploymentEnvironment>('DEVELOPMENT')
  const [newStatus, setNewStatus] =
    useState<DeploymentStatus>('PENDING')
  const [pipelineUrl, setPipelineUrl] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await getServices({
          size: 100,
        })

        setServices(response.content)

        if (response.content.length > 0) {
          setServiceId(String(response.content[0].id))
        }
      } catch {
        setError('Unable to load services.')
      }
    }

    void loadServices()
  }, [])

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

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setIsCreating(true)
    setFormError('')

    try {
      const createdDeployment = await createDeployment({
        serviceId: Number(serviceId),
        version,
        commitSha,
        environment: newEnvironment,
        status: newStatus,
        pipelineUrl,
      })

      setDeployments((current) => [
        createdDeployment,
        ...current,
      ])

      setVersion('')
      setCommitSha('')
      setNewEnvironment('DEVELOPMENT')
      setNewStatus('PENDING')
      setPipelineUrl('')
      setShowCreateForm(false)
    } catch (requestError) {
      setFormError(
        getApiErrorMessage(
          requestError,
          'Unable to create the deployment.',
        ),
      )
    } finally {
      setIsCreating(false)
    }
  }

  async function handleStatusChange(
    deployment: DeploymentResponse,
    nextStatus: DeploymentStatus,
  ) {
    setUpdatingId(deployment.id)
    setError('')

    try {
      const updatedDeployment = await updateDeployment(
        deployment.id,
        {
          status: nextStatus,
        },
      )

      setDeployments((current) =>
        current.map((item) =>
          item.id === updatedDeployment.id
            ? updatedDeployment
            : item,
        ),
      )
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to update the deployment.',
        ),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="deployments-page">
      <header className="page-header">
        <div>
          <h1>Deployments</h1>
          <p>Review deployment history and results.</p>
        </div>

        <div className="header-actions">
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
          >
            <option value="">All environments</option>

            {environments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {canManage && (
            <button
              type="button"
              className="primary-button"
              disabled={services.length === 0}
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={18} />
              Add deployment
            </button>
          )}
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

        {!isLoading && deployments.length > 0 && (
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
                      {canManage ? (
                        <select
                          className="compact-select"
                          value={deployment.status}
                          disabled={
                            updatingId === deployment.id
                          }
                          onChange={(event) =>
                            void handleStatusChange(
                              deployment,
                              event.target
                                .value as DeploymentStatus,
                            )
                          }
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`status-badge status-${deployment.status.toLowerCase()}`}
                        >
                          {deployment.status}
                        </span>
                      )}
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
                          Open <ExternalLink size={14} />
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

      {showCreateForm && (
        <Modal
          title="Add deployment"
          description="Record a new service deployment."
          onClose={() => setShowCreateForm(false)}
        >
          <form
            className="form-grid"
            onSubmit={handleCreate}
          >
            <label htmlFor="deployment-service">
              Service
            </label>
            <select
              id="deployment-service"
              value={serviceId}
              required
              onChange={(event) =>
                setServiceId(event.target.value)
              }
            >
              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.name}
                </option>
              ))}
            </select>

            <label htmlFor="deployment-version">
              Version
            </label>
            <input
              id="deployment-version"
              value={version}
              required
              maxLength={100}
              placeholder="v1.0.0"
              onChange={(event) =>
                setVersion(event.target.value)
              }
            />

            <label htmlFor="deployment-commit">
              Commit SHA
            </label>
            <input
              id="deployment-commit"
              value={commitSha}
              required
              minLength={7}
              maxLength={64}
              pattern="[a-fA-F0-9]{7,64}"
              placeholder="a1b2c3d"
              onChange={(event) =>
                setCommitSha(event.target.value)
              }
            />

            <label htmlFor="deployment-environment">
              Environment
            </label>
            <select
              id="deployment-environment"
              value={newEnvironment}
              onChange={(event) =>
                setNewEnvironment(
                  event.target
                    .value as DeploymentEnvironment,
                )
              }
            >
              {environments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="deployment-status">
              Initial status
            </label>
            <select
              id="deployment-status"
              value={newStatus}
              onChange={(event) =>
                setNewStatus(
                  event.target.value as DeploymentStatus,
                )
              }
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="pipeline-url">
              Pipeline URL
            </label>
            <input
              id="pipeline-url"
              type="url"
              value={pipelineUrl}
              maxLength={500}
              onChange={(event) =>
                setPipelineUrl(event.target.value)
              }
            />

            {formError && (
              <div className="form-error" role="alert">
                {formError}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={isCreating || !serviceId}
              >
                {isCreating
                  ? 'Creating…'
                  : 'Create deployment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
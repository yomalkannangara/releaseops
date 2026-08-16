import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ExternalLink, Plus } from 'lucide-react'
import {
  createService,
  getServices,
  updateService,
} from '../api/services'
import { useAuth } from '../auth/useAuth'
import { Modal } from '../components/ui/Modal'
import type {
  ServiceResponse,
  ServiceStatus,
} from '../types/api'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

const serviceStatuses: ServiceStatus[] = [
  'HEALTHY',
  'DEGRADED',
  'DOWN',
  'MAINTENANCE',
]

export function ServicesPage() {
  const { user } = useAuth()
  const canManage = user?.role !== 'VIEWER'

  const [services, setServices] = useState<ServiceResponse[]>(
    [],
  )
  const [status, setStatus] =
    useState<ServiceStatus | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] =
    useState<number | null>(null)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [productionUrl, setProductionUrl] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getServices({
          status: status || undefined,
        })

        setServices(response.content)
      } catch {
        setError('Unable to load services.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadServices()
  }, [status])

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setIsCreating(true)
    setFormError('')

    try {
      const createdService = await createService({
        name,
        slug,
        description,
        repositoryUrl,
        productionUrl,
      })

      setServices((current) => [
        createdService,
        ...current,
      ])

      setName('')
      setSlug('')
      setDescription('')
      setRepositoryUrl('')
      setProductionUrl('')
      setShowCreateForm(false)
    } catch (requestError) {
      setFormError(
        getApiErrorMessage(
          requestError,
          'Unable to create the service.',
        ),
      )
    } finally {
      setIsCreating(false)
    }
  }

  async function handleStatusChange(
    service: ServiceResponse,
    newStatus: ServiceStatus,
  ) {
    setUpdatingId(service.id)
    setError('')

    try {
      const updatedService = await updateService(
        service.id,
        {
          status: newStatus,
        },
      )

      setServices((current) =>
        current.map((item) =>
          item.id === updatedService.id
            ? updatedService
            : item,
        ),
      )
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to update the service.',
        ),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="services-page">
      <header className="page-header">
        <div>
          <h1>Services</h1>
          <p>Monitor the services managed by ReleaseOps.</p>
        </div>

        <div className="header-actions">
          <select
            className="filter-select"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as ServiceStatus | '',
              )
            }
          >
            <option value="">All statuses</option>

            {serviceStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {canManage && (
            <button
              type="button"
              className="primary-button"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={18} />
              Add service
            </button>
          )}
        </div>
      </header>

      <section className="content-card">
        {isLoading && (
          <div className="page-loading">Loading…</div>
        )}

        {error && <div className="page-error">{error}</div>}

        {!isLoading && !error && services.length === 0 && (
          <p>No services found.</p>
        )}

        {!isLoading && services.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Repository</th>
                  <th>Production</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                    </td>

                    <td>{service.slug}</td>

                    <td>
                      {canManage ? (
                        <select
                          className="compact-select"
                          value={service.status}
                          disabled={updatingId === service.id}
                          onChange={(event) =>
                            void handleStatusChange(
                              service,
                              event.target
                                .value as ServiceStatus,
                            )
                          }
                        >
                          {serviceStatuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`status-badge service-status-${service.status.toLowerCase()}`}
                        >
                          {service.status}
                        </span>
                      )}
                    </td>

                    <td>
                      {service.repositoryUrl ? (
                        <a
                          className="table-link"
                          href={service.repositoryUrl}
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
                      {service.productionUrl ? (
                        <a
                          className="table-link"
                          href={service.productionUrl}
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
                        service.updatedAt,
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
          title="Add service"
          description="Register a software service in ReleaseOps."
          onClose={() => setShowCreateForm(false)}
        >
          <form
            className="form-grid"
            onSubmit={handleCreate}
          >
            <label htmlFor="service-name">Name</label>
            <input
              id="service-name"
              value={name}
              maxLength={120}
              required
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <label htmlFor="service-slug">Slug</label>
            <input
              id="service-slug"
              value={slug}
              maxLength={120}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder="example-service"
              required
              onChange={(event) =>
                setSlug(event.target.value)
              }
            />

            <label htmlFor="service-description">
              Description
            </label>
            <textarea
              id="service-description"
              value={description}
              maxLength={5000}
              rows={3}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <label htmlFor="repository-url">
              Repository URL
            </label>
            <input
              id="repository-url"
              type="url"
              value={repositoryUrl}
              maxLength={500}
              onChange={(event) =>
                setRepositoryUrl(event.target.value)
              }
            />

            <label htmlFor="production-url">
              Production URL
            </label>
            <input
              id="production-url"
              type="url"
              value={productionUrl}
              maxLength={500}
              onChange={(event) =>
                setProductionUrl(event.target.value)
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
                disabled={isCreating}
              >
                {isCreating
                  ? 'Creating…'
                  : 'Create service'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
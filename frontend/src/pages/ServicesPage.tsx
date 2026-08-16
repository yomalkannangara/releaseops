import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { getServices } from '../api/services'
import type {
  ServiceResponse,
  ServiceStatus,
} from '../types/api'

const serviceStatuses: ServiceStatus[] = [
  'HEALTHY',
  'DEGRADED',
  'DOWN',
  'MAINTENANCE',
]

export function ServicesPage() {
  const [services, setServices] = useState<ServiceResponse[]>(
    [],
  )
  const [status, setStatus] =
    useState<ServiceStatus | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className="services-page">
      <header className="page-header">
        <div>
          <h1>Services</h1>
          <p>Monitor the services managed by ReleaseOps.</p>
        </div>

        <select
          className="filter-select"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as ServiceStatus | '',
            )
          }
          aria-label="Filter services by status"
        >
          <option value="">All statuses</option>

          {serviceStatuses.map((serviceStatus) => (
            <option
              key={serviceStatus}
              value={serviceStatus}
            >
              {serviceStatus}
            </option>
          ))}
        </select>
      </header>

      <section className="content-card">
        {isLoading && (
          <div className="page-loading">Loading…</div>
        )}

        {error && <div className="page-error">{error}</div>}

        {!isLoading && !error && services.length === 0 && (
          <p>No services found.</p>
        )}

        {!isLoading && !error && services.length > 0 && (
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
                      <span
                        className={`status-badge service-status-${service.status.toLowerCase()}`}
                      >
                        {service.status}
                      </span>
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
    </div>
  )
}
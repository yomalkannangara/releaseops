import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import {
  createIncident,
  getIncidents,
  updateIncident,
} from '../api/incidents'
import { getServices } from '../api/services'
import { useAuth } from '../auth/useAuth'
import { Modal } from '../components/ui/Modal'
import type {
  IncidentResponse,
  IncidentSeverity,
  IncidentStatus,
  ServiceResponse,
} from '../types/api'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

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
  const { user } = useAuth()
  const canManage = user?.role !== 'VIEWER'

  const [incidents, setIncidents] = useState<
    IncidentResponse[]
  >([])
  const [services, setServices] = useState<
    ServiceResponse[]
  >([])
  const [status, setStatus] =
    useState<IncidentStatus | ''>('')
  const [severity, setSeverity] =
    useState<IncidentSeverity | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] =
    useState<number | null>(null)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)
  const [serviceId, setServiceId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [newSeverity, setNewSeverity] =
    useState<IncidentSeverity>('MEDIUM')
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

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setIsCreating(true)
    setFormError('')

    try {
      const createdIncident = await createIncident({
        serviceId: Number(serviceId),
        title,
        description,
        severity: newSeverity,
      })

      setIncidents((current) => [
        createdIncident,
        ...current,
      ])

      setTitle('')
      setDescription('')
      setNewSeverity('MEDIUM')
      setShowCreateForm(false)
    } catch (requestError) {
      setFormError(
        getApiErrorMessage(
          requestError,
          'Unable to create the incident.',
        ),
      )
    } finally {
      setIsCreating(false)
    }
  }

  async function handleStatusChange(
    incident: IncidentResponse,
    newStatus: IncidentStatus,
  ) {
    setUpdatingId(incident.id)
    setError('')

    try {
      const updatedIncident = await updateIncident(
        incident.id,
        {
          status: newStatus,
        },
      )

      setIncidents((current) =>
        current.map((item) =>
          item.id === updatedIncident.id
            ? updatedIncident
            : item,
        ),
      )
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          'Unable to update the incident.',
        ),
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="incidents-page">
      <header className="page-header">
        <div>
          <h1>Incidents</h1>
          <p>Track and monitor operational incidents.</p>
        </div>

        <div className="header-actions">
          <select
            className="filter-select"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as IncidentStatus | '',
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
            value={severity}
            onChange={(event) =>
              setSeverity(
                event.target.value as
                  | IncidentSeverity
                  | '',
              )
            }
          >
            <option value="">All severities</option>

            {severities.map((item) => (
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
              Add incident
            </button>
          )}
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

        {!isLoading && incidents.length > 0 && (
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
                      {canManage ? (
                        <select
                          className="compact-select"
                          value={incident.status}
                          disabled={
                            updatingId === incident.id
                          }
                          onChange={(event) =>
                            void handleStatusChange(
                              incident,
                              event.target
                                .value as IncidentStatus,
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
                          className={`status-badge incident-status-${incident.status.toLowerCase()}`}
                        >
                          {incident.status}
                        </span>
                      )}
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

      {showCreateForm && (
        <Modal
          title="Add incident"
          description="Report an operational issue."
          onClose={() => setShowCreateForm(false)}
        >
          <form
            className="form-grid"
            onSubmit={handleCreate}
          >
            <label htmlFor="incident-service">
              Service
            </label>
            <select
              id="incident-service"
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

            <label htmlFor="incident-title">Title</label>
            <input
              id="incident-title"
              value={title}
              required
              maxLength={200}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <label htmlFor="incident-description">
              Description
            </label>
            <textarea
              id="incident-description"
              value={description}
              required
              maxLength={10000}
              rows={4}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <label htmlFor="incident-severity">
              Severity
            </label>
            <select
              id="incident-severity"
              value={newSeverity}
              onChange={(event) =>
                setNewSeverity(
                  event.target.value as IncidentSeverity,
                )
              }
            >
              {severities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

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
                  : 'Create incident'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
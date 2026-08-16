import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Plus, X } from 'lucide-react'
import {
  createUser,
  getUsers,
  updateUser,
} from '../api/users'
import { useAuth } from '../auth/useAuth'
import type {
  ApiErrorResponse,
  Role,
  UserResponse,
} from '../types/api'

const roles: Role[] = [
  'ADMIN',
  'ENGINEER',
  'VIEWER',
]

export function UsersPage() {
  const { user: authenticatedUser } = useAuth()

  const [users, setUsers] = useState<UserResponse[]>([])
  const [role, setRole] = useState<Role | ''>('')
  const [enabled, setEnabled] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] =
    useState<number | null>(null)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] =
    useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [newRole, setNewRole] =
    useState<Role>('ENGINEER')
  const [isCreating, setIsCreating] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getUsers({
          role: role || undefined,
          enabled:
            enabled === ''
              ? undefined
              : enabled === 'true',
        })

        setUsers(response.content)
      } catch {
        setError('Unable to load users.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadUsers()
  }, [role, enabled])

  async function handleCreateUser(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setIsCreating(true)
    setFormError('')

    try {
      const createdUser = await createUser({
        email,
        fullName,
        password,
        role: newRole,
      })

      setUsers((currentUsers) => [
        createdUser,
        ...currentUsers,
      ])

      setEmail('')
      setFullName('')
      setPassword('')
      setNewRole('ENGINEER')
      setShowCreateForm(false)
    } catch (requestError) {
      if (isAxiosError<ApiErrorResponse>(requestError)) {
        setFormError(
          requestError.response?.data.message ??
            'Unable to create the user.',
        )
      } else {
        setFormError('Unable to create the user.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function toggleUser(user: UserResponse) {
    if (user.id === authenticatedUser?.userId) {
      return
    }

    setUpdatingId(user.id)
    setError('')

    try {
      const updatedUser = await updateUser(user.id, {
        enabled: !user.enabled,
      })

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id
            ? updatedUser
            : currentUser,
        ),
      )
    } catch {
      setError('Unable to update the user.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="users-page">
      <header className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage ReleaseOps accounts and access roles.</p>
        </div>

        <div className="header-actions">
          <select
            className="filter-select"
            value={role}
            onChange={(event) =>
              setRole(event.target.value as Role | '')
            }
          >
            <option value="">All roles</option>

            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={enabled}
            onChange={(event) =>
              setEnabled(event.target.value)
            }
          >
            <option value="">All account states</option>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={18} />
            Add user
          </button>
        </div>
      </header>

      <section className="content-card">
        {isLoading && (
          <div className="page-loading">Loading…</div>
        )}

        {error && <div className="page-error">{error}</div>}

        {!isLoading && !error && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!isLoading && users.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isCurrentUser =
                    user.id === authenticatedUser?.userId

                  return (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.fullName}</strong>
                        {isCurrentUser && (
                          <span className="current-user">
                            You
                          </span>
                        )}
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span className="role-badge">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            user.enabled
                              ? 'account-enabled'
                              : 'account-disabled'
                          }`}
                        >
                          {user.enabled
                            ? 'ENABLED'
                            : 'DISABLED'}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          user.createdAt,
                        ).toLocaleString()}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="table-button"
                          disabled={
                            isCurrentUser ||
                            updatingId === user.id
                          }
                          title={
                            isCurrentUser
                              ? 'You cannot disable your own account'
                              : undefined
                          }
                          onClick={() =>
                            void toggleUser(user)
                          }
                        >
                          {isCurrentUser
                            ? 'Current user'
                            : updatingId === user.id
                              ? 'Updating…'
                              : user.enabled
                                ? 'Disable'
                                : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showCreateForm && (
        <div className="modal-overlay">
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
          >
            <div className="modal-header">
              <div>
                <h2 id="create-user-title">Add user</h2>
                <p>Create a new ReleaseOps account.</p>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setShowCreateForm(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="form-grid"
              onSubmit={handleCreateUser}
            >
              <label htmlFor="user-full-name">
                Full name
              </label>
              <input
                id="user-full-name"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
                maxLength={120}
              />

              <label htmlFor="user-email">Email</label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                maxLength={255}
              />

              <label htmlFor="user-password">
                Password
              </label>
              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={8}
                maxLength={72}
              />

              <label htmlFor="user-role">Role</label>
              <select
                id="user-role"
                value={newRole}
                onChange={(event) =>
                  setNewRole(event.target.value as Role)
                }
              >
                {roles.map((item) => (
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
                  onClick={() =>
                    setShowCreateForm(false)
                  }
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
                    : 'Create user'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
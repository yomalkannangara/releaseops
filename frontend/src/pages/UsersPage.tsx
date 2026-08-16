import { useEffect, useState } from 'react'
import { getUsers, updateUser } from '../api/users'
import type {
  Role,
  UserResponse,
} from '../types/api'

const roles: Role[] = [
  'ADMIN',
  'ENGINEER',
  'VIEWER',
]

export function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [role, setRole] = useState<Role | ''>('')
  const [enabled, setEnabled] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] =
    useState<number | null>(null)
  const [error, setError] = useState('')

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

  async function toggleUser(user: UserResponse) {
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

        <div className="filter-group">
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.fullName}</strong>
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
                        disabled={updatingId === user.id}
                        onClick={() => void toggleUser(user)}
                      >
                        {updatingId === user.id
                          ? 'Updating…'
                          : user.enabled
                            ? 'Disable'
                            : 'Enable'}
                      </button>
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
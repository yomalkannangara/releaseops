import { apiClient } from './client'
import type {
  CreateUserRequest,
  PageResponse,
  Role,
  UpdateUserRequest,
  UserResponse,
} from '../types/api'

export interface UserFilters {
  role?: Role
  enabled?: boolean
  page?: number
  size?: number
}

export async function getUsers(
  filters: UserFilters = {},
): Promise<PageResponse<UserResponse>> {
  const response = await apiClient.get<
    PageResponse<UserResponse>
  >('/admin/users', {
    params: {
      role: filters.role,
      enabled: filters.enabled,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    },
  })

  return response.data
}

export async function createUser(
  request: CreateUserRequest,
): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>(
    '/admin/users',
    request,
  )

  return response.data
}

export async function updateUser(
  id: number,
  request: UpdateUserRequest,
): Promise<UserResponse> {
  const response = await apiClient.patch<UserResponse>(
    `/admin/users/${id}`,
    request,
  )

  return response.data
}
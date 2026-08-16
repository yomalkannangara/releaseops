import { apiClient } from './client'
import type {
  PageResponse,
  ServiceResponse,
  ServiceStatus,
} from '../types/api'

export interface ServiceFilters {
  status?: ServiceStatus
  page?: number
  size?: number
}

export async function getServices(
  filters: ServiceFilters = {},
): Promise<PageResponse<ServiceResponse>> {
  const response = await apiClient.get<
    PageResponse<ServiceResponse>
  >('/services', {
    params: {
      status: filters.status,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    },
  })

  return response.data
}
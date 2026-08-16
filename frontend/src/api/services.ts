import { apiClient } from './client'
import type {
  CreateServiceRequest,
  PageResponse,
  ServiceResponse,
  ServiceStatus,
  UpdateServiceRequest,
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

export async function createService(
  request: CreateServiceRequest,
): Promise<ServiceResponse> {
  const response = await apiClient.post<ServiceResponse>(
    '/services',
    request,
  )

  return response.data
}

export async function updateService(
  id: number,
  request: UpdateServiceRequest,
): Promise<ServiceResponse> {
  const response = await apiClient.patch<ServiceResponse>(
    `/services/${id}`,
    request,
  )

  return response.data
}

export async function deleteService(
  id: number,
): Promise<void> {
  await apiClient.delete(`/services/${id}`)
}
import { apiClient } from './client'
import type {
  CreateIncidentRequest,
  IncidentResponse,
  IncidentSeverity,
  IncidentStatus,
  PageResponse,
  UpdateIncidentRequest,
} from '../types/api'

export interface IncidentFilters {
  serviceId?: number
  status?: IncidentStatus
  severity?: IncidentSeverity
  page?: number
  size?: number
}

export async function getIncidents(
  filters: IncidentFilters = {},
): Promise<PageResponse<IncidentResponse>> {
  const response = await apiClient.get<
    PageResponse<IncidentResponse>
  >('/incidents', {
    params: {
      serviceId: filters.serviceId,
      status: filters.status,
      severity: filters.severity,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    },
  })

  return response.data
}

export async function createIncident(
  request: CreateIncidentRequest,
): Promise<IncidentResponse> {
  const response = await apiClient.post<IncidentResponse>(
    '/incidents',
    request,
  )

  return response.data
}

export async function updateIncident(
  id: number,
  request: UpdateIncidentRequest,
): Promise<IncidentResponse> {
  const response = await apiClient.patch<IncidentResponse>(
    `/incidents/${id}`,
    request,
  )

  return response.data
}
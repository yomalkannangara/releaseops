import { apiClient } from './client'
import type {
  IncidentResponse,
  IncidentSeverity,
  IncidentStatus,
  PageResponse,
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
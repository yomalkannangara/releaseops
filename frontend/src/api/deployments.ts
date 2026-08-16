import { apiClient } from './client'
import type {
  DeploymentEnvironment,
  DeploymentResponse,
  DeploymentStatus,
  PageResponse,
} from '../types/api'

export interface DeploymentFilters {
  serviceId?: number
  status?: DeploymentStatus
  environment?: DeploymentEnvironment
  page?: number
  size?: number
}

export async function getDeployments(
  filters: DeploymentFilters = {},
): Promise<PageResponse<DeploymentResponse>> {
  const response = await apiClient.get<
    PageResponse<DeploymentResponse>
  >('/deployments', {
    params: {
      serviceId: filters.serviceId,
      status: filters.status,
      environment: filters.environment,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    },
  })

  return response.data
}
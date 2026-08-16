import { apiClient } from './client'
import type {
  CreateDeploymentRequest,
  DeploymentEnvironment,
  DeploymentResponse,
  DeploymentStatus,
  PageResponse,
  UpdateDeploymentRequest,
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

export async function createDeployment(
  request: CreateDeploymentRequest,
): Promise<DeploymentResponse> {
  const response =
    await apiClient.post<DeploymentResponse>(
      '/deployments',
      request,
    )

  return response.data
}

export async function updateDeployment(
  id: number,
  request: UpdateDeploymentRequest,
): Promise<DeploymentResponse> {
  const response =
    await apiClient.patch<DeploymentResponse>(
      `/deployments/${id}`,
      request,
    )

  return response.data
}
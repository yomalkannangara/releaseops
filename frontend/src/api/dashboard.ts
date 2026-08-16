import { apiClient } from './client'
import type {
  DashboardSummaryResponse,
} from '../types/api'

export async function getDashboardSummary():
Promise<DashboardSummaryResponse> {
  const response =
    await apiClient.get<DashboardSummaryResponse>(
      '/dashboard/summary',
    )

  return response.data
}
import { apiClient } from './client'
import type {
  AuditLogResponse,
  PageResponse,
} from '../types/api'

export interface AuditFilters {
  actorId?: number
  entityType?: string
  action?: string
  page?: number
  size?: number
}

export async function getAuditLogs(
  filters: AuditFilters = {},
): Promise<PageResponse<AuditLogResponse>> {
  const response = await apiClient.get<
    PageResponse<AuditLogResponse>
  >('/audit', {
    params: {
      actorId: filters.actorId,
      entityType: filters.entityType,
      action: filters.action,
      page: filters.page ?? 0,
      size: filters.size ?? 50,
    },
  })

  return response.data
}
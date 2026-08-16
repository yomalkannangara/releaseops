export type Role = 'ADMIN' | 'ENGINEER' | 'VIEWER'

export type DeploymentEnvironment =
  | 'DEVELOPMENT'
  | 'STAGING'
  | 'PRODUCTION'

export type DeploymentStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'SUCCESS'
  | 'FAILED'
  | 'ROLLED_BACK'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  tokenType: 'Bearer'
  expiresIn: number
  userId: number
  email: string
  fullName: string
  role: Role
}

export interface DeploymentResponse {
  id: number
  serviceId: number
  serviceName: string
  version: string
  commitSha: string
  environment: DeploymentEnvironment
  status: DeploymentStatus
  triggeredBy: string
  durationSeconds: number | null
  pipelineUrl: string | null
  failureReason: string | null
  deployedAt: string
  createdAt: string
  updatedAt: string
}

export interface DashboardSummaryResponse {
  totalServices: number
  healthyServices: number
  openIncidents: number
  criticalIncidents: number
  deploymentsToday: number
  failedDeploymentsToday: number
  recentDeployments: DeploymentResponse[]
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  fieldErrors: Record<string, string>
}
export type ServiceStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'DOWN'
  | 'MAINTENANCE'

export interface ServiceResponse {
  id: number
  name: string
  slug: string
  description: string | null
  repositoryUrl: string | null
  productionUrl: string | null
  status: ServiceStatus
  createdAt: string
  updatedAt: string
}

export interface PageMetadata {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface PageResponse<T> {
  content: T[]
  page: PageMetadata
}
export type IncidentStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'MONITORING'
  | 'RESOLVED'

export type IncidentSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export interface IncidentResponse {
  id: number
  serviceId: number
  serviceName: string
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}
export interface AuditLogResponse {
  id: number
  actorId: number | null
  actorEmail: string | null
  action: string
  entityType: string
  entityId: number | null
  details: Record<string, unknown>
  ipAddress: string | null
  createdAt: string
}

export interface UserResponse {
  id: number
  email: string
  fullName: string
  role: Role
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  fullName: string
  password: string
  role: Role
}

export interface UpdateUserRequest {
  fullName?: string
  role?: Role
  enabled?: boolean
}
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
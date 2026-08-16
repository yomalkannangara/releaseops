import { apiClient } from './client'
import type {
  AuthResponse,
  LoginRequest,
} from '../types/api'

export async function login(
  request: LoginRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/auth/login',
    request,
  )

  return response.data
}
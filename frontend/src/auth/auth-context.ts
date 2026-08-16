import { createContext } from 'react'
import type {
  LoginRequest,
  Role,
} from '../types/api'

export interface AuthUser {
  userId: number
  email: string
  fullName: string
  role: Role
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (request: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined)
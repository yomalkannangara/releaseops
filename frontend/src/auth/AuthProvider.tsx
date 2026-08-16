import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { login as loginRequest } from '../api/auth'
import {
  TOKEN_STORAGE_KEY,
} from '../api/client'
import type { LoginRequest } from '../types/api'
import {
  AuthContext,
  type AuthUser,
} from './auth-context'

const USER_STORAGE_KEY = 'releaseops_user'
const EXPIRY_STORAGE_KEY = 'releaseops_token_expiry'

function clearStoredAuthentication() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(EXPIRY_STORAGE_KEY)
}

function loadStoredUser(): AuthUser | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const storedUser = localStorage.getItem(USER_STORAGE_KEY)
  const expiry = Number(
    localStorage.getItem(EXPIRY_STORAGE_KEY),
  )

  if (
    !token ||
    !storedUser ||
    !expiry ||
    Date.now() >= expiry
  ) {
    clearStoredAuthentication()
    return null
  }

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    clearStoredAuthentication()
    return null
  }
}

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] =
    useState<AuthUser | null>(loadStoredUser)

  async function login(request: LoginRequest) {
    const response = await loginRequest(request)

    const authenticatedUser: AuthUser = {
      userId: response.userId,
      email: response.email,
      fullName: response.fullName,
      role: response.role,
    }

    const expiry =
      Date.now() + response.expiresIn * 1000

    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      response.token,
    )
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    )
    localStorage.setItem(
      EXPIRY_STORAGE_KEY,
      String(expiry),
    )

    setUser(authenticatedUser)
  }

  function logout() {
    clearStoredAuthentication()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
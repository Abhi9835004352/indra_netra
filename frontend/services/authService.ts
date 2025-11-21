// Backend API integration file for authentication
// This service handles all auth-related API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface LoginResponse {
  success: boolean
  message?: string
  token?: string
  user?: any
}

export interface RegisterResponse {
  success: boolean
  message?: string
  token?: string
  user?: any
}

// Admin authentication endpoints
export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  // Bypass login: always return success
  return {
    success: true,
    token: "mock-admin-token",
    user: { email, role: "admin" },
    message: "Login bypassed (mocked)",
  }
}

// User authentication endpoints
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  // Bypass login: always return success
  return {
    success: true,
    token: "mock-user-token",
    user: { email, role: "user" },
    message: "Login bypassed (mocked)",
  }
}

export async function registerUser(userData: any): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to register user",
    }
  }
}

export async function verifyToken(token: string, role: "admin" | "user"): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.success
  } catch {
    return false
  }
}

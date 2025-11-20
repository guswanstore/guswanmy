"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  email: string
  isAdmin: boolean
  isReseller: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; accountExists?: boolean }>
  register: (email: string, password: string) => Promise<{ success: boolean }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; accountExists?: boolean }> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const userExists = storedUsers.some((u: any) => u.email === email)

      // Check if credentials match admin credentials
      if (email === "guswan122@gmail.com" && password === "guswanshees") {
        const adminUser = { email, isAdmin: true, isReseller: false }
        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))
        return { success: true, accountExists: true }
      }

      const storedResellers = JSON.parse(localStorage.getItem("resellers") || "[]")
      const isResellerUser = storedResellers.some((r: any) => r.email === email)

      // Check if user is registered
      if (!userExists && !isResellerUser) {
        return { success: false, accountExists: false }
      }

      // Login as reseller or regular user
      const regularUser = { email, isAdmin: false, isReseller: isResellerUser }
      setUser(regularUser)
      localStorage.setItem("user", JSON.stringify(regularUser))
      return { success: true, accountExists: true }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { success: false, accountExists: false }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string): Promise<{ success: boolean }> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const userExists = storedUsers.some((u: any) => u.email === email)

      if (userExists) {
        return { success: false }
      }

      storedUsers.push({ email, password })
      localStorage.setItem("registeredUsers", JSON.stringify(storedUsers))

      const newUser = { email, isAdmin: false, isReseller: false }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      console.error("[v0] Register error:", error)
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

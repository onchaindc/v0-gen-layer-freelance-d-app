"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface UserProfile {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: number
}

interface UserContextType {
  profile: UserProfile | null
  updateProfile: (profile: Partial<UserProfile>) => void
  clearProfile: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = prev
        ? { ...prev, ...updates }
        : {
            id: Date.now().toString(),
            username: updates.username || "",
            email: updates.email || "",
            avatar: updates.avatar,
            bio: updates.bio,
            createdAt: Date.now(),
          }
      localStorage.setItem("userProfile", JSON.stringify(updated))
      return updated
    })
  }

  const clearProfile = () => {
    setProfile(null)
    localStorage.removeItem("userProfile")
  }

  return <UserContext.Provider value={{ profile, updateProfile, clearProfile }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}

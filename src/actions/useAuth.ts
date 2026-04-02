// hooks/useAuth.ts
'use client'
import { createClientComponentClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export type AppRole = 'ADM' | 'EDITOR' | 'VIEWER'

export interface UserPermissions {
  role: AppRole | null
  fullName: string | null
  email: string | null
  avatarUrl: string | null
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    role: null,
    fullName: null,
    email: null,
    avatarUrl: null,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    isAuthenticated: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    const supabase = createClientComponentClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      // Buscar profile do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, email, avatar_url')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        const role = profile.role as AppRole
        
        setPermissions({
          role,
          fullName: profile.full_name,
          email: profile.email,
          avatarUrl: profile.avatar_url,
          canCreate: role === 'ADM' || role === 'EDITOR',
          canEdit: role === 'ADM' || role === 'EDITOR',
          canDelete: role === 'ADM',
          isAuthenticated: true
        })
      }
    }
    
    setLoading(false)
  }

  return { permissions, loading, checkPermissions }
}
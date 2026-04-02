// components/AppHeader.tsx (header global)
'use client'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppHeader() {
  const { permissions, loading } = useAuth()
  const pathname = usePathname()

  if (loading || !permissions.isAuthenticated) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/test-cases" className="text-xl font-bold text-gray-900">
              TestCase Manager
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {permissions.role} | {permissions.fullName}
            </span>
            
            {permissions.avatarUrl && (
              <img
                src={permissions.avatarUrl}
                alt={permissions.fullName || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-red-600 underline"
    >
      Keluar
    </button>
  )
}
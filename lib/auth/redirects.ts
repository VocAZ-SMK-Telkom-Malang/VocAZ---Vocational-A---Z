// lib/auth/redirects.ts

export const ROLE_DASHBOARD: Record<string, string> = {
  admin: '/admin/dashboard',
  student: '/student/dashboard',
  company: '/company/dashboard',
  school: '/school/dashboard',
  certification: '/certification/dashboard',
}

export function getDashboardPath(role: string | null | undefined): string {
  if (!role) return '/'
  return ROLE_DASHBOARD[role] ?? '/'
}

export function isAuthPath(pathname: string): boolean {
  return pathname.startsWith('/auth/')
}

export function isPublicPath(pathname: string): boolean {
  const publicPaths = ['/', '/about', '/jobs', '/talents', '/companies', '/showcase']
  return publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
}
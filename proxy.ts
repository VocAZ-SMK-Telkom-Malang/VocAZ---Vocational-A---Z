// middleware.ts
import { auth } from '@/lib/auth/server'

export default auth.middleware({
  loginUrl: '/auth/sign-in',
})

export const config = {
  matcher: [
    '/student/:path*',
    '/company/:path*',
    '/school/:path*',
    '/certification/:path*',
    '/admin/:path*',
  ],
}
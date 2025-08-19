import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export const config = {
  matcher: ['/app/:path*', '/dashboard/:path*', '/settings/:path*'],
}

export default withAuth(
  function middleware(_req: NextRequest) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        return !!token // Returns true if user is authenticated
      },
    },

    pages: {
      signIn: '/portal',
    },
  },
)

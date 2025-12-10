import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip protection for login page
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
        // Check for auth token in cookie
        const authToken = request.cookies.get('bpl_admin_auth');
        const loginTime = request.cookies.get('bpl_admin_login_time');

        if (!authToken || !loginTime) {
            // Redirect to login if not authenticated
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Check if session expired (12 hours)
        const sessionDuration = 12 * 60 * 60 * 1000;
        const elapsed = Date.now() - parseInt(loginTime.value);

        if (elapsed > sessionDuration) {
            // Session expired, redirect to login
            const loginUrl = new URL('/admin/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('bpl_admin_auth');
            response.cookies.delete('bpl_admin_login_time');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};

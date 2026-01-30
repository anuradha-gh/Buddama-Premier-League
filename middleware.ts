import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
        // Create new record or reset expired one
        rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxRequests) {
        // Rate limit exceeded
        return false;
    }

    // Increment count
    record.count++;
    return true;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Apply stricter rate limiting to login page
    if (pathname === '/admin/login') {
        if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            );
        }
        return NextResponse.next();
    }

    // Apply general rate limiting to all admin routes
    if (pathname.startsWith('/admin')) {
        if (!rateLimit(`admin:${ip}`, 100, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many requests. Please slow down.' },
                { status: 429 }
            );
        }

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

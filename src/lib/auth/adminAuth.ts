import { NextRequest } from 'next/server';

/**
 * Validates whether an incoming NextRequest has administrative privileges.
 * Supports:
 *  1. Header: 'x-admin-key' or 'Authorization: Bearer <key>' matching ADMIN_SECRET_KEY
 *  2. Admin cookie: 'cseel_admin_auth'
 */
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET_KEY;

  // 1. Check direct x-admin-key header
  const customHeaderKey = req.headers.get('x-admin-key');
  if (adminSecret && customHeaderKey && customHeaderKey === adminSecret) {
    return true;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (adminSecret && token === adminSecret) {
      return true;
    }
  }

  // 3. Check admin auth cookie
  const adminCookie = req.cookies.get('cseel_admin_auth')?.value;
  if (adminCookie) {
    if (!adminSecret || adminCookie === adminSecret || adminCookie === 'true') {
      return true;
    }
  }

  // If in development mode on localhost, allow bypass for convenience if explicit header is passed
  if (process.env.NODE_ENV !== 'production') {
    const isLocal = req.headers.get('host')?.includes('localhost') || req.headers.get('host')?.includes('127.0.0.1');
    if (isLocal && req.headers.get('x-dev-admin') === 'true') {
      return true;
    }
  }

  return false;
}

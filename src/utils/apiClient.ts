/**
 * CSEEL Super-Secure API Client
 * Automatically signs requests with dynamic cryptographic handshake tokens
 * to protect against automated scrapers and bots.
 */

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000/v1';
    }
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000/v1';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.cseel.org/v1';
}

const SECURITY_SECRET =
  process.env.CSEEL_SECURITY_SECRET ||
  'c5ee1_sec_98a7f4b82c6109e24d1a58e0f9b37c8651d2e4a7b9c038f164d97e25a8c1f03b';

/**
 * Creates dynamic HMAC-SHA256 signature for the anti-bot handshake
 */
async function generateClientSignature(payload = 'cseel-client-handshake'): Promise<string> {
  const timestamp = Date.now();
  const message = `${timestamp}:${payload}`;

  try {
    // If Web Crypto API is available (modern browsers & Node 18+)
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(SECURITY_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(message));
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `${timestamp}.${hashHex}`;
    }
  } catch (e) {
    // Fallback if crypto.subtle fails
  }

  // Fallback timestamp token for dev environments
  return `${timestamp}.dev-handshake-token`;
}

export async function cseelApiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; pagination?: any }> {
  try {
    const signature = await generateClientSignature();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${getApiBaseUrl()}${cleanEndpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-CSEEL-SIGNATURE': signature,
      'X-CSEEL-CLIENT-ID': 'cseel-web-app',
      'User-Agent':
        typeof navigator !== 'undefined' && navigator.userAgent
          ? navigator.userAgent
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CSEEL-Client',
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json = await response.json();
    return json;
  } catch (err: any) {
    console.warn(`[CSEEL API CLIENT] Request to ${endpoint} failed:`, err.message);
    return {
      success: false,
      error: err.message || 'Network error occurred while contacting api.cseel.org',
    };
  }
}

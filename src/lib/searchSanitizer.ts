/**
 * Comprehensive Search Query Sanitizer & Abuse Blocker
 * Ensures all recorded queries are safe, non-infected, bounded in length, and free of vulgar/abusive words.
 */

// Profane and abusive keywords (English and Hindi/Hinglish)
const ABUSIVE_PATTERNS = [
  'fuck', 'fucking', 'bitch', 'bastard', 'asshole', 'porn', 'xxx', 'nude',
  'nudes', 'sex', 'boobs', 'pussy', 'dick', 'whore', 'slut', 'cunt', 'cock',
  'chutiya', 'chutiye', 'madarchod', 'mc', 'bhosdike', 'bhosdi', 'bc',
  'behenchod', 'harami', 'gandu', 'kamine', 'lauda', 'lodu', 'randi',
  'r@ndi', 'gaand', 'choot', 'jhaatu', 'suar', 'kamina', 'saala'
];

// Malicious injection patterns (XSS, SQLi, shell command injection)
const MALICIOUS_PATTERNS = [
  /<[^>]*>/i,                            // HTML tags
  /javascript:/i,                        // JS protocol
  /data:/i,                              // Data protocol
  /vbscript:/i,                          // VBScript
  /onload\s*=/i,                         // DOM events
  /onerror\s*=/i,
  /onclick\s*=/i,
  /eval\s*\(/i,                          // JS eval
  /alert\s*\(/i,
  /document\.cookie/i,
  /union\s+select/i,                     // SQL injection
  /drop\s+table/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /update\s+\w+\s+set/i,
  /exec\s*\(/i,
  /--/,                                  // SQL comments
  /\/\*/,                                // Block comments
  /\b(waitfor\s+delay|sleep\s*\()/i,     // Time-based blind SQLi
];

export interface SanitizationResult {
  isValid: boolean;
  cleanQuery: string;
  reason?: string;
}

export function sanitizeSearchQuery(rawQuery: string): SanitizationResult {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { isValid: false, cleanQuery: '', reason: 'Empty query' };
  }

  const trimmed = rawQuery.trim();

  // 1. Length constraints: min 2, max 80 characters
  if (trimmed.length < 2) {
    return { isValid: false, cleanQuery: '', reason: 'Query too short (min 2 characters)' };
  }
  if (trimmed.length > 80) {
    return { isValid: false, cleanQuery: '', reason: 'Query too long (max 80 characters)' };
  }

  // 2. Malicious payload detection (XSS / SQLi / script injection)
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { isValid: false, cleanQuery: '', reason: 'Potential malicious payload or script blocked' };
    }
  }

  // 3. Control character & null byte cleanup
  let cleaned = trimmed
    .replace(/[\r\n\t\x00-\x1F\x7F-\x9F]/g, ' ')
    .replace(/[<>{}\\"`^~[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 4. Must contain at least 2 alphanumeric characters
  const alphanumericMatches = cleaned.match(/[a-zA-Z0-9]/g);
  if (!alphanumericMatches || alphanumericMatches.length < 2) {
    return { isValid: false, cleanQuery: '', reason: 'Query must contain at least 2 alphanumeric characters' };
  }

  // 5. Profanity & abusive word filter
  const queryLower = cleaned.toLowerCase();
  for (const bad of ABUSIVE_PATTERNS) {
    const wordRegex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${bad}([^a-zA-Z0-9]|\\s|$)`, 'i');
    if (wordRegex.test(queryLower)) {
      return { isValid: false, cleanQuery: '', reason: 'Inappropriate or abusive term blocked' };
    }
  }

  return { isValid: true, cleanQuery: cleaned };
}

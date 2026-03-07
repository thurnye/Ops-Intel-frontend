const SENSITIVE_KEYS = ["password", "token", "secret", "authorization"];

export function sanitizeString(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function redactSensitiveFields<T>(input: T): T {
  if (!input || typeof input !== "object") {
    return input;
  }

  const clone = { ...(input as Record<string, unknown>) };

  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      clone[key] = "[REDACTED]";
    }
  }

  return clone as T;
}

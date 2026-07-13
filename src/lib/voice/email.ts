const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared by the client-side form and the server-side route — a client check alone can't be
 * trusted (same reasoning Turnstile/rate-limiting already apply here), so both sides validate the
 * same shape. Deliberately simple (not full RFC 5322) — this only gates who Serhii can follow up
 * with, not a transactional-email send. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

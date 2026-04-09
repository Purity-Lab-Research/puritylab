import { z } from "zod";

/**
 * Shared Zod schemas for input validation across API routes.
 */

/** Strip HTML tags from a string to prevent XSS. */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

/** Sanitized string: trims whitespace and strips HTML. */
export const safeString = (maxLen = 500) =>
  z
    .string()
    .trim()
    .max(maxLen)
    .transform(stripHtml);

/** UUID v4 format. */
export const uuid = z.string().uuid();

/** Email with basic format check. */
export const email = z.string().email().max(255).trim().toLowerCase();

/** Phone: digits, spaces, dashes, parens, optional leading +. 7 to 20 chars. */
export const phone = z
  .string()
  .trim()
  .regex(/^\+?[\d\s\-().]{7,20}$/, "Invalid phone number format");

/** Positive number with optional max. */
export const positiveNumber = (max = 999_999) =>
  z.number().positive().max(max);

/** Non-negative integer (for quantities). */
export const quantity = z.number().int().min(0).max(10_000);

/** Positive integer quantity (at least 1). */
export const positiveQuantity = z.number().int().min(1).max(10_000);

/** Pagination params. */
export const paginationParams = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

/** Standard error response shape. */
export function errorResponse(message: string, status: number, code?: string) {
  const body: { error: string; code?: string } = { error: message };
  if (code) body.code = code;
  return Response.json(body, { status });
}

/** Generic server error; never exposes internals to client. */
export function serverError() {
  return errorResponse("Something went wrong. Please try again.", 500);
}

/** 401 Unauthorized. */
export function unauthorized() {
  return errorResponse("Unauthorized", 401, "UNAUTHORIZED");
}

/** 403 Forbidden. */
export function forbidden() {
  return errorResponse("Forbidden", 403, "FORBIDDEN");
}

/** 404 Not Found. */
export function notFound(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404, "NOT_FOUND");
}

/** 429 Too Many Requests. */
export function tooManyRequests() {
  return errorResponse("Too many requests. Please try again in a moment.", 429, "RATE_LIMITED");
}

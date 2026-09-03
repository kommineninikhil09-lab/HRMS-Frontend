/**
 * Base URL of the HRMS backend API.
 *
 * Server-side only (used from Next.js route handlers that proxy to the backend).
 * Override with `BACKEND_API_URL` in `.env.local`; see `.env.example`.
 */
export const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? 'http://localhost:3000/api/v1';

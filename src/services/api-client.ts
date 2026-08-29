/**
 * Transport abstraction.
 *
 * Today every endpoint resolves against an in-memory mock adapter. When the
 * FastAPI backend is available, set VITE_API_BASE_URL and the same `request()`
 * calls will hit `/api/v1/...` over HTTP with no change to callers.
 */
export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "";

export const USE_MOCK = !API_BASE_URL;

export const LATENCY_MS = 180;

export function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type MockResolver<T> = () => T | Promise<T>;

export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; mock: MockResolver<T> },
): Promise<T> {
  if (USE_MOCK) {
    return delay(await options.mock());
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed`, response.status, await response.text());
  }
  return (await response.json()) as T;
}

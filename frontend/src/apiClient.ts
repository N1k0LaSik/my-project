import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "./config";
import type {
  ApiError,
  CreateTicketDto,
  CreateUserDto,
  PaginatedResponse,
  StatusDto,
  TicketDetailDto,
  TicketListItemDto,
  UpdateTicketDto,
  UserDto,
} from "./dtos";


// ─── Simple cache ─────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 30_000; // 30 секунд

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setToCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key);
  }
}


// ─── Core request function ────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  signal?: AbortSignal
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, { ...options, signal });
  } catch (e: unknown) {
    const isAbort =
      e instanceof DOMException && e.name === "AbortError";
    const err: ApiError = {
      status: 0,
      code: isAbort ? "TIMEOUT" : "NETWORK_ERROR",
      message: isAbort
        ? "Запит перевищив ліміт часу (10 с)"
        : "Помилка мережі або CORS — перевірте чи запущений бекенд",
      details: e instanceof Error ? e.message : String(e),
    };
    throw err;
  }

  // 204 No Content
  if (response.status === 204) {
    if (!response.ok) {
      const err: ApiError = {
        status: response.status,
        code: "NO_CONTENT_ERROR",
        message: "Помилка сервера",
      };
      throw err;
    }
    return null as unknown as T;
  }

  const rawText = await response.text();

  if (response.ok) {
    if (!rawText) return null as unknown as T;
    try {
      return JSON.parse(rawText) as T;
    } catch {
      return rawText as unknown as T;
    }
  }

  // Parse error response
  let payload: { error?: { code?: string; message?: string; details?: Array<{ field?: string; message: string }> } } | null = null;
  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    // leave null
  }

  const err: ApiError = {
    status: response.status,
    code: payload?.error?.code ?? "HTTP_ERROR",
    message: payload?.error?.message ?? `HTTP ${response.status}`,
    details: rawText,
    errors: payload?.error?.details ?? undefined,
  };
  throw err;
}

// ─── Timeout wrapper ──────────────────────────────────────────────────────────

async function requestWithTimeout<T>(
  path: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  const controller = new AbortController();
  const timerId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );
  try {
    return await request<T>(path, options, controller.signal);
  } catch (e) {
    const err = e as ApiError;

    const method = (options.method ?? "GET").toUpperCase();
    const isSafe = method === "GET";
    const isRetryable = err.status === 429 || err.status === 503;

    if (isSafe && isRetryable && retries > 0) {
      const delay = err.status === 429 ? 2000 : 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return requestWithTimeout<T>(path, options, retries - 1);
    }

    throw err;
  } finally {
    clearTimeout(timerId);
  }
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export async function getTickets(params?: {
  statusId?: string;
  priority?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<TicketListItemDto>> {
  const q = new URLSearchParams();
  if (params?.statusId) q.set("statusId", params.statusId);
  if (params?.priority) q.set("priority", params.priority);
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const qs = q.toString() ? `?${q}` : "";
  const cacheKey = `/tickets${qs}`;

  const cached = getFromCache<PaginatedResponse<TicketListItemDto>>(cacheKey);
  if (cached) return cached;

  const result = await requestWithTimeout<PaginatedResponse<TicketListItemDto>>(`/tickets${qs}`);
  setToCache(cacheKey, result);
  return result;
}

export async function getStatuses(): Promise<PaginatedResponse<StatusDto>> {
  const cached = getFromCache<PaginatedResponse<StatusDto>>("/statuses");
  if (cached) return cached;

  const result = await requestWithTimeout<PaginatedResponse<StatusDto>>("/statuses");
  setToCache("/statuses", result);
  return result;
}

export async function getUsers(): Promise<PaginatedResponse<UserDto>> {
  const cached = getFromCache<PaginatedResponse<UserDto>>("/users");
  if (cached) return cached;

  const result = await requestWithTimeout<PaginatedResponse<UserDto>>("/users");
  setToCache("/users", result);
  return result;
}

export function getTicketById(
  id: string
): Promise<TicketDetailDto> {
  return requestWithTimeout(`/tickets/${encodeURIComponent(id)}`);
}

export function createTicket(
  dto: CreateTicketDto
): Promise<TicketDetailDto> {
  return requestWithTimeout("/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export function updateTicket(
  id: string,
  dto: UpdateTicketDto
): Promise<TicketDetailDto> {
  return requestWithTimeout(`/tickets/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export function deleteTicket(id: string): Promise<null> {
  return requestWithTimeout(`/tickets/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}




export function createUser(dto: CreateUserDto): Promise<UserDto> {
  return requestWithTimeout("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}
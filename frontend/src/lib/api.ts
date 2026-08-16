const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

let onAuthFailure: (() => void) | null = null;

export function setAuthFailureHandler(fn: (() => void) | null): void {
  onAuthFailure = fn
}

let refreshing: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshing) {
    refreshing = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new ApiError(res.status, "Session expired");
        const data = await res.json();
        setAccessToken(data.access_token);
        return data.access_token as string;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing
}

async function request<T>(
    path: string,
    init: RequestInit = {},
    retry = true,
): Promise<T> {
  console.log(getAccessToken());
  const headers = new Headers(init.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include", // required for the refresh cookie to be set/sent
  });

  if (response.status === 401 && retry && !path.startsWith("/auth/")) {
    try {
      await refreshAccessToken();
    } catch {
      setAccessToken(null);
      onAuthFailure?.();
      throw new ApiError(401, "Session expired");
    }
    return request<T>(path, init, false);
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }),

  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  postForm: <T>(path: string, fields: Record<string, string>) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields).toString(),
    }),
};
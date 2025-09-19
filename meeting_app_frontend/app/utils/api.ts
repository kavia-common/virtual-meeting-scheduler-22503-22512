/**
 * PUBLIC_INTERFACE
 * apiFetch wraps fetch with base URL, JSON handling, and auth header injection.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const url = `${base ?? ""}${path}`;
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let data: unknown = undefined;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      // ignore
    }
    const errorData = data as { message?: string; error?: string } | undefined;
    const message = errorData?.message || errorData?.error || res.statusText || "Request failed";
    throw new ApiError(message, res.status, data);
  }
  // handle empty body
  const contentType = res.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) return undefined as T;
  return (await res.json()) as T;
}

/**
 * PUBLIC_INTERFACE
 * ApiError represents API HTTP errors.
 */
export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * PUBLIC_INTERFACE
 * getToken returns the persisted auth token.
 */
export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * PUBLIC_INTERFACE
 * setToken persists or clears the auth token.
 */
export function setToken(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

/**
 * PUBLIC_INTERFACE
 * auth API wrappers
 */
export const AuthAPI = {
  async signIn(email: string, password: string) {
    return apiFetch<{ token: string; user: User }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async signUp(input: { name: string; email: string; password: string }) {
    return apiFetch<{ token: string; user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  async me() {
    return apiFetch<User>("/auth/me", { auth: true });
  },
  async forgot(email: string) {
    const site = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "";
    return apiFetch<{ ok: boolean }>("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email, redirectUrl: `${site}/reset-password` }),
    });
  },
  async reset(token: string, password: string) {
    return apiFetch<{ ok: boolean }>("/auth/reset", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },
};

/**
 * PUBLIC_INTERFACE
 * meetings API wrappers
 */
export const MeetingsAPI = {
  list() {
    return apiFetch<Meeting[]>("/meetings", { auth: true });
  },
  create(input: NewMeeting) {
    return apiFetch<Meeting>("/meetings", {
      method: "POST",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  update(id: string, input: Partial<NewMeeting>) {
    return apiFetch<Meeting>(`/meetings/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
      auth: true,
    });
  },
  remove(id: string) {
    return apiFetch<{ ok: boolean }>(`/meetings/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
  get(id: string) {
    return apiFetch<Meeting>(`/meetings/${id}`, { auth: true });
  },
  invite(id: string, emails: string[]) {
    return apiFetch<{ ok: boolean }>(`/meetings/${id}/invite`, {
      method: "POST",
      body: JSON.stringify({ emails }),
      auth: true,
    });
  },
  join(id: string) {
    return apiFetch<{ ok: boolean; joinUrl?: string }>(`/meetings/${id}/join`, {
      method: "POST",
      auth: true,
    });
  },
};

/**
 * PUBLIC_INTERFACE
 * calendar API wrappers
 */
export const CalendarAPI = {
  list(range?: { start: string; end: string }) {
    const params = range ? `?start=${encodeURIComponent(range.start)}&end=${encodeURIComponent(range.end)}` : "";
    return apiFetch<Meeting[]>(`/calendar${params}`, { auth: true });
  },
};

/* Types */
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export type Meeting = {
  id: string;
  title: string;
  description?: string | null;
  startTime: string; // ISO
  endTime: string; // ISO
  location?: string | null;
  link?: string | null;
  organizerId: string;
  participants: Array<{ email: string; status: "invited" | "accepted" | "declined" }>;
};

export type NewMeeting = {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  link?: string;
  participants?: string[]; // emails
};

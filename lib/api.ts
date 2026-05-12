import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Platform } from "react-native";

export const AUTH_TOKEN_KEY = "auth_token";

const isWeb = Platform.OS === "web";

async function secureGet(key: string): Promise<string | null> {
  if (isWeb) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function secureSet(key: string, value: string): Promise<void> {
  if (isWeb) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function secureDelete(key: string): Promise<void> {
  if (isWeb) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** FastAPI/Pydantic often returns `detail` as a string, object, or array of `{ loc, msg, type }`. */
export function formatApiErrorDetail(data: unknown): string {
  if (data === null || typeof data !== "object") {
    return typeof data === "string" ? data : "Request failed";
  }
  const o = data as Record<string, unknown>;
  if (!("detail" in o)) {
    return "Request failed";
  }
  const detail = o.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const parts = detail.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "msg" in item) {
        const row = item as { msg?: unknown; loc?: unknown };
        const msg = row.msg != null ? String(row.msg) : "";
        const loc = Array.isArray(row.loc) ? row.loc.map(String).join(" · ") : "";
        return loc ? `${loc}: ${msg}` : msg;
      }
      try {
        return JSON.stringify(item);
      } catch {
        return String(item);
      }
    });
    return parts.filter(Boolean).join("; ") || "Request failed";
  }
  if (detail && typeof detail === "object") {
    try {
      return JSON.stringify(detail);
    } catch {
      return "Request failed";
    }
  }
  return detail != null ? String(detail) : "Request failed";
}

export async function getStoredToken(): Promise<string | null> {
  try {
    return await secureGet(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  await secureSet(AUTH_TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  try {
    await secureDelete(AUTH_TOKEN_KEY);
  } catch {
    // ignore if missing
  }
}

function getBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url || typeof url !== "string") {
    throw new Error("EXPO_PUBLIC_API_URL is not set");
  }
  return url.replace(/\/$/, "");
}

export type ApiFetchOptions = RequestInit & {
  /** When false, skip attaching Authorization (e.g. login). Default true */
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, headers: initHeaders, ...rest } = options;
  const base = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const headers = new Headers(initHeaders ?? undefined);

  if (auth) {
    const token = await getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (rest.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (rest.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${base}${normalizedPath}`, {
    ...rest,
    headers,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text;
    }
  }

  if (res.status === 401) {
    await clearStoredToken();
    router.replace("/login");
    const msg =
      typeof data === "object" && data !== null && "detail" in data ? formatApiErrorDetail(data) : "Unauthorized";
    throw new ApiError(401, msg, data);
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "detail" in data
        ? formatApiErrorDetail(data)
        : res.statusText || "Request failed";
    throw new ApiError(res.status, msg, data);
  }

  return data as T;
}

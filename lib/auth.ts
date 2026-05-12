import { router } from "expo-router";
import { apiFetch, clearStoredToken, setStoredToken } from "./api";

export type User = {
  id?: string;
  email?: string;
  [key: string]: unknown;
};

type LoginResponse = {
  access_token?: string;
  token?: string;
  user?: User;
} & User;

export async function login(email: string, password: string): Promise<User> {
  const res = await apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    },
  );

  const bearer = res.access_token ?? res.token;
  if (bearer) {
    await setStoredToken(bearer);
  }

  const { access_token: _a, token: _t, ...rest } = res;
  if (res.user) {
    return res.user;
  }
  return rest as User;
}

export async function logout(): Promise<void> {
  await clearStoredToken();
  router.replace("/login");
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode, useEffect,
} from "react";
import {api, refreshAccessToken, setAccessToken, setAuthFailureHandler} from "../lib/api";

export type User = { id: string; username: string; email: string };

type TokenResponse = { access_token: string; token_type: string };

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading")

  const login = useCallback(async (username: string, password: string) => {
    const tokens = await api.postForm<TokenResponse>("/auth/token", {
      username,
      password,
    });
    setAccessToken(tokens.access_token);

    const me = await api.get<User>("/users/me");
    setUser(me);
    setStatus("authenticated");
  }, []);

  const register = useCallback(
      async (username: string, email: string, password: string) => {
        await api.post("/auth/register", {username, email, password});
        await login(username, password);
      },
      [login],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // best-effort: clear locally even if the network call fails
    }
    setAccessToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  // Let the API layer flip to anonymous when a mid-session refresh fails
  useEffect(() => {
    setAuthFailureHandler(() => {
      setAccessToken(null);
      setUser(null);
      setStatus("anonymous");
    });
    return () => setAuthFailureHandler(null);
  }, []);

  // On load: memory is empty, try to recover session via cookie
  useEffect(() => {
    let cancelled = false;

    refreshAccessToken()
      .then(() => api.get<User>("/users/me"))
      .then((me) => {
        if (!cancelled) {
          setUser(me);
          setStatus("authenticated");
        }
      })
      .catch((err) => {
        if (!cancelled) setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
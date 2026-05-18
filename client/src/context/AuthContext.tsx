import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/auth';
import { getToken, setToken } from '../api/client';

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function decodeUsername(token: string | null): string | null {
  if (!token) return null;
  try {
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as {
      username?: string;
      exp?: number;
    };
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload.username ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => decodeUsername(getToken()));

  const login = useCallback(async (u: string, p: string) => {
    const res = await authApi.login(u, p);
    setToken(res.token);
    setUsername(res.user.username);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ username, isAuthenticated: Boolean(username), login, logout }),
    [username, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

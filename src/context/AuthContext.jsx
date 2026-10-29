import { createContext, useCallback, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const USER_KEY = "auth_user";
const TOKEN_KEY = "auth_token";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  // call this after a successful login
  const setAuth = useCallback(({ user, token }) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
    setUser(user ?? null);
    setToken(token ?? null);
  }, []);

  // merge new values into the stored user (e.g. after a profile update)
  const updateAuthUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev ?? {}), ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      setAuth,
      updateAuthUser,
      logout,
    }),
    [user, token, setAuth, updateAuthUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
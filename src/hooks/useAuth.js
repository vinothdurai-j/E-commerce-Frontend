import { useCallback, useMemo, useSyncExternalStore } from "react";
import { tokenStorage } from "@/utils/tokenStorage.js"; // adjust to where token.js lives

export function useAuth() {
  // primitives (strings), so React can compare snapshots safely
  const token = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.get);
  const userRaw = useSyncExternalStore(tokenStorage.subscribe, tokenStorage.getUserRaw);

  const user = useMemo(() => {
    try {
      return userRaw ? JSON.parse(userRaw) : null;
    } catch {
      return null;
    }
  }, [userRaw]);

  // call after a successful login
  const setAuth = useCallback(({ user, token, refreshToken }) => {
    if (refreshToken) tokenStorage.setRefresh(refreshToken);
    if (user) tokenStorage.setUser(user);
    if (token) tokenStorage.set(token);
  }, []);

  // merge changes into the stored user (e.g. after a profile update)
  const updateAuthUser = useCallback((patch) => {
    tokenStorage.setUser({ ...(tokenStorage.getUser() ?? {}), ...patch });
  }, []);

  const logout = useCallback(() => tokenStorage.clear(), []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    setAuth,
    updateAuthUser,
    logout,
  };
}

export default useAuth;
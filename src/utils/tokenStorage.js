const ACCESS_KEY = "token";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";
const EVENT = "auth-change";

const emit = () => window.dispatchEvent(new Event(EVENT));

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_KEY),
  set: (token) => {
    localStorage.setItem(ACCESS_KEY, token);
    emit();
  },

  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (token) => {
    localStorage.setItem(REFRESH_KEY, token);
    emit();
  },

  // raw JSON string, so useSyncExternalStore gets a stable snapshot
  getUserRaw: () => localStorage.getItem(USER_KEY),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    emit();
  },

  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    emit();
  },

  subscribe: (callback) => {
    window.addEventListener(EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(EVENT, callback);
      window.removeEventListener("storage", callback);
    };
  },
};
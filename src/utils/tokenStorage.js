const ACCESS_KEY = "token";
const REFRESH_KEY = "refreshToken"; // remove if you don't use one
const USER_KEY = "user"; // remove if you don't store one
const EVENT = "auth-change";

const emit = () => window.dispatchEvent(new Event(EVENT));

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_KEY),
  set: (token) => {
    localStorage.setItem(ACCESS_KEY, token);
    emit();
  },

  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setRefresh: (token) => localStorage.setItem(REFRESH_KEY, token),

  // clears everything auth-related and notifies the UI
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    emit();
  },

  // "storage" fires when another tab logs in or out, so all tabs stay in sync
  subscribe: (callback) => {
    window.addEventListener(EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(EVENT, callback);
      window.removeEventListener("storage", callback);
    };
  },
};
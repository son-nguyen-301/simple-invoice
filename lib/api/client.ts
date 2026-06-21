import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api/services",
});

/**
 * Redirect to /login when the BFF signals a dead session. A burst of concurrent
 * 401s may call this several times in the same tick; that's fine -
 * `window.location.replace` coalesces into a single navigation, and keeping no
 * module state avoids any stale-flag fragility across redirects/re-logins.
 */
function redirectToLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.location.replace("/login");
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.headers?.["x-session-expired"]) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

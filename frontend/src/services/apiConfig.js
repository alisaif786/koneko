const defaultApiBaseUrl = typeof window === "undefined"
    ? "http://localhost:8080"
    : `${window.location.protocol}//${window.location.hostname}:8080`;

export const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl
).replace(/\/+$/, "");

export function apiUrl(path) {
    return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

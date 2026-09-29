import { apiUrl } from "./apiConfig";

export function loginUser(options) {
    return fetch(apiUrl("/api/users/login"), options);
}

export function registerUser(options) {
    return fetch(apiUrl("/api/users/register"), options);
}

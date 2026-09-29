import { apiUrl } from "./apiConfig";

export function getCycleStatus(options) {
    return fetch(apiUrl("/api/cycle/status"), options);
}

export function getCycleSettings(options) {
    return fetch(apiUrl("/api/cycle"), options);
}

export function saveCycleSettings(options) {
    return fetch(apiUrl("/api/cycle"), options);
}

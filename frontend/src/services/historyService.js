import { apiUrl } from "./apiConfig";

export function getHistory(options) {
    return fetch(apiUrl("/api/cycle/history"), options);
}

export function getPrediction(options) {
    return fetch(apiUrl("/api/cycle/prediction"), options);
}

export function getAverage(options) {
    return fetch(apiUrl("/api/cycle/average"), options);
}

export function startPeriod(options) {
    return fetch(apiUrl("/api/cycle/start"), options);
}

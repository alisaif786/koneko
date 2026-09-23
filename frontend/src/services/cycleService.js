export function getCycleStatus(options) {
    return fetch("http://localhost:8080/api/cycle/status", options);
}

export function getCycleSettings(options) {
    return fetch("http://localhost:8080/api/cycle", options);
}

export function saveCycleSettings(options) {
    return fetch("http://localhost:8080/api/cycle", options);
}

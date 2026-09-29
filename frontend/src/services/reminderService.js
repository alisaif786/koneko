import { apiUrl } from "./apiConfig";

const REMINDERS_URL = apiUrl("/api/reminders");

export function getHomeReminders(options) {
    return fetch(REMINDERS_URL, options);
}

export function getReminders(options) {
    return fetch(REMINDERS_URL, options);
}

export function createReminder(options) {
    return fetch(REMINDERS_URL, {
        ...options,
        method: "POST",
    });
}

export function deleteReminder(id, options) {
    return fetch(`${REMINDERS_URL}/${id}`, options);
}

export function updateReminder(id, options) {
    return fetch(`${REMINDERS_URL}/${id}`, options);
}

// Kept for compatibility with any existing reminder form integrations.
export function saveReminder(isEditing, id, options) {
    const url = isEditing
        ? `${REMINDERS_URL}/${id}`
        : REMINDERS_URL;

    return fetch(url, options);
}

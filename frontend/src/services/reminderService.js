export function getHomeReminders(options) {
    return fetch("http://localhost:8080/api/reminders", options);
}

export function getReminders(options) {
    return fetch("http://localhost:8080/api/reminders", options);
}

export function deleteReminder(id, options) {
    return fetch(`http://localhost:8080/api/reminders/${id}`, options);
}

export function updateReminder(id, options) {
    return fetch(`http://localhost:8080/api/reminders/${id}`, options);
}

export function saveReminder(isEditing, id, options) {
    const url = isEditing
        ? `http://localhost:8080/api/reminders/${id}`
        : "http://localhost:8080/api/reminders";

    return fetch(url, options);
}

export function formatReminderTime(time) {
    if (!time) return "";

    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour), Number(minute), 0, 0);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

export function formatFrequency(reminder) {
    if (reminder.frequency === "DAILY") {
        return "Every day";
    }

    if (reminder.frequency === "WEEKLY") {
        return `Every ${reminder.dayOfWeek || "week"}`;
    }

    return reminder.frequency || "";
}

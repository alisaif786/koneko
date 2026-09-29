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
        const day = reminder.dayOfWeek
            ? reminder.dayOfWeek.charAt(0) + reminder.dayOfWeek.slice(1).toLowerCase()
            : "week";

        return `Every ${day}`;
    }

    return reminder.frequency || "";
}

export function formatReminderType(type) {
    const labels = {
        WATER: "Water",
        FOOD: "Food",
        MEDICINE: "Medicine",
        SLEEP: "Sleep",
    };

    return labels[type] || type || "Reminder";
}

import {
    formatReminderTime,
    formatFrequency,
    formatReminderType,
} from "../../utils/reminderUtils";

export default function Reminder({
    reminder,
    compact = false,
    onEdit,
    onDelete,
    onToggle,
}) {
    const iconMap = {
        WATER: "💧",
        MEDICINE: "💊",
        FOOD: "🍓",
        SLEEP: "🌙",
    };
    const icon = iconMap[reminder.type] || "🔔";

    return (
        <div
            className={`reminder-card ${compact ? "compact" : ""} ${
                reminder.enabled ? "" : "reminder-disabled"
            }`}
        >
            <div className="reminder-icon">{icon}</div>

            <div className="reminder-main">
                <div className="reminder-title-row">
                    <h4>{reminder.title}</h4>
                    <span
                        className={`reminder-status-badge ${
                            reminder.enabled ? "enabled" : "disabled"
                        }`}
                    >
                        {reminder.enabled ? "Enabled" : "Disabled"}
                    </span>
                </div>
                <p>
                    {formatReminderType(reminder.type)}
                    {" · "}
                    {formatReminderTime(reminder.time)}
                    {" · "}
                    {formatFrequency(reminder)}
                </p>
            </div>

            <div className="reminder-actions">
                <button
                    type="button"
                    className={`reminder-toggle ${
                        reminder.enabled ? "active" : ""
                    }`}
                    onClick={onToggle}
                    aria-label={
                        reminder.enabled ? "Disable reminder" : "Enable reminder"
                    }
                    aria-pressed={reminder.enabled}
                >
                    <span />
                </button>

                <button
                    type="button"
                    className="reminder-edit-button"
                    onClick={onEdit}
                    aria-label="Edit reminder"
                >
                    ✎
                </button>

                <button
                    type="button"
                    className="reminder-delete-button"
                    onClick={onDelete}
                    aria-label="Delete reminder"
                >
                    🗑
                </button>
            </div>
        </div>
    );
}

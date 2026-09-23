import { formatReminderTime, formatFrequency } from "../../utils/reminderUtils";

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
        CUSTOM: "🐾",
    };

    const icon =
        iconMap[reminder.type] ||
        "🔔";

    return (
        <div
            className={`reminder-card ${
                compact
                    ? "compact"
                    : ""
            } ${
                !reminder.enabled
                    ? "reminder-disabled"
                    : ""
            }`}
        >

            {/* ICON */}

            <div className="reminder-icon">
                {icon}
            </div>


            {/* MAIN */}

            <div className="reminder-main">

                <h4>
                    {reminder.title}
                </h4>

                <p>
                    {formatReminderTime(
                        reminder.time
                    )}
                    {" · "}
                    {formatFrequency(
                        reminder
                    )}
                </p>

            </div>


            {/* ACTIONS */}

            <div className="reminder-actions">

                {/* TOGGLE */}

                <button
                    type="button"
                    className={`reminder-toggle ${
                        reminder.enabled
                            ? "active"
                            : ""
                    }`}
                    onClick={onToggle}
                    aria-label={
                        reminder.enabled
                            ? "Disable reminder"
                            : "Enable reminder"
                    }
                >
                    <span />
                </button>


                {/* EDIT */}

                <button
                    type="button"
                    className="reminder-edit-button"
                    onClick={onEdit}
                    aria-label="Edit reminder"
                >
                    ✎
                </button>


                {/* DELETE */}

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


// ============================================================
// REMINDER FORM
// ============================================================

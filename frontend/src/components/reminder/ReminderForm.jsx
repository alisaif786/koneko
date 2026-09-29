import { useState } from "react";
import {
    createReminder,
    updateReminder,
} from "../../services/reminderService";
import Screen from "../common/Screen";

const REMINDER_TYPES = [
    { value: "WATER", label: "Water" },
    { value: "FOOD", label: "Food" },
    { value: "MEDICINE", label: "Medicine" },
    { value: "SLEEP", label: "Sleep" },
];

const DAYS_OF_WEEK = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

async function getResponseMessage(response) {
    const responseText = await response.text();

    if (!responseText) {
        return "";
    }

    try {
        const body = JSON.parse(responseText);
        if (typeof body === "string") {
            return body;
        }

        return body.message || body.error || body.detail || responseText;
    } catch {
        return responseText;
    }
}

export default function ReminderForm({
    reminder,
    initialType,
    onBack,
    onSaved,
}) {
    const isEditing = reminder !== null && reminder !== undefined;

    const [title, setTitle] = useState(reminder?.title || "");
    const requestedType = reminder?.type || initialType || "";
    const [type, setType] = useState(
        REMINDER_TYPES.some((reminderType) => reminderType.value === requestedType)
            ? requestedType
            : "",
    );
    const [time, setTime] = useState((reminder?.time || "").slice(0, 5));
    const [frequency, setFrequency] = useState(
        reminder?.frequency || "DAILY",
    );
    const [dayOfWeek, setDayOfWeek] = useState(
        reminder?.dayOfWeek || "",
    );
    const [enabled, setEnabled] = useState(reminder?.enabled ?? true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Please enter a reminder title.");
            return;
        }

        if (!REMINDER_TYPES.some((reminderType) => reminderType.value === type)) {
            setError("Please select a reminder type.");
            return;
        }

        if (!time) {
            setError("Please select a reminder time.");
            return;
        }

        if (!frequency) {
            setError("Please select a frequency.");
            return;
        }

        if (frequency === "WEEKLY" && !dayOfWeek) {
            setError("Please select a day of the week.");
            return;
        }

        const payload = {
            title: title.trim(),
            type,
            time,
            frequency,
            dayOfWeek: frequency === "WEEKLY" ? dayOfWeek : null,
            enabled,
        };

        try {
            setSaving(true);

            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("koneko_token")}`,
                },
                body: JSON.stringify(payload),
            };
            const response = isEditing
                ? await updateReminder(reminder.id, {
                      ...options,
                      method: "PUT",
                  })
                : await createReminder(options);

            if (!response.ok) {
                const backendMessage = await getResponseMessage(response);
                setError(
                    backendMessage ||
                        (isEditing
                            ? "Failed to update reminder."
                            : "Failed to create reminder."),
                );
                return;
            }

            await onSaved();
        } catch (saveError) {
            console.error("Reminder save error:", saveError);
            setError(
                isEditing
                    ? "Failed to update reminder."
                    : "Failed to create reminder.",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Screen title={isEditing ? "Edit Reminder ♡" : "New Reminder ♡"}>
            <section className="reminder-form-card">
                <div className="reminder-form-header">
                    <button
                        type="button"
                        className="back-button"
                        onClick={onBack}
                        aria-label="Back to reminders"
                    >
                        ‹
                    </button>

                    <div>
                        <span className="mini-label">
                            {isEditing ? "UPDATE YOUR REMINDER" : "ADD A LITTLE CARE"}
                        </span>
                        <h2>{isEditing ? "Edit Reminder" : "New Reminder"}</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="reminder-field">
                        <label htmlFor="reminder-title">Reminder title</label>
                        <input
                            id="reminder-title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="e.g. Drink some water"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="reminder-field">
                        <label htmlFor="reminder-type">Reminder type</label>
                        <select
                            id="reminder-type"
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                            required
                        >
                            <option value="">Choose a type</option>
                            {REMINDER_TYPES.map((reminderType) => (
                                <option
                                    key={reminderType.value}
                                    value={reminderType.value}
                                >
                                    {reminderType.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="reminder-field">
                        <label htmlFor="reminder-time">Reminder time</label>
                        <input
                            id="reminder-time"
                            type="time"
                            value={time}
                            onChange={(event) => setTime(event.target.value)}
                            required
                        />
                    </div>

                    <div className="reminder-field">
                        <label htmlFor="reminder-frequency">Frequency</label>
                        <select
                            id="reminder-frequency"
                            value={frequency}
                            onChange={(event) => setFrequency(event.target.value)}
                            required
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                        </select>
                    </div>

                    {frequency === "WEEKLY" && (
                        <div className="reminder-field">
                            <label htmlFor="reminder-day">Day of week</label>
                            <select
                                id="reminder-day"
                                value={dayOfWeek}
                                onChange={(event) =>
                                    setDayOfWeek(event.target.value)
                                }
                                required
                            >
                                <option value="">Choose a day</option>
                                {DAYS_OF_WEEK.map((day) => (
                                    <option key={day} value={day}>
                                        {day.charAt(0) + day.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="reminder-enable-row">
                        <div>
                            <h3>Reminder enabled</h3>
                            <p>Koneko can remind you at this time.</p>
                        </div>
                        <button
                            type="button"
                            className={`reminder-toggle ${enabled ? "active" : ""}`}
                            onClick={() => setEnabled((current) => !current)}
                            aria-label="Reminder enabled"
                            aria-pressed={enabled}
                        >
                            <span />
                        </button>
                    </div>

                    {error && (
                        <div className="reminder-error" role="alert">
                            😿 {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="save-reminder-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving... 🐾"
                            : isEditing
                              ? "Update Reminder ♡"
                              : "Save Reminder ♡"}
                    </button>
                </form>
            </section>
        </Screen>
    );
}

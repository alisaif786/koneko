import { useState } from "react";
import { saveReminder } from "../../services/reminderService";
import TypeOption from "./TypeOption";

export default function ReminderForm({
                          reminder,
                          onBack,
                          onSaved,
                      }) {
    const isEditing =
        reminder !== null &&
        reminder !== undefined;

    const [title, setTitle] = useState(
        reminder?.title || ""
    );

    const [type, setType] = useState(
        reminder?.type || "WATER"
    );

    const [time, setTime] = useState(
        reminder?.time || "09:00"
    );

    const [frequency, setFrequency] =
        useState(
            reminder?.frequency || "DAILY"
        );

    const [dayOfWeek, setDayOfWeek] =
        useState(
            reminder?.dayOfWeek ||
            "MONDAY"
        );

    const [enabled, setEnabled] =
        useState(
            reminder?.enabled ?? true
        );

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const token =
        localStorage.getItem(
            "koneko_token"
        );

    // ========================================================
    // SAVE
    // ========================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");

        if (!title.trim()) {
            setError(
                "Please enter a reminder name."
            );
            return;
        }

        if (!time) {
            setError(
                "Please select a reminder time."
            );
            return;
        }

        if (
            frequency === "WEEKLY" &&
            !dayOfWeek
        ) {
            setError(
                "Please select a day."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                title: title.trim(),
                type: type,
                time: time,
                frequency: frequency,

                dayOfWeek:
                    frequency ===
                    "WEEKLY"
                        ? dayOfWeek
                        : null,

                enabled: enabled,
            };
            const method = isEditing
                ? "PUT"
                : "POST";

            const response =
                await saveReminder(isEditing, reminder?.id, {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body:
                        JSON.stringify(
                            payload
                        ),
                });

            if (!response.ok) {
                const message =
                    await response.text();

                throw new Error(
                    message ||
                    `API Error: ${response.status}`
                );
            }

            await response.json();

            onSaved();

        } catch (err) {
            console.error(
                "Reminder save error:",
                err
            );

            setError(
                err.message ||
                "Unable to save reminder."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Screen
            title={
                isEditing
                    ? "Edit Reminder ♡"
                    : "New Reminder ♡"
            }
        >

            <section className="reminder-form-card">

                {/* =================================================
                    FORM HEADER
                ================================================= */}

                <div className="reminder-form-header">

                    <button
                        type="button"
                        className="back-button"
                        onClick={onBack}
                    >
                        ‹
                    </button>

                    <div>

                        <span className="mini-label">
                            {isEditing
                                ? "UPDATE YOUR REMINDER"
                                : "ADD A LITTLE CARE"}
                        </span>

                        <h2>
                            {isEditing
                                ? "Edit Reminder"
                                : "New Reminder"}
                        </h2>

                    </div>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div className="reminder-field">

                        <label>
                            What should Koneko
                            remind you about?
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="e.g. Drink some water"
                            maxLength={100}
                        />

                    </div>


                    {/* =================================================
                        TYPE
                    ================================================= */}

                    <div className="reminder-field">

                        <label>
                            Reminder type
                        </label>

                        <div className="type-grid">

                            <TypeOption
                                icon="💧"
                                label="Water"
                                selected={
                                    type ===
                                    "WATER"
                                }
                                onClick={() =>
                                    setType(
                                        "WATER"
                                    )
                                }
                            />

                            <TypeOption
                                icon="💊"
                                label="Medicine"
                                selected={
                                    type ===
                                    "MEDICINE"
                                }
                                onClick={() =>
                                    setType(
                                        "MEDICINE"
                                    )
                                }
                            />

                            <TypeOption
                                icon="🍓"
                                label="Food"
                                selected={
                                    type ===
                                    "FOOD"
                                }
                                onClick={() =>
                                    setType(
                                        "FOOD"
                                    )
                                }
                            />

                            <TypeOption
                                icon="🌙"
                                label="Sleep"
                                selected={
                                    type ===
                                    "SLEEP"
                                }
                                onClick={() =>
                                    setType(
                                        "SLEEP"
                                    )
                                }
                            />

                            <TypeOption
                                icon="🐾"
                                label="Custom"
                                selected={
                                    type ===
                                    "CUSTOM"
                                }
                                onClick={() =>
                                    setType(
                                        "CUSTOM"
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        TIME
                    ================================================= */}

                    <div className="reminder-field">

                        <label>
                            Reminder time
                        </label>

                        <input
                            type="time"
                            value={time}
                            onChange={(event) =>
                                setTime(
                                    event.target
                                        .value
                                )
                            }
                        />

                    </div>


                    {/* =================================================
                        FREQUENCY
                    ================================================= */}

                    <div className="reminder-field">

                        <label>
                            Repeat
                        </label>

                        <div className="frequency-grid">

                            <button
                                type="button"
                                className={
                                    frequency ===
                                    "DAILY"
                                        ? "frequency-option selected"
                                        : "frequency-option"
                                }
                                onClick={() =>
                                    setFrequency(
                                        "DAILY"
                                    )
                                }
                            >
                                Every day
                            </button>

                            <button
                                type="button"
                                className={
                                    frequency ===
                                    "WEEKLY"
                                        ? "frequency-option selected"
                                        : "frequency-option"
                                }
                                onClick={() =>
                                    setFrequency(
                                        "WEEKLY"
                                    )
                                }
                            >
                                Weekly
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        WEEKLY DAY
                    ================================================= */}

                    {frequency ===
                        "WEEKLY" && (
                            <div className="reminder-field">

                                <label>
                                    Which day?
                                </label>

                                <select
                                    value={dayOfWeek}
                                    onChange={(event) =>
                                        setDayOfWeek(
                                            event.target
                                                .value
                                        )
                                    }
                                >

                                    <option value="MONDAY">
                                        Monday
                                    </option>

                                    <option value="TUESDAY">
                                        Tuesday
                                    </option>

                                    <option value="WEDNESDAY">
                                        Wednesday
                                    </option>

                                    <option value="THURSDAY">
                                        Thursday
                                    </option>

                                    <option value="FRIDAY">
                                        Friday
                                    </option>

                                    <option value="SATURDAY">
                                        Saturday
                                    </option>

                                    <option value="SUNDAY">
                                        Sunday
                                    </option>

                                </select>

                            </div>
                        )}


                    {/* =================================================
                        ENABLE / DISABLE
                    ================================================= */}

                    <div className="reminder-enable-row">

                        <div>

                            <h3>
                                Reminder enabled
                            </h3>

                            <p>
                                Koneko can remind
                                you at this time.
                            </p>

                        </div>

                        <button
                            type="button"
                            className={`reminder-toggle ${
                                enabled
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setEnabled(
                                    !enabled
                                )
                            }
                        >
                            <span />
                        </button>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div className="reminder-error">
                            😿 {error}
                        </div>
                    )}


                    {/* =================================================
                        SAVE
                    ================================================= */}

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


// ============================================================
// TYPE OPTION
// ============================================================

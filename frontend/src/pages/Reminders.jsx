import { useCallback, useEffect, useState } from "react";
import { careCat, waterCat, foodCat, medicineCat, sleepCat } from "../assets";
import { getReminders, deleteReminder, updateReminder } from "../services/reminderService";
import Screen from "../components/common/Screen";
import CareCategory from "../components/reminder/CareCategory";
import ReminderDetail from "../components/reminder/ReminderDetail";
import Reminder from "../components/reminder/Reminder";
import ReminderForm from "../components/reminder/ReminderForm";

export default function Reminders({
                       selectedSection,
                       onBack,
                       onSectionChange,
                   }) {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingReminder, setEditingReminder] =
        useState(null);

    const token =
        localStorage.getItem("koneko_token");

    // ========================================================
    // LOAD REMINDERS
    // ========================================================

    const loadReminders = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
                setError("");
            }

            const response = await getReminders({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (!response.ok) {
                throw new Error(
                    `API Error: ${response.status}`
                );
            }

            const data = await response.json();

            setReminders(data);
        } catch (err) {
            console.error(
                "Reminders API Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load reminders."
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        // The initial loading state is already true; loading state changes after the request resolves.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadReminders(false);
    }, [loadReminders]);

    // ========================================================
    // ADD REMINDER
    // ========================================================

    const handleAddReminder = () => {
        setEditingReminder(null);
        setShowForm(true);
    };

    // ========================================================
    // EDIT REMINDER
    // ========================================================

    const handleEditReminder = (reminder) => {
        setEditingReminder(reminder);
        setShowForm(true);
    };

    // ========================================================
    // DELETE REMINDER
    // ========================================================

    const handleDeleteReminder = async (id) => {
        console.log("DELETE HANDLER CALLED:", id);

        const confirmed = window.confirm(
            "Delete this little reminder? 🐱"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await deleteReminder(id, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            console.log(
                "DELETE API STATUS:",
                response.status
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                    `Delete failed: ${response.status}`
                );
            }

            await loadReminders();

        } catch (err) {
            console.error(
                "Delete reminder error:",
                err
            );

            setError(
                err.message ||
                "Unable to delete reminder."
            );
        }
    };

    // ========================================================
    // ENABLE / DISABLE REMINDER
    // ========================================================

    const handleToggleReminder = async (
        reminder
    ) => {
        try {
            setError("");

            const payload = {
                title: reminder.title,
                type: reminder.type,
                time: reminder.time,
                frequency: reminder.frequency,

                dayOfWeek:
                    reminder.frequency ===
                    "WEEKLY"
                        ? reminder.dayOfWeek
                        : null,

                enabled: !reminder.enabled,
            };

            const response = await updateReminder(reminder.id, {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify(payload),
                });

            if (!response.ok) {
                throw new Error(
                    `Update failed: ${response.status}`
                );
            }

            await loadReminders();
        } catch (err) {
            console.error(
                "Toggle reminder error:",
                err
            );

            setError(
                err.message ||
                "Unable to update reminder."
            );
        }
    };

    // ========================================================
    // FORM SAVED
    // ========================================================

    const handleFormSaved = async () => {
        setShowForm(false);
        setEditingReminder(null);

        await loadReminders();
    };

    // ========================================================
    // ADD / EDIT SCREEN
    // ========================================================

    if (showForm) {
        return (
            <ReminderForm
                reminder={editingReminder}
                onBack={() => {
                    setShowForm(false);
                    setEditingReminder(null);
                }}
                onSaved={handleFormSaved}
            />
        );
    }

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <Screen title="Little Care ♡">
                <section className="care-intro">
                    <img
                        src={careCat}
                        alt="Care cat"
                    />

                    <h2>
                        Preparing your little care
                        space...
                    </h2>

                    <p>
                        Just a tiny moment 🐾
                    </p>
                </section>
            </Screen>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error && reminders.length === 0) {
        return (
            <Screen title="Little Care ♡">
                <section className="info-card error-card">
                    <span>😿</span>

                    <h3>
                        Oops...
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="add-reminder-button"
                        onClick={loadReminders}
                    >
                        Try Again
                    </button>
                </section>
            </Screen>
        );
    }

    // ========================================================
    // DETAIL PAGE
    // ========================================================

    if (selectedSection) {
        return (
            <ReminderDetail
                type={selectedSection}
                reminders={reminders}
                onBack={onBack}
                onEdit={handleEditReminder}
                onDelete={handleDeleteReminder}
                onToggle={handleToggleReminder}
                onAdd={handleAddReminder}
            />
        );
    }

    // ========================================================
    // ACTIVE REMINDERS
    // ========================================================

    const enabledReminders =
        reminders.filter(
            (reminder) => reminder.enabled
        );

    return (
        <Screen title="Little Care ♡">

            {/* =================================================
                INTRO
            ================================================= */}

            <section className="care-intro">

                <img
                    src={careCat}
                    alt="Koneko care"
                />

                <div>
                    <span>
                        YOUR LITTLE CARE SPACE
                    </span>

                    <h2>
                        Take care of yourself ♡
                    </h2>

                    <p>
                        Small reminders for the
                        little things that matter.
                    </p>
                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="reminder-error">
                    😿 {error}
                </div>
            )}


            {/* =================================================
                QUICK CARE
            ================================================= */}

            <div className="section-heading care-heading">

                <div>
                    <span>
                        QUICK ACCESS
                    </span>

                    <h2>
                        What do you need? 🌷
                    </h2>
                </div>

            </div>


            <div className="care-category-grid">

                <CareCategory
                    image={waterCat}
                    title="Drink Water"
                    text="Hydration"
                    onClick={() =>
                        onSectionChange("WATER")
                    }
                />

                <CareCategory
                    image={foodCat}
                    title="Food"
                    text="Meals"
                    onClick={() =>
                        onSectionChange("FOOD")
                    }
                />

                <CareCategory
                    image={medicineCat}
                    title="Medicine"
                    text="Medication"
                    onClick={() =>
                        onSectionChange("MEDICINE")
                    }
                />

                <CareCategory
                    image={sleepCat}
                    title="Sleep"
                    text="Rest"
                    onClick={() =>
                        onSectionChange("SLEEP")
                    }
                />

            </div>


            {/* =================================================
                ADD REMINDER
            ================================================= */}

            <button
                type="button"
                className="add-reminder-button"
                onClick={handleAddReminder}
            >
                <span>＋</span>
                Add Reminder
            </button>


            {/* =================================================
                REMINDER LIST HEADER
            ================================================= */}

            <div className="section-heading">

                <div>
                    <span>
                        {enabledReminders.length} ACTIVE
                    </span>

                    <h2>
                        Your reminders 🔔
                    </h2>
                </div>

            </div>


            {/* =================================================
                REMINDER LIST
            ================================================= */}

            <div className="reminder-list">

                {enabledReminders.length === 0 ? (

                    <div className="empty-card">

                        <span>
                            🐱
                        </span>

                        <h3>
                            No reminders yet
                        </h3>

                        <p>
                            Add your first little
                            reminder when you're ready
                            ♡
                        </p>

                        <button
                            type="button"
                            className="empty-add-button"
                            onClick={
                                handleAddReminder
                            }
                        >
                            Add Reminder
                        </button>

                    </div>

                ) : (

                    enabledReminders.map(
                        (reminder) => (
                            <Reminder
                                key={reminder.id}
                                reminder={reminder}
                                onEdit={() =>
                                    handleEditReminder(
                                        reminder
                                    )
                                }
                                onDelete={() =>
                                    handleDeleteReminder(
                                        reminder.id
                                    )
                                }
                                onToggle={() =>
                                    handleToggleReminder(
                                        reminder
                                    )
                                }
                            />
                        )
                    )

                )}

            </div>


            {/* =================================================
                BOTTOM CARE CARD
            ================================================= */}

            <section className="care-bottom-card">

                <img
                    src={careCat}
                    alt="Koneko care"
                />

                <div>

                    <h3>
                        I'm watching over you 😾
                    </h3>

                    <p>
                        Drink water. Eat properly.
                        Rest when you need to.
                    </p>

                </div>

            </section>

        </Screen>
    );
}


// ============================================================
// CARE CATEGORY
// ============================================================

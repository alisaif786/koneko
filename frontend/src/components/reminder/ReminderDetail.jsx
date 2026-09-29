import { waterCat, foodCat, medicineCat, sleepCat } from "../../assets";
import Reminder from "./Reminder";

export default function ReminderDetail({
                            type,
                            reminders,
                            onBack,
                            onEdit,
                            onDelete,
                            onToggle,
                            onAdd,
                            errorMessage,
                            successMessage,
                        }) {
    const data = {
        WATER: {
            title: "Drink Water 💧",
            image: waterCat,
            subtitle:
                "A little sip for you.",
            description:
                "Keep yourself hydrated throughout the day. Your tiny cat is reminding you because you matter. ♡",
            empty:
                "No water reminder is currently active.",
        },

        FOOD: {
            title: "Food & Meals 🍓",
            image: foodCat,
            subtitle:
                "Please don't skip your meals.",
            description:
                "Your body deserves proper meals and little moments of nourishment.",
            empty:
                "No food reminder is currently active.",
        },

        MEDICINE: {
            title: "Medicine 💊",
            image: medicineCat,
            subtitle:
                "Take care of yourself.",
            description:
                "Your scheduled medicine reminders will appear here.",
            empty:
                "No medicine reminder is currently active.",
        },

        SLEEP: {
            title: "Sleep 🌙",
            image: sleepCat,
            subtitle:
                "Time to let yourself rest.",
            description:
                "Good rest is part of taking care of yourself too.",
            empty:
                "No sleep reminder is currently active.",
        },
    };

    const current =
        data[type] || data.WATER;

    const matchingReminders =
        reminders.filter(
            (reminder) =>
                reminder.type === type
        );

    return (
        <div className="screen">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="detail-header">

                <button
                    type="button"
                    onClick={onBack}
                >
                    ‹
                </button>

                <h1>
                    {current.title}
                </h1>

            </div>


            <div className="detail-content">

                {errorMessage && (
                    <div className="reminder-error" role="alert">
                        😿 {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="reminder-success" role="status">
                        {successMessage}
                    </div>
                )}

                {/* =================================================
                    HERO
                ================================================= */}

                <section className="detail-hero">

                    <img
                        src={current.image}
                        alt={current.title}
                    />

                    <span>
                        YOUR LITTLE REMINDER
                    </span>

                    <h2>
                        {current.subtitle}
                    </h2>

                    <p>
                        {current.description}
                    </p>

                </section>


                {/* =================================================
                    ADD
                ================================================= */}

                <button
                    type="button"
                    className="add-reminder-button"
                    onClick={onAdd}
                >
                    <span>＋</span>
                    Add Reminder
                </button>


                {/* =================================================
                    SCHEDULE
                ================================================= */}

                <div className="section-heading">

                    <div>
                        <span>
                            {matchingReminders.filter((reminder) => reminder.enabled).length} ACTIVE
                        </span>

                        <h2>
                            Your schedule
                        </h2>
                    </div>

                </div>


                {matchingReminders.length ===
                0 ? (

                    <div className="empty-card">

                        <span>
                            🐾
                        </span>

                        <h3>
                            Nothing scheduled
                        </h3>

                        <p>
                            {current.empty}
                        </p>

                    </div>

                ) : (

                    matchingReminders.map(
                        (reminder) => (
                            <Reminder
                                key={reminder.id}
                                reminder={reminder}
                                onEdit={() =>
                                    onEdit(reminder)
                                }
                                onDelete={() =>
                                    onDelete(
                                        reminder.id
                                    )
                                }
                                onToggle={() =>
                                    onToggle(reminder)
                                }
                            />
                        )
                    )

                )}


                {/* =================================================
                    CAT NOTE
                ================================================= */}

                <section className="detail-cat-note">

                    <img
                        src={current.image}
                        alt="Koneko"
                    />

                    <p>
                        “I'm only reminding you
                        because I love you. 😾♡”
                    </p>

                </section>

            </div>

        </div>
    );
}


// ============================================================
// REMINDER CARD
// ============================================================

import { useEffect, useState } from "react";
import { konekoHome, waterCat, foodCat, medicineCat, sleepCat, calendarCat } from "../assets";
import phaseData from "../constants/phaseData";
import { getCycleStatus } from "../services/cycleService";
import { getHomeReminders } from "../services/reminderService";
import QuickCareCard from "../components/home/QuickCareCard";
import Reminder from "../components/reminder/Reminder";

export default function Home({ onNavigate, onReminder }) {
    const [cycle, setCycle] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("koneko_token");

        Promise.all([
            getCycleStatus({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                if (!res.ok) throw new Error("Failed to load cycle");
                return res.json();
            }),

            getHomeReminders({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                if (!res.ok) throw new Error("Failed to load reminders");
                return res.json();
            }),
        ])
            .then(([cycleData, reminderData]) => {
                setCycle(cycleData);
                setReminders(reminderData);
            })
            .catch((error) => {
                console.error("Home API Error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="screen home-screen">
                <div className="greeting">
                    <span>Just a tiny moment... 🐾</span>
                    <h1>Koneko 🐱</h1>
                </div>

                <section className="home-loading-card">
                    <img src={konekoHome} alt="Koneko" />
                    <h2>Checking on you...</h2>
                    <p>Your tiny cat is preparing everything ♡</p>
                </section>
            </div>
        );
    }

    const phase = cycle?.phase || "LUTEAL";

    const currentPhase = phaseData[phase];

    const visibleReminders = reminders
        .filter((reminder) => reminder.enabled)
        .slice(0, 4);

    return (
        <div className="screen home-screen">
            <div className="greeting">
                <span>Welcome back, baby 💗</span>
                <h1>Koneko 🐱</h1>
            </div>

            {/* MAIN IMAGE */}

            <section className="home-hero">
                <img src={konekoHome} alt="Koneko" />

                <div className="home-hero-content">
                    <span>YOUR LITTLE CAT</span>
                    <h2>I'm here for you ♡</h2>
                    <p>
                        {phase === "MENSTRUAL"
                            ? "Blanket, snacks and rest. That's the plan. 🐱"
                            : phase === "FOLLICULAR"
                                ? "Look at you getting your energy back! 🐾"
                                : phase === "OVULATION"
                                    ? "Hmm... someone's glowing today. 👀"
                                    : "Come closer. I'm officially in cuddle mode. 🐱"}
                    </p>
                </div>
            </section>

            {/* CURRENT PHASE */}

            <button
                className="phase-home-card"
                onClick={() => onNavigate("cycle")}
            >
                <div className="phase-home-image">
                    <img src={currentPhase.image} alt={currentPhase.name} />
                </div>

                <div className="phase-home-info">
                    <span>YOUR CURRENT PHASE</span>
                    <h2>
                        {currentPhase.icon} {currentPhase.name}
                    </h2>
                    <p>Cycle Day {cycle?.cycleDay || "—"}</p>
                </div>

                <span className="arrow">›</span>
            </button>

            {/* LITTLE NOTE */}

            <section className="love-card">
                <div className="love-icon">{currentPhase.icon}</div>

                <div>
                    <span className="mini-label">TODAY'S LITTLE NOTE</span>
                    <p>{currentPhase.homeMessage}</p>
                </div>
            </section>

            {/* QUICK CARE */}

            <div className="section-heading">
                <div>
                    <span>TAKE CARE OF YOURSELF</span>
                    <h2>Little things ♡</h2>
                </div>
            </div>

            <div className="quick-care-grid">
                <QuickCareCard
                    image={waterCat}
                    title="Drink Water"
                    text="Stay hydrated"
                    onClick={() => onReminder("WATER")}
                />

                <QuickCareCard
                    image={foodCat}
                    title="Eat Something"
                    text="Don't skip meals"
                    onClick={() => onReminder("FOOD")}
                />

                <QuickCareCard
                    image={medicineCat}
                    title="Medicine"
                    text="Take care ♡"
                    onClick={() => onReminder("MEDICINE")}
                />

                <QuickCareCard
                    image={sleepCat}
                    title="Sleep"
                    text="Rest matters"
                    onClick={() => onReminder("SLEEP")}
                />
            </div>

            {/* REMINDERS */}

            <div className="section-heading reminders-heading">
                <div>
                    <span>UPCOMING</span>
                    <h2>Little reminders 🌷</h2>
                </div>

                <button
                    type="button"
                    onClick={() => onNavigate("reminders")}
                >
                    See all
                </button>
            </div>

            <div className="home-reminders">
                {visibleReminders.length === 0 ? (
                    <div className="empty-card">
                        <span>🐾</span>
                        <h3>No reminders yet</h3>
                        <p>Your cat has nothing to nag you about... for now. 😼</p>
                    </div>
                ) : (
                    visibleReminders.map((reminder) => (
                        <Reminder
                            key={reminder.id}
                            reminder={reminder}
                            compact
                            onClick={() => onReminder(reminder.type)}
                        />
                    ))
                )}
            </div>

            {/* CALENDAR SHORTCUT */}

            <button
                className="calendar-shortcut"
                onClick={() => onNavigate("cycle")}
            >
                <img src={calendarCat} alt="Calendar" />

                <div>
                    <span>YOUR CYCLE</span>
                    <h3>Open your calendar 🌸</h3>
                    <p>See where you are in your cycle</p>
                </div>

                <span className="arrow">›</span>
            </button>
        </div>
    );
}

// ================= QUICK CARE CARD =================

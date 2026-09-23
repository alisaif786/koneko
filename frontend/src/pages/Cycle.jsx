import { useEffect, useState } from "react";
import { calendarCat } from "../assets";
import phaseData from "../constants/phaseData";
import { getCycleStatus } from "../services/cycleService";
import Screen from "../components/common/Screen";
import PhaseStep from "../components/cycle/PhaseStep";

export default function Cycle() {
    const [cycle, setCycle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("koneko_token");

        getCycleStatus({
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                setCycle(data);
            })
            .catch((error) => {
                console.error("Cycle API Error:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Screen title="Your Cycle 🌸">
                <section className="big-cycle-card loading-card">
                    <img src={calendarCat} alt="Calendar cat" />
                    <h2>Checking your little calendar...</h2>
                    <p>Just a tiny moment ♡</p>
                </section>
            </Screen>
        );
    }

    if (error || !cycle) {
        return (
            <Screen title="Your Cycle 🌸">
                <section className="info-card error-card">
                    <span>😿</span>
                    <h3>Oops...</h3>
                    <p>{error || "Cycle information isn't available right now."}</p>
                </section>
            </Screen>
        );
    }

    const currentPhase =
        phaseData[cycle.phase] || phaseData.LUTEAL;

    const cycleDay = Number(cycle.cycleDay) || 1;

    const calendarDays = Array.from({ length: 28 }, (_, index) => index + 1);

    return (
        <Screen title="Your Cycle 🌸">
            {/* CURRENT PHASE */}

            <section className={`cycle-hero ${currentPhase.colorClass}`}>
                <div className="cycle-hero-image">
                    <img
                        src={currentPhase.image}
                        alt={currentPhase.name}
                    />
                </div>

                <span className="phase-pill">
          {currentPhase.icon} CURRENT PHASE
        </span>

                <p className="cycle-date">
                    TODAY · {cycle.date}
                </p>

                <h2>Cycle Day {cycle.cycleDay}</h2>

                <p className="phase-name">
                    {currentPhase.name}
                </p>
            </section>

            {/* PHASE MESSAGE */}

            <section className="info-card phase-message-card">
                <span className="mini-label">A LITTLE NOTE FOR YOU</span>
                <h3>{currentPhase.icon} {currentPhase.name}</h3>
                <p>{currentPhase.cycleMessage}</p>
            </section>

            {/* PHASE PROGRESS */}

            <section className="phase-progress-card">
                <span className="mini-label">YOUR CYCLE JOURNEY</span>

                <div className="phase-track">
                    <PhaseStep
                        icon="🩸"
                        label="Menstrual"
                        active={cycle.phase === "MENSTRUAL"}
                    />

                    <PhaseStep
                        icon="🌱"
                        label="Follicular"
                        active={cycle.phase === "FOLLICULAR"}
                    />

                    <PhaseStep
                        icon="🌸"
                        label="Ovulation"
                        active={cycle.phase === "OVULATION"}
                    />

                    <PhaseStep
                        icon="🌙"
                        label="Luteal"
                        active={cycle.phase === "LUTEAL"}
                    />
                </div>
            </section>

            {/* CALENDAR */}

            <section className="calendar-card">
                <div className="calendar-title">
                    <div>
                        <span>SEPTEMBER 2026</span>
                        <h2>Cycle Calendar</h2>
                    </div>

                    <img src={calendarCat} alt="Calendar cat" />
                </div>

                <div className="calendar-week">
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                </div>

                <div className="calendar-grid">
                    {calendarDays.map((day) => (
                        <div
                            key={day}
                            className={`calendar-day ${
                                day === cycleDay ? "today" : ""
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <p className="calendar-note">
                    The highlighted day represents your current cycle day.
                </p>
            </section>

            {/* CAT NOTE */}

            <section className="cat-note image-note">
                <img src={calendarCat} alt="Koneko" />

                <div>
                    <p className="note-title">
                        Your tiny cat supervisor
                    </p>

                    <p className="note-text">
                        “Day {cycle.cycleDay}? I'm keeping an eye on you. 😾”
                    </p>
                </div>
            </section>
        </Screen>
    );
}

// ================= PHASE STEP =================

import { useCallback, useEffect, useState } from "react";
import { konekoHome, waterCat, foodCat, medicineCat, sleepCat } from "../assets";
import careCycle from "../assets/cats/care-cycle.png";
import phaseData from "../constants/phaseData";
import { getCycleSettings, getCycleStatus } from "../services/cycleService";
import { getAverage, getHistory, getPrediction, startPeriod } from "../services/historyService";
import { getHomeReminders } from "../services/reminderService";
import QuickCareCard from "../components/home/QuickCareCard";
import Reminder from "../components/reminder/Reminder";

function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function normalizeDate(value) {
    if (!value) return null;

    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
    ) {
        return null;
    }

    return `${year}-${month}-${day}`;
}

function getPredictionDate(data) {
    if (typeof data === "string") return normalizeDate(data);

    const sources = [
        data,
        data?.prediction,
        data?.nextPeriod,
        data?.expectedPeriod,
        data?.result,
    ];
    const dateKeys = [
        "predictedPeriodStartDate",
        "nextExpectedPeriodStartDate",
        "predictedStartDate",
        "nextPeriodStartDate",
        "nextPeriodDate",
        "expectedPeriodStartDate",
        "expectedDate",
        "predictedDate",
        "periodStartDate",
        "date",
    ];

    for (const source of sources) {
        if (typeof source === "string") {
            const parsedDate = normalizeDate(source);
            if (parsedDate) return parsedDate;
        }

        for (const key of dateKeys) {
            const parsedDate = normalizeDate(source?.[key]);
            if (parsedDate) return parsedDate;
        }
    }

    return null;
}

function getAverageCycleLength(data) {
    const sources = [data, data?.result];
    const lengthKeys = [
        "averageCycleLength",
        "averageCycleLengthDays",
        "averageCycle",
        "averageLength",
        "average",
        "cycleLength",
    ];

    for (const source of sources) {
        const value = typeof source === "number" || typeof source === "string"
            ? Number(source)
            : lengthKeys
                .map((key) => Number(source?.[key]))
                .find((length) => Number.isFinite(length) && length > 0);

        if (Number.isFinite(value) && value > 0) return Math.round(value);
    }

    return null;
}

function formatPredictionDate(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return "";

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
    }).format(date);
}

export default function Home({ onNavigate, onReminder }) {
    const [cycle, setCycle] = useState(null);
    const [cycleProfile, setCycleProfile] = useState(null);
    const [cycleProfileLoaded, setCycleProfileLoaded] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [predictionDate, setPredictionDate] = useState(null);
    const [averageCycleLength, setAverageCycleLength] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showStartPeriodDialog, setShowStartPeriodDialog] = useState(false);
    const [startingPeriod, setStartingPeriod] = useState(false);
    const [startPeriodError, setStartPeriodError] = useState("");
    const [startPeriodSuccess, setStartPeriodSuccess] = useState("");

    const loadHomeData = useCallback(async ({ initial = false, includeHistory = false } = {}) => {
        const token = localStorage.getItem("koneko_token");
        const requestOptions = {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const readJson = async (request) => {
            const response = await request;
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return response.json();
        };

        const cycleRequest = readJson(getCycleStatus(requestOptions))
            .then(setCycle)
            .catch((error) => console.error("Home cycle error:", error));

        const remindersRequest = readJson(getHomeReminders(requestOptions))
            .then(setReminders)
            .catch((error) => console.error("Home reminders error:", error));

        const settingsRequest = getCycleSettings(requestOptions)
            .then(async (response) => {
                if (response.status === 404) return null;
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                return response.json();
            })
            .then(setCycleProfile)
            .catch((error) => {
                console.error("Home cycle settings error:", error);
                setCycleProfile(null);
            })
            .finally(() => setCycleProfileLoaded(true));

        const predictionRequest = readJson(getPrediction(requestOptions))
            .then((data) => setPredictionDate(getPredictionDate(data)))
            .catch((error) => {
                console.error("Home prediction error:", error);
                setPredictionDate(null);
            });

        const averageRequest = readJson(getAverage(requestOptions))
            .then((data) => setAverageCycleLength(getAverageCycleLength(data)))
            .catch((error) => {
                console.error("Home cycle average error:", error);
                setAverageCycleLength(null);
            });

        const historyRequest = includeHistory
            ? getHistory(requestOptions)
                .then((response) => {
                    if (!response.ok) throw new Error(`API Error: ${response.status}`);
                    return response.json();
                })
                .catch((error) => console.error("Home cycle history refresh error:", error))
            : Promise.resolve();

        const coreRequests = Promise.allSettled([cycleRequest, remindersRequest]);
        const supplementaryRequests = Promise.allSettled([
            settingsRequest,
            predictionRequest,
            averageRequest,
            historyRequest,
        ]);

        if (initial) {
            await coreRequests;
            setLoading(false);
            await supplementaryRequests;
        } else {
            await Promise.all([coreRequests, supplementaryRequests]);
        }
    }, []);

    useEffect(() => {
        loadHomeData({ initial: true });
    }, [loadHomeData]);

    async function handleStartPeriod() {
        setStartingPeriod(true);
        setStartPeriodError("");

        try {
            const token = localStorage.getItem("koneko_token");
            const response = await startPeriod({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    periodStartDate: formatLocalDate(new Date()),
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `API Error: ${response.status}`);
            }

            setShowStartPeriodDialog(false);
            setStartPeriodSuccess("Lisa's new cycle has been logged ♡");
            await loadHomeData({ includeHistory: true });
        } catch (error) {
            console.error("Start period error:", error);
            setStartPeriodError("Couldn't log the new cycle. Please try again ♡");
        } finally {
            setStartingPeriod(false);
        }
    }

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
    const today = formatLocalDate(new Date());
    const currentPeriodStartDate = normalizeDate(
        cycleProfile?.lastPeriodStartDate || cycleProfile?.periodStartDate
    );
    const shouldOfferPeriodStart = cycleProfileLoaded && currentPeriodStartDate !== today;

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
                <span>MY LITTLE CAT</span>
                <img className="home-hero-banner" src={konekoHome} alt="Koneko" />

                <div className="home-hero-content">
                    <h2>Made with love, just for you ♡</h2>
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

            {predictionDate && (
                <section className="home-prediction-card" aria-label="Next cycle prediction">
                    <div className="home-prediction-heading">
                        <span aria-hidden="true">🌸</span>
                        <h2>Next Prediction</h2>
                    </div>

                    <div className="home-prediction-values">
                        <div className="home-prediction-value">
                            <span>Expected</span>
                            <strong>{formatPredictionDate(predictionDate)}</strong>
                        </div>
                        <div className="home-prediction-value">
                            <span>Average Cycle</span>
                            <strong>
                                {averageCycleLength
                                    ? `${averageCycleLength} days`
                                    : "Not enough data"}
                            </strong>
                        </div>
                    </div>
                </section>
            )}

            {shouldOfferPeriodStart && (
                <button
                    type="button"
                    className="home-period-start-button"
                    onClick={() => {
                        setStartPeriodError("");
                        setStartPeriodSuccess("");
                        setShowStartPeriodDialog(true);
                    }}
                >
                    🌸 My Period Started Today
                </button>
            )}

            {startPeriodSuccess && (
                <p className="home-period-start-success" role="status">
                    {startPeriodSuccess}
                </p>
            )}

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
                <div>
                    <span>YOUR CYCLE</span>
                    <h3>Open your calendar 🌸</h3>
                    <p>See where you are in your cycle</p>
                </div>

                <img src={careCycle} alt="Your Cycle calendar" />

                <span className="arrow">›</span>
            </button>

            {showStartPeriodDialog && (
                <div
                    className="home-period-start-overlay"
                    role="presentation"
                    onClick={() => {
                        if (!startingPeriod) setShowStartPeriodDialog(false);
                    }}
                >
                    <section
                        className="home-period-start-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="home-period-start-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <span className="home-period-start-icon" aria-hidden="true">🌸</span>
                        <h2 id="home-period-start-title">Start a new cycle today?</h2>
                        <p>Lisa will gently keep track of today's start for you.</p>

                        {startPeriodError && (
                            <p className="home-period-start-error" role="alert">
                                😿 {startPeriodError}
                            </p>
                        )}

                        <div className="home-period-start-actions">
                            <button
                                type="button"
                                className="home-period-cancel"
                                disabled={startingPeriod}
                                onClick={() => setShowStartPeriodDialog(false)}
                            >
                                Not now
                            </button>
                            <button
                                type="button"
                                className="home-period-confirm"
                                disabled={startingPeriod}
                                onClick={handleStartPeriod}
                            >
                                {startingPeriod ? "Saving... 🐾" : "Yes, start today ♡"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

// ================= QUICK CARE CARD =================

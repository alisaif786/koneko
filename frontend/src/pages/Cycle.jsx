import { useEffect, useState } from "react";
import { calendarCat } from "../assets";
import watchingCat from "../assets/cats/watching.png";
import phaseData from "../constants/phaseData";
import { getCycleSettings, getCycleStatus } from "../services/cycleService";
import Screen from "../components/common/Screen";
import PhaseStep from "../components/cycle/PhaseStep";

function getStartOfDay(value) {
    if (!value) return null;

    const dateParts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateParts) {
        const [, year, month, day] = dateParts;
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        if (
            date.getFullYear() === Number(year) &&
            date.getMonth() === Number(month) - 1 &&
            date.getDate() === Number(day)
        ) {
            return date;
        }

        return null;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return null;

    return new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
    );
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function isSameDay(firstDate, secondDate) {
    return Boolean(
        firstDate &&
        secondDate &&
        firstDate.getFullYear() === secondDate.getFullYear() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getDate() === secondDate.getDate()
    );
}

function isDateInRange(date, rangeStart, rangeEnd) {
    return Boolean(rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd);
}

function getMonthDays(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const numberOfDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const mondayFirstOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const dates = [
        ...Array(mondayFirstOffset).fill(null),
        ...Array.from(
            { length: numberOfDays },
            (_, index) => new Date(date.getFullYear(), date.getMonth(), index + 1)
        ),
    ];
    const trailingEmptyDays = (7 - (dates.length % 7)) % 7;

    return [...dates, ...Array(trailingEmptyDays).fill(null)];
}

function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

function getCalendarDayDifference(firstDate, secondDate) {
    const firstDay = Date.UTC(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate()
    );
    const secondDay = Date.UTC(
        secondDate.getFullYear(),
        secondDate.getMonth(),
        secondDate.getDate()
    );

    return Math.round((firstDay - secondDay) / 86400000);
}

function CycleCalendar({ cycle }) {
    const cycleDay = Number(cycle?.cycleDay) || null;
    const periodLengthValue = Number(cycle?.periodLength);
    const cycleLengthValue = Number(cycle?.cycleLength);
    const periodLength = periodLengthValue > 0 ? periodLengthValue : null;
    const cycleLength = cycleLengthValue > 0 ? cycleLengthValue : null;
    const calendarDate =
        getStartOfDay(cycle?.date) || getStartOfDay(new Date());
    const periodStart = getStartOfDay(cycle?.lastPeriodStartDate);
    const periodEnd =
        periodStart && periodLength
            ? addDays(periodStart, periodLength - 1)
            : null;
    const nextPeriodStart =
        periodStart && cycleLength
            ? addDays(periodStart, cycleLength)
            : null;
    const nextPeriodEnd =
        nextPeriodStart && periodLength
            ? addDays(nextPeriodStart, periodLength - 1)
            : null;
    const ovulationPeak = periodStart
        ? addDays(periodStart, 13)
        : null;
    const ovulationStart = ovulationPeak
        ? addDays(ovulationPeak, -1)
        : null;
    const ovulationEnd = ovulationPeak
        ? addDays(ovulationPeak, 3)
        : null;
    const monthLabel = new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
    })
        .format(calendarDate)
        .toLocaleUpperCase();
    const calendarDays = getMonthDays(calendarDate);
    const predictionRange =
        nextPeriodStart && nextPeriodEnd
            ? `${formatDate(nextPeriodStart)} – ${formatDate(nextPeriodEnd)}`
            : null;

    return (
        <>
            <section className="calendar-card">
                <div className="calendar-title">
                    <div>
                        <span>{monthLabel}</span>
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
                    {calendarDays.map((date, index) => {
                        if (!date) {
                            return (
                                <div
                                    key={`empty-${index}`}
                                    className="calendar-day calendar-day-empty"
                                    aria-hidden="true"
                                />
                            );
                        }

                        const day = date.getDate();
                        const isToday = isSameDay(date, calendarDate);
                        const isPeriodDay =
                            isDateInRange(date, periodStart, periodEnd) ||
                            (isToday && cycle?.phase === "MENSTRUAL");
                        const isFertileDay = isDateInRange(
                            date,
                            ovulationStart,
                            ovulationEnd
                        );
                        const ovulationDayOffset = ovulationPeak
                            ? getCalendarDayDifference(date, ovulationPeak)
                            : null;
                        const isOvulationPeak = ovulationDayOffset === 0;
                        const isNextPeriodDay = isDateInRange(
                            date,
                            nextPeriodStart,
                            nextPeriodEnd
                        );
                        const ovulationEmphasis =
                            ovulationDayOffset === 0
                                ? "ovulation-peak"
                                : ovulationDayOffset === -1
                                    ? "ovulation-pre-peak"
                                    : ovulationDayOffset === 1
                                        ? "ovulation-near"
                                        : ovulationDayOffset === 2
                                            ? "ovulation-soft"
                                            : "ovulation-softer";
                        const dayClasses = [
                            "calendar-day",
                            isToday && "today",
                            isPeriodDay && "period-day",
                            isFertileDay && "fertile-day",
                            isOvulationPeak && "ovulation-peak-day",
                            isNextPeriodDay && "next-period-day",
                        ].filter(Boolean).join(" ");

                        return (
                            <div
                                key={`${date.getFullYear()}-${date.getMonth() + 1}-${day}`}
                                className={dayClasses}
                            >
                                <span className="calendar-day-number">{day}</span>
                                {isPeriodDay ? (
                                    <span
                                        className="calendar-day-indicator period-indicator"
                                        aria-hidden="true"
                                    >
                                        •
                                    </span>
                                ) : isNextPeriodDay ? (
                                    <span
                                        className="calendar-day-indicator predicted-period-indicator"
                                        aria-hidden="true"
                                    >
                                        •
                                    </span>
                                ) : isFertileDay ? (
                                    <span
                                        className={`calendar-day-indicator ovulation-indicator ${ovulationEmphasis}`}
                                        aria-hidden="true"
                                    >
                                        ✦
                                    </span>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                <p className="calendar-note">
                    {cycleDay
                        ? `Today is cycle day ${cycleDay}. Pink dots mark period days; sparkles show your fertile window.`
                        : "Today's date is highlighted. Add cycle dates to see your prediction."}
                </p>
            </section>

            <section className={`next-period-note${predictionRange ? "" : " empty"}`}>
                <span className="next-period-note-icon" aria-hidden="true">♡</span>
                <div>
                    <span className="next-period-note-label">NEXT PERIOD</span>
                    <p>
                        {predictionRange
                            ? "Next period expected"
                            : "Add your cycle dates to see a gentle next-period prediction."}
                    </p>
                    {predictionRange && (
                        <strong>{predictionRange}</strong>
                    )}
                </div>
            </section>
        </>
    );
}

export default function Cycle() {
    const [cycle, setCycle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("koneko_token");
        const requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const statusRequest = getCycleStatus(requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                return response.json();
            });

        const settingsRequest = getCycleSettings(requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                return response.json();
            })
            .catch((error) => {
                console.error("Cycle settings error:", error);
                return null;
            });

        Promise.allSettled([statusRequest, settingsRequest])
            .then(([statusResult, settingsResult]) => {
                const settings =
                    settingsResult.status === "fulfilled"
                        ? settingsResult.value
                        : null;

                if (statusResult.status === "fulfilled") {
                    setCycle({ ...statusResult.value, ...(settings || {}) });
                    return;
                }

                const statusError = statusResult.reason;
                console.error("Cycle API Error:", statusError);
                setError(statusError?.message || "Cycle status is unavailable.");
                setCycle(settings);
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
            <Screen title="Your Cycle">
                <section className="info-card">
                    <h3>Your calendar is here</h3>
                    <p>
                        {error
                            ? "Your cycle details could not be loaded just now. You can still see this month below."
                            : "Add your cycle dates whenever you are ready to see personal predictions."}
                    </p>
                </section>
                <CycleCalendar cycle={cycle} />
            </Screen>
        );
    }

    const currentPhase =
        phaseData[cycle.phase] || phaseData.LUTEAL;

    const cycleDay = Number(cycle.cycleDay) || 1;

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

                <h2>Cycle Day {cycleDay}</h2>

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

            <CycleCalendar cycle={cycle} />

            {/* CAT NOTE */}

            <section className="cat-note image-note">
                <img src={watchingCat} alt="Koneko" />

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

import { useEffect, useState } from "react";
import Screen from "../components/common/Screen";
import { getHistory } from "../services/historyService";

function getEntryDate(entry) {
    return entry.periodStartDate || entry.startDate || entry.date || "";
}

function parseDate(value) {
    if (!value) return null;

    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
        const [, year, month, day] = match;
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

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function formatCycleDate(value) {
    const date = parseDate(value);
    if (!date) return String(value || "Date unavailable");

    return new Intl.DateTimeFormat(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function getHistoryEntries(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.history)) return data.history;
    if (Array.isArray(data?.cycles)) return data.cycles;
    if (Array.isArray(data?.content)) return data.content;
    return [];
}

export default function CycleHistory({ onBack }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isCurrent = true;
        const token = localStorage.getItem("koneko_token");

        getHistory({
            cache: "no-store",
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
                if (!isCurrent) return;

                const entries = getHistoryEntries(data)
                    .slice()
                    .sort((first, second) => {
                        const firstTime = parseDate(getEntryDate(first))?.getTime() || 0;
                        const secondTime = parseDate(getEntryDate(second))?.getTime() || 0;
                        return secondTime - firstTime;
                    });

                setHistory(entries);
            })
            .catch((error) => {
                console.error("Cycle history error:", error);
                if (isCurrent) setHasError(true);
            })
            .finally(() => {
                if (isCurrent) setLoading(false);
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    return (
        <Screen title="Cycle History 🌸">
            <button
                type="button"
                className="cycle-history-back"
                onClick={onBack}
            >
                ‹ Back to Profile
            </button>

            {loading && (
                <section className="info-card settings-loading">
                    <div className="settings-cat">🐱</div>
                    <h3>Gathering your cycle history...</h3>
                    <p>Just a tiny moment ♡</p>
                </section>
            )}

            {!loading && hasError && (
                <section className="info-card cycle-history-error" role="alert">
                    😿 Couldn't load cycle history.
                </section>
            )}

            {!loading && !hasError && history.length === 0 && (
                <section className="empty-card cycle-history-empty">
                    <span>🌸</span>
                    <h3>No cycle history yet</h3>
                    <p>Your recorded cycle starts will appear here.</p>
                </section>
            )}

            {!loading && !hasError && history.length > 0 && (
                <div
                    className="cycle-history-timeline"
                    role="list"
                    aria-label="Cycle history, newest first"
                >
                    {history.map((entry, index) => {
                        const cycleLength = Number(entry.cycleLengthFromPrevious);
                        const isFirstCycle =
                            index === history.length - 1 &&
                            entry.cycleLengthFromPrevious !== null &&
                            entry.cycleLengthFromPrevious !== undefined &&
                            cycleLength === 0;

                        return (
                            <article
                                className="cycle-history-entry"
                                role="listitem"
                                key={`${getEntryDate(entry)}-${index}`}
                            >
                                <span className="cycle-history-marker" aria-hidden="true" />
                                <div className="cycle-history-card">
                                    <h2>
                                        <span aria-hidden="true">🌸</span>
                                        {formatCycleDate(getEntryDate(entry))}
                                    </h2>
                                    <p>
                                        {isFirstCycle
                                            ? "First recorded cycle ♡"
                                            : Number.isFinite(cycleLength) && cycleLength > 0
                                                ? `${cycleLength} Day Cycle`
                                                : "Cycle length unavailable"}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </Screen>
    );
}

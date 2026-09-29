import { useEffect, useState } from "react";
import { getCycleSettings, saveCycleSettings } from "../services/cycleService";
import Screen from "../components/common/Screen";

export default function CycleSettings({ onSaved }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [lastPeriodStartDate, setLastPeriodStartDate] = useState("");
    const [cycleLength, setCycleLength] = useState(28);
    const [periodLength, setPeriodLength] = useState(5);

    useEffect(() => {
        const token = localStorage.getItem("koneko_token");

        getCycleSettings({
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 404) {
                    return null;
                }

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                return response.json();
            })
            .then((data) => {
                if (data) {
                    setLastPeriodStartDate(
                        data.lastPeriodStartDate || ""
                    );

                    setCycleLength(
                        data.cycleLength || 28
                    );

                    setPeriodLength(
                        data.periodLength || 5
                    );
                }
            })
            .catch((err) => {
                console.error("Cycle settings error:", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const cycle = Number(cycleLength);
        const period = Number(periodLength);

        if (!lastPeriodStartDate) {
            setError("Please select your last period start date.");
            return;
        }

        if (Number.isNaN(cycle) || cycle < 21 || cycle > 45) {
            setError("Cycle length should be between 21 and 45 days.");
            return;
        }

        if (Number.isNaN(period) || period < 1 || period > 10) {
            setError("Period length should be between 1 and 10 days.");
            return;
        }

        if (period >= cycle) {
            setError("Period length must be shorter than cycle length.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("koneko_token");

            const response = await saveCycleSettings({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    lastPeriodStartDate,
                    cycleLength: cycle,
                    periodLength: period,
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `API Error: ${response.status}`);
            }

            await response.json();

            setSuccess("Your cycle has been saved ♡");

            if (onSaved) {
                onSaved();
            }

        } catch (err) {
            console.error("Save cycle error:", err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Screen title="Cycle Settings 🌸">
                <section className="info-card settings-loading">
                    <div className="settings-cat">🐱</div>
                    <h3>Checking your cycle...</h3>
                    <p>Just a tiny moment ♡</p>
                </section>
            </Screen>
        );
    }

    return (
        <Screen title="Cycle Settings 🌸">

            <section className="cycle-settings-card">

                <div className="settings-header">
                    <div className="settings-icon">
                        🌸
                    </div>

                    <div>
                        <h2>Your Cycle</h2>
                        <p>
                            Tell Koneko a little about your cycle.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave}>

                    <div className="settings-field">
                        <label>
                            Last period started
                        </label>

                        <input
                            type="date"
                            value={lastPeriodStartDate}
                            onChange={(e) =>
                                setLastPeriodStartDate(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="settings-field">
                        <label>
                            Average cycle length
                        </label>

                        <div className="number-input-row">
                            <input
                                type="number"
                                min="21"
                                max="45"
                                value={cycleLength}
                                onChange={(e) =>
                                    setCycleLength(
                                        Number(e.target.value)
                                    )
                                }
                                required
                            />

                            <span>days</span>
                        </div>
                    </div>

                    <div className="settings-field">
                        <label>
                            Period length
                        </label>

                        <div className="number-input-row">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={periodLength}
                                onChange={(e) =>
                                    setPeriodLength(
                                        Number(e.target.value)
                                    )
                                }
                                required
                            />

                            <span>days</span>
                        </div>
                    </div>

                    {error && (
                        <div className="settings-error">
                            😿 {error}
                        </div>
                    )}

                    {success && (
                        <div className="settings-success">
                            🌸 {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="save-cycle-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving... 🐾"
                            : "Save Cycle ♡"}
                    </button>

                </form>

            </section>

            <section className="settings-note">
                <span>🐱</span>

                <div>
                    <p className="note-title">
                        A tiny reminder
                    </p>

                    <p className="note-text">
                        You can update these details whenever
                        your cycle changes.
                    </p>
                </div>
            </section>

        </Screen>
    );
}

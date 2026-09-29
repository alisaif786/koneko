import { useMemo, useState } from "react";
import { profileCat } from "../assets";
import lisaPhoto from "../assets/cats/lisa.png";
import Screen from "../components/common/Screen";

const CAT_PERSONALITY_KEY = "koneko_cat_personality";
const CAT_PERSONALITIES = [
    {
        value: "SWEET",
        emoji: "🌸",
        name: "Sweet",
        description: "Gentle, affectionate, and supportive.",
        example: "Hi love ♡ Don't forget to drink some water.",
    },
    {
        value: "TSUNDERE",
        emoji: "😼",
        name: "Tsundere",
        description: "Pretends not to care, but secretly does.",
        example: "I'm not reminding you because I care... just drink your water already.",
    },
    {
        value: "SHY",
        emoji: "🥺",
        name: "Shy",
        description: "Quiet, soft, and adorable.",
        example: "Um... if you're not busy... maybe drink some water? ♡",
    },
    {
        value: "SLEEPY",
        emoji: "😴",
        name: "Sleepy",
        description: "Calm and cozy, always ready for a nap.",
        example: "Before we nap together... let's drink some water.",
    },
    {
        value: "CHEERFUL",
        emoji: "🎀",
        name: "Cheerful",
        description: "Energetic, bright, and positive.",
        example: "Yay! Let's take care of ourselves today! 🌸",
    },
];

function getSavedPersonality() {
    try {
        const savedPersonality = localStorage.getItem(CAT_PERSONALITY_KEY);
        if (CAT_PERSONALITIES.some(({ value }) => value === savedPersonality)) {
            return savedPersonality;
        }

        localStorage.setItem(CAT_PERSONALITY_KEY, "SWEET");
        return "SWEET";
    } catch {
        return "SWEET";
    }
}

export default function Profile({ onCycleSettings, onCycleHistory, onLogout }) {
    const [showAboutKoneko, setShowAboutKoneko] = useState(false);
    const [showCatPersonality, setShowCatPersonality] = useState(false);
    const [catPersonality, setCatPersonality] = useState(getSavedPersonality);

    const user = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("koneko_user") || "{}"
            );
        } catch {
            return {};
        }
    }, []);

    const username = user.username || "Baby";
    const selectedPersonality = CAT_PERSONALITIES.find(
        (personality) => personality.value === catPersonality
    ) || CAT_PERSONALITIES[0];

    function selectPersonality(personality) {
        setCatPersonality(personality);
        try {
            localStorage.setItem(CAT_PERSONALITY_KEY, personality);
        } catch {
            // Keep the selected personality for this visit if storage is unavailable.
        }
    }

    return (
        <Screen title="Your Little Space 🐱">

            {/* ================= PROFILE HERO ================= */}

            <section className="profile-hero">

                <div className="profile-image">
                    <img
                        src={profileCat}
                        alt="Profile"
                    />
                </div>

                <span>
                    YOUR KONEKO SPACE
                </span>

                <h2>
                    {username}
                </h2>

                <p>
                    A tiny place made with love ♡
                </p>

            </section>


            {/* ================= PROFILE MENU ================= */}

            <section className="profile-menu">

                {/* Notifications */}

                <button>
                    <span>🔔</span>

                    <div>
                        <h3>
                            Notifications
                        </h3>

                        <p>
                            Manage your reminders
                        </p>
                    </div>

                    <b>›</b>
                </button>


                {/* Cycle Settings */}

                <button
                    onClick={onCycleSettings}
                >
                    <span>🌸</span>

                    <div>
                        <h3>
                            Cycle Settings
                        </h3>

                        <p>
                            Your cycle preferences
                        </p>
                    </div>

                    <b>›</b>
                </button>


                {/* Cycle History */}

                <button
                    type="button"
                    onClick={onCycleHistory}
                >
                    <span>📅</span>

                    <div>
                        <h3>
                            Cycle History
                        </h3>

                        <p>
                            Your past cycle starts
                        </p>
                    </div>

                    <b>›</b>
                </button>


                {/* Cat Personality */}

                <button
                    type="button"
                    onClick={() => setShowCatPersonality(true)}
                >
                    <span>🐱</span>

                    <div>
                        <h3>
                            Cat Personality
                        </h3>

                        <p>
                            Your tiny supervisor
                        </p>
                    </div>

                    <b>›</b>
                </button>


                {/* About */}

                <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-controls="about-koneko-dialog"
                    onClick={() => setShowAboutKoneko(true)}
                >
                    <span>💕</span>

                    <div>
                        <h3>
                            About Koneko
                        </h3>

                        <p>
                            Your little private space
                        </p>
                    </div>

                    <b>›</b>
                </button>

            </section>


            {/* ================= LOGOUT ================= */}

            <button
                className="logout-button"
                onClick={onLogout}
            >
                Log out
            </button>

            {showAboutKoneko && (
                <div
                    className="profile-about-overlay about-koneko-overlay"
                    role="presentation"
                    onClick={() => setShowAboutKoneko(false)}
                >
                    <section
                        className="profile-about-view about-koneko-view"
                        id="about-koneko-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-about-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="profile-about-close"
                            type="button"
                            aria-label="Close About Koneko"
                            onClick={() => setShowAboutKoneko(false)}
                        >
                            ×
                        </button>

                        <img
                            className="profile-about-image"
                            src={profileCat}
                            alt=""
                        />

                        <h2 id="profile-about-title">About Koneko 🐱</h2>
                        <p className="profile-about-intro">
                            A little care companion, made for softer days.
                        </p>

                        <section className="about-koneko-section">
                            <h3>🌸 What is Koneko?</h3>
                            <p>
                                Koneko is a gentle self-care companion created to help someone special take care of herself every day.
                            </p>
                            <div className="about-koneko-pill-list" role="list" aria-label="What Koneko combines">
                                <span role="listitem">Cycle tracking</span>
                                <span role="listitem">Daily reminders</span>
                                <span role="listitem">Self-care</span>
                                <span role="listitem">Cute companionship</span>
                                <span role="listitem">Personalized support</span>
                            </div>
                        </section>

                        <section className="about-koneko-section about-koneko-lisa">
                            <h3>🐱 Lisa</h3>
                            <p>
                                Lisa is the little cat companion who lovingly stays by your side and gently reminds you to care for yourself.
                            </p>
                        </section>

                        <section className="about-koneko-section about-koneko-love">
                            <h3>💖 Built With Love</h3>
                            <p>
                                Koneko was lovingly created by <strong>Ali</strong> for someone very special.
                            </p>
                            <p>
                                Every reminder, every little message, and every tiny detail was made with love and care.
                            </p>
                        </section>

                        <section className="about-koneko-section">
                            <h3>✨ Features</h3>
                            <ul className="profile-about-features about-koneko-features">
                                <li><span aria-hidden="true">🌸</span> Cycle Tracking</li>
                                <li><span aria-hidden="true">💧</span> Water Reminders</li>
                                <li><span aria-hidden="true">💊</span> Medicine Reminders</li>
                                <li><span aria-hidden="true">😴</span> Sleep Care</li>
                                <li><span aria-hidden="true">🍽️</span> Food Reminders</li>
                                <li><span aria-hidden="true">🐱</span> Lisa's Personality</li>
                                <li><span aria-hidden="true">💖</span> Personalized Care</li>
                            </ul>
                        </section>

                        <p className="profile-about-version about-koneko-version">Version 1.0</p>

                        <p className="profile-about-closing about-koneko-footer">
                            Take care of yourself today. Lisa is cheering for you. 🐱💕
                        </p>

                        <button
                            className="profile-about-back"
                            type="button"
                            onClick={() => setShowAboutKoneko(false)}
                        >
                            Back to Profile
                        </button>
                    </section>
                </div>
            )}

            {showCatPersonality && (
                <div
                    className="profile-about-overlay"
                    role="presentation"
                    onClick={() => setShowCatPersonality(false)}
                >
                    <section
                        className="cat-personality-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cat-personality-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="profile-about-close"
                            type="button"
                            aria-label="Close Lisa's Personality"
                            onClick={() => setShowCatPersonality(false)}
                        >
                            ×
                        </button>

                        <div className="cat-personality-card">
                            <img
                                className="cat-personality-photo"
                                src={lisaPhoto}
                                alt="Lisa, Koneko's fluffy cat companion"
                            />

                            <div className="cat-personality-heading">
                                <span aria-hidden="true">🐱</span>
                                <div>
                                    <h2 id="cat-personality-title">Lisa's Personality</h2>
                                    <p>Choose how Lisa talks to you throughout Koneko.</p>
                                </div>
                            </div>

                            <div
                                className="cat-personality-options"
                                role="group"
                                aria-label="Choose Lisa's personality"
                            >
                                {CAT_PERSONALITIES.map((personality) => (
                                    <button
                                        className={`cat-personality-option${catPersonality === personality.value ? " selected" : ""}`}
                                        key={personality.value}
                                        type="button"
                                        aria-pressed={catPersonality === personality.value}
                                        onClick={() => selectPersonality(personality.value)}
                                    >
                                        <span className="cat-personality-emoji" aria-hidden="true">
                                            {personality.emoji}
                                        </span>
                                        <span className="cat-personality-copy">
                                            <span className="cat-personality-name">
                                                {personality.name}
                                                {personality.value === "SWEET" && (
                                                    <span className="cat-personality-default">Default</span>
                                                )}
                                            </span>
                                            <span className="cat-personality-description">
                                                {personality.description}
                                            </span>
                                        </span>
                                        <span className="cat-personality-check" aria-hidden="true">
                                            {catPersonality === personality.value ? "✓" : ""}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="cat-personality-preview" aria-live="polite">
                                <span className="cat-personality-preview-label">
                                    {selectedPersonality.emoji} Lisa says
                                </span>
                                <p key={selectedPersonality.value}>
                                    “{selectedPersonality.example}”
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )}

        </Screen>
    );
}
// ================= SCREEN =================

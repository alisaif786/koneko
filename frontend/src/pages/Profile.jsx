import { useMemo } from "react";
import { profileCat } from "../assets";
import Screen from "../components/common/Screen";

export default function Profile({ onCycleSettings, onLogout }) {
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


                {/* Cat Personality */}

                <button>
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

                <button>
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

        </Screen>
    );
}
// ================= SCREEN =================

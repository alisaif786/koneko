import { useState } from "react";
import { chatCat } from "../assets";
import Screen from "../components/common/Screen";

export default function Us() {
    const [openLetter, setOpenLetter] = useState(null);

    const letters = [
        {
            id: "miss",
            icon: "💌",
            label: "OPEN WHEN",
            title: "You miss me",
            text: "A tiny letter is waiting for you...",
            message:
                "If you're reading this because you miss me, then come here. Consider this your little virtual hug. 🤍",
        },
        {
            id: "sleep",
            icon: "🌙",
            label: "OPEN WHEN",
            title: "You can't sleep",
            text: "Maybe there's something sweet inside.",
            message:
                "Close your eyes, get comfortable, and imagine me telling you goodnight. Sleep softly, baby. 🌙♡",
        },
        {
            id: "random",
            icon: "🐱",
            label: "RANDOM",
            title: "A message from me",
            text: "Because you deserve random love too. ♡",
            message:
                "This is your completely random reminder that someone is thinking about you. 🐱💕",
        },
    ];

    return (
        <Screen title="Just Us 💌">
            <section className="us-hero">
                <img src={chatCat} alt="Koneko love" />

                <span>OUR LITTLE CORNER</span>

                <h2>Just you & me ♡</h2>

                <p>
                    Little messages for the moments when you need
                    something sweet.
                </p>
            </section>

            <div className="letter-list">
                {letters.map((letter) => (
                    <button
                        className={`letter-card ${
                            openLetter === letter.id ? "opened" : ""
                        }`}
                        key={letter.id}
                        onClick={() =>
                            setOpenLetter(
                                openLetter === letter.id ? null : letter.id
                            )
                        }
                    >
                        <div className="letter-top">
              <span className="letter-icon">
                {letter.icon}
              </span>

                            <span className="letter-arrow">
                {openLetter === letter.id ? "⌃" : "›"}
              </span>
                        </div>

                        <span className="mini-label">
              {letter.label}
            </span>

                        <h3>{letter.title}</h3>

                        <p>{letter.text}</p>

                        {openLetter === letter.id && (
                            <div className="letter-message">
                                {letter.message}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <section className="us-bottom">
                <img src={chatCat} alt="Koneko" />

                <p>
                    “This little corner is just for us. 💕”
                </p>
            </section>
        </Screen>
    );
}

// ================= PROFILE =================

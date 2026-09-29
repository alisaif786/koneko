import { useEffect, useState } from "react";
import { chatCat } from "../assets";
import usCat from "../assets/cats/us.jpg";
import Screen from "../components/common/Screen";
import usMessages from "../data/usMessages";

const millisecondsPerDay = 24 * 60 * 60 * 1000;

function getLocalDayNumber(date) {
    return Math.floor(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) /
            millisecondsPerDay
    );
}

function getTwoDayBucket(date = new Date()) {
    return Math.floor(getLocalDayNumber(date) / 2);
}

function getBucketMessage(messages, bucket, offset) {
    if (!messages.length) return "";

    return messages[(bucket + offset) % messages.length];
}

export default function Us() {
    const [openLetter, setOpenLetter] = useState(null);
    const [messageBucket, setMessageBucket] = useState(getTwoDayBucket);

    useEffect(() => {
        const now = new Date();
        const dayNumber = getLocalDayNumber(now);
        const nextBucketDayNumber = (Math.floor(dayNumber / 2) + 1) * 2;
        const daysUntilBoundary = nextBucketDayNumber - dayNumber;
        const nextBoundary = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + daysUntilBoundary
        );
        const timeoutId = window.setTimeout(() => {
            setMessageBucket(getTwoDayBucket());
        }, Math.max(0, nextBoundary.getTime() - Date.now()));

        return () => window.clearTimeout(timeoutId);
    }, [messageBucket]);

    const letters = [
        {
            id: "miss",
            icon: "💌",
            label: "OPEN WHEN",
            title: "You miss me",
            text: "A tiny letter is waiting for you...",
            message: getBucketMessage(usMessages.miss, messageBucket, 0),
        },
        {
            id: "sleep",
            icon: "🌙",
            label: "OPEN WHEN",
            title: "You can't sleep",
            text: "Maybe there's something sweet inside.",
            message: getBucketMessage(usMessages.sleep, messageBucket, 1),
        },
        {
            id: "random",
            icon: "🐱",
            label: "RANDOM",
            title: "A message from me",
            text: "Because you deserve random love too. ♡",
            message: getBucketMessage(usMessages.random, messageBucket, 2),
        },
    ];

    return (
        <Screen title="Just Us 💌">
            <section className="us-hero">
                <img src={usCat} alt="Koneko love" />

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

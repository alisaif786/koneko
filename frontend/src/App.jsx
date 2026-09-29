import { useEffect, useState } from "react";
import "./styles/app.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Cycle from "./pages/Cycle";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Us from "./pages/Us";
import CycleSettings from "./pages/CycleSettings";
import CycleHistory from "./pages/CycleHistory";
import NavItem from "./components/common/NavItem";
import { registerNotifications } from "./services/notificationService";

export default function App() {
    const [activeTab, setActiveTab] = useState("home");
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("koneko_token")
    );
    const [authView, setAuthView] = useState("login");
    const [authNotice, setAuthNotice] = useState("");
    const [reminderSection, setReminderSection] = useState(null);
    const [profileSection, setProfileSection] = useState(null);
    useEffect(() => {
        if (isLoggedIn) {
            void registerNotifications();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        if (authView === "register") {
            return (
                <Register
                    onBack={() => {
                        setAuthNotice("");
                        setAuthView("login");
                    }}
                    onRegistered={() => {
                        setAuthNotice("Account created, please log in");
                        setAuthView("login");
                    }}
                />
            );
        }

        return (
            <Login
                onLogin={() => setIsLoggedIn(true)}
                onRegister={() => {
                    setAuthNotice("");
                    setAuthView("register");
                }}
                notice={authNotice}
                onClearNotice={() => setAuthNotice("")}
            />
        );
    }

    const handleTabChange = (tab) => {
        setReminderSection(null);
        setProfileSection(null);
        setActiveTab(tab);
    };

    const renderScreen = () => {
        if (activeTab === "home") {
            return (
                <Home
                    onNavigate={handleTabChange}
                    onReminder={(type) => {
                        setReminderSection(type);
                        setActiveTab("reminders");
                    }}
                />
            );
        }

        if (activeTab === "cycle") return <Cycle />;

        if (activeTab === "reminders") {
            return (
                <Reminders
                    selectedSection={reminderSection}
                    onBack={() => setReminderSection(null)}
                    onSectionChange={setReminderSection}
                />
            );
        }

        if (activeTab === "us") return <Us />;

        if (activeTab === "profile") {
            if (profileSection === "cycle-settings") {
                return (
                    <CycleSettings
                        onBack={() => setProfileSection(null)}
                        onSaved={() => setProfileSection(null)}
                    />
                );
            }

            if (profileSection === "cycle-history") {
                return (
                    <CycleHistory
                        onBack={() => setProfileSection(null)}
                    />
                );
            }

            return (
                <Profile
                    onCycleSettings={() => setProfileSection("cycle-settings")}
                    onCycleHistory={() => setProfileSection("cycle-history")}
                    onLogout={() => {
                        localStorage.removeItem("koneko_token");
                        localStorage.removeItem("koneko_user");
                        setIsLoggedIn(false);
                    }}
                />
            );
        }

        return <Home onNavigate={handleTabChange} />;
    };

    return (
        <div className="app">
            <main className="phone">
                {renderScreen()}
                <nav className="bottom-nav">
                    <NavItem
                        icon="⌂"
                        label="Home"
                        active={activeTab === "home"}
                        onClick={() => handleTabChange("home")}
                    />
                    <NavItem
                        icon="🌸"
                        label="Cycle"
                        active={activeTab === "cycle"}
                        onClick={() => handleTabChange("cycle")}
                    />
                    <NavItem
                        icon="♡"
                        label="Care"
                        active={activeTab === "reminders"}
                        onClick={() => handleTabChange("reminders")}
                    />
                    <NavItem
                        icon="💌"
                        label="Us"
                        active={activeTab === "us"}
                        onClick={() => handleTabChange("us")}
                    />
                    <NavItem
                        icon="🐱"
                        label="Profile"
                        active={activeTab === "profile"}
                        onClick={() => handleTabChange("profile")}
                    />
                </nav>
            </main>
        </div>
    );
}

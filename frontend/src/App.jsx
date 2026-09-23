import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cycle from "./pages/Cycle";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Us from "./pages/Us";
import CycleSettings from "./pages/CycleSettings";
import NavItem from "./components/common/NavItem";

export default function App() {
    const [activeTab, setActiveTab] = useState("home");
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("koneko_token")
    );
    const [reminderSection, setReminderSection] = useState(null);
    const [profileSection, setProfileSection] = useState(null);

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />;
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

            return (
                <Profile
                    onCycleSettings={() => setProfileSection("cycle-settings")}
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

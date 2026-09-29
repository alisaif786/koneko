import { useState } from "react";
import heyCat from "../assets/cats/hey.png";
import { loginUser } from "../services/authService";

export default function Login({ onLogin, onRegister, notice, onClearNotice }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        onClearNotice?.();
        setError("");
        setLoading(true);

        try {
            const response = await loginUser({
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });

            if (!response.ok) {
                throw new Error("Invalid username or password");
            }

            const data = await response.json();

            localStorage.setItem("koneko_token", data.token);
            localStorage.setItem("koneko_user", JSON.stringify(data));

            onLogin();
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-image">
                <img src={heyCat} alt="Koneko" />
            </div>

            <h1>
                Koneko <span>♡</span>
            </h1>

            <p className="login-subtitle">
                Your little private space 🌸
            </p>

            <form className="login-card" onSubmit={handleLogin}>
                <h2>Welcome back ♡</h2>

                <p className="login-hint">
                    Your tiny cat has been waiting for you.
                </p>

                {notice && (
                    <p className="login-success" role="status">
                        {notice}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="login-error">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Entering... 🐾" : "Enter Koneko ♡"}
                </button>
                <p className="auth-switch">
                    New to Koneko?{" "}
                    <button type="button" onClick={onRegister}>
                        Create account
                    </button>
                </p>
            </form>
        </div>
    );
}

// ================= NAV ITEM =================

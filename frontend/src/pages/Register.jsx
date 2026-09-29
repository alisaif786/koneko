import { useState } from "react";
import heyCat from "../assets/cats/hey.png";
import { registerUser } from "../services/authService";

const requiredMessage = "This field is required.";
const requestErrorMessage = "Unable to create your account. Please try again.";

export default function Register({ onBack, onRegistered }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateField = (field, value, setValue) => {
        setValue(value);
        setFieldErrors((current) => ({ ...current, [field]: "" }));
        setError("");
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        const nextErrors = {};
        if (!username.trim()) nextErrors.username = requiredMessage;
        if (!password) nextErrors.password = requiredMessage;
        if (!displayName.trim()) nextErrors.displayName = requiredMessage;

        setFieldErrors(nextErrors);
        setError("");
        if (Object.keys(nextErrors).length > 0) return;

        setLoading(true);

        try {
            const response = await registerUser({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password,
                    displayName: displayName.trim(),
                }),
            });

            if (!response.ok) {
                let message = requestErrorMessage;
                try {
                    const responseBody = await response.json();
                    if (typeof responseBody?.message === "string") {
                        message = responseBody.message;
                    }
                } catch {
                    // Some server errors do not include a JSON response body.
                }
                throw new Error(message);
            }

            await response.json();
            onRegistered();
        } catch (registerError) {
            console.error("Registration error:", registerError);
            setError(registerError.message || requestErrorMessage);
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

            <p className="login-subtitle">Your little private space 🌸</p>

            <form
                className="login-card"
                onSubmit={handleRegister}
                noValidate
            >
                <h2>Create your account ♡</h2>

                <p className="login-hint">
                    A cozy little space, just for you.
                </p>

                <input
                    type="text"
                    name="displayName"
                    placeholder="Display name"
                    autoComplete="name"
                    value={displayName}
                    onChange={(event) =>
                        updateField(
                            "displayName",
                            event.target.value,
                            setDisplayName
                        )
                    }
                    aria-invalid={Boolean(fieldErrors.displayName)}
                    aria-describedby={
                        fieldErrors.displayName
                            ? "register-display-name-error"
                            : undefined
                    }
                />
                {fieldErrors.displayName && (
                    <p
                        className="login-error field-error"
                        id="register-display-name-error"
                    >
                        {fieldErrors.displayName}
                    </p>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    value={username}
                    onChange={(event) =>
                        updateField("username", event.target.value, setUsername)
                    }
                    aria-invalid={Boolean(fieldErrors.username)}
                    aria-describedby={
                        fieldErrors.username
                            ? "register-username-error"
                            : undefined
                    }
                />
                {fieldErrors.username && (
                    <p
                        className="login-error field-error"
                        id="register-username-error"
                    >
                        {fieldErrors.username}
                    </p>
                )}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) =>
                        updateField("password", event.target.value, setPassword)
                    }
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                        fieldErrors.password
                            ? "register-password-error"
                            : undefined
                    }
                />
                {fieldErrors.password && (
                    <p
                        className="login-error field-error"
                        id="register-password-error"
                    >
                        {fieldErrors.password}
                    </p>
                )}

                {error && (
                    <p className="login-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account... 🐾" : "Create account ♡"}
                </button>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <button type="button" onClick={onBack}>
                        Back to login
                    </button>
                </p>
            </form>
        </div>
    );
}

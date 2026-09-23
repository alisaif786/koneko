

export default function PhaseStep({ icon, label, active }) {
    return (
        <div className={`phase-step ${active ? "active" : ""}`}>
            <div>{icon}</div>
            <span>{label}</span>
        </div>
    );
}

// ================= REMINDERS =================

// ============================================================
// REMINDERS
// ============================================================

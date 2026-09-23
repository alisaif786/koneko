

export default function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            className={`nav-item ${active ? "active" : ""}`}
            onClick={onClick}
            type="button"
        >
            <span>{icon}</span>
            <small>{label}</small>
        </button>
    );
}

// ================= HOME =================

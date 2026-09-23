

export default function TypeOption({
                        icon,
                        label,
                        selected,
                        onClick,
                    }) {
    return (
        <button
            type="button"
            className={
                selected
                    ? "type-option selected"
                    : "type-option"
            }
            onClick={onClick}
        >
            <span>
                {icon}
            </span>

            <small>
                {label}
            </small>
        </button>
    );
}

// ================= US =================

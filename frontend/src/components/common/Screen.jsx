

export default function Screen({ title, children }) {
    return (
        <div className="screen">
            <header className="screen-header">
                <h1>{title}</h1>
            </header>

            <div className="screen-content">
                {children}
            </div>
        </div>
    );
}

// ================= HELPERS =================



export default function QuickCareCard({ image, title, text, onClick }) {
    return (
        <button className="quick-care-card" onClick={onClick}>
            <div className="quick-care-image">
                <img src={image} alt={title} />
            </div>

            <div>
                <h3>{title}</h3>
                <p>{text}</p>
            </div>

            <span className="small-arrow">›</span>
        </button>
    );
}

// ================= CYCLE =================

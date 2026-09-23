

export default function CareCategory({
                          image,
                          title,
                          text,
                          onClick,
                      }) {
    return (
        <button
            type="button"
            className="care-category"
            onClick={onClick}
        >
            <img
                src={image}
                alt={title}
            />

            <div>
                <h3>
                    {title}
                </h3>

                <p>
                    {text}
                </p>
            </div>

            <span>
                ›
            </span>
        </button>
    );
}


// ============================================================
// REMINDER DETAIL
// ============================================================

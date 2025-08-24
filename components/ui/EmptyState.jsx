const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        <svg
          width="180"
          height="120"
          viewBox="0 0 180 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="empty-state-image"
        >
          <rect
            x="20"
            y="40"
            width="140"
            height="60"
            rx="8"
            fill="#f0f0f0"
            stroke="#e1e1e1"
            strokeWidth="2"
          />
          <rect x="30" y="50" width="120" height="8" rx="4" fill="#d8d8d8" />
          <rect x="30" y="65" width="80" height="6" rx="3" fill="#d8d8d8" />
          <rect x="30" y="75" width="100" height="6" rx="3" fill="#d8d8d8" />
          <rect x="30" y="85" width="60" height="6" rx="3" fill="#d8d8d8" />
          <circle cx="150" cy="70" r="15" fill="#c53030" opacity="0.1" />
          <path
            d="M145 70h10M150 65v10"
            stroke="#c53030"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="empty-state-title">Nothing added here yet</h2>
      <p className="empty-state-description">
        Click on the [+] Add button to add items to this course
      </p>
    </div>
  );
};

export default EmptyState;

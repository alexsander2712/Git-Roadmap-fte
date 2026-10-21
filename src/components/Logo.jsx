
import "./Logo.css";

export default function Logo() {
  return (
    <div className="gr-logo" aria-label="GitRoadmap">
      <svg
        className="gr-logo__symbol"
        viewBox="0 0 64 48"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 24h13l12-13h13" />
          <path d="M20 24l12 13h13" />
          <path d="M32 11v26" />
          <circle cx="7" cy="24" r="4" fill="currentColor" />
          <circle cx="45" cy="11" r="4" fill="currentColor" />
          <circle cx="45" cy="37" r="4" fill="currentColor" />
        </g>

        <path
          d="M35 29l10-12 9 1-8 12-5-2-4 7-5-1z"
          fill="#f4f6f8"
          stroke="#d83232"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      <span className="gr-logo__word">
        <span className="gr-logo__git">Git</span>
        <span className="gr-logo__roadmap">Roadmap</span>
      </span>
    </div>
  );
}

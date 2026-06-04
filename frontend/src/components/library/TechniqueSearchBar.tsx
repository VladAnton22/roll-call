interface TechniqueSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TechniqueSearchBar({ value, onChange }: TechniqueSearchBarProps) {
  return (
    <div className="relative mb-5">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-subtle"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search techniques..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-input border border-chrome-strong rounded-xl pl-10 pr-4 py-2.5 text-sm text-content-secondary placeholder-content-faint focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-muted"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
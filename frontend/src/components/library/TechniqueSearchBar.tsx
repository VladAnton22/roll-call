import { SearchIcon, CloseIcon } from "../icons";

interface TechniqueSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TechniqueSearchBar({ value, onChange }: TechniqueSearchBarProps) {
  return (
    <div className="relative mb-5">
      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-subtle" />
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
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
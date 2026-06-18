import { CalendarIcon } from "../icons";

interface SessionEmptyStateProps {
  onLogSession: () => void;
}

export default function SessionEmptyState({ onLogSession }: SessionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-surface-hover border border-chrome flex items-center justify-center">
        <CalendarIcon className="w-7 h-7 text-content-faint" />
      </div>
      <div>
        <p className="text-sm font-semibold text-content-muted">No sessions yet</p>
        <p className="text-xs text-content-subtle mt-1">
          Log your first training session to get started.
        </p>
      </div>
      <button
        onClick={onLogSession}
        className="mt-2 text-sm font-bold text-brand-text hover:underline"
      >
        Log a session
      </button>
    </div>
  );
}
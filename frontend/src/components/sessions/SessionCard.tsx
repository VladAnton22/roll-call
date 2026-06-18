import type { Session } from "../../hooks/useSessionLog";
import { TrashIcon } from "../icons";

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
}

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function SessionCard({ session, onDelete }: SessionCardProps) {
  return (
    <div className="bg-surface-card border border-chrome rounded-2xl px-5 py-4 flex gap-4 items-start">
      {/* Left: date block */}
      <div className="shrink-0 text-center bg-surface-base border border-chrome rounded-xl px-3 py-2 min-w-13">
        <p className="text-xs font-semibold text-content-subtle leading-none mb-0.5">
          {new Date(session.date + "T12:00:00").toLocaleDateString("en-IE", { month: "short" }).toUpperCase()}
        </p>
        <p className="text-xl font-black text-content-primary leading-none">
          {new Date(session.date + "T12:00:00").getDate()}
        </p>
      </div>

      {/* Middle: details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              session.type === "gi"
                ? "bg-brand/10 text-brand-text border border-brand/20"
                : "bg-surface-hover text-content-secondary border border-chrome"
            }`}
          >
            {session.type === "gi" ? "Gi" : "No-Gi"}
          </span>
          <span className="text-xs text-content-subtle">{formatDuration(session.durationMins)}</span>
          <span className="text-xs text-content-faint">{formatDate(session.date)}</span>
        </div>
        {session.notes ? (
          <p className="text-sm text-content-secondary leading-snug line-clamp-2">{session.notes}</p>
        ) : (
          <p className="text-sm text-content-faint italic">No notes</p>
        )}
      </div>

      {/* Right: delete */}
      <button
        onClick={() => onDelete(session.id)}
        aria-label="Delete session"
        className="shrink-0 mt-0.5 text-content-faint hover:text-red-400 transition-colors"
      >
        <TrashIcon />
      </button>
    </div>
  );
}
import type { Session } from "../../hooks/useSessionLog.ts";
import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";

interface SessionCardProps {
  session: Session;
  onClick: (session: Session) => void;
}

const TECHNIQUE_NAMES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const category of TECHNIQUE_CATEGORIES) {
    for (const technique of category.techniques) {
      map[technique.id] = technique.name;
    }
  }
  return map;
})();

const MAX_VISIBLE_TAGS = 4;

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function SessionCard({ session, onClick }: SessionCardProps) {
  const techniqueNames = (session.techniqueIds ?? [])
    .map((id) => TECHNIQUE_NAMES[id])
    .filter(Boolean);
  const visibleTags = techniqueNames.slice(0, MAX_VISIBLE_TAGS);
  const extraCount = techniqueNames.length - visibleTags.length;

  return (
    <button
      onClick={() => onClick(session)}
      className="w-full bg-surface-card border border-chrome rounded-2xl px-5 py-4 flex gap-4 items-start text-left hover:bg-surface-hover transition-colors"
    >
      <div className="shrink-0 text-center bg-surface-base border border-chrome rounded-xl px-3 py-2 min-w-[52px]">
        <p className="text-xs font-semibold text-content-subtle leading-none mb-0.5">
          {new Date(session.date + "T12:00:00")
            .toLocaleDateString("en-IE", { month: "short" })
            .toUpperCase()}
        </p>
        <p className="text-xl font-black text-content-primary leading-none">
          {new Date(session.date + "T12:00:00").getDate()}
        </p>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              session.type === "gi"
                ? "bg-brand/10 text-brand-text border border-brand/20"
                : "bg-surface-hover text-content-secondary border border-chrome"
            }`}
          >
            {session.type === "gi" ? "Gi" : "No-Gi"}
          </span>
          <span className="text-xs text-content-subtle">
            {formatDuration(session.durationMins)}
          </span>
        </div>

        {techniqueNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {visibleTags.map((name) => (
              <span
                key={name}
                className="rounded-md bg-surface-base border border-chrome px-1.5 py-0.5 text-[11px] font-medium text-content-secondary"
              >
                {name}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-content-subtle">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {session.notes ? (
          <p className="text-sm text-content-secondary leading-snug line-clamp-1">
            {session.notes}
          </p>
        ) : (
          <p className="text-sm text-content-faint italic">No notes</p>
        )}
      </div>
    </button>
  );
}
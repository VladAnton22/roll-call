import type { Session } from "../../hooks/useSessionLog.ts";
import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";
import ModalShell from "../../components/ui/ModalShell.tsx";
import PrimaryButton from "../../components/ui/PrimaryButton.tsx";

interface SessionDetailModalProps {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
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

function formatFullDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function SessionDetailModal({
  session,
  onEdit,
  onDelete,
  onClose,
}: SessionDetailModalProps) {
  const techniqueNames = (session.techniqueIds ?? [])
    .map((id) => TECHNIQUE_NAMES[id])
    .filter(Boolean);

  return (
    <ModalShell
      eyebrow="Session Details"
      title={formatFullDate(session.date)}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onDelete}
            className="px-4 py-3 rounded-xl border border-chrome-strong text-content-muted hover:text-red-400 hover:border-red-700 text-sm font-semibold transition-colors"
          >
            Delete
          </button>
          <PrimaryButton onClick={onEdit} fullWidth>
            Edit Session
          </PrimaryButton>
        </>
      }
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            session.type === "gi"
              ? "bg-brand/10 text-brand-text border border-brand/20"
              : "bg-surface-hover text-content-secondary border border-chrome"
          }`}
        >
          {session.type === "gi" ? "Gi" : "No-Gi"}
        </span>
        <span className="text-sm text-content-subtle">
          {formatDuration(session.durationMins)}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-content-subtle mb-2">
          Techniques
        </p>
        {techniqueNames.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {techniqueNames.map((name) => (
              <span
                key={name}
                className="rounded-md bg-surface-base border border-chrome px-2 py-1 text-xs font-medium text-content-secondary"
              >
                {name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-content-faint italic">
            No techniques logged for this session.
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-content-subtle mb-2">
          Notes
        </p>
        {session.notes ? (
          <p className="text-sm text-content-secondary leading-relaxed whitespace-pre-wrap">
            {session.notes}
          </p>
        ) : (
          <p className="text-sm text-content-faint italic">No notes for this session.</p>
        )}
      </div>
    </ModalShell>
  );
}
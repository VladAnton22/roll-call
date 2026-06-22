import type { Session } from "../../hooks/useSessionLog";
import ModalShell from "../ui/ModalShell.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

interface SessionDetailModalProps {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

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
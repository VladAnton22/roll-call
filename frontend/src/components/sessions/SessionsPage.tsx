import { useState } from "react";
import { useSessionLog, type Session } from "../../hooks/useSessionLog";
import SessionFormModal from "./SessionFormModal";
import SessionDetailModal from "./SessionDetailModal";
import SessionCard from "./SessionCard";
import SessionStatsBar from "./SessionStatsBar";
import SessionEmptyState from "./SessionEmptyState";
import PrimaryButton from "../ui/PrimaryButton";
import { PlusIcon } from "../icons";

type ModalState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "detail"; session: Session }
  | { kind: "edit"; session: Session };

export default function SessionsPage() {
  const { sessions, addSession, updateSession, deleteSession } = useSessionLog();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  const totalMins = sessions.reduce((sum, s) => sum + s.durationMins, 0);
  const totalHours = Math.floor(totalMins / 60);
  const giCount = sessions.filter((s) => s.type === "gi").length;
  const nogiCount = sessions.filter((s) => s.type === "no-gi").length;

  function handleDelete(id: string) {
    deleteSession(id);
    setModal({ kind: "none" });
  }

  return (
    <>
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-3">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-content-primary mb-1">
              Sessions
            </h1>
            <p className="text-sm text-content-subtle">
              Track your training time and keep a journal.
            </p>
          </div>
          <PrimaryButton onClick={() => setModal({ kind: "create" })}>
            <span className="flex items-center gap-2">
            <PlusIcon />
            Log Session
            </span>
          </PrimaryButton>
        </div>

        {sessions.length > 0 ? (
          <>
            <SessionStatsBar
              total={sessions.length}
              totalHours={totalHours}
              giCount={giCount}
              nogiCount={nogiCount}
            />
            <div className="space-y-3">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} onClick={(s) => setModal({ kind: "detail", session: s })} />
              ))}
            </div>
          </>
        ) : (
          <SessionEmptyState onLogSession={() => setModal({ kind: "create" })} />
        )}
      </main>

      {modal.kind === "create" && (
        <SessionFormModal
          onSubmit={addSession}
          onClose={() => setModal({ kind: "none" })}
        />
      )}
 
      {modal.kind === "detail" && (
        <SessionDetailModal
          session={modal.session}
          onEdit={() => setModal({ kind: "edit", session: modal.session })}
          onDelete={() => handleDelete(modal.session.id)}
          onClose={() => setModal({ kind: "none" })}
        />
      )}
 
      {modal.kind === "edit" && (
        <SessionFormModal
          initialSession={modal.session}
          onSubmit={(data) => updateSession(modal.session.id, data)}
          onClose={() => setModal({ kind: "none" })}
        />
      )}
    </>
  );
}
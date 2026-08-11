import { useState } from "react";
import { useSessionLog, type Session } from "../../hooks/useSessionLog.ts";
import SessionFormModal from "./SessionFormModal.tsx";
import SessionDetailModal from "./SessionDetailModal.tsx";
import SessionCard from "./SessionCard.tsx";
import SessionStats from "./SessionStats.tsx";
import SessionEmptyState from "./SessionEmptyState.tsx";
import PrimaryButton from "../../components/ui/PrimaryButton.tsx";
import { PlusIcon } from "../../components/icons";

type ModalState =
  | { kind: "none" }
  | { kind: "create" }
  | { kind: "detail"; session: Session }
  | { kind: "edit"; session: Session };

export default function SessionsPage() {
  const { sessions, addSession, sessionsThisWeek, minutesThisWeek, updateSession, deleteSession } = useSessionLog();
  const [modal, setModal] = useState<ModalState>({ kind: "none" });


  function handleDelete(id: string) {
    deleteSession(id);
    setModal({ kind: "none" });
  }

  return (
    <>
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-3">
        <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-content-primary mb-1">
              Sessions
            </h1>
          <PrimaryButton onClick={() => setModal({ kind: "create" })}>
            <span className="flex items-center gap-2">
            <PlusIcon />
            Log Session
            </span>
          </PrimaryButton>
        </div>

        {sessions.length > 0 ? (
          <>
            <SessionStats
              sessionsThisWeek={sessionsThisWeek}
              minutesThisWeek={minutesThisWeek}
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
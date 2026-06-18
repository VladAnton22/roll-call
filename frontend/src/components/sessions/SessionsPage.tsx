import { useState } from "react";
import { useSessionLog } from "../../hooks/useSessionLog";
import LogSessionModal from "./LogSessionModal";
import SessionCard from "./SessionCard";
import SessionStatsBar from "./SessionStatsBar";
import SessionEmptyState from "./SessionEmptyState";
import PrimaryButton from "../ui/PrimaryButton";
import { PlusIcon } from "../icons";

export default function SessionsPage() {
  const { sessions, addSession, deleteSession } = useSessionLog();
  const [modalOpen, setModalOpen] = useState(false);

  const totalMins = sessions.reduce((sum, s) => sum + s.durationMins, 0);
  const totalHours = Math.floor(totalMins / 60);
  const giCount = sessions.filter((s) => s.type === "gi").length;
  const nogiCount = sessions.filter((s) => s.type === "no-gi").length;

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
          <PrimaryButton onClick={() => setModalOpen(true)}>
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
                <SessionCard key={session.id} session={session} onDelete={deleteSession} />
              ))}
            </div>
          </>
        ) : (
          <SessionEmptyState onLogSession={() => setModalOpen(true)} />
        )}
      </main>

      {modalOpen && (
        <LogSessionModal
          onSave={addSession}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
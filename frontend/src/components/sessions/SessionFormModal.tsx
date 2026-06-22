import { useState } from "react";
import type { Session, SessionType } from "../../hooks/useSessionLog";
import ModalShell from "../ui/ModalShell.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";
import FormField from "../ui/FormField.tsx";

export interface SessionFormData {
  date: string;
  type: SessionType;
  durationMins: number;
  notes: string;
}

interface SessionFormModalProps {
  initialSession?: Session;
  onSubmit: (data: SessionFormData) => void;
  onClose: () => void;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

const INPUT_CLASSES =
  "w-full bg-surface-input border border-chrome rounded-xl px-4 py-2.5 text-sm text-content-primary focus:outline-none focus:border-brand-border transition-colors";

export default function SessionFormModal({
  initialSession,
  onSubmit,
  onClose,
}: SessionFormModalProps) {
  const isEditing = Boolean(initialSession);
  const [date, setDate] = useState(initialSession?.date ?? today());
  const [type, setType] = useState<SessionType>(initialSession?.type ?? "gi");
  const [durationMins, setDurationMins] = useState<string>(
    initialSession ? String(initialSession.durationMins) : "60",
  );
  const [notes, setNotes] = useState(initialSession?.notes ?? "");

  const canSave = Boolean(date && durationMins && Number(durationMins) > 0);

  function handleSave() {
    if (!canSave) return;
    onSubmit({
      date,
      type,
      durationMins: Number(durationMins),
      notes: notes.trim(),
    });
    onClose();
  }

  return (
    <ModalShell
      eyebrow={isEditing ? "Edit Session" : "New Session"}
      title={isEditing ? "Edit Training Session" : "Log a Training Session"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-chrome-strong text-content-muted hover:text-content-primary hover:border-chrome text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <PrimaryButton onClick={handleSave} disabled={!canSave} fullWidth>
            {isEditing ? "Save Changes" : "Save Session"}
          </PrimaryButton>
        </>
      }
    >
      <FormField label="Date">
        <input
          type="date"
          value={date}
          max={today()}
          onChange={(e) => setDate(e.target.value)}
          className={INPUT_CLASSES}
        />
      </FormField>

      <FormField label="Type">
        <TypeToggle value={type} onChange={setType} />
      </FormField>

      <FormField label="Duration" hint="(minutes)">
        <input
          type="number"
          min="1"
          max="300"
          value={durationMins}
          onChange={(e) => setDurationMins(e.target.value)}
          placeholder="60"
          className={INPUT_CLASSES}
        />
      </FormField>

      <FormField label="Notes" hint="(optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you work on? Any breakthroughs or things to drill?"
          rows={3}
          className={`${INPUT_CLASSES} resize-none placeholder:text-content-faint`}
        />
      </FormField>
    </ModalShell>
  );
}

interface TypeToggleProps {
  value: SessionType;
  onChange: (type: SessionType) => void;
}

function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="flex gap-2">
      {(["gi", "no-gi"] as SessionType[]).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all duration-150 ${
            value === t
              ? "bg-brand text-white border-brand shadow-lg shadow-brand-shadow"
              : "bg-surface-input border-chrome text-content-muted hover:border-chrome-strong"
          }`}
        >
          {t === "gi" ? "Gi" : "No-Gi"}
        </button>
      ))}
    </div>
  );
}

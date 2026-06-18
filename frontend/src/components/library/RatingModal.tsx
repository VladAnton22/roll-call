import { useState } from "react";
import type { TechniqueRating, Confidence } from "../../data/techniques.ts";
import RatingScale from "./RatingScale.tsx";
import ConfidenceSelector from "./ConfidenceSelector.tsx";
import ModalShell from "../ui/ModalShell.tsx";
import PrimaryButton from "../ui/PrimaryButton.tsx";

interface RatingModalProps {
  techniqueName: string;
  currentRating?: TechniqueRating;
  onSave: (rating: 1 | 2 | 3 | 4 | 5, confidence: Confidence) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function RatingModal({
  techniqueName,
  currentRating,
  onSave,
  onClear,
  onClose,
}: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | 4 | 5 | null>(
    currentRating?.rating ?? null
  );
  const [selectedConfidence, setSelectedConfidence] = useState<Confidence | null>(
    currentRating?.confidence ?? null
  );

  const canSave = selectedRating !== null && selectedConfidence !== null;

  function handleSave() {
    if (!canSave) return;
    onSave(selectedRating!, selectedConfidence!);
    onClose();
  }

  function handleClear() {
    onClear();
    onClose();
  }

  return (
    <ModalShell
      eyebrow="Rate Technique"
      title={techniqueName}
      onClose={onClose}
      footer={
        <>
          {currentRating && (
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl border border-chrome-strong text-content-muted hover:text-red-400 hover:border-red-700 text-sm font-semibold transition-colors"
            >
              Clear
            </button>
          )}
          <PrimaryButton onClick={handleSave} disabled={!canSave} fullWidth>
            Save Rating
          </PrimaryButton>
        </>
      }
    >
      <RatingScale selected={selectedRating} onChange={setSelectedRating} />
      <ConfidenceSelector selected={selectedConfidence} onChange={setSelectedConfidence} />
    </ModalShell>
  );
}
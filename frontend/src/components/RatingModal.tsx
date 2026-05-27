import { useState } from "react";
import type { TechniqueRating, Confidence } from "../data/techniques.ts";
import RatingScale from "./RatingScale.tsx";
import ConfidenceSelector from "./ConfidenceSelector.tsx";

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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
         if (e.target === e.currentTarget) onClose(); 
        }}
    >
      <div className="w-full max-w-md bg-surface-elevated border border-chrome rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-chrome">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-content-subtle mb-1">
                Rate Technique
              </p>
              <h2 className="text-xl font-bold text-content-primary leading-tight">{techniqueName}</h2>
            </div>
            <button
              onClick={onClose}
              className="mt-1 text-content-subtle hover:text-content-muted transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
 
        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          <RatingScale selected={selectedRating} onChange={setSelectedRating} />
          <ConfidenceSelector selected={selectedConfidence} onChange={setSelectedConfidence} />
        </div>
 
        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {currentRating && (
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-xl border border-chrome-strong text-content-muted hover:text-red-400 hover:border-red-700 text-sm font-semibold transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-150 ${
              canSave
                ? "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand-shadow"
                : "bg-surface-elevated text-content-faint cursor-not-allowed"
            }`}
          >
            Save Rating
          </button>
        </div>
      </div>
    </div>
  );
}
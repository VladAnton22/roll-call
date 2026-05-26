import { useState } from "react";
import type { TechniqueRating, Confidence } from "../data/techniques.ts";
import { RATING_LABELS, CONFIDENCE_LABELS } from "../data/techniques.ts";

interface RatingModalProps {
  techniqueName: string;
  currentRating?: TechniqueRating;
  onSave: (rating: 1 | 2 | 3 | 4 | 5, confidence: Confidence) => void;
  onClear: () => void;
  onClose: () => void;
}

// Idle (unselected) button styles per rating level
const RATING_IDLE: Record<number, string> = {
  1: "bg-rating-1 border-rating-1-border text-rating-1-text hover:bg-rating-1-hover",
  2: "bg-rating-2 border-rating-2-border text-rating-2-text hover:bg-rating-2-hover",
  3: "bg-rating-3 border-rating-3-border text-rating-3-text hover:bg-rating-3-hover",
  4: "bg-rating-4 border-rating-4-border text-rating-4-text hover:bg-rating-4-hover",
  5: "bg-rating-5 border-rating-5-border text-rating-5-text hover:bg-rating-5-hover",
};
 
// Selected button styles per rating level
const RATING_SELECTED: Record<number, string> = {
  1: "bg-rating-1-selected border-rating-1-selected-border text-white ring-2 ring-rating-1-selected-ring",
  2: "bg-rating-2-selected border-rating-2-selected-border text-white ring-2 ring-rating-2-selected-ring",
  3: "bg-rating-3-selected border-rating-3-selected-border text-white ring-2 ring-rating-3-selected-ring",
  4: "bg-rating-4-selected border-rating-4-selected-border text-white ring-2 ring-rating-4-selected-ring",
  5: "bg-rating-5-selected border-rating-5-selected-border text-white ring-2 ring-rating-5-selected-ring",
};
 
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
 
        <div className="px-6 py-5 space-y-6">
          {/* Rating 1–5 */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-3">
              Rating
            </p>
            <div className="space-y-2">
              {([1, 2, 3, 4, 5] as const).map((r) => {
                const isSelected = selectedRating === r;
                return (
                  <button
                    key={r}
                    onClick={() => setSelectedRating(r)}
                    className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                      isSelected ? RATING_SELECTED[r] : RATING_IDLE[r]
                    }`}
                  >
                    <span className="text-lg font-black leading-none mt-0.5 w-5 flex-shrink-0">{r}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm leading-none mb-1">{RATING_LABELS[r].level}</p>
                      <p className="text-xs opacity-75 leading-snug">{RATING_LABELS[r].description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
 
          {/* Confidence L/M/H */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-3">
              Confidence
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["L", "M", "H"] as const).map((c) => {
                const isSelected = selectedConfidence === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedConfidence(c)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all duration-150 ${
                      isSelected
                        ? "bg-brand border-brand-border text-white ring-2 ring-brand-border"
                        : "bg-surface-elevated border-chrome-strong text-content-muted hover:bg-surface-hover hover:text-content-secondary"
                    }`}
                  >
                    <span className="block text-xl font-black">{c}</span>
                    <span className="block text-xs font-normal opacity-75 mt-0.5">
                      {CONFIDENCE_LABELS[c]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
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
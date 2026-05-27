import type { Confidence } from "../data/techniques.ts";
import { CONFIDENCE_LABELS } from "../data/techniques.ts";

interface ConfidenceSelectorProps {
  selected: Confidence | null;
  onChange: (confidence: Confidence) => void;
}

export default function ConfidenceSelector({ selected, onChange }: ConfidenceSelectorProps) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-3">
        Confidence
      </p>
      <div className="grid grid-cols-3 gap-2">
        {(["L", "M", "H"] as const).map((c) => {
          const isSelected = selected === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
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
  );
}
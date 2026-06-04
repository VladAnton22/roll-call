import { RATING_LABELS } from "../../data/techniques.ts";

const RATING_IDLE: Record<number, string> = {
  1: "bg-rating-1 border-rating-1-border text-rating-1-text hover:bg-rating-1-hover",
  2: "bg-rating-2 border-rating-2-border text-rating-2-text hover:bg-rating-2-hover",
  3: "bg-rating-3 border-rating-3-border text-rating-3-text hover:bg-rating-3-hover",
  4: "bg-rating-4 border-rating-4-border text-rating-4-text hover:bg-rating-4-hover",
  5: "bg-rating-5 border-rating-5-border text-rating-5-text hover:bg-rating-5-hover",
};

const RATING_SELECTED: Record<number, string> = {
  1: "bg-rating-1-selected border-rating-1-selected-border text-white ring-2 ring-rating-1-selected-ring",
  2: "bg-rating-2-selected border-rating-2-selected-border text-white ring-2 ring-rating-2-selected-ring",
  3: "bg-rating-3-selected border-rating-3-selected-border text-white ring-2 ring-rating-3-selected-ring",
  4: "bg-rating-4-selected border-rating-4-selected-border text-white ring-2 ring-rating-4-selected-ring",
  5: "bg-rating-5-selected border-rating-5-selected-border text-white ring-2 ring-rating-5-selected-ring",
};

interface RatingScaleProps {
  selected: 1 | 2 | 3 | 4 | 5 | null;
  onChange: (rating: 1 | 2 | 3 | 4 | 5) => void;
}

export default function RatingScale({ selected, onChange }: RatingScaleProps) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-3">
        Rating
      </p>
      <div className="space-y-2">
        {([1, 2, 3, 4, 5] as const).map((r) => {
          const isSelected = selected === r;
          return (
            <button
              key={r}
              onClick={() => onChange(r)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                isSelected ? RATING_SELECTED[r] : RATING_IDLE[r]
              }`}
            >
              <span className="text-lg font-black leading-none mt-0.5 w-5 shrink-0">
                {r}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-none mb-1">
                  {RATING_LABELS[r].level}
                </p>
                <p className="text-xs opacity-75 leading-snug">
                  {RATING_LABELS[r].description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
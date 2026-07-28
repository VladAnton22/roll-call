import { RATING_LABELS } from "../../data/techniques.ts";
import getRatingColors from "../../data/ratingColors.ts";

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
          const colors = getRatingColors(r)
          const isSelected = selected === r;
          const ratingClasses = isSelected
            ? `${colors.bgSelected} ${colors.borderSelected} ring-2 ${colors.ring} ${
                r === 1 ? colors.text : "text-white"
              }`
            : `${colors.bg} ${colors.border} ${colors.text} ${colors.bgHover}`;
          return (
            <button
              key={r}
              onClick={() => onChange(r)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${ratingClasses}`}
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
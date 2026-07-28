import type { Technique, TechniqueRating } from "../../data/techniques.ts";
import ScoreBadge from "./ScoreBadge.tsx";

interface TechniqueRowProps {
  technique: Technique;
  rating?: TechniqueRating;
  onClick: (techniqueId: string, techniqueName: string) => void;
}

export default function TechniqueRow({ technique, rating, onClick }: TechniqueRowProps) {
  return (
    <button
      onClick={() => onClick(technique.id, technique.name)}
      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors text-left group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
            rating ? "bg-brand-text" : "bg-chrome group-hover:bg-chrome-strong"
          }`}
        />
        <span
          className={`text-sm font-medium truncate transition-colors ${
            rating
              ? "text-content-secondary"
              : "text-content-muted group-hover:text-content-secondary"
          }`}
        >
          {technique.name}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {rating ? (
          <ScoreBadge rating={rating} size="sm" />
        ) : (
          <span className="text-xs text-content-faint group-hover:text-content-subtle transition-colors">
            Rate
          </span>
        )}
      </div>
    </button>
  );
}
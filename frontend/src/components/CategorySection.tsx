import { useState } from "react";
import type { TechniqueCategory, TechniqueRating } from "../data/techniques.ts";
import ScoreBadge from "./ScoreBadge.tsx";

interface CategorySectionProps {
  category: TechniqueCategory;
  ratings: Record<string, TechniqueRating>;
  onTechniqueClick: (techniqueId: string, techniqueName: string) => void;
}

export default function CategorySection({
  category,
  ratings,
  onTechniqueClick,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const ratedInCategory = category.techniques.filter((t) => ratings[t.id]).length;
  const totalInCategory = category.techniques.length;

  // Compute average rating for the category header bar
  const ratedTechniques = category.techniques.filter((t) => ratings[t.id]);
  const avgRating =
    ratedTechniques.length > 0
      ? ratedTechniques.reduce((sum, t) => sum + (ratings[t.id]?.rating ?? 0), 0) /
        ratedTechniques.length
      : null;

  const progressPercent = (ratedInCategory / totalInCategory) * 100;

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card overflow-hidden">
      {/* Category header */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors text-left gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            className={`w-4 h-4 text-content-subtle flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-bold text-content-primary text-base truncate">{category.name}</span>
        </div>
 
        <div className="flex items-center gap-3 flex-shrink-0">
          {avgRating !== null && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs text-content-subtle">avg</span>
              <span className="text-sm font-bold text-content-secondary">{avgRating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-xs text-content-subtle tabular-nums">
            {ratedInCategory}/{totalInCategory}
          </span>
          <div className="w-16 h-1.5 bg-chrome rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-subtle rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </button>
 
      {/* Technique rows */}
      {isOpen && (
        <div className="border-t border-chrome divide-y divide-chrome/60">
          {category.techniques.map((technique) => {
            const rating = ratings[technique.id];
            return (
              <button
                key={technique.id}
                onClick={() => onTechniqueClick(technique.id, technique.name)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                      rating ? "bg-brand-text" : "bg-chrome group-hover:bg-chrome-strong"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium truncate transition-colors ${
                      rating ? "text-content-secondary" : "text-content-muted group-hover:text-content-secondary"
                    }`}
                  >
                    {technique.name}
                  </span>
                </div>
 
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  {rating ? (
                    <ScoreBadge rating={rating} size="sm" />
                  ) : (
                    <span className="text-xs text-content-faint group-hover:text-content-subtle transition-colors">
                      Rate →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
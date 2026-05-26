import type { TechniqueRating } from "../data/techniques.ts";

interface ScoreBadgeProps {
  rating: TechniqueRating;
  size?: "sm" | "md";
}

const BADGE_COLORS: Record<number, string> = {
  1: "bg-rating-1 text-rating-1-text border-rating-1-border",
  2: "bg-rating-2 text-rating-2-text border-rating-2-border",
  3: "bg-rating-3 text-rating-3-text border-rating-3-border",
  4: "bg-rating-4 text-rating-4-text border-rating-4-border",
  5: "bg-rating-5 text-rating-5-text border-rating-5-border",
};
 
export default function ScoreBadge({ rating, size = "md" }: ScoreBadgeProps) {
  const { rating: r, confidence: c } = rating;
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
 
  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border tabular-nums ${BADGE_COLORS[r]} ${sizeClass}`}
      title={`Rating: ${r}, Confidence: ${c}`}
    >
      {r}{c}
    </span>
  );
}
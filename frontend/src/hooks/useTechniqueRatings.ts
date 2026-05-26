import { useState, useCallback } from "react";
import type { TechniqueRating, Confidence } from "../data/techniques";

export type RatingsMap = Record<string, TechniqueRating>;

export function useTechniqueRatings() {
  const [ratings, setRatings] = useState<RatingsMap>({});

  const setRating = useCallback(
    (techniqueId: string, rating: 1 | 2 | 3 | 4 | 5, confidence: Confidence) => {
      setRatings((prev) => ({
        ...prev,
        [techniqueId]: { rating, confidence },
      }));
    },
    []
  );

  const clearRating = useCallback((techniqueId: string) => {
    setRatings((prev) => {
      const next = { ...prev };
      delete next[techniqueId];
      return next;
    });
  }, []);

  const getRating = useCallback(
    (techniqueId: string): TechniqueRating | undefined => ratings[techniqueId],
    [ratings]
  );

  const ratedCount = Object.keys(ratings).length;

  return { ratings, setRating, clearRating, getRating, ratedCount };
}
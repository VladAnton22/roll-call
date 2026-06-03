import { useCallback } from "react";
import type { TechniqueRating, Confidence } from "../data/techniques";
import useLocalStorage from "./useLocalStorage";

export type RatingsMap = Record<string, TechniqueRating>;

export function useTechniqueRatings() {
  const [ratings, setRatings] = useLocalStorage<RatingsMap>("ratings", {});

  const setRating = useCallback(
    (techniqueId: string, rating: 1 | 2 | 3 | 4 | 5, confidence: Confidence) => {
      setRatings((prev) => ({
        ...prev,
        [techniqueId]: { rating, confidence },
      }));
    },
    [setRatings]
  );

  const clearRating = useCallback((techniqueId: string) => {
    setRatings((prev) => {
      const next = { ...prev };
      delete next[techniqueId];
      return next;
    });
  }, [setRatings]);

  const getRating = useCallback(
    (techniqueId: string): TechniqueRating | undefined => ratings[techniqueId],
    [ratings]
  );

  const ratedCount = Object.keys(ratings).length;

  return { ratings, setRating, clearRating, getRating, ratedCount };
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "../lib/api";
import type { Confidence, TechniqueRating } from "../data/techniques";

export type RatingsMap = Record<string, TechniqueRating>;

// Shape returned by GET /ratings and PUT /ratings/{id}
interface RatingDTO {
  technique_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  confidence: Confidence;
  created_at: string;
  updated_at: string;
}

type RatingsContextValue = {
  ratings: RatingsMap;
  isLoading: boolean;
  error: string | null;
  setRating: (
    techniqueId: string,
    rating: 1 | 2 | 3 | 4 | 5,
    confidence: Confidence,
  ) => void;
  clearRating: (techniqueId: string) => void;
  getRating: (techniqueId: string) => TechniqueRating | undefined;
  ratedCount: number;
};

const RatingsContext = createContext<RatingsContextValue | null>(null)

function toRatingsMap(dtos: RatingDTO[]): RatingsMap {
  const map: RatingsMap = {};
  for (const dto of dtos) {
    map[dto.technique_id] = { rating: dto.rating, confidence: dto.confidence };
  }
  return map;
}

export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<RatingsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // A live ref so the optimistic rollback logic can read the value at call time without stale closures and without re-creating the callbacks on every edit.
  const ratingsRef = useRef(ratings);
  useEffect(() => {
    ratingsRef.current = ratings;
  }, [ratings]);

  // This provider only mounts inside the authenticated shell, so fetching on mount is safe — there's always a session here.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .get<RatingDTO[]>("/ratings")
      .then((dtos => {
        if (!cancelled) {
          setRatings(toRatingsMap(dtos));
          setError(null);
        }
      }))
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load ratings",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    }
  }, [])

  const setRating = useCallback(
    (techniqueId: string, rating: 1 | 2 | 3 | 4 | 5, confidence: Confidence) => {
      const previous = ratingsRef.current[techniqueId];
      // reflect change instantly, reconcile with server after
      setRatings((prev) => ({ ...prev, [techniqueId]: { rating, confidence } }));

      api.put(`/ratings/${techniqueId}`, { rating, confidence }).catch((err) => {
        // roll back to previous value
        setRatings((prev) => {
          const next = { ...prev };
          if (previous) next[techniqueId] = previous;
          else delete next[techniqueId];
          return next;
        });
        setError(
          err instanceof ApiError ? err.message : "Failed to save rating",
        );
      });
    },
    [],
  );

  const clearRating = useCallback((techniqueId: string) => {
    const previous = ratingsRef.current[techniqueId];
    if (!previous) return;
    // remove on clientside first
    setRatings((prev) => {
      const next = { ...prev };
      delete next[techniqueId];
      return next;
    });

    api.del(`/ratings/${techniqueId}`).catch((err) => {
      // restore clientside on failure
      setRatings((prev) => ({ ...prev, [techniqueId]: previous }));
      setError(
        err instanceof ApiError ? err.message : "Failed to remove rating",
      );
    });
  }, []);

  const getRating = useCallback(
    (techniqueId: string): TechniqueRating | undefined => ratings[techniqueId],
    [ratings],
  );

  const ratedCount = Object.keys(ratings).length;

  const value = useMemo(
    () => ({
      ratings,
      isLoading,
      error,
      setRating,
      clearRating,
      getRating,
      ratedCount,
    }),
    [ratings, isLoading, error, setRating, clearRating, getRating, ratedCount],
  );

  return (
    <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>
  );
}

export function useTechniqueRatings() {
  const ctx = useContext(RatingsContext);
  if (!ctx) {
    throw new Error("useTechniqueRatings must be used within a RatingsProvider");
  }
  return ctx;
}
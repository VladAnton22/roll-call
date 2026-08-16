// The ratings state now lives in a provider so the Library and Progress pages
// share one source of truth. This re-export keeps existing import paths working.
export {
  useTechniqueRatings,
  RatingsProvider,
  type RatingsMap,
} from "../context/RatingsContext";
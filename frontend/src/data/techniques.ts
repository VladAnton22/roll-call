export type Confidence = "L" | "M" | "H";
 
export interface TechniqueRating {
  rating: 1 | 2 | 3 | 4 | 5;
  confidence: Confidence;
}
 
export interface Technique {
  id: string;
  name: string;
  subcategory?: string;
}
 
export interface TechniqueCategory {
  id: string;
  name: string;
  techniques: Technique[];
}
 
// Simplified starter set — enough to feel real, easy to extend
export const TECHNIQUE_CATEGORIES: TechniqueCategory[] = [
  {
    id: "standing",
    name: "Standing",
    techniques: [
      { id: "grip-fighting", name: "Grip Fighting" },
      { id: "balance-posture", name: "Balance & Posture" },
      { id: "takedown-entries", name: "Takedown Entries" },
      { id: "double-leg", name: "Double Leg" },
      { id: "single-leg", name: "Single Leg" },
      { id: "sprawl", name: "Sprawl" },
    ],
  },
  {
    id: "top-positions",
    name: "Top Positions",
    techniques: [
      { id: "closed-guard-top", name: "Closed Guard (Top)" },
      { id: "half-guard-top", name: "Half Guard (Top)" },
      { id: "side-control", name: "Side Control" },
      { id: "mount", name: "Mount" },
      { id: "back-control", name: "Back Control" },
    ],
  },
  {
    id: "bottom-positions",
    name: "Bottom Positions",
    techniques: [
      { id: "closed-guard-bottom", name: "Closed Guard (Bottom)" },
      { id: "open-guard", name: "Open Guard" },
      { id: "half-guard-bottom", name: "Half Guard (Bottom)" },
      { id: "butterfly-guard", name: "Butterfly Guard" },
      { id: "dlr", name: "De La Riva" },
    ],
  },
  {
    id: "escapes",
    name: "Escapes",
    techniques: [
      { id: "mount-escape", name: "Mount Escape" },
      { id: "side-control-escape", name: "Side Control Escape" },
      { id: "back-escape", name: "Back Escape" },
      { id: "turtle-defence", name: "Turtle Defence" },
    ],
  },
  {
    id: "submissions",
    name: "Submissions",
    techniques: [
      { id: "armbar-guard", name: "Armbar (Guard)" },
      { id: "armbar-mount", name: "Armbar (Mount)" },
      { id: "triangle", name: "Triangle" },
      { id: "kimura", name: "Kimura" },
      { id: "americana", name: "Americana" },
      { id: "guillotine", name: "Guillotine" },
      { id: "rear-naked-choke", name: "Rear Naked Choke" },
      { id: "cross-collar-choke", name: "Cross Collar Choke" },
    ],
  },
  {
    id: "passing",
    name: "Passing",
    techniques: [
      { id: "knee-cut", name: "Knee Cut Pass" },
      { id: "torreando", name: "Torreando Pass" },
      { id: "smash-pass", name: "Smash Pass" },
    ],
  },
  {
    id: "sweeps",
    name: "Sweeps",
    techniques: [
      { id: "scissor-sweep", name: "Scissor Sweep" },
      { id: "pendulum-sweep", name: "Pendulum Sweep" },
      { id: "hip-bump-sweep", name: "Hip Bump Sweep" },
      { id: "butterfly-sweep", name: "Butterfly Sweep" },
      { id: "tripod-sweep", name: "Tripod Sweep (DLR)" },
    ],
  },
  {
    id: "concepts",
    name: "Concepts",
    techniques: [
      { id: "frames", name: "Frames" },
      { id: "underhooks", name: "Underhooks" },
      { id: "base-balance", name: "Base & Balance" },
      { id: "pressure", name: "Pressure" },
      { id: "kuzushi", name: "Kuzushi (Off Balancing)" },
      { id: "timing", name: "Timing" },
    ],
  },
];
 
export const RATING_LABELS: Record<number, { level: string; description: string }> = {
  1: { level: "No understanding", description: "Don't recognise the move. Couldn't attempt it live." },
  2: { level: "Basic knowledge", description: "Understand mechanics. Can drill it, can't hit it in sparring." },
  3: { level: "Developing", description: "Can hit it occasionally. Works on lower belts or ideal situations." },
  4: { level: "Reliable", description: "Consistently use it in sparring. Works at similar level." },
  5: { level: "A-Game", description: "Go-to move. Works under pressure, on higher belts, can chain it." },
};
 
export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  L: "Low",
  M: "Medium",
  H: "High",
};
 
export function computeScoreLabel(rating: number, confidence: Confidence): string {
  return `${rating}${confidence}`;
}
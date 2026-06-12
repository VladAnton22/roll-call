export interface RatingColorSet {
    bg: string;
    border: string;
    text: string;
    bgHover: string;
    bgSelected: string;
    borderSelected: string;
    ring: string;
}

const RATING_COLORS: Record<number, RatingColorSet> = {
    1: {
        bg: "bg-rating-1",
        border: "border-rating-1-border",
        text: "text-rating-1-text",
        bgHover: "hover:bg-rating-1-hover",
        bgSelected: "bg-rating-1-selected",
        borderSelected: "border-rating-1-selected-border",
        ring: "ring-rating-1-selected-ring",
    },
    2: {
        bg: "bg-rating-2",
        border: "border-rating-2-border",
        text: "text-rating-2-text",
        bgHover: "hover:bg-rating-2-hover",
        bgSelected: "bg-rating-2-selected",
        borderSelected: "border-rating-2-selected-border",
        ring: "ring-rating-2-selected-ring",
    },
    3: {
        bg: "bg-rating-3",
        border: "border-rating-3-border",
        text: "text-rating-3-text",
        bgHover: "hover:bg-rating-3-hover",
        bgSelected: "bg-rating-3-selected",
        borderSelected: "border-rating-3-selected-border",
        ring: "ring-rating-3-selected-ring",
    },
    4: {
        bg: "bg-rating-4",
        border: "border-rating-4-border",
        text: "text-rating-4-text",
        bgHover: "hover:bg-rating-4-hover",
        bgSelected: "bg-rating-4-selected",
        borderSelected: "border-rating-4-selected-border",
        ring: "ring-rating-4-selected-ring",
    },
    5: {
        bg: "bg-rating-5",
        border: "border-rating-5-border",
        text: "text-rating-5-text",
        bgHover: "hover:bg-rating-5-hover",
        bgSelected: "bg-rating-5-selected",
        borderSelected: "border-rating-5-selected-border",
        ring: "ring-rating-5-selected-ring",
    },
};

export default function getRatingColors(rating: number): RatingColorSet {
    return RATING_COLORS[Math.round(Math.max(1, Math.min(5, rating)))];
}
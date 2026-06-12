import { useTechniqueRatings } from "../../hooks/useTechniqueRatings";
import CategoryRadarChart from "./CategoryRadarChart";
import WeakestCategories from "./WeakestCategories";
import ProgressSummary from "./ProgressSummary";

export default function ProgressPage() {
    const { ratings } = useTechniqueRatings();
    return (
            <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-3">
                <div className="mb-6">
                    <h1 className="text-2xl font-black tracking-tight text-content-primary mb-1">Your Progress</h1>
                </div>
                <ProgressSummary ratings={ratings}></ProgressSummary>
                <CategoryRadarChart ratings={ratings}></CategoryRadarChart>
                <WeakestCategories ratings={ratings}></WeakestCategories>
            </main>
    )
}
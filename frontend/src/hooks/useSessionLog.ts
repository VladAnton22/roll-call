import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

export type SessionType = "gi" | "no-gi";

export interface Session {
    id: string;
    date: string; // ISO date string YYYY-MM-DD
    type: SessionType;
    durationMins: number;
    notes: string;
    createdAt: string; // ISO timestamp
}

export function useSessionLog() {
    const [sessions, setSessions] = useLocalStorage<Session[]>("sessions", []);

    const addSession = useCallback(
        (data: Omit<Session, "id" | "createdAt">) => {
            const session: Session = {
                ...data,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
            };
            setSessions((prev) => [session, ...prev]);
        },
        [setSessions],
    );

    const updateSession = useCallback(
        (id: string, data: Omit<Session, "id" | "createdAt">) => {
            setSessions((prev) =>
                prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
            );
        },
        [setSessions],
    );

    const deleteSession = useCallback(
        (id: string) => {
            setSessions((prev) => prev.filter((s) => s.id !== id));
        },
        [setSessions],
    );

    const sorted = [...sessions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const sessionsThisWeek = sorted.filter((s) => {
        const now = new Date();
        const daysSinceMonday = (now.getDay() + 6) % 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - daysSinceMonday);
        monday.setHours(0, 0, 0, 0);
        return new Date(s.date + "T00:00:00") >= monday;
    }).length;

    return { sessions: sorted, sessionsThisWeek, addSession, updateSession, deleteSession };
}

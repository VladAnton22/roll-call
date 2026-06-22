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

    return { sessions: sorted, addSession, updateSession, deleteSession };
}

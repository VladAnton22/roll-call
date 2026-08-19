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

export type SessionType = "gi" | "no-gi";

export interface Session {
  id: string;
  date: string;
  type: SessionType;
  durationMins: number;
  notes: string;
  techniqueIds: string[];
  createdAt: string;  // ISO timestamp
}

// What the form submits
export type SessionInput = Omit<Session, "id" | "createdAt">;

// Shape returned by GET /sessions and POST/PUT /sessions/{id}
interface SessionDTO {
  id: string;
  date: string;
  type: SessionType;
  duration_mins: number;
  notes: string;
  technique_ids: string[];
  created_at: string;
}

type SessionsContextValue = {
  sessions: Session[];
  sessionsThisWeek: number;
  minutesThisWeek: number;
  isLoading: boolean;
  error: string | null;
  addSession: (data: SessionInput) => void;
  updateSession: (id: string, data: SessionInput) => void;
  deleteSession: (id: string) => void;
};

const SessionsContext = createContext<SessionsContextValue | null>(null);

function toSession(dto: SessionDTO): Session {
  return {
    id: dto.id,
    date: dto.date,
    type: dto.type,
    durationMins: dto.duration_mins,
    notes: dto.notes,
    techniqueIds: dto.technique_ids,
    createdAt: dto.created_at,
  };
}

// camelCase form data -> snake_case body the API expects
function toRequestBody(data: SessionInput) {
  return {
    date: data.date,
    type: data.type,
    duration_mins: data.durationMins,
    notes: data.notes,
    technique_ids: data.techniqueIds
  }
}

function startOfWeek(): Date {
  const now = new Date();
  const daysSinceMonday = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function byCreatedAtDesc(a: Session, b: Session) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live ref so optimistic rollback reads value at call time
  const sessionsRef = useRef(sessions);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  // fetch on mount (safe because it only mounts inside the authenticated shell)
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .get<SessionDTO[]>("/sessions")
      .then((dtos) => {
        if (!cancelled) {
          setSessions(dtos.map(toSession));
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Failed to load sessions",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    }
  }, []);

  const addSession = useCallback((data: SessionInput) => {
    setError(null);
    api
      .post<SessionDTO>("/sessions", toRequestBody(data))
      .then((dto) => setSessions((prev) => [toSession(dto), ...prev]))
      .catch((err) => {
        setError(
          err instanceof ApiError ? err.message: "Failed to save session",
        );
      });
  }, []);

  const updateSession = useCallback((id: string, data: SessionInput)=> {
    const previous = sessionsRef.current.find((s) => s.id === id);
    if (!previous) return;

    setError(null);
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data }: s)),
    );

    api.put<SessionDTO>(`/sessions/${id}`, toRequestBody(data)).catch((err) => {
      // roll back to the pre-edit snapshot
      setSessions((prev) => prev.map((s) => (s.id === id ? previous : s)));
      setError(
        err instanceof ApiError ? err.message : "Failed to save session",
      )
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    const previous = sessionsRef.current;
    if (!previous.some((s) => s.id === id)) return;

    // Drop it on frontend immediately, restore the list on failure
    setError(null);
    setSessions((prev) => prev.filter((s) => s.id !== id));

    api.del(`/sessions/${id}`).catch((err) => {
      setSessions(previous);
      setError(
        err instanceof ApiError ? err.message : "Failed to delete session",
      );
    });
  }, []);

  const sorted = useMemo(() => [...sessions].sort(byCreatedAtDesc), [sessions]);

  const { sessionsThisWeek, minutesThisWeek } = useMemo(() => {
    const monday = startOfWeek();
    const thisWeek = sorted.filter(
      (s) => new Date(s.date + "T00:00:00") >= monday,
    );
    return {
      sessionsThisWeek: thisWeek.length,
      minutesThisWeek: thisWeek.reduce((sum, s) => sum + s.durationMins, 0),
    };
  }, [sorted]);

  const value = useMemo(
    () => ({
      sessions: sorted,
      sessionsThisWeek,
      minutesThisWeek,
      isLoading,
      error,
      addSession,
      updateSession,
      deleteSession,
    }),
    [
      sorted,
      sessionsThisWeek,
      minutesThisWeek,
      isLoading,
      error,
      addSession,
      updateSession,
      deleteSession,
    ],
    );

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessionLog() {
  const ctx = useContext(SessionsContext);
  if (!ctx) {
    throw new Error("useSessionLog must be used within a SessionsProvider");
  }
  return ctx;
}
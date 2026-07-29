import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export function RequireAuth() {
    const { status } = useAuth();
    console.log("guard sees:", status);

    if (status === "loading") return null;
    if (status === "anonymous") return <Navigate to="/login" replace />;
    return <Outlet />
}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RedirectIfAuthenticated() {
  const { status } = useAuth();

  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to="/" replace />;

  return <Outlet />;
}
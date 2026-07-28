import { Outlet } from "react-router";
import AppHeader from "./AppHeader.tsx";
import BottomNav from "./BottomNav.tsx";

export default function Layout() {
    return (
        <div className="min-h-screen bg-surface-base text-content-primary">
            <AppHeader />
            <Outlet />
            <BottomNav />
        </div>
    );
}
import './index.css';
import TechniqueLibrary from './pages/library/TechniqueLibrary.tsx';
import ProgressPage from './pages/progress/ProgressPage.tsx';
import SessionsPage from './pages/sessions/SessionsPage.tsx';
import Layout from './layout/Layout.tsx'
import { Routes, Route } from 'react-router';
import {Login} from "./pages/login/Login.tsx";
import {RequireAuth} from "./components/RequireAuth.tsx";

function App() {
    return (
        <>
            <Routes>
                {/* Public - outise guard and shell */}
                <Route path="/login" element={<Login />} />
                {/* Protected - guard first, then the shell, then pages */}
                <Route element={<RequireAuth />}>
                    <Route element={<Layout />}>
                        <Route index element={<TechniqueLibrary />} />
                        <Route path="progress" element={<ProgressPage />}/>
                        <Route path="sessions" element={<SessionsPage />}/>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App

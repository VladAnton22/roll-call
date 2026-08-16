import './index.css';
import TechniqueLibrary from './pages/library/TechniqueLibrary.tsx';
import ProgressPage from './pages/progress/ProgressPage.tsx';
import SessionsPage from './pages/sessions/SessionsPage.tsx';
import Layout from './layout/Layout.tsx'
import { Routes, Route } from 'react-router';
import { Login } from "./pages/login/Login.tsx";
import { Register } from "./pages/register/Register.tsx"
import {RequireAuth} from "./components/RequireAuth.tsx";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated.tsx";
import { RatingsProvider } from "./context/RatingsContext.tsx";

function App() {
    return (
        <>
            <Routes>
                <Route element={<RedirectIfAuthenticated />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                {/* Protected - guard first, then the shell, then pages */}
                <Route element={<RequireAuth />}>
                  <Route element={<RatingsProvider><Layout /></RatingsProvider>}>
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

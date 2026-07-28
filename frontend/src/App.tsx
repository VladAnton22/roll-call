import './index.css';
import TechniqueLibrary from './pages/library/TechniqueLibrary.tsx';
import ProgressPage from './pages/progress/ProgressPage.tsx';
import SessionsPage from './pages/sessions/SessionsPage.tsx';
import Layout from './layout/Layout.tsx'
import { Routes, Route } from 'react-router';
import {AuthProvider} from "./context/AuthContext.tsx";
import {Login} from "./pages/login/Login.tsx";

function App() {
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route index element={<TechniqueLibrary />} />
                        <Route path="progress" element={<ProgressPage />}/>
                        <Route path="sessions" element={<SessionsPage />}/>
                    </Route>
                </Routes>
            </AuthProvider>
        </>
    )
}

export default App

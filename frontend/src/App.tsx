import './index.css';
import TechniqueLibrary from './components/library/TechniqueLibrary.tsx';
import ProgressPage from './components/progress/ProgressPage.tsx';
import Layout from './components/layout/Layout.tsx'
import { Routes, Route } from 'react-router'

function App() {
    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<TechniqueLibrary />} />
                    <Route path="progress" element={<ProgressPage />}/>
                </Route>
            </Routes>
        </>
    )
}

export default App

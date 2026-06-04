import './index.css';
import TechniqueLibrary from './components/library/TechniqueLibrary';
import ProgressVisualiser from './components/progress/ProgressPage';
import { Routes, Route } from 'react-router'

function App() {
    return (
        <>
            <Routes>
                <Route index element={<TechniqueLibrary />} />
                <Route path="progress-visualiser" element={<ProgressVisualiser />}/>
            </Routes>
        </>
    )
}

export default App

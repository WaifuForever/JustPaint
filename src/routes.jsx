import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DrawScreen from './pages/DrawScreen';

const Paths = () => {
    return (
        <div className="h-screen w-screen">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/draw" element={<DrawScreen />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default Paths;

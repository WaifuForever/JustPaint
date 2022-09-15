import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import DrawScreen from './pages/DrawScreen';

const Paths = () => {
    return (
        <div className="flex flex-row h-screen w-screen">
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/draw" element={<DrawScreen />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default Paths;

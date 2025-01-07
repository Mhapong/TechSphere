import { Link, Navigate, BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';

export default Route(
    <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={<Home />}
            />
        </Routes>
    </BrowserRouter>
);
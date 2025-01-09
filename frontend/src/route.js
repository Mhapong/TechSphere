import { Link, Navigate, BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/client/Home';
import Login from './pages/client/Login';
import SignUp from './pages/client/SignUp';


export default Route(
    <BrowserRouter>
        <Routes>
            <Route
                path="/Home"
                element={<Home />}
            />
            <Route
                path="/Login"
                element={<Login />}
            />
            <Route
                path="/SignUp"
                element={<SignUp />}
            />
        </Routes>
    </BrowserRouter>
);
import './App.css';
import { Link, Navigate, BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './client/pages/Home';
import Login from './client/pages/Login';
import SignUp from './client/pages/SignUp';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/sign-in"
          element={<Login />}
        />
        <Route
          path="/sign-up"
          element={<SignUp />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

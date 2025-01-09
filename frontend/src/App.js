import './App.css';
import { Link, Navigate, BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './client/pages/Home';
import Login from './client/pages/Login';
import SignUp from './client/pages/SignUp';


function App() {
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
};

export default App;

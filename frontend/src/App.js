import {
  Link,
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/Auth.context";

import Home from "./client/pages/Home";
import Login from "./client/pages/Login";
import SignUp from "./client/pages/SignUp";
import View from "./admin/pages/view";
import Cart from "./client/pages/Cart";
import { Navbar } from "@material-tailwind/react";
import Nav from "./client/components/navbar";
import NavAdmin from "./admin/components/navbar-admin";

function App() {
  const { state } = useContext(AuthContext);
  console.log(state.user);

  if (!state.isLoggedIn)
    return (
      <>
        <Nav />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  else {
    console.log(state.user.userRole);
    const userRole = state.user?.userRole;
    if (userRole === "User") {
      return (
        <>
          <Nav />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />

            </Routes>
          </BrowserRouter>
        </>
      );
    } else if (userRole === "Lecturer") {
      return (
        <>
          <Nav />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </>
      );
    } else if (userRole === "Admin") {
      return (
        <>
          <NavAdmin />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Home />} />
              <Route path="/view" element={<Home />} />
              <Route path="/lecturer" element={<Home />} />
              <Route path="/student" element={<Home />} />
              <Route path="/finance" element={<Home />} />
              <Route path="/user" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </>
      );
    }
  }
}
export default App;

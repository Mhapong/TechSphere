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
import Mycourse from "./client/pages/MyCourse";
import Profile from "./admin/pages/profile";
import EditProfile from "./admin/pages/edit-profile";
import AddCourse from "./admin/pages/addcourse";
import ContentStudy from "./client/pages/ContentStudy.js" 
import AddTopic from "./admin/pages/CreateTopic";
import CourseDetails from "./admin/pages/CreateSummarize";
import LecturerAll from "./admin/pages/Lecturer";

function App() {
  const { state } = useContext(AuthContext);
  console.log(state.user);

  const userRole = state.user?.userRole;

  return (
    <BrowserRouter>
      {state.isLoggedIn ? (
        userRole === "User" ? (
          <>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-course" element={<Mycourse />} /> 
            </Routes>
          </>
        ) : userRole === "Lecturer" ? (
          <>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </>
        ) : userRole === "Admin" ? (
          <>
            <NavAdmin />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-course" element={<AddCourse />} />
              <Route path="/lecturer" element={<LecturerAll />} />
            </Routes>
          </>
        ) : null
      ) : (
        <>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/my-course" element={<Mycourse />} />
            {/* testing in plublic role */}
            <Route path="/contentstudy" element={<ContentStudy />} /> 
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;

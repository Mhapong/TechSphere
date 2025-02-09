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
import AddCourse from "./admin/pages/CreateCourse";
import BuyCourse from "./client/pages/buyCourse";
import ContentStudy from "./client/pages/ContentStudy.js";
import AddTopic from "./admin/pages/CreateTopic";
import CourseDetails from "./admin/pages/CreateSummarize";
import LecturerAll from "./admin/pages/Lecturer";
import Explore from "./client/pages/explore.js";
import StudentTable from "./admin/pages/student";
import HomeAdmin from "./admin/pages/home-admin";

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
              <Route path="/explore" element={<Explore />} />
              <Route path="/my-course" element={<Mycourse />} />
              <Route path="/contentstudy" element={<ContentStudy />} />
              <Route
                path="/view-product/:name/:documenId"
                element={<BuyCourse />}
              />
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
              <Route path="/" element={<HomeAdmin />} />
              <Route path="/create-course" element={<AddCourse />} />
              <Route
                path="/create-topic/:courseid/:coursename"
                element={<AddTopic />}
              />
              <Route
                path="/create-summarize/:courseid"
                element={<CourseDetails />}
              />
              <Route path="/view" element={<Home />} />
              <Route path="/lecturer" element={<LecturerAll />} />
              <Route path="/student" element={<StudentTable />} />
              <Route path="/finance" element={<Home />} />
              <Route path="/user" element={<Profile />} />
              <Route path="/edit-profile/:userid" element={<EditProfile />} />
              <Route path="/sign-up" element={<SignUp />} />
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
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/view-product/:name/:documenId"
              element={<BuyCourse />}
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;

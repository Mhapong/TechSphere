import {
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

function App() {
  const { state } = useContext(AuthContext);

  if (!state.isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
    );
  } else {
    const userRole = state.user?.userRole;
    if (userRole === "Student") {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/topic/:subject_title/:username/:subject"
              element={<TopicStudent />}
            />
            <Route path="/user" element={<UserPage />} />
            <Route path="/contact" element={<ContactLecturer />} />
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
              <Route path="/explore" element={<Explore />} />
              <Route path="/my-course" element={<Mycourse />} />
              <Route path="/contentstudy" element={<ContentStudy />} />
              <Route
                path="/view-product/:name/:documenId"
                element={<BuyCourse />}
              />
            </Routes>
          </BrowserRouter>
        </>
      );
    } else if (userRole === "Lecturer") {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/topic/:subject_title/:username/:subject/:documentId"
              element={<TopicLecturer />}
            />
            <Route
              path="/topic/detail/:topic_title/:subject/:max_score/:id/:documentId"
              element={<DetailTopicLecturer />}
            />
            <Route path="/topic/create/:subject" element={<CreateTopic />} />
            <Route
              path="/topic/addscore/:subject"
              element={<AddScoreTopic />}
            />
            <Route
              path="/subject/addstudent/:id/:subject"
              element={<AddStudent />}
            />
            <Route
              path="/subject/student-all/:id/:subject"
              element={<StudentListPage />}
            />
            <Route
              path="/subject/student/:id/:subject"
              element={<AddIDStudent />}
            />
            <Route
              path="/subject/edit/:subject"
              element={<EditSubjectInfo />}
            />
            <Route path="/subject/create" element={<CreateSubject />} />
            <Route path="/" element={<HomeLecturer />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/excelfetch" element={<ExcelFetch />} />
          </Routes>
        </BrowserRouter>
      );
    }
  }
}

export default App;

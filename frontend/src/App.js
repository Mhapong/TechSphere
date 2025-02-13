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
import Cart from "./client/pages/Cart";
import Nav from "./client/components/navbar";
import NavAdmin from "./admin/components/navbar-admin";
import Mycourse from "./client/pages/MyCourse";
import Profile from "./admin/pages/profile";
import EditProfile from "./admin/pages/edit-profile";
import ContentStudy from "./client/pages/ContentStudy.js";
import AddTopic from "./admin/pages/CreateTopic";
import CourseDetails from "./admin/pages/CreateSummarize";
import LecturerAll from "./admin/pages/Lecturer";
import Explore from "./client/pages/explore.js";
import StudentTable from "./admin/pages/student";
import HomeAdmin from "./admin/pages/home-admin";
import ViewCourse from "./client/pages/viewCourse.js";
import AddCourse from "./admin/pages/CreateCourse";
import About from "./client/pages/About.js";
import Test from "./client/pages/test.js";
import Footer from "./client/components/footer.js";
import PageNotFound from "./client/pages/Error.js";
import BuyProduct from "./client/pages/buyProduct.js";

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
              <Route
                path="/contentstudy/:documentId"
                element={<ContentStudy />}
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/view-product/:name/:documenId"
                element={<ViewCourse />}
              />
              <Route path="/test" element={<Test />} />
              <Route path="/purchease" element={<BuyProduct />} />
              <Route element={<PageNotFound />} />
            </Routes>
            <Footer />
          </>
        ) : userRole === "Lecturer" ? (
          <>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<PageNotFound />} />
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
              <Route path="/" element={<Home />} />
              <Route path="/lecturer" element={<LecturerAll />} />
              <Route path="/student" element={<StudentTable />} />
              <Route path="/finance" element={<Home />} />
              <Route path="/user" element={<Profile />} />
              <Route path="/edit-profile/:userid" element={<EditProfile />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<PageNotFound />} />
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
              element={<ViewCourse />}
            />
            <Route path="/about" element={<About />} />
            {/* testing in plublic role */}
            <Route path="/contentstudy" element={<ContentStudy />} />
            <Route path="/my-course" element={<Mycourse />} />

            <Route element={<PageNotFound />} />
          </Routes>
          <Footer />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;

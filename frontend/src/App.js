import {
  Link,
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import React, { useContext, useState } from "react";
import { AuthContext } from "./context/Auth.context";
import ForumIcon from "@mui/icons-material/Forum";
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
import { CourseView } from "./admin/pages/Course.js";
import FinanceOrder from "./admin/pages/Finance.js";
import CourseStudentTable from "./admin/pages/CourseViewStudent.js";
import PaymentSucceed from "./client/pages/paymentSucceedPage.js";
import Chat from "./admin/components/chat.js";
import EditContent from "./admin/pages/EditContent.js";
import CheckCourseStatus from "./client/pages/CheckCourseStatus.js";
import PromotionAdminPage from "./admin/pages/Promotion.js";
import AddEditPromotion from "./admin/pages/AddEditPromotion.js";
import EditFinance from "./admin/pages/EditFinance.js";
import { Toaster } from "sonner";
import LecturerBackGround from "./client/pages/LecturerBackGround.js";
import HomeLecturer from "./lecturer/page/home-lecturer.js";
// import ReviewLecturer from "./lecturer/page/viewReview.js";
import ReviewAdmin from "./admin/pages/viewReview.js";
import { CourseAdminView } from "./lecturer/page/course.js";
import CreateLecturer from "./admin/pages/CreateLecturer.js";

function App() {
  const { state } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const userRole = state.user?.userRole;

  return (
    <BrowserRouter>
      <Toaster />
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
                path="/view-product/:name/:documentId"
                element={<ViewCourse />}
              />
              <Route path="/test" element={<Test />} />
              <Route path="/purchase" element={<BuyProduct />} />
              <Route path="/payment-succeed" element={<PaymentSucceed />} />
              <Route path="/checkstatus" element={<CheckCourseStatus />} />
              <Route
                path="/lecturer-background/:name"
                element={<LecturerBackGround />}
              />
              <Route path="/user" element={<Profile />} />
              <Route path="/edit-profile/:userid" element={<EditProfile />} />
              {/* <Route path="*" element={<PageNotFound />} /> */}
            </Routes>
            <Footer />
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
              <ForumIcon fontSize="large" />
            </button>
          </>
        ) : userRole === "Lecturer" ? (
          <>
            <NavAdmin />
            <Routes>
              <Route path="/" element={<HomeLecturer />} />
              <Route path="/user" element={<Profile />} />
              <Route path="/edit-profile/:userid" element={<EditProfile />} />
              <Route path="/review" element={<ReviewAdmin />} />
              <Route path="/course" element={<CourseAdminView />} />
              <Route
                path="/view-product/:name/:documentId"
                element={<ViewCourse />}
              />
              <Route path="/view-student" element={<CourseStudentTable />} />
              {/* <Route path="*" element={<PageNotFound />} /> */}
            </Routes>
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
              <ForumIcon fontSize="large" />
            </button>
          </>
        ) : userRole === "Admin" ? (
          <>
            <NavAdmin />
            <Routes>
              <Route path="/" element={<HomeAdmin />} />
              <Route path="/create-course" element={<AddCourse />} />
              <Route path="/create-topic/:topicid" element={<AddTopic />} />
              <Route path="/promotion/view" element={<AddEditPromotion />} />
              <Route
                path="/edit-content/:contentid"
                element={<EditContent />}
              />
              <Route
                path="/create-summarize/:courseid"
                element={<CourseDetails />}
              />
              <Route path="/view" element={<CourseView />} />
              <Route path="/review" element={<ReviewAdmin />} />
              <Route path="/view-student" element={<CourseStudentTable />} />
              <Route path="/promotion" element={<PromotionAdminPage />} />
              <Route path="/lecturer" element={<LecturerAll />} />
              <Route path="/student" element={<StudentTable />} />
              <Route path="/finance" element={<FinanceOrder />} />
              <Route path="/user" element={<Profile />} />
              <Route path="/edit-profile/:userid" element={<EditProfile />} />
              <Route path="/create-lecturer" element={<CreateLecturer />} />
              <Route
                path="/edit-finance/:financeid"
                element={<EditFinance />}
              />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
              <ForumIcon fontSize="large" />
            </button>
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
              path="/view-product/:name/:documentId"
              element={<ViewCourse />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/lecturer-background/:name"
              element={<LecturerBackGround />}
            />
            {/* testing in plublic role */}
            <Route path="/contentstudy" element={<ContentStudy />} />
            <Route path="/my-course" element={<Mycourse />} />

            {/* <Route path="*" element={<PageNotFound />} /> */}
          </Routes>
          <Footer />
        </>
      )}
      {isChatOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <Chat open={isChatOpen} close={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;

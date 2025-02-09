import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/Auth.context.js";
import LoginForm from "./page/login.js";
import HomeLecturer from "./lecturer/page/home.js";
import TopicLecturer from "./lecturer/page/topic.js";
import HomeStudent from "./student/page/home.js";
import TopicStudent from "./student/page/topic.js";
import UserPage from "./page/user.js";
import ExcelFetch from "./lecturer/page/excelfetch.js";
import CreateTopic from "./lecturer/page/addTopic.js";
import CreateSubject from "./lecturer/page/addSubject.js";
import AddStudent from "./lecturer/page/addStudent.js";
import StudentListPage from "./lecturer/page/Student.js";
import EditSubjectInfo from "./lecturer/page/editSubjectInfo.js";
import DetailTopicLecturer from "./lecturer/page/detailTopic.js";
import AddIDStudent from "./lecturer/page/addIdStudent.js";
import AddScoreTopic from "./lecturer/page/addScore.js";
import ContactLecturer from "./page/contact_lecturer.js";
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
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<HomeStudent />} />
            <Route
              path="/topic/:subject_title/:username/:subject"
              element={<TopicStudent />}
            />
            <Route path="/user" element={<UserPage />} />
            <Route path="/contact" element={<ContactLecturer />} />
          </Routes>
        </BrowserRouter>
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

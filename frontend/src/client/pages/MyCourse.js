import { useEffect, useState, useContext, useCallback } from "react";
import ax from "../../conf/ax";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/Auth.context.js";
import axios from "axios";

// รีวิวคอร์สเรียน
const ReviewModal = ({
  isOpen,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  selectedCourse,
  user,
  setHasReviewedCourses,
  readOnly = false,
  hasReviewedCourses = {},
  refreshReviews, // ฟังก์ชันรีเฟรชข้อมูลรีวิวจาก backend
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) {
      onClose();
      return;
    }

    // เช็กว่าผู้ใช้เลือกดาวอย่างน้อย 1 ดวง
    if (rating < 1) {
      alert("คุณยังไม่ได้กรอกคะแนนคอร์สเรียน");
      return;
    }

    // เช็กว่าผู้ใช้เคยรีวิวคอร์สนี้ไปแล้วหรือยัง
    if (hasReviewedCourses[String(selectedCourse?.id)]) {
      alert("คุณได้รีวิวอาจารย์เรียบร้อยแล้ว");
      onClose();
      return;
    }

    // แจ้งเตือนให้ยืนยันก่อนส่งรีวิว
    const isConfirmed = window.confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการส่งรีวิวนี้? หากยืนยันแล้วจะไม่สามารถแก้ไขได้อีกครั้ง"
    );
    if (!isConfirmed) return;

    try {
      const response = await ax.post("reviews?populate=*", {
        data: {
          star: rating,
          comment,
          review_id: selectedCourse?.id,
          users_review: user?.id,
        },
      });

      console.log("Review Submitted:", response.data);

      // อัปเดต state ทันที
      setHasReviewedCourses((prev) => ({
        ...prev,
        [String(selectedCourse.id)]: { rating, comment },
      }));

      onClose();
      setRating(0);
      setComment("");
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review, please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
        >
          ✖
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center">
          {readOnly ? "Your Review" : "ให้คะแนน & รีวิวคอร์สเรียน"}
        </h3>
        <div className="flex justify-center mb-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => !readOnly && setRating(num)}
              className={`text-2xl mx-1 ${
                num <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="เขียนรีวิวคอร์สเรียน บอกเล่าประสบการณ์ที่ได้เรียนในคอร์ส :)"
          value={comment}
          onChange={(e) => !readOnly && setComment(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          rows="3"
          readOnly={readOnly}
        ></textarea>
        {!readOnly && (
          <button
            onClick={handleSubmit}
            className="w-full py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
          >
            ยืนยันการรีวิว
          </button>
        )}
      </div>
    </div>
  );
};

// Add hasReviewedTeacher state to TeacherReviewModal props
const TeacherReviewModal = ({
  isOpen,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  selectedTeacher,
  user,
  setHasReviewedTeacher, // Add this prop
  readOnly = false,
  hasReviewedTeacher = {}, // Change from hasReviewedCourses
  refreshReviews,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) {
      onClose();
      return;
    }

    // เช็กว่าผู้ใช้เลือกดาวอย่างน้อย 1 ดวง
    if (rating < 1) {
      alert("คุณยังไม่ได้กรอกคะแนนคอร์สเรียน");
      return;
    }

    // เช็กว่าผู้ใช้เคยรีวิวอาจารย์คนนี้ไปแล้วหรือยัง
    if (hasReviewedTeacher[String(selectedTeacher?.id)]) {
      alert("คุณได้รีวิวอาจารย์เรียบร้อยแล้ว");
      onClose();
      return;
    }

    // แจ้งเตือนให้ยืนยันก่อนส่งรีวิว
    const isConfirmed = window.confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการส่งรีวิวนี้? หากยืนยันแล้วจะไม่สามารถแก้ไขได้อีกครั้ง"
    );
    if (!isConfirmed) return;

    try {
      const response = await ax.post("lecturer-reviews?populate=*", {
        data: {
          star: rating,
          comment,
          review: user?.id,
          lecturer_review_id: selectedTeacher?.id,
        },
      });

      console.log("Teacher Review Submitted:", response.data);

      // อัปเดต state ทันที
      setHasReviewedTeacher((prev) => ({
        ...prev,
        [String(selectedTeacher.id)]: { rating, comment },
      }));

      onClose();
      setRating(0); // รีเซ็ตค่าเป็น 0 ดาว
      setComment("");
      alert("Teacher review submitted successfully!");
    } catch (error) {
      console.error("Error submitting teacher review:", error);
      alert("Failed to submit teacher review, please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
        >
          ✖
        </button>
        <h3 className="text-lg font-semibold mb-4 text-center">
          {readOnly ? "Your Review" : "ให้คะแนน & รีวิวอาจารย์ผู้สอน"}
        </h3>
        <div className="flex justify-center mb-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => !readOnly && setRating(num)}
              className={`text-2xl mx-1 ${
                num <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="เขียนรีวิวอาจารย์ผู้สอน เพื่อการปรับปรุงคุณภาพการสอนที่ดีมากยิ่งขึ้น :) "
          value={comment}
          onChange={(e) => !readOnly && setComment(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          rows="3"
          readOnly={readOnly}
        ></textarea>
        {!readOnly && (
          <button
            onClick={handleSubmit}
            className="w-full py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
          >
            ยืนยันการรีวิว
          </button>
        )}
      </div>
    </div>
  );
};

export default function MyCourse() {
  const [user, setUser] = useState(null);
  const [ownedCourses, setOwnedCourses] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [isTeacherReviewOpen, setIsTeacherReviewOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherRating, setTeacherRating] = useState(0);
  const [teacherComment, setTeacherComment] = useState("");
  const [progress, setProgress] = useState({});
  const [hasReviewedTeacher, setHasReviewedTeacher] = useState(false);
  const [hasReviewedCourses, setHasReviewedCourses] = useState({});
  const { state } = useContext(AuthContext);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";
  // ฟังก์ชันดึงข้อมูลรีวิวจาก Backend
  const fetchAllReviews = useCallback(
    async (currentUser) => {
      if (!currentUser) return;

      try {
        const params = {
          populate: "*",
          "filters[users_review][id][$eq]": currentUser.id,
        };

        const response = await axios.get(`${BASE_URL}/api/reviews`, { params });
        console.log("API Response:", response.data);

        const reviewedCourses = {};

        response.data.data.forEach((review) => {
          // ✅ ใช้ optional chaining ป้องกัน error ถ้าข้อมูลบางตัวหาย
          const courseId = String(review.review_id?.id);
          const userId = String(review.users_review?.id);

          if (userId === String(currentUser.id)) {
            reviewedCourses[courseId] = {
              rating: review.star ?? 0, // ⭐ ใส่ default ถ้าไม่มีคะแนน
              comment: review.comment ?? "", // 💬 ใส่ default ถ้าไม่มีคอมเมนต์
            };
          }
        });

        console.log("🎯 Reviewed Courses Data:", reviewedCourses);
        setHasReviewedCourses(reviewedCourses);
      } catch (error) {
        console.error(
          "❌ Error fetching reviews:",
          error.response?.data || error.message
        );
      }
    },
    [BASE_URL]
  ); // ✅ เพิ่ม BASE_URL เป็น dependency

  // Add fetchTeacherReviews function in MyCourse component
  const fetchTeacherReviews = useCallback(
    async (currentUser) => {
      if (!currentUser) return;

      try {
        const params = {
          populate: "*", // ✅ ดึงข้อมูลทุกความสัมพันธ์
          "filters[review][id][$eq]": currentUser.id, // ✅ ฟิลเตอร์เฉพาะรีวิวของ currentUser
        };

        const response = await axios.get(`${BASE_URL}/api/lecturer-reviews`, {
          params,
        });
        console.log("Teacher Reviews API Response:", response.data);

        const reviewedTeachers = {};

        response.data.data.forEach((review) => {
          const teacherId = String(review.lecturer_review_id?.id);
          const userId = String(review.review?.id);

          if (userId === String(currentUser.id)) {
            reviewedTeachers[teacherId] = {
              rating: review.star ?? 0,
              comment: review.comment ?? "",
            };
          }
        });

        console.log("🎯 Reviewed Teachers Data:", reviewedTeachers);
        setHasReviewedTeacher(reviewedTeachers);
      } catch (error) {
        console.error(
          "❌ Error fetching teacher reviews:",
          error.response?.data || error.message
        );
      }
    },
    [BASE_URL]
  ); // ✅ เพิ่ม BASE_URL เป็น dependency

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลผู้ใช้และคอร์สที่ลงทะเบียน
        const userResponse = await ax.get(
          `${BASE_URL}/api/users/me?populate=owned_course.image`
        );
        console.log("✅ User Data:", userResponse.data);
        const currentUser = userResponse.data;
        setUser(currentUser);
        setOwnedCourses(currentUser.owned_course || []);

        // ดึงข้อมูลคอร์สทั้งหมด
        const coursesResponse = await axios.get(
          `${BASE_URL}/api/courses?populate=image`
        );
        console.log("✅ Course Data:", coursesResponse.data.data);
        setCourseData(coursesResponse.data.data);

        // ดึงข้อมูลรีวิวโดยใช้ currentUser ที่ได้มา
        await fetchAllReviews(currentUser);

        // Add this line after fetchAllReviews
        await fetchTeacherReviews(currentUser);
      } catch (err) {
        console.error("🚨 Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchAllReviews, fetchTeacherReviews]);

  // ดึงข้อมูลความคืบหน้าของคอร์ส เมื่อมีข้อมูล user
  useEffect(() => {
    if (!user) return;
    const fetchCourseProgresses = async () => {
      try {
        const response = await ax.get(
          `${BASE_URL}/api/course-progresses?populate=*`,
          {
            params: {
              "filters[course_progress_owner][id][$eq]": user.id,
            },
          }
        );
        const courseProgressData = response.data.data.reduce((acc, item) => {
          if (
            item.course_progress_name &&
            item.course_progress_name.documentId
          ) {
            acc[item.course_progress_name.documentId] =
              Number(item.course_progress) || 0;
          }
          return acc;
        }, {});
        console.log("✅ Course Progress Data:", courseProgressData);
        setProgress(courseProgressData);
      } catch (error) {
        console.error("🚨 Error fetching course progress:", error);
      }
    };

    fetchCourseProgresses();
  }, [user]);

  // กรองคอร์สตามการค้นหา (Search)
  const filteredCourses = ownedCourses.filter((course) =>
    (course.Name || "").toLowerCase().includes(query.toLowerCase())
  );

  const handleReviewClick = (course) => {
    if (hasReviewedCourses[String(course.id)]) {
      alert("คุณได้รีวิวคอร์สนี้ไปแล้ว!");
      return;
    }
    setSelectedCourse(course);
    setIsOpen(true);
  };

  const handleTeacherReviewClick = (teacher) => {
    if (hasReviewedTeacher[String(teacher.id)]) {
      alert("คุณได้รีวิวอาจารย์คนนี้ไปแล้ว!");
      return;
    }
    setSelectedTeacher(teacher);
    setIsTeacherReviewOpen(true);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto mt-10 p-5">
      <h1 className="text-4xl font-bold mb-5">
        ยินดีต้อนรับคุณ, {user ? user.username : "Guest"}
      </h1>

      <div className="flex justify-between items-center mb-5 bg-white shadow-md p-3 rounded-lg">
        <input
          type="text"
          placeholder="ค้นหาชื่อคอร์ส..."
          className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
          value={query}
          onChange={handleSearch}
        />
        <button className="p-2 bg-blue-500 text-white rounded-lg ml-3">
          ค้นหา
        </button>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="border border-gray-300 p-5 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold">คอร์สของคุณ</h2>
          <div
            id="slider"
            className="flex h-[32rem] w-full overflow-x-auto my-7 scroll-smooth whitespace-nowrap gap-10 items-center scrollbar-hide"
          >
            {filteredCourses.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.1 }}
                className="min-w-80 border border-blue-200 rounded-lg shadow-md p-4 cursor-pointer"
              >
                <div
                  className="overflow-hidden rounded-lg"
                  onClick={() => navigate(`/contentstudy/${item.documentId}`)}
                >
                  <img
                    src={
                      item.image && item.image.length > 0
                        ? `${BASE_URL}${item.image[0].url}`
                        : "/placeholder.svg"
                    }
                    alt="Course Image"
                    className="object-contain w-full h-[270px]"
                  />
                </div>
                <div className="mt-4 w-72">
                  <p className="truncate whitespace-nowrap overflow-hidden">
                    {item.Name}
                  </p>
                  <p className="uppercase text-green-600 text-xs font-medium break-words">
                    {item.lecturer_owner
                      ? `${item.lecturer_owner.first_name} ${item.lecturer_owner.last_name}`
                      : "ไม่มีผู้สอน"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    สิ้นสุด: {item.end_date ? item.end_date : "ไม่ระบุ"}
                  </p>
                </div>

                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${progress[item.documentId] || 0}%` }}
                  >
                    {progress[item.documentId] || 0}%
                  </div>
                </div>

                {progress[item.documentId] === 100 && (
                  <div className="flex gap-2 mt-2">
                    {hasReviewedCourses[String(item.id)] ? (
                      <button
                        onClick={() => {
                          setSelectedCourse(item);
                          setRating(hasReviewedCourses[String(item.id)].rating);
                          setComment(
                            hasReviewedCourses[String(item.id)].comment
                          );
                          setIsOpen(true);
                        }}
                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
                      >
                        ดูรีวิวที่คุณส่งไป
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReviewClick(item)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                      >
                        รีวิวคอร์สเรียน
                      </button>
                    )}
                    {hasReviewedTeacher[String(item.id)] ? (
                      <button
                        onClick={() => {
                          setSelectedTeacher(item);
                          setTeacherRating(
                            hasReviewedTeacher[String(item.id)].rating
                          );
                          setTeacherComment(
                            hasReviewedTeacher[String(item.id)].comment
                          );
                          setIsTeacherReviewOpen(true);
                        }}
                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
                      >
                        ดูรีวิวอาจารย์
                      </button>
                    ) : (
                      <button
                        onClick={() => handleTeacherReviewClick(item)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                      >
                        รีวิวอาจารย์ผู้สอน
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-5">ไม่พบคอร์สที่ค้นหา</p>
      )}
      {/* กรณีไม่มีการลงทะเบียนใดๆ */}
      {ownedCourses.length === 0 && (
        <div>
          <blockquote className="text-xl italic font-semibold text-center text-gray-900 dark:text-white">
            <p>"คุณยังไม่มีการลงทะเบียนเรียน"</p>
          </blockquote>
          {/* คอร์สยอดนิยม */}
          <div>
            <h2 className="text-2xl font-bold mb-5">คอร์สเรียนยอดนิยม</h2>
          </div>
          <div
            id="slider"
            className="flex h-[32rem] min-w-full overflow-x-auto overflow-y-visible scroll-y scroll my-7 scroll-smooth whitespace-nowrap gap-10 items-center place-content-center scrollbar-hide"
          >
            {courseData.map((items) => (
              <motion.div
                key={items.id}
                whileHover={{ scale: 1.1 }}
                className="min-w-80 border border-blue-200 rounded-lg shadow-md p-4"
                onClick={() =>
                  navigate(`/view-product/${items.Name}/${items.documentId}/`)
                }
              >
                {/* <!-- Discount Badge --> */}
                <div className="relative">
                  <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    -20%
                  </span>
                </div>
                {/* <!-- Wishlist Icon --> */}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h18M3 3v18M3 3l18 18"
                    />
                  </svg>
                </button>
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={items.image || "/placeholder.svg"}
                    alt="Course Image"
                    className="object-contain w-full h-[270px]"
                  />
                </div>
                <div className="mt-4 w-72">
                  <p className="truncate whitespace-nowrap overflow-hidden">
                    {items.Name}
                  </p>
                  {items.lecturer_owner ? (
                    <p className="uppercase text-green-600 text-xs font-medium break-words">
                      {`${items.lecturer_owner.first_name} ${items.lecturer_owner.last_name}`}
                    </p>
                  ) : (
                    <p className="uppercase text-green-600 text-xs font-medium">
                      ไม่มีผู้สอน
                    </p>
                  )}

                  {/* <!-- Ratings --> */}
                  <div className="flex space-x-1 text-orange-500 text-sm mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927ล1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724ล-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01ล-3.614 1.96c-.74.414-1.6-.218-1.419-1.034ล.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724ล4.004-.37L9.049 2.927z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927ล1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724ล-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01ล-3.614 1.96c-.74.414-1.6-.218-1.419-1.034ล.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724ล4.004-.37L9.049 2.927z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927ล1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724ล-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01ล-3.614 1.96c-.74.414-1.6-.218-1.419-1.034ล.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724ล4.004-.37L9.049 2.927z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927ล1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724ล-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01ล-3.614 1.96c-.74.414-1.6-.218-1.419-1.034ล.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724ล4.004-.37L9.049 2.927z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927ล1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724ล-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01ล-3.614 1.96c-.74.414-1.6-.218-1.419-1.034ล.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724ล4.004-.37L9.049 2.927z" />
                    </svg>
                  </div>

                  {/* <!-- Pricing --> */}
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-blue-600 text-xl font-semibold">
                        {items.Price} THB
                      </span>
                      <span className="text-gray-400 text-sm line-through">
                        {items.Price * 1.2} THB
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 17h-11v-14h-2" />
                        <path d="M6 5l14 1l-1 7h-13" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <ReviewModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedCourse(null);
        }}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        selectedCourse={selectedCourse}
        user={user}
        setHasReviewedCourses={setHasReviewedCourses}
        refreshReviews={fetchAllReviews}
        readOnly={
          selectedCourse
            ? !!hasReviewedCourses[String(selectedCourse.id)]
            : false
        }
      />

      <TeacherReviewModal
        isOpen={isTeacherReviewOpen}
        onClose={() => setIsTeacherReviewOpen(false)}
        rating={teacherRating}
        setRating={setTeacherRating}
        comment={teacherComment}
        setComment={setTeacherComment}
        selectedTeacher={selectedTeacher}
        user={user}
        setHasReviewedTeacher={setHasReviewedTeacher}
        hasReviewedTeacher={hasReviewedTeacher}
        refreshReviews={fetchAllReviews}
        readOnly={
          selectedTeacher
            ? !!hasReviewedTeacher[String(selectedTeacher.id)]
            : false
        }
      />
    </div>
  );
}

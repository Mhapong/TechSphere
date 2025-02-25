import React, { useState, useEffect, useContext, useCallback } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";

const ReviewAdmin = () => {
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [reviewData, setReviewData] = useState([]);
  const [reviewCourseData, setReviewCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  // state สำหรับฟิลเตอร์รีวิวคอร์ส
  const [selectedRating, setSelectedRating] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  // state สำหรับฟิลเตอร์รีวิวอาจารย์
  const [lecturerSelectedRating, setLecturerSelectedRating] = useState(null);
  const [lecturerShowFilterOptions, setLecturerShowFilterOptions] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ax.get(`${BASE_URL}/api/users`, {
        params: {
          "filters[role][name][$eq]": "Lecturer",
          "populate": ["rating", "profile_picture"],
        },
      });

      console.log("Lecturer Data Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setReviewData(response.data);
      } else {
        setReviewData([]);
      }
    } catch (error) {
      console.error("Error fetching lecturer review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  const fetchCourseReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ax.get(`${BASE_URL}/api/courses`, {
        params: {
          "populate": ["rating", "image"],
        },
      });

      console.log("Course Data Response:", response.data.data);

      if (response.data?.data && Array.isArray(response.data.data)) {
        setReviewCourseData(response.data.data);
      } else {
        setReviewCourseData([]);
      }
    } catch (error) {
      console.error("Error fetching course review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  // ฟังก์ชันสำหรับฟิลเตอร์รีวิวคอร์ส
  const filterReviews = (rating) => {
    if (!selectedCourse) return [];
    if (rating === null) return selectedCourse.rating;
    return selectedCourse.rating.filter((review) => review.star === rating);
  };

  const filteredReviews = selectedCourse ? filterReviews(selectedRating) : [];

  // ฟังก์ชันสำหรับฟิลเตอร์รีวิวอาจารย์
  const filterLecturerReviews = (rating) => {
    if (!selectedLecturer) return [];
    if (rating === null) return selectedLecturer.rating;
    return selectedLecturer.rating.filter((review) => review.star === rating);
  };

  const filteredLecturerReviews = selectedLecturer
    ? filterLecturerReviews(lecturerSelectedRating)
    : [];

  useEffect(() => {
    fetchReview();
    fetchCourseReview();
  }, [fetchReview, fetchCourseReview]);

  return (
    <div className="container w-full lg:w-[1000px] mt-11 lg:ml-96 max-w-7xl p-4">
      {/* รีวิวของอาจารย์ */}
      <div className="mx-auto text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          รีวิวทั้งหมดของอาจารย์
        </h2>
      </div>

      {loading && <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>}
      {!loading && !error && reviewData.length === 0 && (
        <p className="text-center text-gray-500">ไม่มีรีวิวที่จะแสดง</p>
      )}

      {!loading && !error && reviewData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewData.map((lecturer) => {
            const profileImage = lecturer?.profile_picture?.[0]?.url
              ? `${BASE_URL}${lecturer.profile_picture[0].url}`
              : "/default-profile.png";

            // คำนวณคะแนนเฉลี่ยของอาจารย์
            const averageRating =
              lecturer.rating && lecturer.rating.length > 0
                ? (
                    lecturer.rating.reduce((acc, review) => acc + review.star, 0) /
                    lecturer.rating.length
                  ).toFixed(1)
                : "0.0";

            return (
              <motion.div
                key={lecturer.id}
                className="flex items-center p-6 border rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  // เมื่อเลือกอาจารย์ใหม่ ให้รีเซ็ตฟิลเตอร์ของรีวิวอาจารย์
                  setSelectedLecturer(
                    selectedLecturer?.id === lecturer.id ? null : lecturer
                  );
                  setLecturerSelectedRating(null);
                  setLecturerShowFilterOptions(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={profileImage}
                  alt={`${lecturer.first_name} ${lecturer.last_name}`}
                  className="w-20 h-20 rounded-full object-cover mr-6"
                />
                <div>
                  <h3 className="text-xl font-semibold text-blue-700">
                    {lecturer.first_name} {lecturer.last_name}
                  </h3>
                  {/* แสดงคะแนนเฉลี่ย */}
                  <div className="flex items-center mt-2">
                    <span className="text-2xl text-yellow-500 mr-2">⭐</span>
                    <span className="text-yellow-500 font-semibold text-lg sm:text-xl">
                      {averageRating}
                    </span>
                    <span className="text-gray-500 text-base ml-2">/ 5</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ส่วนรายละเอียดรีวิวอาจารย์ (รวมฟิลเตอร์) */}
      {selectedLecturer && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-blue-700">
              {selectedLecturer.first_name} {selectedLecturer.last_name}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => {
                setSelectedLecturer(null);
                setLecturerShowFilterOptions(false);
                setLecturerSelectedRating(null);
              }}
            >
              ✖
            </button>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-800">Reviews:</h4>

            {/* ฟิลเตอร์สำหรับรีวิวอาจารย์ */}
            <div className="mt-2">
              {!lecturerShowFilterOptions ? (
                <button
                  className="px-4 py-2 text-sm rounded bg-green-500 text-white"
                  onClick={() => setLecturerShowFilterOptions(true)}
                >
                  แสดงตัวเลือกฟิลเตอร์
                </button>
              ) : (
                <div>
                  <div className="mb-2">
                    <button
                      className="px-4 py-2 text-sm rounded bg-red-500 text-white"
                      onClick={() => {
                        setLecturerShowFilterOptions(false);
                        setLecturerSelectedRating(null);
                      }}
                    >
                      ปิดฟิลเตอร์
                    </button>
                  </div>
                  <div>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        className={`px-4 py-2 text-sm rounded mr-2 border-2 transition-all 
                          ${
                            lecturerSelectedRating === star
                              ? "bg-green-600 text-white border-green-700 shadow-lg scale-105"
                              : "bg-green-500 text-white border-transparent"
                          }`}
                        onClick={() => setLecturerSelectedRating(star)}
                      >
                        {star} ดาว
                      </button>
                    ))}
                    <button
                      className={`px-4 py-2 text-sm rounded border-2 transition-all
                          ${
                            lecturerSelectedRating === null
                              ? "bg-green-600 text-white border-green-700 shadow-lg scale-105"
                              : "bg-green-500 text-white border-transparent"
                          }`}
                      onClick={() => setLecturerSelectedRating(null)}
                    >
                      รีวิวทั้งหมด
                    </button>
                  </div>
                </div>
              )}
            </div>

            {filteredLecturerReviews && filteredLecturerReviews.length > 0 ? (
              <ul className="space-y-4 mt-2">
                {filteredLecturerReviews.map((review) => (
                  <motion.li
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b pb-4 last:border-none"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.star ? "text-yellow-500" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base italic">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      )}

      {/* รีวิวของคอร์ส */}
      <div className="mx-auto text-center mt-12 mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          รีวิวทั้งหมดของคอร์ส
        </h2>
      </div>
      {loading && <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>}
      {!loading && !error && reviewCourseData.length === 0 && (
        <p className="text-center text-gray-500">ไม่มีรีวิวที่จะแสดง</p>
      )}

      {!loading && !error && reviewCourseData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewCourseData.map((course) => {
            const courseImage = course?.image?.[0]?.url
              ? `${BASE_URL}${course.image[0].url}`
              : "/default-profile.png";

            // คำนวณคะแนนเฉลี่ยของคอร์ส
            const averageRating =
              course.rating && course.rating.length > 0
                ? (
                    course.rating.reduce((acc, review) => acc + review.star, 0) /
                    course.rating.length
                  ).toFixed(1)
                : "0.0";

            return (
              <motion.div
                key={course.id}
                className="flex items-center p-6 border rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  // เมื่อเลือกคอร์สใหม่ ให้รีเซ็ต selectedRating กับ showFilterOptions
                  setSelectedCourse(selectedCourse?.id === course.id ? null : course);
                  setSelectedRating(null);
                  setShowFilterOptions(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={courseImage}
                  alt={`${course.Name}`}
                  className="w-20 h-20 rounded-full object-cover mr-6"
                />
                <div>
                  <h3 className="text-xl font-semibold text-blue-700">
                    {course.Name}
                  </h3>
                  {/* แสดงคะแนนเฉลี่ย */}
                  <div className="flex items-center mt-2">
                    <span className="text-2xl text-yellow-500 mr-2">⭐</span>
                    <span className="text-yellow-500 font-semibold text-lg sm:text-xl">
                      {averageRating}
                    </span>
                    <span className="text-gray-500 text-base ml-2">/ 5</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedCourse && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-blue-700">
              {selectedCourse.Name}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => {
                setSelectedCourse(null);
                setShowFilterOptions(false);
                setSelectedRating(null);
              }}
            >
              ✖
            </button>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-800">Reviews:</h4>

            {/* ฟิลเตอร์สำหรับรีวิวคอร์ส */}
            <div className="mt-2">
              {!showFilterOptions ? (
                <button
                  className="px-4 py-2 text-sm rounded bg-green-500 text-white"
                  onClick={() => setShowFilterOptions(true)}
                >
                  แสดงตัวเลือกฟิลเตอร์
                </button>
              ) : (
                <div>
                  <div className="mb-2">
                    <button
                      className="px-4 py-2 text-sm rounded bg-red-500 text-white"
                      onClick={() => {
                        setShowFilterOptions(false);
                        setSelectedRating(null); // รีเซ็ต selectedRating เมื่อปิดฟิลเตอร์
                      }}
                    >
                      ปิดฟิลเตอร์
                    </button>
                  </div>
                  <div>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        className={`px-4 py-2 text-sm rounded mr-2 border-2 transition-all 
              ${
                selectedRating === star
                  ? "bg-green-600 text-white border-green-700 shadow-lg scale-105"
                  : "bg-green-500 text-white border-transparent"
              }`}
                        onClick={() => setSelectedRating(star)}
                      >
                        {star} ดาว
                      </button>
                    ))}
                    <button
                      className={`px-4 py-2 text-sm rounded border-2 transition-all
            ${
              selectedRating === null
                ? "bg-green-600 text-white border-green-700 shadow-lg scale-105"
                : "bg-green-500 text-white border-transparent"
            }`}
                      onClick={() => setSelectedRating(null)}
                    >
                      รีวิวทั้งหมด
                    </button>
                  </div>
                </div>
              )}
            </div>

            {filteredReviews && filteredReviews.length > 0 ? (
              <ul className="space-y-4 mt-2">
                {filteredReviews.map((review) => (
                  <motion.li
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b pb-4 last:border-none"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < review.star ? "text-yellow-500" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm sm:text-base italic">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAdmin;



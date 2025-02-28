import { useEffect, useState, useCallback, useRef } from "react";
import ax from "../../conf/ax";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import conf from "../../conf/main";

export default function LecturerProfile() {
  const { name } = useParams();
  const BASE_URL = conf.apiUrl;
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  const fetchLecturer = useCallback(async () => {
    if (!name || !name.includes("-")) return;

    const capitalize = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const [firstName, lastName] = name.split("-").map(capitalize);

    try {
      const response = await ax.get(`users`, {
        params: {
          "filters[first_name][$eq]": firstName,
          "filters[last_name][$eq]": lastName,
          populate: ["created_courses.image", "rating", "profile_picture"],
        },
      });

      if (response.data?.length > 0) {
        setLecturer(response.data[0]);
      } else {
        setLecturer(null);
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะดึงข้อมูลอาจารย์:", err);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, name]);

  useEffect(() => {
    fetchLecturer();
  }, [fetchLecturer, name]);

  useEffect(() => {
    if (containerRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  if (!lecturer)
    return (
      <p className="text-center text-red-500 p-4 text-xl">
        Lecturer not found.
      </p>
    );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* รูปโปรไฟล์ */}
          {lecturer?.profile_picture?.length > 0 ? (
            <img
              src={`${BASE_URL}${lecturer.profile_picture[0].url}`}
              alt={`${lecturer.first_name} ${lecturer.last_name}`}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 shadow-lg object-cover"
            />
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 bg-gray-300 flex items-center justify-center">
              <span className="text-4xl text-gray-600">
                {lecturer?.first_name?.[0]}
                {lecturer?.last_name?.[0]}
              </span>
            </div>
          )}

          {/* ชื่ออาจารย์ */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            {lecturer?.first_name} {lecturer?.last_name}
          </h1>

          {/* ข้อมูลพื้นฐาน */}
          <div className="text-center text-gray-600 mt-2 text-sm sm:text-base whitespace-pre-line">
            {lecturer?.background || "No background information."}
          </div>

          {/* รายการคอร์สที่เปิดสอน */}
          <div className="mt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Created Courses:
            </h3>
            {lecturer?.created_courses?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lecturer.created_courses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}
                    className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Course Image */}
                    <div className="w-full h-48 bg-gray-200">
                      {course.image && course.image.length > 0 ? (
                        <img
                          src={`${BASE_URL}${course.image[0].url}`}
                          alt={course?.Name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg?height=192&width=384"
                          alt={course?.Name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-4">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">
                        {course?.Name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 whitespace-pre-line">
                        {course?.Description}
                      </p>

                      {/* Course Details */}
                      <div className="space-y-2">
                        <p className="text-sm flex items-center text-gray-600">
                          <span className="mr-2">⏳</span>
                          ระยะเวลาเรียน: {course?.Time_Usage || "N/A"} ชั่วโมง
                        </p>
                        <p className="text-sm flex items-center text-gray-600">
                          <span className="mr-2">👨‍🏫</span>
                          ผู้สอน: {lecturer.first_name} {lecturer.last_name}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mt-4 flex justify-end">
                        <p className="text-xl font-bold text-gray-800">
                          {course?.Price?.toLocaleString()} ฿
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                No courses created.
              </p>
            )}
          </div>

          {/* รีวิว */}
          <div className="mt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Reviews ({lecturer?.rating?.length || 0}):
            </h3>
            {lecturer?.rating?.length > 0 ? (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl text-yellow-500 mr-2">⭐</span>
                  <span className="text-yellow-500 font-semibold text-lg sm:text-xl">
                    {(
                      lecturer.rating.reduce(
                        (acc, review) => acc + review.star,
                        0
                      ) / lecturer.rating.length
                    ).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-base ml-2">/ 5</span>
                </div>
                <ul className="space-y-4">
                  {lecturer.rating.map((review) => {
                    const stars = review?.star ?? 0;
                    return (
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
                                  i < stars
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <div>
                            <p className="text-gray-700 text-sm sm:text-base italic">
                              "{review?.comment}"
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                No reviews yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

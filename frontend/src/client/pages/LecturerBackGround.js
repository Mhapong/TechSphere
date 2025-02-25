"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import { useParams } from "react-router-dom";

export default function LecturerProfile() {
  const { state } = useContext(AuthContext);
  const { name } = useParams();
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";
  const [lecturer, setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLecturer = useCallback(async () => {
    if (!name || !name.includes("-")) return;

    const capitalize = (str) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const [firstName, lastName] = name.split("-").map(capitalize);

    console.log("Searching for:", firstName, lastName);

    try {
      const response = await ax.get(`${BASE_URL}/api/users`, {
        params: {
          "filters[first_name][$eq]": firstName,
          "filters[last_name][$eq]": lastName,
          populate: ["created_courses", "rating", "profile_picture"],
        },
      });

      console.log("API Response:", response.data);

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
    console.log("useParams name:", name);
  }, [fetchLecturer, name]);

  if (loading)
    return <p className="text-center text-gray-500 p-4">Loading...</p>;
  if (!lecturer)
    return <p className="text-center text-red-500 p-4">Lecturer not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* รูปโปรไฟล์ */}
          {lecturer?.profile_picture?.length > 0 && (
            <img
              src={`${BASE_URL}${lecturer.profile_picture[0].url}`}
              alt={`${lecturer.first_name} ${lecturer.last_name}`}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 shadow-lg object-cover"
            />
          )}

          {/* ชื่ออาจารย์ */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
            {lecturer?.first_name} {lecturer?.last_name}
          </h1>

          {/* ข้อมูลพื้นฐาน */}
          <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
            {lecturer?.background || "No background information."}
          </p>

          {/* รายการคอร์สที่เปิดสอน */}
          <div className="mt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Created Courses:
            </h3>
            {lecturer?.created_courses?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lecturer.created_courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-gray-50 shadow-md rounded-lg p-4 border"
                  >
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800">
                      {course?.Name}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      {course?.Description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      ⏳ {course?.Time_Usage || "N/A"} hours
                    </p>
                  </div>
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
              รีวิว:
            </h3>
            {lecturer?.rating?.length > 0 ? (
              <div>
                <p className="text-yellow-500 font-semibold text-lg sm:text-xl">
                  ⭐{" "}
                  {(
                    lecturer.rating.reduce(
                      (acc, review) => acc + review.star,
                      0
                    ) / lecturer.rating.length
                  ).toFixed(1)}{" "}
                  / 5
                </p>
                <ul className="space-y-4 mt-4">
                  {lecturer.rating.map((review) => (
                    <li
                      key={review.id}
                      className="border-b pb-4 last:border-none"
                    >
                      <p className="text-gray-700 text-sm sm:text-base">
                        "{review?.comment}"
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        ⭐ {review?.star} stars
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                ไม่มีรีวิวในตอนนี้.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

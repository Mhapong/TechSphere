"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ax from "../../conf/ax";

// Import images
import homepic from "../components/home-page.png";
import webpic from "../components/web-100.png";
import datapic from "../components/data.png";
import hardwarepic from "../components/hardware.png";
import networkpic from "../components/network.png";
import gamepic from "../components/game.png";
import morepic from "../components/more.png";
import { Rating } from "@mui/material";
import conf from "../../conf/main";

const categories = [
  { name: "Web Develop", img: webpic, path: "Web Develop" },
  { name: "Data Analysis", img: datapic, path: "Data Analysis" },
  { name: "IoT & Hardware", img: hardwarepic, path: "Hardware" },
  { name: "Network", img: networkpic, path: "Network" },
  { name: "Game Develop", img: gamepic, path: "Game Develop" },
  { name: "AI", img: morepic, path: "AI" },
];

export default function Home() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const baseURL = conf.apiUrl;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await ax.get("courses?populate=*");
      const topCourse = response.data.data
        .sort((a, b) => b.user_owner.length - a.user_owner.length)
        .slice(0, 3);
      setCourseData(topCourse);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              คอร์สเรียนออนไลน์เพิ่มทักษะยุคดิจิทัล
            </motion.h1>
            <motion.p
              className="text-xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              พร้อมเวิร์กชอปและ Bootcamp ที่จะช่วยอัปสกิล ให้คุณทำงานเก่งขึ้น!
            </motion.p>
            <motion.button
              className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-100 transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => navigate("/explore")}
            >
              เริ่มเรียนเลย
            </motion.button>
          </div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={homepic || "/placeholder.svg"}
              alt="Programming courses"
              className=""
            />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            เลือกเรียนตามเรื่องที่คุณสนใจ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => navigate("/explore", { state: category.name })}
                whileInView={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 1.05 }}
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.05, delay: index * 0.1 }}
              >
                <img
                  src={category.img || "/placeholder.svg"}
                  alt={category.name}
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-lg font-semibold text-center">
                  {category.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            คอร์สเรียนยอดนิยม
          </h2>

          {courseData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-gray-600">
                ❌ ไม่พบคอร์สที่ต้องการ
              </h3>
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {courseData.map((course) => (
                <motion.div
                  key={course.documentId}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="border rounded-lg shadow-lg cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/view-product/${course.Name}/${course.documentId}/`
                      )
                    }
                  >
                    <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center">
                      {course.image ? (
                        <img
                          src={`${baseURL}${course.image[0].url}`}
                          alt={course.Name}
                          className="object-cover w-full h-full rounded-t-lg"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold line-clamp-1">
                        {course.Name}
                      </h3>
                      <p className="text-gray-600 line-clamp-1">
                        {course.Description
                          ? course.Description
                          : "ไม่มีคำอธิบาย"}
                      </p>
                      <p className="text-blue-700 mt-1">
                        ⏳ เวลาเรียน: {course.Time_Usage} ชั่วโมง
                      </p>
                      <p className="text-green-700">
                        👨‍🏫 ผู้สอน:{" "}
                        {course.lecturer_owner !== null
                          ? `${
                              course.lecturer_owner?.first_name || "ไม่มีชื่อ"
                            } ${
                              course.lecturer_owner?.last_name || "ไม่มีนามสกุล"
                            }`
                          : "ไม่ระบุ"}
                      </p>
                      <div className=" flex justify-between ">
                        <span className="text-amber-900 flex items-center gap-0.5">
                          {course.rating.length === 0
                            ? 0
                            : (
                                course.rating.reduce(
                                  (sum, item) => sum + (item?.star || 0),
                                  0
                                ) / course.rating.length
                              ).toFixed(1)}
                          <Rating
                            value={
                              course.rating.length === 0
                                ? 0
                                : course.rating.reduce(
                                    (sum, item) => sum + (item?.star || 0),
                                    0
                                  ) / course.rating.length
                            }
                            size="small"
                            precision={0.5}
                            readOnly
                          />
                          ({course.rating.length})
                        </span>

                        <span>ขายแล้ว: {course.user_owner?.length}</span>
                      </div>
                    </div>
                    <div className="p-4 border-t flex  justify-end">
                      <span className="text-xl font-bold text-primary">
                        {course.Price} ฿
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="text-center mt-12">
            <button
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
              onClick={() => navigate("/explore")}
            >
              ดูคอร์สทั้งหมด
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

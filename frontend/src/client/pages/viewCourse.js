"use client";

import { Breadcrumbs, Tooltip } from "@material-tailwind/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/Cart.context";
import { AuthContext } from "../../context/Auth.context";
import usericon from "../../admin/components/Image/user-icon.webp";
import {
  FaStar,
  FaClock,
  FaShoppingCart,
  FaPlay,
  FaInfinity,
  FaMobileAlt,
  FaCertificate,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ax from "../../conf/ax";
import conf from "../../conf/main";

// Import images
import webpic from "../components/web-100.png";
import datapic from "../components/data.png";
import hardwarepic from "../components/hardware.png";
import networkpic from "../components/network.png";
import gamepic from "../components/game.png";
import morepic from "../components/more.png";
import allpic from "../../admin/components/Image/All.png";
import { fontSize, sizing } from "@mui/system";
import { Rating } from "@mui/material";

export default function ViewCourse() {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { addToCart, cartItems } = useCart();
  const { name, documentId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({}); // ✅ จัดการ state ของ dropdown แต่ละหัวข้อ

  const baseURL = conf.apiUrl;

  const fetchCourse = async () => {
    try {
      const response = await ax.get(
        `courses?filters[documentId][$eq]=${documentId}&populate[0]=topic.content&populate[1]=lecturer_owner.created_courses&populate[2]=rating.users_review.profile_picture&populate[3]=categories&populate[4]=user_owner&populate[5]=lecturer_owner.rating`
      );
      const now_course = response.data.data;
      setCourse(now_course[0]);

      console.log(now_course[0]);
      console.log(now_course[0].topic);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: "ALL", img: allpic, path: "ALL" },
    { name: "Web Develop", img: webpic, path: "Web Develop" },
    { name: "Data Analysis", img: datapic, path: "Data Analysis" },
    { name: "IoT & Hardware", img: hardwarepic, path: "Hardware" },
    { name: "Network", img: networkpic, path: "Network" },
    { name: "Game Develop", img: gamepic, path: "Game Develop" },
    { name: "AI", img: morepic, path: "AI" },
  ];

  useEffect(() => {
    fetchCourse();
    console.log(course);
    console.log(state.user?.id);
    if (
      course &&
      course.user_owner?.some((owner) => owner.id === state.user.id)
    ) {
      console.log("This user owns the course");
    } else {
      console.log("This user does not own the course");
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading course details.</div>;
  if (!course) return <div>No course found.</div>;

  const averageRating = course.rating?.length
    ? course.rating.reduce((sum, review) => sum + review.star, 0) /
      course.rating.length
    : 0;

  const Lec_ratings = course.lecturer_owner?.rating || [];

  const averageLecturerRating = Lec_ratings.length
    ? Lec_ratings.reduce((acc, curr) => acc + curr.star, 0) / Lec_ratings.length
    : 0;

  const isCourseInCart = cartItems.some((item) => item.id === course.id);
  const isUserOwned = course.user_owner?.some(
    (owner) => owner?.id === state.user?.id
  );

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index], // ✅ Toggle เปิด/ปิด
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-tl from-teal-800 to-black text-white py-16">
        <div className="container mx-auto w-full px-4 mb-2">
          <Breadcrumbs className="my-1 text-teal-50 bg-transparent">
            <a href="/" className="opacity-80 text-white hover:text-blue-700">
              Home
            </a>
            <a
              href="/explore"
              className="opacity-80 text-white hover:text-blue-700"
            >
              Explore
            </a>
            <a className="text-white hover:text-blue-700">{course.Name}</a>
          </Breadcrumbs>
        </div>
        <div className="container mx-auto w-full px-4 flex flex-col md:flex-row overflow-visible">
          <div className="md:w-2/3 pr-8 w-full order-2 md:order-1">
            <h1 className="text-3xl font-bold mb-4">{course.Name}</h1>
            <p className="text-xl mb-4">
              {course.Description === null
                ? "ไม่มีการบรรยาย"
                : course.Description}
            </p>
            <div className="flex items-center mb-4">
              <div className="flex bg-white rounded-full mr-2">
                <Rating
                  value={averageRating}
                  readonly
                  size=""
                  readOnly
                  className="mx-1"
                />
              </div>
              <span className="mr-2">{averageRating} ดาว</span>
              <span className="text-gray-400">
                ({course?.rating.length || "ยังไม่มีรีวิว"} รีวิว)
              </span>
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-4">
                จำนวนผู้เรียน {course?.user_owner.length || "0"} คน
              </span>
            </div>
            <div className="flex items-center mb-4">
              <span className="flex items-center">
                <FaClock className="mr-2" /> ระยะเวลาเรียน {course.Time_Usage}{" "}
                ชั่วโมง
              </span>
            </div>
            <div className="mb-4">
              <span className="mr-2">สร้างโดย</span>
              <a className="text-green-500 hover:underline">
                ชื่อผู้สอน:{" "}
                {course.lecturer_owner
                  ? `${course.lecturer_owner.first_name} ${course.lecturer_owner.last_name}`
                  : " ไม่ระบุ "}
              </a>
            </div>
            <div className="flex items-center">
              <span className="mr-2">อัพเดทล่าสุด:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/3 order-1 sm:pb-6 md:pb-6 md:order-2">
            <div className="overflow-visible sm:mt-5">
              <div className="bg-white min-h-full rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
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
                <div className="p-6">
                  <div className="text-3xl font-bold mb-4 text-indigo-700 text-end">
                    {course.Price}฿
                  </div>
                  <button
                    className={`w-full px-6 py-3 rounded-lg flex items-center justify-center text-white mb-4 ${
                      isCourseInCart || isUserOwned
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-teal-500 hover:bg-teal-700"
                    }`}
                    onClick={() =>
                      !state.isLoggedIn
                        ? navigate("/login")
                        : addToCart({
                            ...course,
                            course_id: course.documentId,
                          })
                    }
                    disabled={isCourseInCart || isUserOwned}
                  >
                    <FaShoppingCart className="mr-2" />
                    {!isUserOwned && !isCourseInCart
                      ? "Add to Cart"
                      : isCourseInCart && !isUserOwned
                      ? "Already in cart"
                      : "Already owned"}
                  </button>
                  <ul className="text-sm text-black">
                    <li className="flex items-center mb-2 text-black">
                      <FaInfinity className="mr-2" /> เรียนได้ตลอดชีพ
                    </li>
                    <li className="flex items-center mb-2">
                      <FaMobileAlt className="mr-2 text-black" />{" "}
                      เรียนได้ทุกอุปกรณ์
                    </li>
                    <li className="flex items-center mb-2">
                      <FaCertificate className="mr-2 text-black" />{" "}
                      ใบรับรองการจบหลักสูตร
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="md:flex">
          {/* Left Column */}
          <div className="md:w-full lg:w-2/3 pr-8">
            <div className="container mx-auto mb-2 px-4">
              <h2 className="text-2xl font-bold mb-4">หมวดหมู่ที่เกี่ยวข้อง</h2>
              <ul className="flex line-clamp-1">
                {course &&
                  course.categories.map((value) => (
                    <div
                      key={value.id}
                      className="inline-flex bg-white border-2 border-black rounded-md px-3 py-2 text-sm font-semibold text-gray-900 items-center"
                    >
                      {value.tag}
                      <Tooltip content={value.tag}>
                        <div key={value.id}>
                          <img
                            src={
                              categories.find((cat) => cat.name === value.tag)
                                ?.img
                            }
                            alt={value.tag}
                            className="ml-2.5 size-8 object-cover"
                          />
                        </div>
                      </Tooltip>
                    </div>
                  ))}
              </ul>
            </div>

            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-4">เนื้อหาคอร์ส</h2>
              <div>
                {course.topic && course.topic.length > 0 ? (
                  course.topic.map((topic, index) => (
                    <div
                      key={index}
                      className="mb-4 border border-gray-300 rounded-lg"
                    >
                      {/*หัวข้อที่กดขยาย/ย่อได้ */}
                      <button
                        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg focus:outline-none"
                        onClick={() => toggleSection(index)}
                      >
                        <span className="font-semibold">
                          {topic.topic_title}
                        </span>
                        {openSections[index] ? (
                          <FaChevronUp className="text-gray-600" />
                        ) : (
                          <FaChevronDown className="text-gray-600" />
                        )}
                      </button>

                      {/*ส่วนเนื้อหาภายใน */}
                      {openSections[index] && (
                        <div className="p-4 bg-white">
                          {topic.content ? (
                            <ul className="list-none">
                              {topic.content.map((content, contentIndex) => (
                                <li
                                  key={contentIndex}
                                  className="flex items-center py-2 border-b last:border-none"
                                >
                                  <FaPlay className="text-green-500 mr-2" />
                                  <span>
                                    {"  "}
                                    {content.content_title}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">ไม่มีเนื้อหา</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>ไม่มีเนื้อหาคอร์ส</p>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">รายละเอียด</h2>
                <p>{course.Description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">รีวิว</h3>
                {course.rating && course.rating.length > 0 ? (
                  course.rating.map((review, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                      <div className="flex items-center mb-2">
                        <img
                          className="size-12 rounded-full"
                          src={
                            review.users_review.userProfile
                              ? `${conf.apiUrl}${review.users_review.userProfile.url}`
                              : usericon
                          }
                          alt={`${review.users_review.username} Avatar`}
                        />
                        <div className="gird-row-2 grid">
                          <p className="ml-2 font-medium">
                            {review.users_review.first_name}{" "}
                            {review.users_review.last_name}
                          </p>
                          <p className="ml-1.5 text-sm">
                            <Rating
                              value={review.star}
                              readonly
                              size="small"
                              readOnly
                            />
                          </p>
                        </div>
                      </div>
                      <p className="ml-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">ยังไม่มีรีวิวสำหรับคอร์สนี้</p>
                )}
              </div>

              {/* ส่วนข้อมูลวิทยากร */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  วิทยากร
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
                  {/* ส่วนรูปภาพ */}
                  <div className="flex flex-col items-center">
                    <img
                      src={course.lecturer_owner?.profileImage || usericon}
                      alt="วิทยากร"
                      className="w-32 h-32 rounded-full object-cover mb-4"
                    />
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Rating
                          value={averageLecturerRating}
                          readonly
                          size="small"
                          readOnly
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        คะแนนวิทยากร 4.7
                      </span>
                    </div>
                  </div>

                  {/* ส่วนข้อมูลรายละเอียด */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {course.lecturer_owner
                          ? `${course.lecturer_owner.first_name} ${course.lecturer_owner.last_name}`
                          : "ไม่ระบุผู้สอน"}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        Programmer, Developer
                      </p>
                    </div>

                    {/* สถิติ */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          14
                        </div>
                        <div className="text-sm text-gray-600">หลักสูตร</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          13,593
                        </div>
                        <div className="text-sm text-gray-600">ผู้เรียน</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          200,000+
                        </div>
                        <div className="text-sm text-gray-600">ผู้ติดตาม</div>
                      </div>
                    </div>

                    {/* คำอธิบาย */}
                    <p className="text-gray-700 leading-relaxed">
                      เจ้าของเทจ KongRuksiam Studio สอนเขียนโปรแกรมในช่อง
                      YouTube KongRuksiam Official และ KongRuksiam Tutorial
                    </p>

                    {/* ข้อความแนะนำ */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 italic">
                        "สำหรับท่านใดที่สนใจส่วนลดคอร์สเรียน
                        สามารถดูรายละเอียดได้ที่ช่อง YouTube หรือเพจ Facebook
                        ตามลิงก์ด้านล่างได้เลย"
                      </p>
                    </div>

                    {/* ปุ่มสังคมมีเดีย */}
                    <div className="flex gap-3">
                      <a
                        href="https://youtube.com/kongruksiam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-600 text-white rounded-full flex items-center hover:bg-red-700 transition"
                      >
                        <img
                          src="https://www.svgrepo.com/show/475689/youtube-color.svg"
                          className="w-5 h-5 mr-2"
                          alt="YouTube"
                        />
                        YouTube
                      </a>
                      <a
                        href="https://facebook.com/kongruksiam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center hover:bg-blue-700 transition"
                      >
                        <img
                          src="https://www.svgrepo.com/show/475664/facebook-color.svg"
                          className="w-5 h-5 mr-2"
                          alt="Facebook"
                        />
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-0 relative hidden sm:hidden md:hidden lg:block lg:w-2/6">
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              exit={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="sticky top-20 overflow-visible"
            >
              <div className="bg-white min-h-full  rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
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
                <div className="p-6">
                  <div className="text-3xl font-bold mb-4 text-indigo-700 text-end">
                    {course.Price}฿
                  </div>
                  <button
                    className={`w-full px-6 py-3 rounded-lg flex items-center justify-center text-white mb-4 ${
                      isCourseInCart || isUserOwned
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-teal-500 hover:bg-teal-700"
                    }`}
                    onClick={() =>
                      !state.isLoggedIn
                        ? navigate("/login")
                        : addToCart({
                            ...course,
                            course_id: course.documentId,
                          })
                    }
                    disabled={(isCourseInCart, isUserOwned)}
                  >
                    <FaShoppingCart className="mr-2" />
                    {!isUserOwned && !isCourseInCart
                      ? "Add to Cart"
                      : isCourseInCart && !isUserOwned
                      ? "Already in cart"
                      : "Already owned"}
                  </button>
                  <ul className="text-sm text-black">
                    <li className="flex items-center mb-2 text-black">
                      <FaInfinity className="mr-2" /> เรียนได้ตลอดชีพ
                    </li>
                    <li className="flex items-center mb-2">
                      <FaMobileAlt className="mr-2 text-black" />{" "}
                      เรียนได้ทุกอุปกรณ์
                    </li>
                    <li className="flex items-center mb-2">
                      <FaCertificate className="mr-2 text-black" />{" "}
                      ใบรับรองการจบหลักสูตร
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

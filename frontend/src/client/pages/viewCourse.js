"use client";

import { Breadcrumbs } from "@material-tailwind/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/Cart.context";
import { AuthContext } from "../../context/Auth.context";
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

export default function ViewCourse() {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { addToCart, cartItems } = useCart();
  const { name, documentId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({}); // ✅ จัดการ state ของ dropdown แต่ละหัวข้อ

  const baseURL = "http://localhost:1337";

  const fetchCourse = async () => {
    try {
      const response = await ax.get(
        `courses?filters[documentId][$eq]=${documentId}&populate[0]=topic.content&populate[1]=lecturer_owner&populate[2]=rating&populate[3]=user_owner`
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

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // ดาวเต็ม
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // ดาวครึ่ง
    const emptyStars = 5 - fullStars - halfStars; // ดาวที่ว่าง
  };
  const isCourseInCart = cartItems.some((item) => item.id === course.id);
  const isUserOwned = course.user_owner?.some(
    (owner) => owner.id === state.user.id
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
        <div className="container mx-auto w-full px-4 flex overflow-visible">
          <div className="md:flex w-full">
            <div className="md:w-2/3 pr-8 w-full">
              <h1 className="text-3xl font-bold mb-4">{course.Name}</h1>
              <p
                className="text-xl mb-4
              "
              >
                {course.Description === null
                  ? "ไม่มีการบรรยาย"
                  : course.Description}
              </p>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < 4 ? "text-yellow-400" : "text-gray-400"}
                    />
                  ))}
                </div>
                <span className="mr-2">4.8</span>
                <span className="text-gray-400">(320 รีวิว)</span>
              </div>
              <div className="flex items-center mb-4">
                <span className="mr-4">จำนวนผู้เรียน 1,234 คน</span>
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

            <div className="md:w-1/3">
              <div className=" overflow-visible">
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
                      {isUserOwned
                        ? isCourseInCart
                          ? "Already in cart"
                          : "You're already owned this course"
                        : "Add to Cart"}
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
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="md:flex">
          {/* Left Column */}
          <div className="md:w-2/3 pr-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                สิ่งที่คุณจะได้เรียนรู้
              </h2>
              <ul className="grid grid-cols-2 gap-4">
                {[
                  "เรียนรู้ A",
                  "เข้าใจ B",
                  "ฝึกปฏิบัติ C",
                  "สร้างโปรเจค D",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaPlay className="text-green-500 mt-1 mr-2" />
                    <span>{item}</span>
                  </li>
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

              <div>
                <h2 className="text-2xl font-bold mb-4">รีวิวจากผู้เรียน</h2>
                {course.rating && course.rating.length > 0 ? (
                  <>
                    {course.rating.map((reviewer, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-md mb-4"
                      >
                        <div className="flex mb-2">
                          {renderStars(reviewer.star)}{" "}
                          {/* แสดงดาวตามคะแนนของรีวิว */}
                        </div>
                        <p className="text-gray-800 mb-2">{reviewer.comment}</p>
                        <p className="text-sm text-gray-500">
                          - {reviewer.name}
                        </p>
                      </div>
                    ))}

                    {/* แสดงคะแนนเฉลี่ย */}
                    <div className="mt-4">
                      <h3 className="font-semibold text-lg">คะแนนเฉลี่ย: </h3>
                      <div className="flex mb-2">
                        {renderStars(averageRating)}{" "}
                        {/* แสดงดาวตามคะแนนเฉลี่ย */}
                      </div>
                      <p>คะแนนเฉลี่ย: {averageRating.toFixed(1)} / 5</p>
                    </div>
                  </>
                ) : (
                  <p>ยังไม่มีรีวิว</p>
                )}
              </div>
            </div>
          </div>
          <div className="md:w-1/3 relative">
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
                    {isUserOwned
                      ? isCourseInCart
                        ? "Already in cart"
                        : "You're already owned this course"
                      : "Add to Cart"}
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

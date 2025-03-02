import { Breadcrumbs, Tooltip } from "@material-tailwind/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/Cart.context";
import { AuthContext } from "../../context/Auth.context";
import usericon from "../../admin/components/Image/user-icon.webp";
import {
  FaClock,
  FaShoppingCart,
  FaPlay,
  FaInfinity,
  FaMobileAlt,
  FaCertificate,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ax from "../../conf/ax";
import conf from "../../conf/main";

// Import images
import webpic from "../components/static/web-100.png";
import datapic from "../components/static/data.png";
import hardwarepic from "../components/static/hardware.png";
import networkpic from "../components/static/network.png";
import gamepic from "../components/static/game.png";
import morepic from "../components/static/more.png";
import allpic from "../../admin/components/Image/All.png";
import { Rating } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function ViewCourse() {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { addToCart, cartItems } = useCart();
  const { documentId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isPending, setisPending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const baseURL = conf.apiUrl;

  const fetchCourse = async () => {
    try {
      const response = await ax.get(
        `courses?filters[documentId][$eq]=${documentId}&populate[0]=topic.content&populate[1]=lecturer_owner.created_courses&populate[2]=rating.users_review.profile_picture&populate[3]=categories&populate[4]=user_owner&populate[5]=lecturer_owner.rating&populate[6]=image`
      );
      const now_course = response.data.data;
      setCourse(now_course[0]);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    const response = await ax.get(
      `confirm-purchases?populate[0]=users_purchase&populate[1]=course_purchase&filters[status_confirm][$in][0]=waiting&filters[course_purchase][documentId][$in][1]=${documentId}`
    );
    console.log(response.data.data);
    if (
      response?.data?.data?.some(
        (item) => item.users_purchase?.username === state.user?.username
      )
    ) {
      setisPending(true);
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
    fetchPending();
    if (
      course &&
      course?.user_owner?.some((owner) => owner?.id === state.user?.id)
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
    console.log(openSections);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-br from-black to-cyan-900 text-white pt-4 pb-8 sm:py-16">
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
          <div className="md:w-2/3 pr-8 w-full order-1 md:order-1 mb-5">
            <h1 className="text-3xl font-bold mb-4 ">{course.Name}</h1>
            <p className="text-xl mb-4">
              {course.Description === null
                ? "ไม่มีการบรรยาย"
                : course.Description}
            </p>
            <div className="flex items-center mb-4">
              <div className="flex bg-white rounded-full mr-2">
                <Rating
                  value={averageRating}
                  size=""
                  readOnly
                  precision={0.5}
                  className="mx-1"
                />
              </div>
              <span className="mr-2">{averageRating.toFixed(1)} ดาว</span>
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
          <div className="md:w-1/3 order-2  md:pb-6 md:order-2">
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
                      isCourseInCart || isUserOwned || isPending
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-700 to-purple-600 hover:bg-gradient-to-t hover:from-light-blue-900 hover:to-blue-900 transition-colors duration-300"
                    }`}
                    onClick={() =>
                      !state.isLoggedIn
                        ? setShowModal(true)
                        : addToCart(
                            {
                              ...course,
                              rating: course.rating,
                              lecturer_owner: course.lecturer_owner,
                              Time_Usage: course.Time_Usage,
                              course_id: course.documentId,
                            },
                            toast.success("เพิ่มคอร์สลงในรถเข็นแล้ว!", {
                              position: "bottom-left",
                              duration: 2000,
                              style: {
                                fontSize: "1.2rem",
                                padding: "20px",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderRadius: "10px",
                                color: "green",
                              },
                            })
                          )
                    }
                    disabled={isCourseInCart || isUserOwned || isPending}
                  >
                    <FaShoppingCart className="mr-2" />
                    {!isUserOwned && !isCourseInCart && !isPending
                      ? "เพิ่มลงรถเข็น"
                      : isCourseInCart && !isUserOwned && !isPending
                      ? "คอร์สอยู่ในรถเข็น"
                      : !isCourseInCart && isUserOwned && !isPending
                      ? "เป็นเจ้าของแล้ว"
                      : "รอการอนุมัติ"}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-3xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
            <p className="text-gray-900 mb-4">
              คุณต้องเข้าสู่ระบบก่อนที่จะซื้อคอร์สเรียน
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                onClick={() => setShowModal(false)}
              >
                ปิด
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-700 to-purple-600 hover:bg-gradient-to-t hover:from-light-blue-900 hover:to-blue-900 transition-colors duration-300 text-white rounded-lg"
                onClick={() => navigate("/login")}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="md:flex">
          {/* Left Column */}
          <div className="md:w-full lg:w-2/3 pr-8">
            <div className="container mx-auto mb-2 px-4">
              <h2 className="text-2xl font-bold mb-4">หมวดหมู่ที่เกี่ยวข้อง</h2>
              <ul className="flex line-clamp-1">
                {course ? (
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
                  ))
                ) : (
                  <div className="inline-flex bg-white border-2 border-black rounded-md px-3 py-2 text-sm font-semibold text-gray-900 items-center">
                    ไม่หมวดหมู่แสดง
                  </div>
                )}
              </ul>
            </div>

            <div className="container mx-auto px-4 mt-8">
              <h2 className="text-2xl font-bold mb-4">รายละเอียด</h2>
              <p>
                {course.Description ? course.Description : "ไม่ระบุรายละเอียด"}
              </p>
            </div>

            <div className="container mx-auto px-4 py-8 ">
              <h2 className="text-2xl font-bold mb-4">เนื้อหาคอร์ส</h2>
              <div className="max-h-[800px] overflow-y-auto pr-2">
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
                        <span className="font-semibold text-start">
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
                          {topic?.content.length > 0 ? (
                            <ul className="list-none ">
                              {topic.content.map((content, contentIndex) => (
                                <li
                                  key={contentIndex}
                                  className="flex items-center py-2  border-b last:border-none"
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
                            <ul className="list-none ">
                              <li className="flex items-center py-2 border-b last:border-none">
                                <span className="text-black">ไม่มีเนื้อหา</span>
                              </li>
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>ไม่มีเนื้อหาคอร์ส</p>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold mb-4">รีวิว</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  {course.rating && course.rating.length > 0 ? (
                    course.rating.map((review, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border rounded-lg bg-white shadow"
                      >
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
                          <div className="grid grid-rows-2 ml-2">
                            <p className="font-medium">
                              {review.users_review.first_name}{" "}
                              {review.users_review.last_name}
                            </p>
                            <p className="text-sm">
                              <Rating
                                value={review.star}
                                readonly
                                size="small"
                              />
                            </p>
                          </div>
                        </div>
                        <p className="ml-2 text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="mb-4 p-4 bg-white rounded-lg text-gray-800 shadow-lg">
                      ยังไม่มีรีวิวสำหรับคอร์สนี้
                    </p>
                  )}
                </div>
              </div>

              {/* ส่วนข้อมูลวิทยากร */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  ผู้สอน
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
                          size="small"
                          readOnly
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        คะแนนวิทยากร {averageLecturerRating.toFixed(1)}
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
                          {course?.lecturer_owner?.created_courses
                            ? course?.lecturer_owner?.created_courses?.length
                            : "0"}{" "}
                        </div>
                        <div className="text-sm text-gray-600">หลักสูตร</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {course?.user_owner
                            ? course?.user_owner?.length
                            : "0"}{" "}
                        </div>
                        <div className="text-sm text-gray-600">ผู้เรียน</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          มากกว่า 9000
                        </div>
                        <div className="text-sm text-gray-600">ผู้ติดตาม</div>
                      </div>
                    </div>

                    {/* คำอธิบาย */}
                    <p className="text-gray-700 leading-relaxed">
                      {course.lecturer_owner?.background
                        ? course.lecturer_owner?.background
                        : "ไม่มีข้อมูลอาจารย์ผู้สอน"}
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
                        <YouTubeIcon />
                        YouTube
                      </a>
                      <a
                        href="https://facebook.com/kongruksiam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center hover:bg-blue-700 transition"
                      >
                        <FacebookIcon />
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-0 relative hidden sm:hidden md:hidden lg:block lg:w-2/6 mb-16">
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
                duration: 1,
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
                      isCourseInCart || isUserOwned || isPending
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-700 to-purple-600 hover:bg-gradient-to-t hover:from-light-blue-900 hover:to-blue-900 transition-colors duration-300"
                    }`}
                    onClick={() =>
                      !state.isLoggedIn
                        ? setShowModal(true)
                        : addToCart({
                            ...course,
                            rating: course.rating,
                            lecturer_owner: course.lecturer_owner,
                            Time_Usage: course.Time_Usage,
                            course_id: course.documentId,
                          })
                    }
                    disabled={isCourseInCart || isUserOwned || isPending}
                  >
                    <FaShoppingCart className="mr-2" />
                    {!isUserOwned && !isCourseInCart && !isPending
                      ? "เพิ่มลงรถเข็น"
                      : isCourseInCart && !isUserOwned && !isPending
                      ? "คอร์สอยู่ในรถเข็น"
                      : !isCourseInCart && isUserOwned && !isPending
                      ? "เป็นเจ้าของแล้ว"
                      : "รอการอนุมัติ"}
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

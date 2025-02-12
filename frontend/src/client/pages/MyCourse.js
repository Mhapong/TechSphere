import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import ax from "../../conf/ax";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@mui/icons-material";
import networkpic from "../components/network.png";

export default function MyCourse() {
    const [user, setUser] = useState(null);  // ข้อมูลผู้ใช้
    const [ownedCourses, setOwnedCourses] = useState([]);  // คอร์สที่ผู้ใช้ลงทะเบียน
    const [courseData, setCourseData] = useState([]);  // คอร์สทั้งหมด
    const [loading, setLoading] = useState(true);  // สถานะการโหลด
    const [error, setError] = useState(null);  // สถานะข้อผิดพลาด
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // ดึงข้อมูลผู้ใช้และคอร์สที่ผู้ใช้ลงทะเบียน
        const fetchUserData = async () => {
            try {
                const response = await ax.get("http://localhost:1337/api/users/me?populate=owned_course");
                console.log("✅ User Data:", response.data);
                setUser(response.data);  // เก็บข้อมูลผู้ใช้
                setOwnedCourses(response.data.owned_course || []);  // เก็บคอร์สที่ผู้ใช้ลงทะเบียน
            } catch (err) {
                console.error("🚨 Error fetching user data:", err);
                setError(err);
            }
        };

        // ดึงข้อมูลคอร์สทั้งหมด
        const fetchCourses = async () => {
            try {
                const response = await ax.get("http://localhost:1337/api/courses?populate=*");
                console.log("✅ Course Data:", response.data.data);
                setCourseData(response.data.data);  // เก็บคอร์สทั้งหมด
            } catch (err) {
                console.error("🚨 Error fetching courses:", err);
                setError(err);
            }
        };

        fetchUserData();
        fetchCourses();
        setLoading(false);  // ปรับสถานะการโหลดเป็น false หลังจากดึงข้อมูลเรียบร้อย
    }, []);

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const filteredCourses = ownedCourses.filter((course) =>
        course.Name.toLowerCase().includes(query.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;  // กรณีที่ยังโหลดข้อมูล
    if (error) return <div>Error: {error.message}</div>;  // กรณีที่เกิดข้อผิดพลาด

    return (
        <div className="container mx-auto mt-10 p-5">
            <h1 className="text-4xl font-bold mb-5">
                ยินดีต้อนรับคุณ, {user ? user.username : "Guest"}
            </h1>

            {/* Search Bar */}
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

            {/* กรอบรอบทั้งหมด */}
            {filteredCourses.length > 0 ? (
                <div className="border border-gray-300 p-5 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold">คอร์สของฉัน</h2>
                    <div
                        id="slider"
                        className="flex h-[32rem] w-full overflow-x-auto my-7 scroll-smooth whitespace-nowrap gap-10 items-center scrollbar-hide"
                    >
                        {filteredCourses.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.1 }}
                                className="min-w-80 border border-blue-200 rounded-lg shadow-md p-4 cursor-pointer"
                                onClick={() => navigate(`/contentstudy/${item.documentId}`)}
                            >
                                {/* รูปภาพคอร์ส */}
                                <div className="overflow-hidden rounded-lg">
                                    <img
                                        src={item.image}
                                        alt="Course Image"
                                        className="object-contain w-full h-[270px]"
                                    />
                                </div>

                                {/* รายละเอียดคอร์ส */}
                                <div className="mt-4 w-72">
                                    <p className="truncate whitespace-nowrap overflow-hidden">{item.Name}</p>
                                    <p className="uppercase text-green-600 text-xs font-medium break-words">
                                        {item.lecturer_owner
                                            ? `${item.lecturer_owner.first_name} ${item.lecturer_owner.last_name}`
                                            : "ไม่มีผู้สอน"}
                                    </p>
                                </div>
                                
                                {/* % การเรียน */}
                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                        style={{ width: '45%' }}
                                    >
                                        45%
                                    </div>
                                </div>


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
                                            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                                        />
                                    </svg>
                                </button>
                                {/* <!-- Product Image --> */}
                                <div>
                                    <Image
                                        src="https://primecomputer.com.bd/wp-content/uploads/2024/07/oraimo-headphones.jpg"
                                        alt="Product Image"
                                        className="object-contain w-full h-[270px] fill"
                                    />
                                </div>
                                {/* <!-- Product Details --> */}
                                <div className="mt-4">
                                    <p className="text-black text-lg font-semibold line-clamp-[calc(var(--characters)/20)] h-full w-full">
                                        {items.Name}
                                    </p>
                                    {items.lecturer_owner !== null ? (
                                        <p className="uppercase text-green-600 text-xs font-medium">
                                            {items.lecturer_owner.first_name}{" "}
                                            {items.lecturer_owner.last_name}
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
                                            <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-gray-300"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
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
        </div>
    );
}
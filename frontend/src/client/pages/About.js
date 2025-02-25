import React, { useState, useEffect, useCallback } from "react";
import techspherepic from "../components/logo.png";
import definitionpic from "../components/definition.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"

const AboutPage = () => {
    const navigate = useNavigate();
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";

    const fetchLecturers = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users`, {
                params: { populate: ["profile_picture"] },
            });

            console.log("API Response:", response.data);

            if (response.data?.length > 0) {
                // กรองข้อมูลเฉพาะที่มี role เป็น "Lecturer"
                const lecturersData = response.data.filter(
                    (user) => user.username === "lecturer"
                );
                setLecturers(lecturersData);
            } else {
                setLecturers([]);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูลอาจารย์:", err);
        } finally {
            setLoading(false);
        }
    }, [BASE_URL]);

    useEffect(() => {
        fetchLecturers();
    }, [fetchLecturers]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8">
            <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
                <img className="object-cover object-center w-full h-96" src={techspherepic || "/placeholder.svg"} alt="Techsphere" />
            </div>

            <div className="text-center space-y-4">
                <p className="text-4xl font-bold text-gray-900">ศูนย์กลางการเรียนรู้ด้านเทคโนโลยี</p>
                <p className="text-3xl font-semibold text-blue-600">TechSphere</p>
            </div>

            <blockquote className="max-w-4xl text-2xl leading-relaxed text-center text-gray-700">
                <p className="italic font-semibold">"TechSphere คือองค์กรที่มุ่งเน้นการเสริมสร้างความรู้และทักษะด้านเทคโนโลยีสมัยใหม่
                    ผ่านการเรียนการสอนที่เข้มข้นและมีประสิทธิภาพ ไม่ว่าจะเป็นการพัฒนาซอฟต์แวร์ ปัญญาประดิษฐ์
                    ความปลอดภัยทางไซเบอร์ หรือเทคโนโลยีอื่น ๆ ที่กำลังเปลี่ยนแปลงโลก
                    เราเชื่อว่าการเรียนรู้เทคโนโลยีไม่ควรจำกัดอยู่แค่ในห้องเรียน แต่ควรเป็นประสบการณ์ที่สามารถนำไปใช้ได้จริงในชีวิตและอาชีพ
                    ด้วยหลักสูตรที่ออกแบบโดยผู้เชี่ยวชาญและอัปเดตให้ทันสมัยอยู่เสมอ TechSphere เป็นศูนย์กลางแห่งการเรียนรู้ที่เปิดโอกาสให้ผู้เรียนทุกระดับ
                    ไม่ว่าจะเป็นผู้เริ่มต้น นักพัฒนา หรือแม้แต่องค์กรที่ต้องการพัฒนาทักษะทีมงาน
                    เราพร้อมพาคุณก้าวสู่อนาคตของเทคโนโลยีด้วยการเรียนรู้ที่มีประสิทธิภาพและสนุกสนาน"</p>
            </blockquote>

            <div className="w-screen overflow-hidden">
                <img className="w-screen h-auto object-cover" src={definitionpic || "/placeholder.svg"} alt="definition" />
            </div>

            <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400"
                    >
                        คณาจารย์ผู้เชี่ยวชาญ
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center text-blue-800 dark:text-blue-200 max-w-3xl mx-auto mb-12 text-lg"
                    >
                        เราพร้อมนำเสนอคอร์สเรียนที่ทันสมัย จากเหล่าอาจารย์ผู้มีความเชี่ยวชาญ...
                    </motion.p>

                    {loading ? (
                        <p className="text-center text-blue-600 dark:text-blue-400">กำลังโหลดข้อมูล...</p>
                    ) : lecturers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {lecturers.map((lecturer) => (
                                <motion.div
                                    key={lecturer.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer"
                                    onClick={() =>
                                        navigate(
                                            `/lecturer-background/${lecturer.first_name}-${lecturer.last_name}`
                                        )
                                    }
                                >
                                    <div className="aspect-square relative">
                                        <img
                                            src={`${BASE_URL}${lecturer.profile_picture &&
                                                    lecturer.profile_picture.length > 0
                                                    ? lecturer.profile_picture[0].formats?.thumbnail?.url ||
                                                    lecturer.profile_picture[0].url
                                                    : "/placeholder.svg"
                                                }`}
                                            alt={`${lecturer.first_name} ${lecturer.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/60 to-transparent" />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-1">
                                            {lecturer.first_name} {lecturer.last_name}
                                        </h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-300">
                                            {lecturer.position || "อาจารย์"}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-blue-600 dark:text-blue-400">ไม่พบข้อมูลอาจารย์</p>
                    )}
                </div>
            </section>

            <section className="bg-white dark:bg-gray-900">
                {/*ช่องที่ 1*/}
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
                        <a href="#" className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-blue-400 mb-2">
                            <svg className="w-4 h-4 me-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z" />
                            </svg>
                            All courses
                        </a>
                        <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-extrabold mb-2">เปลี่ยนตัวเองให้พร้อมสำหรับโลกอนาคตแห่งยุคดิจิทัล!</h1>
                        <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">เพิ่มพูนทักษะดิจิทัลของคุณ และก้าวสู่อนาคตอย่างมั่นใจ.</p>
                        <a href="/explore" className="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                            เลือกคอร์สเรียน
                            <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </a>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                            <a href="#" className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2">
                                <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                                </svg>
                                Design
                            </a>
                            <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">Start with Flowbite Design System</h2>
                            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.</p>
                            <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more
                                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                            <a href="#" className="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2">
                                <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15" />
                                </svg>
                                Code
                            </a>
                            <h2 className="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">Best react libraries around the web</h2>
                            <p className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.</p>
                            <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more
                                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;


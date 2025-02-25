import { useState, useEffect, useCallback } from "react"
import techspherepic from "../components/logo.png"
import definitionpic from "../components/definition.png"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"

const AboutPage = () => {
    const navigate = useNavigate()
    const [lecturers, setLecturers] = useState([])
    const [loading, setLoading] = useState(true)
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337"

    const fetchLecturers = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users`, {
                params: { populate: ["profile_picture", "role"] },
            })

            console.log("API Response:", response.data)

            if (response.data?.length > 0) {
                const lecturersData = response.data.filter((user) => user.role?.type === "lecturer")
                setLecturers(lecturersData)
            } else {
                setLecturers([])
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูลอาจารย์:", err)
        } finally {
            setLoading(false)
        }
    }, [BASE_URL])

    useEffect(() => {
        fetchLecturers()
    }, [fetchLecturers])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-[80vh] sm:h-[70vh] md:h-[60vh] lg:h-[50vh] xl:h-[40vh] bg-gradient-to-r from-blue-600 to-teal-300 flex items-center justify-center mb-12"
            >
                <img
                    className="object-cover object-center w-auto h-auto max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] max-h-full opacity-70"
                    src={techspherepic || "/placeholder.svg"}
                    alt="Techsphere"
                />
            </motion.div>

            {/* Title Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center space-y-4 mb-12"
            >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ">
                    ศูนย์กลางการเรียนรู้ด้านเทคโนโลยี
                </h1>
                <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">TechSphere</p>
            </motion.div>

            {/* Blockquote Section */}
            <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-4xl mx-8 p-8 text-xl md:text-2xl leading-relaxed text-center text-gray-700 dark:text-gray-300 
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-12"
            >
                <p className="italic font-medium text-xl mb-12">"TechSphere คือองค์กรที่มุ่งเน้นการเสริมสร้างความรู้และทักษะด้านเทคโนโลยีสมัยใหม่ 
                    ผ่านคอร์สเรียนออนไลน์ที่ออกแบบมาเพื่อให้ผู้เรียนสามารถพัฒนาทักษะได้ทุกที่ทุกเวลา พร้อมเนื้อหาที่อัปเดตตามเทรนด์เทคโนโลยีล่าสุด  
                    โดยมีหลักสูตรที่ครอบคลุมตั้งแต่พื้นฐานไปจนถึงระดับสูง สอนโดยผู้เชี่ยวชาญในอุตสาหกรรม เพื่อให้คุณนำความรู้ไปต่อยอดในการทำงานและสร้างโอกาสใหม่ๆ ในสายอาชีพของคุณ"</p>

                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Innovative
                </h1>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">นวัตกรรมที่ล้ำสมัยในการเรียนรู้เทคโนโลยี</p>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Empowering
                </h1>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">ส่งเสริมและพัฒนาทักษะให้ทุกคนก้าวสู่ยุคดิจิทัล</p>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Future-Ready
                </h1>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">เตรียมความพร้อมให้คุณรับมือกับอนาคตของเทคโนโลยี</p>
            </motion.blockquote>

            {/* Definition Part */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center space-y-4 mb-12"
            >
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ">
                Innovative
                </h1>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">นวัตกรรมที่ล้ำสมัยในการเรียนรู้เทคโนโลยี</p>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ">
                Empowering
                </h1>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">ส่งเสริมและพัฒนาทักษะให้ทุกคนก้าวสู่ยุคดิจิทัล</p>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ">
                Future-Ready
                </h1>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">เตรียมความพร้อมให้คุณรับมือกับอนาคตของเทคโนโลยี</p>
            </motion.div> */}

            {/* Lecturers Section */}
            <section className="w-full py-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            คณาจารย์ผู้เชี่ยวชาญ
                        </h2>
                        <p className="text-blue-800 dark:text-blue-200 max-w-3xl mx-auto text-lg">
                        เราพร้อมนำเสนอคอร์สเรียนที่ทันสมัย จากเหล่าอาจารย์ผู้มีความเชี่ยวชาญหลากหลายด้านและมีประสบการณ์
                         เพื่อช่วยให้ผู้เรียนเข้าใจเนื้อหาได้อย่างลึกซึ้ง ผ่านการสอนที่เป็นระบบ และสามารถนำไปประยุกต์ใช้ได้จริง...
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : lecturers.length > 0 ? (
                        <div className="relative px-4 md:px-12">
                            <div
                                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                    WebkitOverflowScrolling: "touch",
                                }}
                            >
                                {lecturers.map((lecturer) => (
                                    <motion.div
                                        key={lecturer.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex-none w-[280px] md:w-[320px] snap-center bg-white dark:bg-gray-700 rounded-xl 
                      shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        onClick={() => navigate(`/lecturer-background/${lecturer.first_name}-${lecturer.last_name}`)}
                                    >
                                        <div className="aspect-square relative">
                                            <img
                                                src={`${BASE_URL}${lecturer.profile_picture && lecturer.profile_picture.length > 0
                                                    ? lecturer.profile_picture[0].formats?.thumbnail?.url || lecturer.profile_picture[0].url
                                                    : "/placeholder.svg"
                                                    }`}
                                                alt={`${lecturer.first_name} ${lecturer.last_name}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                                        </div>
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                                {lecturer.first_name} {lecturer.last_name}
                                            </h3>
                                            <p className="text-sm text-blue-600 dark:text-blue-300">{lecturer.position || "อาจารย์"}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-blue-600 dark:text-blue-400">ไม่พบข้อมูลอาจารย์</p>
                    )}
                </div>
            </section>

            {/* Courses Section */}
            <section className="w-full bg-white dark:bg-gray-900 py-16">
                <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 
              dark:border-gray-700 rounded-2xl p-8 md:p-12 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <a
                            href="#"
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-400 text-white 
                dark:bg-blue-900/30 dark:text-blue-400 mb-4"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                            </svg>
                            All courses
                        </a>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            เปลี่ยนตัวเองให้พร้อมสำหรับโลกอนาคตแห่งยุคดิจิทัล!
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">เพิ่มพูนทักษะดิจิทัลของคุณ และก้าวสู่อนาคตอย่างมั่นใจ</p>
                        <a
                            href="/explore"
                            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-400 hover:bg-blue-700 
                text-white font-medium transition-colors duration-300"
                        >
                            เลือกคอร์สเรียน
                            <svg
                                className="w-4 h-4 ml-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage
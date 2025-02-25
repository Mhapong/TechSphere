"use client"

import { useEffect, useState, useContext, useCallback } from "react"
import ax from "../../conf/ax"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { AuthContext } from "../../context/Auth.context.js"
import axios from "axios"

// Review Modal Component with enhanced styling
const ReviewModal = ({
    isOpen,
    onClose,
    rating,
    setRating,
    comment,
    setComment,
    selectedCourse,
    user,
    setHasReviewedCourses,
    readOnly = false,
    hasReviewedCourses = {},
    refreshReviews,
}) => {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full relative border border-gray-200 dark:border-gray-700"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                        {readOnly ? "Your Review" : "ให้คะแนน & รีวิวคอร์สเรียน"}
                    </h3>
                    <div className="flex justify-center mb-6 space-x-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onClick={() => !readOnly && setRating(num)}
                                className={`transform transition-transform hover:scale-110 ${num <= rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="เขียนรีวิวคอร์สเรียน บอกเล่าประสบการณ์ที่ได้เรียนในคอร์ส :)"
                        value={comment}
                        onChange={(e) => !readOnly && setComment(e.target.value)}
                        className="w-full p-4 mb-6 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 
              dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 
              dark:focus:ring-blue-400 focus:border-transparent transition-all"
                        rows="4"
                        readOnly={readOnly}
                    />
                    {!readOnly && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async (e) => {
                                e.preventDefault()
                                if (rating < 1) {
                                    alert("กรุณาให้คะแนนอย่างน้อย 1 ดาว")
                                    return
                                }
                                if (hasReviewedCourses[String(selectedCourse?.id)]) {
                                    alert("คุณได้รีวิวคอร์สนี้ไปแล้ว")
                                    onClose()
                                    return
                                }
                                const isConfirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการส่งรีวิวนี้? หากยืนยันแล้วจะไม่สามารถแก้ไขได้อีก")
                                if (!isConfirmed) return

                                try {
                                    const response = await ax.post("reviews?populate=*", {
                                        data: {
                                            star: rating,
                                            comment,
                                            review_id: selectedCourse?.id,
                                            users_review: user?.id,
                                        },
                                    })
                                    setHasReviewedCourses((prev) => ({
                                        ...prev,
                                        [String(selectedCourse.id)]: { rating, comment },
                                    }))
                                    onClose()
                                    setRating(0)
                                    setComment("")
                                    alert("ส่งรีวิวเรียบร้อยแล้ว!")
                                } catch (error) {
                                    console.error("Error submitting review:", error)
                                    alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
                                }
                            }}
                            className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium shadow-lg 
                hover:shadow-xl transition-all duration-200"
                        >
                            ยืนยันการรีวิว
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// TeacherReviewModal Component with similar enhanced styling
const TeacherReviewModal = ({
    isOpen,
    onClose,
    rating,
    setRating,
    comment,
    setComment,
    selectedTeacher,
    user,
    setHasReviewedTeacher,
    readOnly = false,
    hasReviewedTeacher = {},
    refreshReviews,
}) => {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full relative border border-gray-200 dark:border-gray-700"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                        {readOnly ? "Your Review" : "ให้คะแนน & รีวิวอาจารย์ผู้สอน"}
                    </h3>
                    <div className="flex justify-center mb-6 space-x-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onClick={() => !readOnly && setRating(num)}
                                className={`transform transition-transform hover:scale-110 ${num <= rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="เขียนรีวิวอาจารย์ผู้สอน เพื่อการปรับปรุงคุณภาพการสอนที่ดีมากยิ่งขึ้น :)"
                        value={comment}
                        onChange={(e) => !readOnly && setComment(e.target.value)}
                        className="w-full p-4 mb-6 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 
              dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 
              dark:focus:ring-blue-400 focus:border-transparent transition-all"
                        rows="4"
                        readOnly={readOnly}
                    />
                    {!readOnly && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={async (e) => {
                                e.preventDefault()
                                if (rating < 1) {
                                    alert("กรุณาให้คะแนนอย่างน้อย 1 ดาว")
                                    return
                                }
                                if (hasReviewedTeacher[String(selectedTeacher?.id)]) {
                                    alert("คุณได้รีวิวอาจารย์ท่านนี้ไปแล้ว")
                                    onClose()
                                    return
                                }
                                const isConfirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการส่งรีวิวนี้? หากยืนยันแล้วจะไม่สามารถแก้ไขได้อีก")
                                if (!isConfirmed) return

                                try {
                                    const response = await ax.post("lecturer-reviews?populate=*", {
                                        data: {
                                            star: rating,
                                            comment,
                                            review: user?.id,
                                            lecturer_review_id: selectedTeacher?.id,
                                        },
                                    })
                                    setHasReviewedTeacher((prev) => ({
                                        ...prev,
                                        [String(selectedTeacher.id)]: { rating, comment },
                                    }))
                                    onClose()
                                    setRating(0)
                                    setComment("")
                                    alert("ส่งรีวิวอาจารย์เรียบร้อยแล้ว!")
                                } catch (error) {
                                    console.error("Error submitting review:", error)
                                    alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
                                }
                            }}
                            className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 
                hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium shadow-lg 
                hover:shadow-xl transition-all duration-200"
                        >
                            ยืนยันการรีวิว
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

// Main Component
export default function MyCourse() {
    const [user, setUser] = useState(null)
    const [ownedCourses, setOwnedCourses] = useState([])
    const [courseData, setCourseData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const navigate = useNavigate()
    const [isTeacherReviewOpen, setIsTeacherReviewOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState(null)
    const [teacherRating, setTeacherRating] = useState(0)
    const [teacherComment, setTeacherComment] = useState("")
    const [progress, setProgress] = useState({})
    const [hasReviewedTeacher, setHasReviewedTeacher] = useState({})
    const [hasReviewedCourses, setHasReviewedCourses] = useState({})
    const { state } = useContext(AuthContext)
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337"
    // ฟังก์ชันดึงข้อมูลรีวิวจาก Backend
    const fetchAllReviews = useCallback(
        async (currentUser) => {
            if (!currentUser) return

            try {
                const params = {
                    populate: "*",
                    "filters[users_review][id][$eq]": currentUser.id,
                }

                const response = await axios.get(`${BASE_URL}/api/reviews`, { params })
                console.log("API Response:", response.data)

                const reviewedCourses = {}

                response.data.data.forEach((review) => {
                    // ✅ ใช้ optional chaining ป้องกัน error ถ้าข้อมูลบางตัวหาย
                    const courseId = String(review.review_id?.id)
                    const userId = String(review.users_review?.id)

                    if (userId === String(currentUser.id)) {
                        reviewedCourses[courseId] = {
                            rating: review.star ?? 0, // ⭐ ใส่ default ถ้าไม่มีคะแนน
                            comment: review.comment ?? "", // 💬 ใส่ default ถ้าไม่มีคอมเมนต์
                        }
                    }
                })

                console.log("🎯 Reviewed Courses Data:", reviewedCourses)
                setHasReviewedCourses(reviewedCourses)
            } catch (error) {
                console.error("❌ Error fetching reviews:", error.response?.data || error.message)
            }
        },
        [BASE_URL],
    ) // ✅ เพิ่ม BASE_URL เป็น dependency

    // Add fetchTeacherReviews function in MyCourse component
    const fetchTeacherReviews = useCallback(
        async (currentUser) => {
            if (!currentUser) return

            try {
                const params = {
                    populate: "*", // ✅ ดึงข้อมูลทุกความสัมพันธ์
                    "filters[review][id][$eq]": currentUser.id, // ✅ ฟิลเตอร์เฉพาะรีวิวของ currentUser
                }

                const response = await axios.get(`${BASE_URL}/api/lecturer-reviews`, {
                    params,
                })
                console.log("Teacher Reviews API Response:", response.data)

                const reviewedTeachers = {}

                response.data.data.forEach((review) => {
                    const teacherId = String(review.lecturer_review_id?.id)
                    const userId = String(review.review?.id)

                    if (userId === String(currentUser.id)) {
                        reviewedTeachers[teacherId] = {
                            rating: review.star ?? 0,
                            comment: review.comment ?? "",
                        }
                    }
                })

                console.log("🎯 Reviewed Teachers Data:", reviewedTeachers)
                setHasReviewedTeacher(reviewedTeachers)
            } catch (error) {
                console.error("❌ Error fetching teacher reviews:", error.response?.data || error.message)
            }
        },
        [BASE_URL],
    ) // ✅ เพิ่ม BASE_URL เป็น dependency

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ดึงข้อมูลผู้ใช้และคอร์สที่ลงทะเบียน
                const userResponse = await ax.get(`${BASE_URL}/api/users/me?populate=owned_course.image`)
                console.log("✅ User Data:", userResponse.data)
                const currentUser = userResponse.data
                setUser(currentUser)
                setOwnedCourses(currentUser.owned_course || [])

                // ดึงข้อมูลคอร์สทั้งหมด
                const coursesResponse = await axios.get(`${BASE_URL}/api/courses?populate=image`)
                console.log("✅ Course Data:", coursesResponse.data.data)
                setCourseData(coursesResponse.data.data)

                // ดึงข้อมูลรีวิวโดยใช้ currentUser ที่ได้มา
                await fetchAllReviews(currentUser)

                // Add this line after fetchAllReviews
                await fetchTeacherReviews(currentUser)
            } catch (err) {
                console.error("🚨 Error fetching data:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [fetchAllReviews, fetchTeacherReviews, BASE_URL])

    // ดึงข้อมูลความคืบหน้าของคอร์ส เมื่อมีข้อมูล user
    useEffect(() => {
        if (!user) return
        const fetchCourseProgresses = async () => {
            try {
                const response = await ax.get(`${BASE_URL}/api/course-progresses?populate=*`, {
                    params: {
                        "filters[course_progress_owner][id][$eq]": user.id,
                    },
                })
                const courseProgressData = response.data.data.reduce((acc, item) => {
                    if (item.course_progress_name && item.course_progress_name.documentId) {
                        acc[item.course_progress_name.documentId] = Number(item.course_progress) || 0
                    }
                    return acc
                }, {})
                console.log("✅ Course Progress Data:", courseProgressData)
                setProgress(courseProgressData)
            } catch (error) {
                console.error("🚨 Error fetching course progress:", error)
            }
        }

        fetchCourseProgresses()
    }, [user, BASE_URL])

    // กรองคอร์สตามการค้นหา (Search)
    const filteredCourses = ownedCourses.filter((course) =>
        (course.Name || "").toLowerCase().includes(query.toLowerCase()),
    )

    const handleReviewClick = (course) => {
        if (hasReviewedCourses[String(course.id)]) {
            alert("คุณได้รีวิวคอร์สนี้ไปแล้ว!")
            return
        }
        setSelectedCourse(course)
        setIsOpen(true)
    }

    const handleTeacherReviewClick = (teacher) => {
        if (hasReviewedTeacher[String(teacher.id)]) {
            alert("คุณได้รีวิวอาจารย์คนนี้ไปแล้ว!")
            return
        }
        setSelectedTeacher(teacher)
        setIsTeacherReviewOpen(true)
    }

    const handleSearch = (e) => {
        setQuery(e.target.value)
    }

    const reviewModalProps = {
        isOpen: isOpen,
        onClose: () => {
            setIsOpen(false)
            setSelectedCourse(null)
        },
        rating: rating,
        setRating: setRating,
        comment: comment,
        setComment: setComment,
        selectedCourse: selectedCourse,
        user: user,
        setHasReviewedCourses: setHasReviewedCourses,
        refreshReviews: fetchAllReviews,
        readOnly: selectedCourse ? !!hasReviewedCourses[String(selectedCourse.id)] : false,
    }

    const teacherReviewModalProps = {
        isOpen: isTeacherReviewOpen,
        onClose: () => setIsTeacherReviewOpen(false),
        rating: teacherRating,
        setRating: setTeacherRating,
        comment: teacherComment,
        setComment: setTeacherComment,
        selectedTeacher: selectedTeacher,
        user: user,
        setHasReviewedTeacher: setHasReviewedTeacher,
        hasReviewedTeacher: hasReviewedTeacher,
        refreshReviews: fetchAllReviews,
        readOnly: selectedTeacher ? !!hasReviewedTeacher[String(selectedTeacher.id)] : false,
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-8 text-gray-900 dark:text-white"
                >
                    ยินดีต้อนรับคุณ, {user ? user.username : "Guest"}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8"
                >
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อคอร์ส..."
                            className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 
                dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 
                dark:focus:ring-blue-400 focus:border-transparent transition-all"
                            value={query}
                            onChange={handleSearch}
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
                hover:to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg 
                transition-all duration-200"
                        >
                            ค้นหา
                        </motion.button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="relative w-20 h-20">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping" />
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse" />
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredCourses.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-5 bg-white dark:bg-gray-800"
                            >
                                <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">คอร์สของคุณ</h2>

                                <div className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 py-2">
                                    {filteredCourses.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            // กำหนดให้มีขนาดแน่นอนและไม่ยืดออกด้วย flex-none
                                            className="flex-none w-[320px] sm:w-[350px] md:w-[400px] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-all duration-300"
                                        >
                                            <div onClick={() => navigate(`/contentstudy/${item.documentId}`)} className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                                <img
                                                    src={item.image && item.image.length > 0 ? `${BASE_URL}${item.image[0].url}` : "/placeholder.svg"}
                                                    alt="Course Image"
                                                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">{item.Name}</h3>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-3">
                                                    <div
                                                        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                                        style={{ width: `${progress[item.documentId] || 0}%` }}
                                                    >
                                                        {progress[item.documentId] || 0}%
                                                    </div>
                                                </div>

                                                {/* Review Buttons */}
                                                {progress[item.documentId] === 100 && (
                                                    <div className="flex gap-2 mt-4">
                                                        {hasReviewedCourses[String(item.id)] ? (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedCourse(item)
                                                                    setRating(hasReviewedCourses[String(item.id)].rating)
                                                                    setComment(hasReviewedCourses[String(item.id)].comment)
                                                                    setIsOpen(true)
                                                                }}
                                                                className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-800 transition-all duration-200"
                                                            >
                                                                ดูรีวิวที่คุณส่งไป
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleReviewClick(item)}
                                                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 transition-all duration-200"
                                                            >
                                                                รีวิวคอร์สเรียน
                                                            </button>
                                                        )}
                                                        {hasReviewedTeacher[String(item.id)] ? (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedTeacher(item)
                                                                    setTeacherRating(hasReviewedTeacher[String(item.id)].rating)
                                                                    setTeacherComment(hasReviewedTeacher[String(item.id)].comment)
                                                                    setIsTeacherReviewOpen(true)
                                                                }}
                                                                className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-800 transition-all duration-200"
                                                            >
                                                                ดูรีวิวอาจารย์
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleTeacherReviewClick(item)}
                                                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 transition-all duration-200"
                                                            >
                                                                รีวิวอาจารย์ผู้สอน
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <p className="text-center text-gray-500 mt-5 dark:text-gray-400">ไม่พบคอร์สที่ค้นหา</p>
                        )}


                        {/* กรณีไม่มีการลงทะเบียนใดๆ */}
                        {ownedCourses.length === 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <blockquote className="text-xl italic font-semibold text-center text-gray-900 dark:text-white">
                                    <p>"คุณยังไม่มีการลงทะเบียนเรียน"</p>
                                </blockquote>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">คอร์สเรียนยอดนิยม</h2>
                                </div>

                                <div
                                    id="slider"
                                    className="flex h-[32rem] min-w-full overflow-visible scroll-y scroll my-7 scroll-smooth whitespace-nowrap gap-10 items-center place-content-center scrollbar-hide"
                                >
                                    {courseData && courseData.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64">
                                            <h1 className="text-3xl font-extrabold text-gray-600 dark:text-gray-400">❌ ไม่พบคอร์สที่ต้องการ</h1>
                                            <p className="text-gray-500 dark:text-gray-400 mt-2">ลองเปลี่ยนหมวดหมู่หรือช่วงราคา แล้วค้นหาอีกครั้ง</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="flex space-x-6 overflow-x-auto scrollbar-hide px-4 py-2"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {courseData.map((course) => (
                                                <motion.div
                                                    key={course.documentId}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="min-w-[300px] sm:min-w-[350px] md:min-w-[400px]"
                                                >
                                                    <div
                                                        className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg cursor-pointer 
          bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
                                                        onClick={() => navigate(`/view-product/${course.Name}/${course.documentId}/`)}
                                                    >
                                                        <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                            {course.image ? (
                                                                <img
                                                                    src={`${BASE_URL}${course.image[0].url}`}
                                                                    alt={course.Name}
                                                                    className="object-cover w-full h-full rounded-t-lg transform hover:scale-105 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-500">No Image</span>
                                                            )}
                                                        </div>

                                                        <div className="p-4">
                                                            <h3 className="text-lg font-bold line-clamp-2 text-gray-900 dark:text-white">{course.Name}</h3>
                                                            <p className="text-gray-600 dark:text-gray-300 line-clamp-1">
                                                                {course.Description ? course.Description : "ไม่มีคำอธิบาย"}
                                                            </p>
                                                            <p className="text-blue-700 dark:text-blue-400 mt-1">⏳ ระยะเวลาเรียน: {course.Time_Usage} ชั่วโมง</p>
                                                            <p className="text-green-700 dark:text-green-400">
                                                                👨‍🏫 ผู้สอน: {course.lecturer_owner ? `${course.lecturer_owner.first_name} ${course.lecturer_owner.last_name}` : "ไม่ระบุ"}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="text-amber-700 dark:text-amber-400">
                                                                    ⭐ {course.rating === 0 ? "ยังไม่มีรีวิว" : `(${course.rating?.length} reviews)`}
                                                                </span>
                                                                <span className="text-gray-600 dark:text-gray-400">ขายแล้ว: {course.user_owner?.length || 0}</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{course.Price} ฿</span>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
              transition-colors duration-200 flex items-center gap-2"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-5 w-5"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                                    />
                                                                </svg>
                                                                เพิ่มลงตะกร้า
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </>
                )}

                {/* Keep your existing modals */}
                <ReviewModal {...reviewModalProps} />
                <TeacherReviewModal {...teacherReviewModalProps} />
            </div>
        </div>
    )
}


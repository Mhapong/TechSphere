import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import ax from "../../conf/ax";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@mui/icons-material";
import networkpic from "../components/network.png";

//รีวิวคอร์สเรียน
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
}) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) {
            onClose();
            return;
        }

        // เช็กว่าผู้ใช้เคยรีวิวคอร์สนี้ไปแล้วหรือยัง
        if (hasReviewedCourses[selectedCourse?.id]) {
            alert("คุณได้รีวิวคอร์สนี้ไปแล้ว!");
            onClose();  // ปิด Modal ถ้ามีการรีวิวแล้ว
            return;
        }

        try {
            const response = await ax.post("reviews?populate=*", {
                data: {
                    star: rating,
                    comment,
                    review_id: selectedCourse?.id,
                    users_review: user?.id,
                },
            });

            console.log("Review Submitted:", response.data);

            // อัปเดตสถานะว่ารีวิวแล้ว
            setHasReviewedCourses((prev) => ({
                ...prev,
                [selectedCourse.id]: { rating, comment },  // อัปเดตรีวิวที่ได้ส่งไป
            }));

            onClose();
            setRating(5);
            setComment("");
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review, please try again.");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-6 max-w-md w-full relative">
                {/* ปุ่มปิด Modal */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
                >
                    ✖
                </button>

                {/* ฟอร์มให้ดาวและพิมพ์คอมเมนต์ */}
                <h3 className="text-lg font-semibold mb-4 text-center">
                    {readOnly ? "Your Review" : "Rate & Review"}
                </h3>

                {/* ให้ดาว 1-5 */}
                <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => !readOnly && setRating(num)}
                            className={`text-2xl mx-1 ${num <= rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {/* ช่องพิมพ์คอมเมนต์ */}
                <textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => !readOnly && setComment(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                    rows="3"
                    readOnly={readOnly}
                ></textarea>

                {/* ปุ่ม Submit */}
                {!readOnly && (
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
                    >
                        Submit Review
                    </button>
                )}
            </div>
        </div>
    );
};

const TeacherReviewModal = ({
    isOpen,
    onClose,
    rating,
    setRating,
    comment,
    setComment,
    selectedTeacher,
    user,
    readOnly = false,
}) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) {
            onClose();
            return;
        }
        try {
            const response = await ax.post("lecturer-reviews?populate=*", {
                data: {
                    star: rating,
                    comment,
                    review: user?.id,
                    lecturer_review_id: selectedTeacher?.id,
                },
            });

            console.log("Teacher Review Submitted:", response.data);

            onClose();
            setRating(5);
            setComment("");
            alert("Teacher review submitted successfully!");
        } catch (error) {
            console.error("Error submitting teacher review:", error);
            alert("Failed to submit teacher review, please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 p-6 max-w-md w-full relative">
                {/* ปุ่มปิด Modal */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-900"
                >
                    ✖
                </button>

                {/* ฟอร์มให้ดาวและพิมพ์คอมเมนต์ */}
                <h3 className="text-lg font-semibold mb-4 text-center">
                    {readOnly ? "Your Review" : "Rate & Review Teacher"}
                </h3>

                {/* ให้ดาว 1-5 */}
                <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            onClick={() => !readOnly && setRating(num)}
                            className={`text-2xl mx-1 ${num <= rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {/* ช่องพิมพ์คอมเมนต์ */}
                <textarea
                    placeholder="Write your review for teacher..."
                    value={comment}
                    onChange={(e) => !readOnly && setComment(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                    rows="3"
                    readOnly={readOnly}
                ></textarea>

                {/* ปุ่ม Submit */}
                {!readOnly && (
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
                    >
                        Submit Review
                    </button>
                )}
            </div>
        </div>
    );
};

export default function MyCourse() {
    const [user, setUser] = useState(null);  // ข้อมูลผู้ใช้
    const [ownedCourses, setOwnedCourses] = useState([]);  // คอร์สที่ผู้ใช้ลงทะเบียน
    const [courseData, setCourseData] = useState([]);  // คอร์สทั้งหมด
    const [loading, setLoading] = useState(true);  // สถานะการโหลด
    const [error, setError] = useState(null);  // สถานะข้อผิดพลาด
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const navigate = useNavigate();
    const [isTeacherReviewOpen, setIsTeacherReviewOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherRating, setTeacherRating] = useState(5);
    const [teacherComment, setTeacherComment] = useState("");
    const [progress, setProgress] = useState({});
    const [hasReviewedTeacher, setHasReviewedTeacher] = useState(false);  // สถานะการรีวิวอาจารย์
    const [hasReviewedCourses, setHasReviewedCourses] = useState({});

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

    useEffect(() => {
        if (!user) return;
        const fetchCourseProgresses = async () => {
            try {
                const response = await ax.get(
                    "http://localhost:1337/api/course-progresses?populate=*",
                    {
                        params: {
                            "filters[course_progress_owner][id][$eq]": user.id,
                        },
                    }
                );
                // แปลงข้อมูลให้เป็น object โดยใช้ course documentId เป็น key
                const courseProgressData = response.data.data.reduce((acc, item) => {
                    if (
                        item.course_progress_name &&
                        item.course_progress_name.documentId
                    ) {
                        acc[item.course_progress_name.documentId] =
                            Number(item.course_progress) || 0;
                    }
                    return acc;
                }, {});
                console.log("✅ Course Progress Data:", courseProgressData);
                setProgress(courseProgressData);
            } catch (error) {
                console.error("🚨 Error fetching course progress:", error);
            }
        };

        fetchCourseProgresses();
    }, [user]);

    useEffect(() => {
        const fetchAllReviews = async () => {
            if (!user) return;

            try {
                const response = await ax.get("http://localhost:1337/api/reviews?populate=*");
                console.log("API Response:", response.data);
                const reviewedCourses = {};

                response.data.data.forEach((review) => {
                    if (review?.attributes?.review_id && review?.attributes?.users_review?.id === user.id) {
                        reviewedCourses[review.attributes.review_id] = {
                            rating: review.attributes.star,
                            comment: review.attributes.comment,
                        };
                    }
                });

                console.log("🎯 Reviewed Courses Data:", reviewedCourses);

                // บันทึกข้อมูลใน localStorage เพื่อให้มันอยู่หลังจากรีเฟรช
                localStorage.setItem('hasReviewedCourses', JSON.stringify(reviewedCourses));

                // อัปเดต state
                setHasReviewedCourses(reviewedCourses);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        // ถ้ามีข้อมูลใน localStorage ก็สามารถโหลดมาใช้ได้
        const storedReviews = localStorage.getItem('hasReviewedCourses');
        if (storedReviews) {
            setHasReviewedCourses(JSON.parse(storedReviews));
        }

        fetchAllReviews();
    }, [user]);  // ตรวจสอบ user ทุกครั้งที่มีการเปลี่ยนแปลง





    // ป้องกันกรณีที่ course.Name อาจจะ undefined
    const filteredCourses = ownedCourses.filter((course) =>
        (course.Name || "").toLowerCase().includes(query.toLowerCase())
    );

    const handleReviewClick = (course) => {
        // ตรวจสอบว่าเคยรีวิวคอร์สนี้หรือยัง
        if (hasReviewedCourses[course.id]) {
            alert("คุณได้รีวิวคอร์สนี้ไปแล้ว!");
            return;
        }

        setSelectedCourse(course);
        setIsOpen(true);
    };


    const handleTeacherReviewClick = (teacher) => {
        setSelectedTeacher(teacher);
        setIsTeacherReviewOpen(true);
    };

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

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
                    <h2 className="text-2xl font-bold">คอร์สของคุณ</h2>
                    <div
                        id="slider"
                        className="flex h-[32rem] w-full overflow-x-auto my-7 scroll-smooth whitespace-nowrap gap-10 items-center scrollbar-hide"
                    >
                        {filteredCourses.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.1 }}
                                className="min-w-80 border border-blue-200 rounded-lg shadow-md p-4 cursor-pointer"
                            >
                                {/* รูปภาพคอร์ส */}
                                <div className="overflow-hidden rounded-lg" onClick={() => navigate(`/contentstudy/${item.documentId}`)}>
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
                                    <p className="text-gray-500 text-xs">
                                        สิ้นสุด: {item.end_date ? item.end_date : "ไม่ระบุ"}
                                    </p>
                                </div>

                                {/* % การเรียน */}
                                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                        style={{ width: `${progress[item.documentId] || 0}%` }}
                                    >
                                        {progress[item.documentId] || 0}%
                                    </div>
                                </div>
                                {/* ปุ่มรีวิวคอร์สเรียน */}
                                {progress[item.documentId] === 100 && (
                                    hasReviewedCourses[item.id] ? (
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(item);
                                                setRating(hasReviewedCourses[item.id].rating);
                                                setComment(hasReviewedCourses[item.id].comment);
                                                setIsOpen(true);
                                            }}
                                            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-800"
                                        >
                                            ดูรีวิวที่คุณส่งไป
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleReviewClick(item)}
                                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                                        >
                                            รีวิวคอร์สเรียน
                                        </button>
                                    )
                                )}

                                {/* ปุ่มรีวิวอาจารย์ - แสดงเมื่อ progress = 100 */}
                                {progress[item.documentId] === 100 && (
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => handleTeacherReviewClick(item.lecturer_owner)}
                                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                                        >
                                            รีวิวอาจารย์ผู้สอน
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-5">ไม่พบคอร์สที่ค้นหา</p>
            )}

            <ReviewModal
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedCourse(null); // เคลียร์ค่าเมื่อปิด
                }}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                selectedCourse={selectedCourse}
                user={user}
                setHasReviewedCourses={setHasReviewedCourses}
                readOnly={selectedCourse ? !!hasReviewedCourses[selectedCourse.id] : false}
            />

            {/* Modal สำหรับรีวิวอาจารย์ */}
            <TeacherReviewModal
                isOpen={isTeacherReviewOpen}
                onClose={() => setIsTeacherReviewOpen(false)}
                rating={teacherRating}
                setRating={setTeacherRating}
                comment={teacherComment}
                setComment={setTeacherComment}
                selectedTeacher={selectedTeacher}
                user={user}
            />
        </div>
    );
}
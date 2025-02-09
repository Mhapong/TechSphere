import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import axios from "axios";

export default function MyCourse() {
    const [courses, setCourses] = useState([]); // คอร์สที่ลงทะเบียน
    const [recommendedCourses, setRecommendedCourses] = useState([]); // คอร์สแนะนำ
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("/api/courses");
                setCourses(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        const fetchRecommendedCourses = async () => {
            try {
                const response = await axios.get("/api/recommended-courses"); // เรียก API คอร์สแนะนำ
                setRecommendedCourses(response.data);
            } catch (err) {
                console.error("Error fetching recommended courses:", err);
            }
        };

        fetchCourses();
        fetchRecommendedCourses();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container mx-auto mt-10 p-5">
            <h1 className="text-2xl font-bold mb-5">ยินดีต้อนรับคุณ,</h1>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} sx={{ p: 3, boxShadow: 3, mb: 3 }}>
                            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <img className="rounded-t-lg" src={course.img} alt="Course" />
                                <div className="p-5">
                                    <h5 className="text-2xl font-bold text-gray-900 dark:text-white">{course.name}</h5>
                                    <p className="text-gray-700 dark:text-gray-400">{course.description}</p>
                                    <a href="#" className="text-white bg-blue-700 px-3 py-2 rounded-lg">Get Start</a>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                //กรณียังไม่มีการสมัตรคอร์สเรียนใดๆ
                <div className="text-center p-5">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">คุณยังไม่ได้ลงทะเบียนคอร์สใด ๆ</h2>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">คอร์สที่แนะนำ:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
                        {recommendedCourses.map((course) => (
                            <div key={course.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <img className="p-8 rounded-t-lg" src={course.img} alt="Course Thumbnail" />
                                <div className="px-5 pb-5">
                                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white">{course.name}</h5>
                                    <p className="text-gray-700 dark:text-gray-400">{course.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${course.price}</span>
                                        <a href="#" className="text-white bg-blue-700 px-5 py-2.5 rounded-lg">ลงทะเบียน</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

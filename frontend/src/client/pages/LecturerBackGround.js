"use client"

import { useContext, useEffect, useState, useCallback } from "react"
import { AuthContext } from "../../context/Auth.context"
import ax from "../../conf/ax"
import { useParams } from "react-router-dom"

export default function LecturerProfile() {
    const { state } = useContext(AuthContext)
    const { documentId } = useParams()
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337"

    const [lecturer, setLecturer] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchLecturer = useCallback(async () => {
        try {
            const response = await ax.get(`${BASE_URL}/api/users`, {
                params: {
                    "filters[documentId][$eq]": documentId,
                    populate: ["created_courses", "rating", "profile_picture"],
                },
            })
            if (response.data.length > 0) {
                console.log("Lecturer Data:", response.data[0])
                setLecturer(response.data[0])
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูลอาจารย์:", err)
        } finally {
            setLoading(false)
        }
    }, [BASE_URL, documentId])

    useEffect(() => {
        fetchLecturer()
    }, [fetchLecturer])

    if (loading) return <p>Loading...</p>
    if (!lecturer) return <p>Lecturer not found.</p>

    return (
        <div className="max-w-4xl mx-auto py-10">
            {/* รูปโปรไฟล์ */}
            {lecturer.profile_picture.length > 0 && (
                <img
                    src={`${BASE_URL}${lecturer.profile_picture[0].url}`}
                    alt={`${lecturer.first_name} ${lecturer.last_name}`}
                    className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
                />
            )}


            {/* ชื่ออาจารย์ */}
            <h1 className="text-3xl font-bold text-center">
                {lecturer.first_name} {lecturer.last_name}
            </h1>

            {/* ข้อมูลพื้นฐาน */}
            <p className="text-center text-gray-600">
                {lecturer.background ? lecturer.background : "No background information."}
            </p>

            {/* รายการคอร์สที่เปิดสอน */}
            <div className="mt-5">
                <h3 className="text-lg font-semibold">Created Courses:</h3>
                {lecturer.created_courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {lecturer.created_courses.map((course) => (
                            <div key={course.id} className="bg-white shadow-md rounded-lg p-4">
                                <h4 className="font-semibold text-lg">{course.Name}</h4>
                                <p className="text-gray-600 text-sm">{course.Description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No courses created.</p>
                )}
            </div>

            {/* รีวิว */}
            <div className="mt-5">
                <h3 className="text-lg font-semibold">Reviews:</h3>
                {lecturer.rating.length > 0 ? (
                    <div>
                        <p className="text-yellow-500 font-semibold">
                            ⭐ {(
                                lecturer.rating.reduce((acc, review) => acc + review.star, 0) /
                                lecturer.rating.length
                            ).toFixed(1)}{" "}
                            / 5
                        </p>
                        <ul className="space-y-2 mt-2">
                            {lecturer.rating.map((review) => (
                                <li key={review.id} className="border-b py-2 last:border-none">
                                    <p className="text-gray-700">"{review.comment}"</p>
                                    <p className="text-sm text-gray-500">⭐ {review.star} stars</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                )}
            </div>
        </div>
    )
}

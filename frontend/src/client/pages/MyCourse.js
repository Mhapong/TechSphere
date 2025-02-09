import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import ax from "../../conf/ax";

export default function MyCourse() {
  const [user, setUser] = useState(null); // ข้อมูลผู้ใช้
  const [ownedCourses, setOwnedCourses] = useState([]); // คอร์สที่ผู้ใช้ลงทะเบียน
  const [courseData, setCourseData] = useState([]); // คอร์สทั้งหมด
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้และคอร์สที่ผู้ใช้ลงทะเบียน
    const fetchUserData = async () => {
      try {
        const response = await ax.get(
          "http://localhost:1337/api/users/me?populate=owned_course"
        );
        console.log("✅ User Data:", response.data);
        setUser(response.data); // เก็บข้อมูลผู้ใช้
        setOwnedCourses(response.data.owned_course || []); // เก็บคอร์สที่ผู้ใช้ลงทะเบียน
      } catch (err) {
        console.error("🚨 Error fetching user data:", err);
        setError(err);
      }
    };

    // ดึงข้อมูลคอร์สทั้งหมด
    const fetchCourses = async () => {
      try {
        const response = await ax.get(
          "http://localhost:1337/api/courses?populate=*"
        );
        console.log("✅ Course Data:", response.data.data);
        setCourseData(response.data.data); // เก็บคอร์สทั้งหมด
      } catch (err) {
        console.error("🚨 Error fetching courses:", err);
        setError(err);
      }
    };

    fetchUserData();
    fetchCourses();
    setLoading(false); // ปรับสถานะการโหลดเป็น false หลังจากดึงข้อมูลเรียบร้อย
  }, []);

  if (loading) return <div>Loading...</div>; // กรณีที่ยังโหลดข้อมูล
  if (error) return <div>Error: {error.message}</div>; // กรณีที่เกิดข้อผิดพลาด

  return (
    <div className="container mx-auto mt-10 p-5">
      <h1 className="text-2xl font-bold mb-5">
        ยินดีต้อนรับคุณ, {user ? user.username : "Guest"}
      </h1>

      {ownedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ownedCourses.map((course) => (
            <Card key={course.id} sx={{ p: 3, boxShadow: 3, mb: 3 }}>
              <h2 className="text-xl font-semibold">{course.Name}</h2>
              <p>{course.Description}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p>คุณยังไม่ได้ลงทะเบียนคอร์สใด ๆ</p>
      )}
    </div>
  );
}

import { FaStar, FaClock, FaShoppingCart } from "react-icons/fa";

const ViewCourse = () => {
  return (
    <div className="bg-white min-h-screen p-6 md:p-12 text-gray-900">
      {/* Course Header */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src="https://via.placeholder.com/500x300"
            alt="Course Thumbnail"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Fundamental Web Dev with HTML5 & CSS3
          </h1>
          <p className="text-gray-500 text-sm mt-2">อัปเดตเมื่อ 2025</p>

          <div className="flex items-center mt-4 text-yellow-400">
            <FaStar /> <FaStar /> <FaStar /> <FaStar />
            <FaStar className="text-gray-300" />
            <span className="ml-2 text-gray-700">4.8 (320 รีวิว)</span>
          </div>

          <div className="flex items-center text-blue-500 mt-3">
            <FaClock className="mr-2" /> ระยะเวลาเรียน 3 ชั่วโมง
          </div>

          <div className="mt-6">
            <span className="text-xl font-semibold text-green-500">฿ 690</span>
            <span className="text-gray-400 line-through ml-2">฿ 990</span>
          </div>

          <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700">
            <FaShoppingCart className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>

      {/* Course Description */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">เกี่ยวกับคอร์ส</h2>
        <p className="mt-4 text-gray-700">
          คอร์สนี้เหมาะสำหรับผู้เริ่มต้นที่ต้องการเรียนรู้พื้นฐานการพัฒนาเว็บไซต์ด้วย
          HTML5 และ CSS3 เรียนรู้วิธีการสร้างเว็บที่ตอบสนองทุกอุปกรณ์
          และพื้นฐานของ Bootstrap
        </p>
      </div>

      {/* Reviews Section */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          รีวิวจากผู้เรียน
        </h2>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-gray-800">
            ⭐⭐⭐⭐⭐ <br />
            "คอร์สนี้อธิบายได้ดีมาก เหมาะกับมือใหม่!"
          </p>
          <p className="text-sm text-gray-500 mt-2">- คุณสมชาย</p>
        </div>

        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-gray-800">
            ⭐⭐⭐⭐ <br />
            "มีตัวอย่างให้ทำตาม เข้าใจง่ายครับ"
          </p>
          <p className="text-sm text-gray-500 mt-2">- คุณมานะ</p>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;

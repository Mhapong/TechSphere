import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confirm from "../components/static/confirm.png";
import Unapproved from "../components/static/unapproved.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import conf from "../../conf/main";

export default function CheckCourseStatus() {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  const BASE_URL = conf.apiUrl;
  const [confirmData, setConfirmData] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [filters, setFilters] = useState({
    waiting: true,
    confirmed: true,
    unapproved: true,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollContainerRefs = useRef({});
  const [showPopup, setShowPopup] = useState(false);

  // ตั้งสถานะสี
  const statusBackgroundColor = useCallback((status) => {
    switch (status) {
      case "waiting":
        return "bg-gradient-to-r from-gray-200 to-gray-400";
      case "confirmed":
        return "bg-gradient-to-r from-teal-400 to-green-200";
      case "unapproved":
        return "bg-gradient-to-r from-red-400 to-red-300";
      default:
        return "bg-gray-200";
    }
  }, []);

  // ดึงข้อมูลการซื้อคอร์ส
  const fetchConfirmPurchases = useCallback(async () => {
    try {
      const response = await ax.get(`confirm-purchases`, {
        params: {
          populate: "*",
          "filters[users_purchase][id][$eq]": state.user.id,
        },
      });
      setConfirmData(response.data.data);
      return response.data.data;
    } catch (err) {
      console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err);
      return [];
    }
  }, [BASE_URL, state.user.id]);

  useEffect(() => {
    fetchConfirmPurchases().then((data) => {
      setTimeout(() => {
        if (data.some((item) => item.status_confirm === "unapproved")) {
          setShowPopup(true);
        }
      }, 1000);
    });
  }, [fetchConfirmPurchases]);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filteredData = confirmData.filter((item) => {
    const matchesFilter = filters[item.status_confirm];
    const matchesSearch = item.course_purchase[0]?.Name.toLowerCase().includes(
      courseFilter.toLowerCase()
    );
    return matchesFilter && matchesSearch;
  });

  const sortedData = {
    unapproved: filteredData.filter(
      (item) => item.status_confirm === "unapproved"
    ),
    confirmed: filteredData.filter(
      (item) => item.status_confirm === "confirmed"
    ),
    waiting: filteredData.filter((item) => item.status_confirm === "waiting"),
  };

  // เปลี่ยนภาษาอังกฤษเป็นไทย
  const getThaiStatus = (status) => {
    switch (status) {
      case "waiting":
        return "รอดำเนินการ";
      case "confirmed":
        return "ยืนยันแล้ว";
      case "unapproved":
        return "ไม่อนุมัติ";
      default:
        return status;
    }
  };

  const scroll = (direction, status) => {
    const container = scrollContainerRefs.current[status];
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-full min-h-screen">
      {/* Sidebar Filter */}
      <div
        className={`lg:w-1/4 p-4 bg-gray-100 ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">ค้นหาชื่อคอร์ส</h3>
          <input
            type="text"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            placeholder="พิมพ์ชื่อคอร์สที่ต้องการค้นหา"
            className="w-full p-2 border border-gray-400 rounded-lg mb-4"
          />
        </div>

        <h3 className="text-lg font-semibold mb-2">ตัวกรองสถานะ</h3>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="waiting"
            checked={filters.waiting}
            onChange={handleFilterChange}
            className="mr-2"
          />
          รอดำเนินการ
        </label>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="confirmed"
            checked={filters.confirmed}
            onChange={handleFilterChange}
            className="mr-2"
          />
          ยืนยันแล้ว
        </label>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="unapproved"
            checked={filters.unapproved}
            onChange={handleFilterChange}
            className="mr-2"
          />
          ไม่อนุมัติ
        </label>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Popup แจ้งเตือน */}
        {showPopup && (
          <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-4 text-center shadow-md z-50 flex justify-between items-center">
            <span>
              ตอนนี้มีคอร์สของคุณที่ไม่ได้รับการอนุมัติ
              กรุณาเข้าไปเช็คที่ช่องแชทของคุณเพื่อดูสาเหตุ
            </span>
            <button
              onClick={() => setShowPopup(false)}
              className="ml-4 bg-white text-red-500 px-3 py-1 rounded"
            >
              ปิด
            </button>
          </div>
        )}

        {/* ส่วนเนื้อหาหลัก */}
        <div className="p-4">
          <h2 className="text-xl font-bold">ข้อมูลสถานะการซื้อคอร์ส</h2>
          {/* เนื้อหาคอร์สของคุณ */}
        </div>
      </div>
      <div className="lg:w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-black text-xl lg:text-2xl font-bold">
            ข้อมูลสถานะการซื้อคอร์ส
          </h2>
          <button
            className="lg:hidden bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "ปิดตัวกรอง" : "เปิดตัวกรอง"}
          </button>
        </div>

        {Object.entries(sortedData).map(
          ([status, items]) =>
            items.length > 0 && (
              <div key={status} className="mb-8">
                <h3 className="text-lg font-bold mb-4 capitalize">
                  {getThaiStatus(status)}
                </h3>
                <div className="relative">
                  <button
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2"
                    onClick={() => scroll("left", status)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <div
                    ref={(el) => (scrollContainerRefs.current[status] = el)}
                    className="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide"
                    style={{ scrollSnapType: "x mandatory" }}
                  >
                    {items.map((item, index) => (
                      <motion.div
                        key={index}
                        className={`flex-none w-[300px] md:w-[400px] p-3 md:p-4 border border-gray-300 rounded-lg flex flex-col min-h-[160px] md:min-h-[180px] relative ${statusBackgroundColor(
                          item.status_confirm
                        )}`}
                        style={{ scrollSnapAlign: "start" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {item.status_confirm === "confirmed" && (
                          <img
                            src={Confirm || "/placeholder.svg"}
                            alt="Confirmed"
                            className="absolute top-2 right-2 w-14 h-14 lg:w-24 lg:h-24"
                          />
                        )}
                        {item.status_confirm === "unapproved" && (
                          <img
                            src={Unapproved || "/placeholder.svg"}
                            alt="Unapproved"
                            className="absolute top-2 right-2 w-14 h-14 lg:w-24 lg:h-24"
                          />
                        )}

                        <div className="mt-0 pt-2">
                          <p className="text-black text-xs lg:text-sm mb-2">
                            หมายเลขคำสั่งซื้อ: {item.id}
                          </p>
                          <p className="text-black font-semibold text-lg lg:text-2xl pr-20">
                            ชื่อคอร์ส: {item.course_purchase[0]?.Name}
                          </p>
                          <p className="text-black text-sm lg:text-base">
                            จำนวนเงิน:{" "}
                            {item.amount > 0 ? `${item.amount} บาท` : "ฟรี"}
                          </p>
                          <p className="text-black text-sm lg:text-base">
                            สถานะ:{" "}
                            {getThaiStatus(item.status_confirm) || "ไม่ระบุ"}
                          </p>
                          <p className="text-black text-sm lg:text-base">
                            วันที่สั่งซื้อ:{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {item.status_confirm === "confirmed" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/contentstudy/${item.course_purchase[0]?.documentId}`
                              )
                            }
                            className="absolute bottom-4 right-4 px-3 py-1 lg:px-4 lg:py-2 bg-gray-800 text-white text-sm lg:text-base rounded-lg"
                          >
                            ไปที่บทเรียน
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <button
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2"
                    onClick={() => scroll("right", status)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

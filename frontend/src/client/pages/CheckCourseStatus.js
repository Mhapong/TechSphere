"use client"

import { useContext, useEffect, useState, useCallback } from "react"
import { AuthContext } from "../../context/Auth.context"
import ax from "../../conf/ax"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Confirm from "../components/confirm.png"
import Unapproved from "../components/unapproved.png"

export default function CheckCourseStatus() {
    const { state } = useContext(AuthContext)
    const { documentId } = useParams()
    const navigate = useNavigate()
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337"
    const [confirmData, setConfirmData] = useState([])
    const [courseFilter, setCourseFilter] = useState("")
    const [filters, setFilters] = useState({
        waiting: true,
        confirmed: true,
        unapproved: true,
    })
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // ตั้งสถานะสี
    const statusBackgroundColor = useCallback((status) => {
        switch (status) {
            case "waiting":
                return "bg-gradient-to-r from-gray-200 to-gray-400"
            case "confirmed":
                return "bg-gradient-to-r from-teal-400 to-green-200"
            case "unapproved":
                return "bg-gradient-to-r from-red-400 to-red-300"
            default:
                return "bg-gray-200"
        }
    }, [])

    // ดึงข้อมูลการซื้อคอร์ส
    const fetchConfirmPurchases = useCallback(async () => {
        try {
            const response = await ax.get(`${BASE_URL}/api/confirm-purchases`, {
                params: {
                    populate: "*",
                    "filters[users_purchase][id][$eq]": state.user.id,
                },
            })
            console.log("Confirm Data:", response.data.data)
            setConfirmData(response.data.data)
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err)
        }
    }, [BASE_URL, state.user.id])

    useEffect(() => {
        fetchConfirmPurchases()
    }, [fetchConfirmPurchases])

    const handleFilterChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked })
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className="flex flex-col lg:flex-row max-w-full min-h-screen">
            {/* Sidebar Filter */}
            <div className={`lg:w-1/4 p-4 bg-gray-100 ${isSidebarOpen ? "block" : "hidden lg:block"}`}>
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
            <div className="lg:w-3/4 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-black text-xl lg:text-2xl font-bold">ข้อมูลสถานะการซื้อคอร์ส</h2>
                    <button
                        className="lg:hidden bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded"
                        onClick={toggleSidebar}
                    >
                        {isSidebarOpen ? "ปิดตัวกรอง" : "เปิดตัวกรอง"}
                    </button>
                </div>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {confirmData.length > 0 ? (
                        confirmData
                            .filter((item) => filters[item.status_confirm])
                            .filter((item) => item.course_purchase[0]?.Name.toLowerCase().includes(courseFilter.toLowerCase()))
                            .map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={`p-4 border border-gray-300 rounded-lg flex flex-col min-h-[180px] relative ${statusBackgroundColor(item.status_confirm)}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {/* แสดงรูปสถานะที่มุมขวาบน */}
                                    {item.status_confirm === "confirmed" && (
                                        <img
                                            src={Confirm || "/placeholder.svg"}
                                            alt="Confirmed"
                                            className="absolute top-2 right-2 w-16 h-16 lg:w-24 lg:h-24"
                                        />
                                    )}
                                    {item.status_confirm === "unapproved" && (
                                        <img
                                            src={Unapproved || "/placeholder.svg"}
                                            alt="Unapproved"
                                            className="absolute top-2 right-2 w-16 h-16 lg:w-24 lg:h-24"
                                        />
                                    )}

                                    {/* ข้อความขยับขึ้นไปติดขอบบน */}
                                    <div className="mt-0 pt-2">
                                        <p className="text-black text-xs lg:text-sm mb-2">หมายเลขคำสั่งซื้อ: {item.id}</p>
                                        <p className="text-black font-semibold text-lg lg:text-2xl pr-20">
                                            ชื่อคอร์ส: {item.course_purchase[0]?.Name}
                                        </p>
                                        <p className="text-black text-sm lg:text-base">จำนวนเงิน: {item.amount} บาท</p>
                                        <p className="text-black text-sm lg:text-base">สถานะ: {item.status_confirm || "ไม่ระบุ"}</p>
                                        <p className="text-black text-sm lg:text-base">
                                            วันที่สั่งซื้อ: {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* ปุ่มไปที่บทเรียน */}
                                    {item.status_confirm === "confirmed" && (
                                        <button
                                            onClick={() => navigate(`/contentstudy/${item.course_purchase[0]?.documentId}`)}
                                            className="absolute bottom-4 right-4 px-3 py-1 lg:px-4 lg:py-2 bg-gray-800 text-white text-sm lg:text-base rounded-lg"
                                        >
                                            ไปที่บทเรียน
                                        </button>
                                    )}
                                </motion.div>
                            ))
                    ) : (
                        <p className="text-gray-500 text-center col-span-full">ไม่มีข้อมูลการซื้อคอร์ส</p>
                    )}
                </div>
            </div>
        </div>
    )
}


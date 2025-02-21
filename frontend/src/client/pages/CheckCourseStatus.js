import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CheckCourseStatus() {
    const { state } = useContext(AuthContext);
    const { documentId } = useParams();
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";
    const [confirmData, setConfirmData] = useState([]);
    const [filters, setFilters] = useState({
        waiting: true,
        confirmed: true,
        unapproved: true,
    });

    //ดึงข้อมูลการซื้อคอร์ส
    const fetchConfirmPurchases = async () => {
        try {
            const response = await ax.get(`${BASE_URL}/api/confirm-purchases`, {
                params: {
                    populate: "*",
                    "filters[users_purchase][id][$eq]": state.user.id,
                }
            });
            console.log("Confirm Data:", response.data.data);

            setConfirmData(response.data.data);
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err);
        }
    };

    useEffect(() => {
        fetchConfirmPurchases();
    }, []);

    //ตั้งสถานะสี
    const statusBackgroundColor = (status) => {
        switch (status) {
            case "waiting":
                return "bg-gradient-to-r from-gray-200 to-gray-400";
            case "confirmed":
                return "bg-gradient-to-r from-teal-400 to-green-200";
            case "unapproved":
                return "bg-gradient-to-r from-red-300 to-red-600";
            default:
                return "bg-gray-200";
        }
    };


    const handleFilterChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.checked });
    };

    return (
        <div className="flex max-w-full h-screen p-4">
            {/* Sidebar Filter */}
            <div className="w-[20%] p-4 border-r border-gray-300">
                <h3 className="text-lg font-semibold mb-2">Filter สถานะ</h3>
                <label className="flex items-center mb-2">
                    <input type="checkbox" name="waiting" checked={filters.waiting} onChange={handleFilterChange} className="mr-2" />
                    รอดำเนินการ
                </label>
                <label className="flex items-center mb-2">
                    <input type="checkbox" name="confirmed" checked={filters.confirmed} onChange={handleFilterChange} className="mr-2" />
                    ยืนยันแล้ว
                </label>
                <label className="flex items-center mb-2">
                    <input type="checkbox" name="unapproved" checked={filters.unapproved} onChange={handleFilterChange} className="mr-2" />
                    ไม่อนุมัติ
                </label>
            </div>

            {/* Main Content */}
            <div className="w-[80%] flex flex-col items-center">
                <h2 className="text-black text-2xl font-bold mb-4">ข้อมูลสถานะการซื้อคอร์ส</h2>
                <div className="w-full max-w-3xl flex flex-col gap-2">
                    {confirmData.length > 0 ? confirmData
                        .filter(item => filters[item.status_confirm])
                        .map((item, index) => (
                            <motion.div
                                key={index}
                                className={`p-4 border border-gray-300 w-full rounded-lg flex flex-col min-h-[180px] relative ${statusBackgroundColor(item.status_confirm)}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div>
                                    <p className="text-black text-sm mb-3">หมายเลขคำสั่งซื้อ: {item.id}</p>
                                    <p className="text-black font-semibold text-2xl">ชื่อคอร์ส: {item.course_purchase[0]?.Name}</p>
                                    <p className="text-black text-base">จำนวนเงิน: {item.amount} บาท</p>
                                    <p className="text-black text-base">สถานะ: {item.status_confirm || "ไม่ระบุ"}</p>
                                    <p className="text-black text-base">วันที่สั่งซื้อ: {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                {item.status_confirm === "confirmed" && (
                                    <button
                                        onClick={() => navigate(`/contentstudy/${item.course_purchase[0]?.documentId}`)}
                                        className="absolute bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded-lg">
                                        ไปที่บทเรียน
                                    </button>
                                )}
                            </motion.div>

                        )) : (
                        <p className="text-gray-500 text-center">ไม่มีข้อมูลการซื้อคอร์ส</p>
                    )}
                </div>
            </div>
        </div>
    );
}

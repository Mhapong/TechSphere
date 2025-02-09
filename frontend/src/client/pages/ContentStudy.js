import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";

export default function ContentStudy() {
    const { state } = useContext(AuthContext);
    const [contentData, setContentData] = useState([]);
    const BASE_URL = "http://localhost:1337";

    const fetchContent = async () => {
        try {
            const response = await ax.get("http://localhost:1337/api/contents?populate=*");
            console.log("API Response:", response.data.data);

            const formattedData = response.data.data.map(item => ({
                id: item.content_id,
                content_title: item.content_title || "ไม่มีชื่อเนื้อหา",
                video_url: item.video ? BASE_URL + item.video.url : "",
                detail: item.detail || "ไม่มีรายละเอียด",
            }));

            console.log("Formatted Data:", formattedData);
            setContentData(formattedData);
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    return (
        <div className="flex max-w-full h-screen">
            {/* ฝั่งซ้าย - แสดงวิดีโอและเนื้อหา */}
            <div className="w-[70%] bg-gray-100 p-6 overflow-y-auto">
                {contentData.length > 0 ? (
                    contentData.map((item, index) => (
                        <section key={index} className="mb-6">
                            {/* แสดงวิดีโอ */}
                            {item.video_url ? (
                                <video width="100%" height="auto" controls controlsList="nodownload" className="mb-4">
                                    <source src={item.video_url} type="video/mp4" />
                                    เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                                </video>
                            ) : (
                                <p className="text-gray-500">ไม่มีวิดีโอ</p>
                            )}
                            <h1 className="text-black text-xl font-medium mb-2">
                                {item.content_title}
                            </h1>
                            <p className="text-gray-700">{item.detail}</p>
                        </section>
                    ))
                ) : (
                    <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                )}
            </div>
            {/* ฝั่งขวา - รายการเนื้อหาวิดีโอ */}
            <div className="w-[30%] bg-white p-6 overflow-y-auto">
                <h className="text-lg font-bold mb-4">เนื้อหาวิดีโอ</h>
                <ul>
                    {contentData.length > 0 ? (
                        contentData.map((item, index) => (
                            <li key={index} className="mb-4">
                                <h5 className="text-blue-400 font-medium">{item.content_title}</h5>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">ไม่มีเนื้อหาวิดีโอ</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

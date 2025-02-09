import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";

export default function ContentStudy() {
    const { state } = useContext(AuthContext);
    const [groupedContent, setGroupedContent] = useState({});
    const [selectedContent, setSelectedContent] = useState(null); 
    const BASE_URL = "http://localhost:1337";

    const fetchTopics = async () => {
        try {
            const response = await ax.get("http://localhost:1337/api/topics?populate=content.video");
            console.log("API Response:", response.data.data);

            const groupedData = response.data.data.reduce((acc, topic) => {
                acc[topic.topic_title] = topic.content.map(item => ({
                    id: item.content_id,
                    content_title: item.content_title || "ไม่มีชื่อเนื้อหา",
                    video_url: item.video?.url ? BASE_URL + item.video.url : "", 
                    detail: item.detail || "ไม่มีรายละเอียด",
                }));
                return acc;
            }, {});

            console.log("Grouped Data:", groupedData);
            setGroupedContent(groupedData);

            const firstTopic = Object.keys(groupedData)[0];
            if (firstTopic && groupedData[firstTopic].length > 0) {
                setSelectedContent(groupedData[firstTopic][0]);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <div className="flex max-w-full h-screen">
            {/* ฝั่งซ้าย - แสดงวิดีโอและเนื้อหาที่เลือก */}
            <div className="w-[70%] bg-gray-100 p-6 overflow-y-auto">
                {selectedContent ? (
                    <section>
                        <h2 className="text-black text-2xl font-bold mb-4">{selectedContent.content_title}</h2>
                        {/* แสดงวิดีโอ */}
                        {selectedContent.video_url ? (
                            <video
                            key={selectedContent.video_url} 
                            width="100%"
                            height="auto"
                            controls
                            controlsList="nodownload"
                            className="mb-4"
                        >
                            <source src={selectedContent.video_url} type="video/mp4" />
                            เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                        </video>
                        ) : (
                            <p className="text-gray-500">ไม่มีวิดีโอ</p>
                        )}
                        <p className="text-gray-700">{selectedContent.detail}</p>
                    </section>
                ) : (
                    <p className="text-gray-500">เลือกเนื้อหาจากทางขวา</p>
                )}
            </div>

            {/* ฝั่งขวา - รายการเนื้อหาวิดีโอ */}
            <div className="w-[30%] bg-white p-6 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">เนื้อหาวิดีโอ</h2>
                <ul>
                    {Object.keys(groupedContent).length > 0 ? (
                        Object.entries(groupedContent).map(([topic, contents]) => (
                            <li key={topic} className="mb-6">
                                <h3 className="text-blue-600 font-bold">{topic}</h3>
                                <ul className="ml-4 mt-2">
                                    {contents.map((item) => (
                                        <li key={item.id} className="mb-2">
                                            <button
                                                className={`text-left w-full ${
                                                    selectedContent?.id === item.id
                                                        ? "text-blue-500 font-bold"
                                                        : "text-blue-400"
                                                }`}
                                                onClick={() => {
                                                    console.log("เลือกเนื้อหา:", item);
                                                    setSelectedContent(item);
                                                }}
                                            >
                                                {item.content_title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
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

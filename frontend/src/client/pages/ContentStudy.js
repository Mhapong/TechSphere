import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import { useParams } from "react-router-dom";
import video_FinishStudy from "../components/video_FinishStudy.png";
import video_NeverStudy from "../components/video_NeverStudy.png";
import video_Studying from "../components/video_Studying.png";

export default function ContentStudy() {
    const { state } = useContext(AuthContext);
    const [groupedContent, setGroupedContent] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const { documentId } = useParams();
    const BASE_URL = "http://localhost:1337";
    const [progress, setProgress] = useState({});

    const fetchTopics = async () => {
        try {
            const response = await ax.get("http://localhost:1337/api/topics", {
                params: {
                    populate: "content.video",
                    "filters[topic_id][documentId][$eq]": documentId,
                }
            });
            console.log("API Response:", response.data.data);

            const groupedData = response.data.data.reduce((acc, topic) => {
                acc[topic.topic_title] = topic.content.map(item => ({
                    id: item.content_id || item.id || Math.random(),
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

    const handleTimeUpdate = (event, contentId) => {
        const currentTime = event.target.currentTime;
        const duration = event.target.duration;
        setProgress((prev) => ({
            ...prev,
            [contentId]: (currentTime / duration) * 100,
        }));

        localStorage.setItem(`progress_${contentId}`, currentTime);
    };

    const handleVideoEnd = (contentId) => {
        setProgress((prev) => ({
            ...prev,
            [contentId]: 100,
        }));
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
                                onTimeUpdate={(e) => handleTimeUpdate(e, selectedContent.id)}
                                onEnded={() => handleVideoEnd(selectedContent.id)}
                            >
                                <source src={selectedContent.video_url} type="video/mp4" />
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
                <h2 className="text-lg font-bold text-xl mb-4">เนื้อหาวิดีโอ</h2>

                <ul>
                    {Object.keys(groupedContent).length > 0 ? (
                        Object.entries(groupedContent).map(([topic, contents]) => (
                            <li key={topic} className="mb-6">
                                <h3 className="text-gray-600 text-m font-bold">{topic}</h3>
                                <h6 className="text-gray-400 text-xs font-bold">จำนวน {contents.length} บทเรียน</h6>

                                <ul className="ml-4 mt-2">
                                    {contents.map((item) => (
                                        <li key={item.id} className="mb-2">
                                            <button
                                                className={`flex items-center space-x-4 text-left w-full ${selectedContent?.id === item.id
                                                    ? "text-blue-500 font-bold text-s"
                                                    : "text-gray-400"
                                                    }`}
                                                onClick={() => {
                                                    console.log("เลือกเนื้อหา:", item);
                                                    setSelectedContent(item);
                                                }}
                                            >
                                                <img
                                                    src={selectedContent?.id === item.id ? video_Studying : video_NeverStudy}
                                                    alt="Video Icon"
                                                    className="w-14 h-14"
                                                />
                                                <div className="flex flex-col w-full">
                                                    <span>{item.content_title}</span>
                                                    {/* ✅ Progress Bar + Percent */}
                                                    <div className="relative w-32 h-6 bg-gray-200 rounded overflow-hidden mt-1">
                                                        <div
                                                            className="h-full bg-blue-500 transition-all duration-300"
                                                            style={{ width: `${progress[item.id] || 0}%` }}
                                                        ></div>
                                                        <span className="absolute inset-0 flex items-center justify-center text-black text-xs font-bold">
                                                            {Math.round(progress[item.id] || 0)}%
                                                        </span>
                                                    </div>
                                                </div>
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



        </div >
    );
}

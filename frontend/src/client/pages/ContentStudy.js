import React, { useContext, useEffect, useState, useRef } from "react";
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
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";
    const [progress, setProgress] = useState({});
    const [courseProgress, setCourseProgress] = useState({});
    const videoRef = useRef(null);
    const isProgressFetched = useRef(false)
    const isCourseProgressFetched = useRef(false)
    const [overallProgress, setOverallProgress] = useState(0);
    const lastUpdatedProgress = useRef({});

    const fetchTopics = async () => {
        try {
            const response = await ax.get(`${BASE_URL}/api/topics`, {
                params: {
                    populate: "content.video",
                    "filters[topic_id][documentId][$eq]": documentId,
                }
            });

            const groupedData = response.data.data.reduce((acc, topic) => {
                acc[topic.topic_title] = topic.content.map(item => ({
                    id: item.content_id || item.id || Math.random(),
                    content_title: item.content_title || "ไม่มีชื่อเนื้อหา",
                    video_url: item.video?.url ? BASE_URL + item.video.url : "",
                    detail: item.detail || "ไม่มีรายละเอียด",
                }));
                return acc;
            }, {});

            setGroupedContent(groupedData);

            const firstTopic = Object.keys(groupedData)[0];
            if (firstTopic && groupedData[firstTopic].length > 0) {
                setSelectedContent(groupedData[firstTopic][0]);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาดขณะดึงข้อมูล:", err);
        }
    };

    // progress ของ Content
    const fetchProgresses = async () => {
        if (isProgressFetched.current) return;
        isProgressFetched.current = true;
        try {
            console.log("Fetching progress data...");
            const progressResponse = await ax.get(`${BASE_URL}/api/progresses`, {
                params: {
                    populate: "*",
                    "filters[progress_owner][id][$eq]": state.user.id,
                },
            });
    
            let progressData = progressResponse.data.data.reduce((acc, item) => {
                if (item.content_progress && item.content_progress.id) {
                    acc[item.content_progress.id] = {
                        documentId: item.documentId,
                        progress: Number(item.progress) || 0,
                        course_of_progress: item.course_of_progress.documentId,
                    };
                }
                return acc;
            }, {});
    
            console.log("Current progress data:", progressData);
    
            const topicResponse = await ax.get(`${BASE_URL}/api/topics`, {
                params: {
                    populate: "*",
                    "filters[topic_id][documentId][$eq]": documentId, 
                },
            });
    
            const contentIds = topicResponse.data.data.flatMap(topic => topic.content.map(content => content.id));
    
            const missingContents = contentIds.filter(id => !progressData[id]);
    
            console.log("Missing content progress:", missingContents);
    
            const newProgressEntries = await Promise.all(
                missingContents.map(async (contentId) => {
                    const response = await ax.post(`${BASE_URL}/api/progresses`, {
                        data: {
                            progress: 0,
                            progress_owner: state.user.id,
                            content_progress: contentId,
                            course_of_progress: documentId,
                        },
                    });
    
                    const newDocumentId = response.data.data.documentId;
    
                    return { [contentId]: { documentId: newDocumentId, progress: 0, course_of_progress: documentId } };
                })
            );
    
            newProgressEntries.forEach(entry => {
                progressData = { ...progressData, ...entry };
            });
    
            console.log("Final progress data after adding missing entries:", progressData);
    
            setProgress(progressData);
            calculateOverallProgress(progressData, documentId);
    
        } catch (err) {
            console.error("Error fetching progress data:", err);
        }
    };

    // progress ของ Course
    const fetchCourseProgresses = async () => {
        if (isCourseProgressFetched.current) return;
        isCourseProgressFetched.current = true;
    
        try {
            console.log("Fetching course progress data...");
            const courseProgressResponse = await ax.get(`${BASE_URL}/api/course-progresses`, {
                params: {
                    populate: "*",
                    "filters[course_progress_owner][id][$eq]": state.user.id,
                },
            });
    
            let courseProgressData = courseProgressResponse.data.data.reduce((acc, item) => {
                if (item.course_progress_name && item.course_progress_name.documentId) {  
                    acc[item.course_progress_name.documentId] = {  
                        documentId: item.documentId,
                        course_progress: Number(item.course_progress) || 0,
                        course_progress_name: item.course_progress_name.documentId,  
                    };
                }
                return acc;
            }, {});
    
            console.log("Current course progress data:", courseProgressData);
    
            const courseResponse = await ax.get(`${BASE_URL}/api/courses`, {
                params: {
                    populate: "*",
                    "filters[documentId][$eq]": documentId, 
                },
            });
    
            console.log("Fetched course data:", courseResponse.data);
    
            const courseDocumentIds = courseResponse.data.data.map(course => course.documentId);
    
            console.log("Extracted course document IDs:", courseDocumentIds);
    
            const missingCourses = courseDocumentIds.filter(docId => !courseProgressData[docId]);
    
            console.log("Missing course progress:", missingCourses);
    
            const newCourseProgressEntries = await Promise.all(
                missingCourses.map(async (docId) => {
                    console.log(`Creating new course progress for documentId: ${docId}`);
    
                    try {
                        const response = await ax.post(`${BASE_URL}/api/course-progresses`, {
                            data: {
                                course_progress:  overallProgress || 0,
                                course_progress_owner: state.user.id,
                                course_progress_name: docId,  
                            },
                        });
    
                        console.log("New course progress response:", response.data);
    
                        const newDocumentId = response.data.data.documentId;
    
                        return { 
                            [docId]: { 
                                documentId: newDocumentId, 
                                course_progress: overallProgress || 0, 
                                course_progress_name: docId  
                            } 
                        };
                    } catch (error) {
                        console.error(`Error creating course progress for documentId ${docId}:`, error);
                        return {};
                    }
                })
            );
    
            newCourseProgressEntries.forEach(entry => {
                courseProgressData = { ...courseProgressData, ...entry };
            });
    
            console.log("Final course progress data after adding missing entries:", courseProgressData);
    
            setCourseProgress(courseProgressData);  
        } catch (err) {
            console.error("Error fetching course progress data:", err);
        }
    };
    
    
    
    const updateProgress = async (contentId, newProgress, courseId) => {
        try {
            const existingProgress = progress[contentId];
    
            console.log("🔍 Checking progress update condition:", {
                contentId,
                newProgress,
                existingProgress
            });
    
            if (existingProgress?.documentId && Math.abs(existingProgress.progress - newProgress) >= 1) {
                console.log(`⏳ Updating progress for content ${contentId} - New progress: ${newProgress}%`);
    
                const response = await ax.put(`${BASE_URL}/api/progresses/${existingProgress.documentId}`, {
                    data: { progress: newProgress },
                });
    
                console.log("✅ PUT request success:", response.data);

                setProgress(prev => {
                    const updatedProgress = {
                        ...prev,
                        [contentId]: { ...prev[contentId], progress: newProgress }
                    };
                    console.log("📌 Updated progress state:", updatedProgress);
    
                    calculateOverallProgress(updatedProgress, courseId);
                    return updatedProgress;
                });
            }
        } catch (err) {
            console.error("❌ Error updating progress:", err.response?.data || err.message);
        }
    };
    
    const calculateOverallProgress = (progressData, courseId) => {
        const filteredProgress = Object.values(progressData).filter(item => item.course_of_progress === courseId);
        const totalContents = filteredProgress.length;
    
        if (totalContents === 0) {
            setOverallProgress(0);
            console.log("⚠️ No relevant content available for progress calculation.");
            return;
        }
    
        const totalProgress = filteredProgress.reduce((sum, item) => sum + (item.progress || 0), 0);
        const averageProgress = Math.round(totalProgress / totalContents);
    
        console.log(`📊 Calculated overall progress for course ${courseId}: ${averageProgress}%`);
    
        if (Math.abs(overallProgress - averageProgress) >= 1) {
            setOverallProgress(averageProgress);
            updateCourseProgress(courseId, averageProgress);
        }
    };
    
    const updateCourseProgress = async (courseId, newOverallProgress) => {
        try {
            const existingCourseProgress = courseProgress[courseId];
    
            if (existingCourseProgress?.documentId) {
                const previousProgress = existingCourseProgress.course_progress || 0;
    
                if (Math.abs(previousProgress - newOverallProgress) >= 1) {
                    console.log(`⏳ Updating course progress for course ${courseId} - New progress: ${newOverallProgress}%`);
    
                    const response = await ax.put(`${BASE_URL}/api/course-progresses/${existingCourseProgress.documentId}`, {
                        data: { course_progress: newOverallProgress },
                    });
    
                    console.log("✅ Course progress updated:", response.data);
    
                    setCourseProgress(prev => ({
                        ...prev,
                        [courseId]: { ...prev[courseId], course_progress: newOverallProgress }
                    }));
                }
            }
        } catch (err) {
            console.error("❌ Error updating course progress:", err.response?.data || err.message);
        }
    };
    
    const handleTimeUpdate = (event) => {
        const contentId = selectedContent?.id;
        if (!contentId) return;
    
        const currentTime = event.target.currentTime;
        const duration = event.target.duration;
        const newProgress = Math.round((currentTime / duration) * 100);
    
        console.log(`[handleTimeUpdate] contentId: ${contentId}, currentTime: ${currentTime}, newProgress: ${newProgress}%`);
    
        if (newProgress !== progress[contentId]?.progress) {
            setProgress(prev => ({
                ...prev,
                [contentId]: { ...(prev[contentId] || {}), progress: newProgress }
            }));
        }
    
        if (!lastUpdatedProgress.current[contentId] || newProgress !== lastUpdatedProgress.current[contentId]) {
            lastUpdatedProgress.current[contentId] = newProgress;
            console.log(`🔄 Updating progress for content ${contentId}: ${newProgress}%`);
            updateProgress(contentId, newProgress, documentId);
        }
    
        const updatedProgress = { ...progress, [contentId]: { ...(progress[contentId] || {}), progress: newProgress } };
        calculateOverallProgress(updatedProgress, documentId);
    };
    
    const handleVideoEnd = () => {
        const contentId = selectedContent?.id;
        if (!contentId) return;
    
        setProgress(prev => ({
            ...prev,
            [contentId]: { ...(prev[contentId] || {}), progress: 100 }
        }));
    
        updateProgress(contentId, 100, documentId);
    };
    
    
    
    const handleLoadedMetadata = (event) => {
        const videoElement = event.target;
        const duration = videoElement.duration;
        const contentId = selectedContent?.id;
    
        if (contentId && progress[contentId]) {
            let startTime = (progress[contentId].progress / 100) * duration;

            if (Math.abs(videoElement.currentTime - startTime) > 1) {
                console.log(`Setting video time for content ${contentId}:`, {
                    progress: progress[contentId].progress,
                    duration,
                    startTime,
                });
                videoElement.currentTime = startTime;
            }
        }
    };
    
    
    useEffect(() => {
        if (selectedContent?.id && videoRef.current) {
            const videoElement = videoRef.current;
            const duration = videoElement.duration;
            if (duration && progress[selectedContent.id]) {
                let startTime = (progress[selectedContent.id].progress / 100) * duration;
                
                if (Math.abs(videoElement.currentTime - startTime) > 1) {
                    console.log(`Applying saved progress to video: ${startTime}s`);
                    videoElement.currentTime = startTime;
                }
            }
        }
    }, [selectedContent]); 


    const goToNextLesson = () => {
        const topics = Object.values(groupedContent).flat();
        const currentIndex = topics.findIndex((item) => item.id === selectedContent?.id);
    
        if (currentIndex !== -1 && currentIndex < topics.length - 1) {
            setSelectedContent(topics[currentIndex + 1]);
        }
    };
    
    
    useEffect(() => {
        fetchProgresses().then(() => {
            fetchTopics();
            fetchCourseProgresses();
        });
    }, []);

    
    


    return (
        <div className="flex max-w-full h-screen">
            <div className="w-[70%] bg-gray-100 p-6 overflow-y-auto">
                {selectedContent && (
                    <section>
                        <h2 className="text-black text-2xl font-bold mb-4">{selectedContent.content_title}</h2>
                        {selectedContent.video_url ? (
                            <video
                                ref={videoRef}
                                width="100%"
                                height="auto"
                                controls
                                controlsList="nodownload"
                                className="mb-4"
                                onLoadedMetadata={handleLoadedMetadata}
                                onTimeUpdate={(e) => handleTimeUpdate(e, selectedContent.id)}
                                onEnded={() => handleVideoEnd(selectedContent.id)}
                            >
                                <source src={selectedContent.video_url} type="video/mp4" />
                            </video>

                        ) : (
                            <p className="text-gray-500">ไม่มีวิดีโอ</p>
                        )}
                        <p className="text-gray-700">{selectedContent.detail}</p>

                        {progress[selectedContent.id]?.progress === 100 && (
                            <button
                                className="mt-4 px-4 py-2 text-white rounded-full transition bg-gradient-to-r from-[#64c5d7] to-[#2563eb] hover:opacity-80"
                                onClick={() => goToNextLesson()}
                            >
                                ไปบทเรียนถัดไป
                            </button>

                        )}
                    </section>
                )}

            </div>
            <div className="w-[30%] bg-white p-6 overflow-y-auto">
                <h2 className="text-lg font-bold text-xl mb-4">ความคืบหน้าของบทเรียน</h2>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-2 mb-4">
                    <div
                        className="bg-green-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
                        style={{
                            width: `${overallProgress}%`,
                            background: `linear-gradient(to right, #64c5d7 , #2563eb)`,
                        }}
                    >
                        {overallProgress}%
                    </div>
                </div>
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
                                                className={`flex items-center space-x-4 text-left w-full ${progress[item.id]?.progress === 100
                                                    ? "text-blue-500 text-xs"
                                                    : selectedContent?.id === item.id
                                                        ? "text-blue-500 font-bold text-xs"
                                                        : "text-gray-400 text-xs"
                                                    }`}
                                                onClick={() => setSelectedContent(item)}
                                            >
                                                <img
                                                    src={
                                                        progress[item.id]?.progress === 100
                                                            ? video_FinishStudy
                                                            : selectedContent?.id === item.id
                                                                ? video_Studying
                                                                : video_NeverStudy
                                                    }
                                                    alt="Video Icon"
                                                    className="w-14 h-14"
                                                />
                                                <div className="flex flex-col w-full">
                                                    <span>{item.content_title}</span>
                                                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-1">
                                                        <div
                                                            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                                            style={{
                                                                width: `${progress[item.id]?.progress || 0}%`,
                                                                background: `linear-gradient(to right, #64c5d7 , #2563eb)`,
                                                            }}
                                                        >
                                                            {Math.round(progress[item.id]?.progress || 0)}%
                                                        </div>
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
        </div>
    );
}

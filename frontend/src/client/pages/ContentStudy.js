import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
import { useParams, useNavigate } from "react-router-dom";
import video_FinishStudy from "../components/video_FinishStudy.png";
import video_NeverStudy from "../components/video_NeverStudy.png";
import video_Studying from "../components/video_Studying.png";
import conf from "../../conf/main";

export default function ContentStudy() {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  const [groupedContent, setGroupedContent] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);
  const { documentId } = useParams();
  const BASE_URL = conf.apiUrl;
  const [progress, setProgress] = useState({});
  const [courseProgress, setCourseProgress] = useState({});
  const videoRef = useRef(null);
  const isProgressFetched = useRef(false);
  const isCourseProgressFetched = useRef(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const lastUpdatedProgress = useRef({});
  const [videoDurations, setVideoDurations] = useState({});

  const fetchTopics = async () => {
    try {
      const response = await ax.get(`${BASE_URL}/api/topics`, {
        params: {
          populate: "content.video",
          "filters[topic_id][documentId][$eq]": documentId,
        },
      });

      const groupedData = response.data.data.reduce((acc, topic) => {
        acc[topic.topic_title] = topic.content.map((item) => ({
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

      const topicResponse = await ax.get(`${BASE_URL}/api/topics`, {
        params: {
          populate: "*",
          "filters[topic_id][documentId][$eq]": documentId,
        },
      });

      const contentIds = topicResponse.data.data.flatMap((topic) =>
        topic.content.map((content) => content.id)
      );

      const missingContents = contentIds.filter((id) => !progressData[id]);

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

          return {
            [contentId]: {
              documentId: newDocumentId,
              progress: 0,
              course_of_progress: documentId,
            },
          };
        })
      );

      newProgressEntries.forEach((entry) => {
        progressData = { ...progressData, ...entry };
      });

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
      const courseProgressResponse = await ax.get(
        `${BASE_URL}/api/course-progresses`,
        {
          params: {
            populate: "*",
            "filters[course_progress_owner][id][$eq]": state.user.id,
          },
        }
      );

      let courseProgressData = courseProgressResponse.data.data.reduce(
        (acc, item) => {
          if (
            item.course_progress_name &&
            item.course_progress_name.documentId
          ) {
            acc[item.course_progress_name.documentId] = {
              documentId: item.documentId,
              course_progress: Number(item.course_progress) || 0,
              course_progress_name: item.course_progress_name.documentId,
            };
          }
          return acc;
        },
        {}
      );

      const courseResponse = await ax.get(`${BASE_URL}/api/courses`, {
        params: {
          populate: "*",
          "filters[documentId][$eq]": documentId,
        },
      });
      const courseDocumentIds = courseResponse.data.data.map(
        (course) => course.documentId
      );
      const missingCourses = courseDocumentIds.filter(
        (docId) => !courseProgressData[docId]
      );
      const newCourseProgressEntries = await Promise.all(
        missingCourses.map(async (docId) => {
          try {
            const response = await ax.post(
              `${BASE_URL}/api/course-progresses`,
              {
                data: {
                  course_progress: overallProgress || 0,
                  course_progress_owner: state.user.id,
                  course_progress_name: docId,
                },
              }
            );
            const newDocumentId = response.data.data.documentId;
            return {
              [docId]: {
                documentId: newDocumentId,
                course_progress: overallProgress || 0,
                course_progress_name: docId,
              },
            };
          } catch (error) {
            console.error(
              `Error creating course progress for documentId ${docId}:`,
              error
            );
            return {};
          }
        })
      );

      newCourseProgressEntries.forEach((entry) => {
        courseProgressData = { ...courseProgressData, ...entry };
      });

      setCourseProgress(courseProgressData);
    } catch (err) {
      console.error("Error fetching course progress data:", err);
    }
  };

  //ส่วนจัดการ update ข้อมูล progress
  const updateProgress = async (contentId, newProgress, courseId) => {
    try {
      const existingProgress = progress[contentId];

      if (
        existingProgress?.documentId &&
        Math.abs(existingProgress.progress - newProgress) >= 1
      ) {
        const response = await ax.put(
          `${BASE_URL}/api/progresses/${existingProgress.documentId}`,
          {
            data: { progress: newProgress },
          }
        );

        setProgress((prev) => {
          const updatedProgress = {
            ...prev,
            [contentId]: { ...prev[contentId], progress: newProgress },
          };

          calculateOverallProgress(updatedProgress, courseId);
          return updatedProgress;
        });
      }
    } catch (err) {
      console.error(
        "❌ Error updating progress:",
        err.response?.data || err.message
      );
    }
  };

  const calculateOverallProgress = (progressData, courseId) => {
    const filteredProgress = Object.values(progressData).filter(
      (item) => item.course_of_progress === courseId
    );
    const totalContents = filteredProgress.length;

    if (totalContents === 0) {
      setOverallProgress(0);
      console.log("⚠️ No relevant content available for progress calculation.");
      return;
    }

    const totalProgress = filteredProgress.reduce(
      (sum, item) => sum + (item.progress || 0),
      0
    );
    const averageProgress = Math.round(totalProgress / totalContents);

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
          const response = await ax.put(
            `${BASE_URL}/api/course-progresses/${existingCourseProgress.documentId}`,
            {
              data: { course_progress: newOverallProgress },
            }
          );

          setCourseProgress((prev) => ({
            ...prev,
            [courseId]: {
              ...prev[courseId],
              course_progress: newOverallProgress,
            },
          }));
        }
      }
    } catch (err) {
      console.error(
        "❌ Error updating course progress:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchProgresses().then(() => {
      fetchTopics();
      fetchCourseProgresses();
    });
  }, []);

  //ส่วนการจัดการ วิดีโอ
  const handleTimeUpdate = (event) => {
    const contentId = selectedContent?.id;
    if (!contentId) return;

    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    const newProgress = Math.round((currentTime / duration) * 100);

    if (newProgress !== progress[contentId]?.progress) {
      setProgress((prev) => ({
        ...prev,
        [contentId]: { ...(prev[contentId] || {}), progress: newProgress },
      }));
    }

    if (
      !lastUpdatedProgress.current[contentId] ||
      newProgress !== lastUpdatedProgress.current[contentId]
    ) {
      lastUpdatedProgress.current[contentId] = newProgress;

      updateProgress(contentId, newProgress, documentId);
    }

    const updatedProgress = {
      ...progress,
      [contentId]: { ...(progress[contentId] || {}), progress: newProgress },
    };
    calculateOverallProgress(updatedProgress, documentId);
  };

  const handleVideoEnd = () => {
    const contentId = selectedContent?.id;
    if (!contentId) return;

    setProgress((prev) => ({
      ...prev,
      [contentId]: { ...(prev[contentId] || {}), progress: 100 },
    }));

    updateProgress(contentId, 100, documentId);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time <= 0) return "00:00:00";

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const parseTimeString = (timeString) => {
    // ฟังก์ชันแปลงเวลา (hh:mm:ss -> วินาที)
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const topicDurations = Object.entries(groupedContent).reduce(
    (acc, [topic, contents]) => {
      const totalSeconds = contents.reduce((sum, item) => {
        const duration = videoDurations[item.id] || "00:00:00";
        return sum + parseTimeString(duration);
      }, 0);

      const formattedDuration = formatTime(totalSeconds);
      return { ...acc, [topic]: formattedDuration };
    },
    {}
  );

  const handleLoadedMetadata = (event) => {
    const videoElement = event.target;
    const duration = videoElement.duration;
    const contentId = selectedContent?.id;

    if (!contentId) return;

    setVideoDurations((prev) => ({
      ...prev,
      [contentId]: formatTime(duration),
    }));

    if (progress[contentId]) {
      let startTime = (progress[contentId].progress / 100) * duration;

      setTimeout(() => {
        if (Math.abs(videoElement.currentTime - startTime) > 1) {
          videoElement.currentTime = startTime;
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (selectedContent && videoRef.current) {
      const videoElement = videoRef.current;

      videoElement.src = selectedContent.video_url;
      videoElement.load();

      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        if (duration && progress[selectedContent.id]) {
          let startTime =
            (progress[selectedContent.id].progress / 100) * duration;

          videoElement.currentTime = startTime;
        }
      };
    }
  }, [selectedContent]);

  useEffect(() => {
    const fetchVideoDurations = async () => {
      const durations = {};

      for (const topic of Object.values(groupedContent)) {
        for (const content of topic) {
          if (content.video_url) {
            const video = document.createElement("video");
            video.src = content.video_url;
            video.preload = "metadata";

            await new Promise((resolve) => {
              video.onloadedmetadata = () => {
                durations[content.id] = formatTime(video.duration);
                resolve();
              };
              video.onerror = () => {
                durations[content.id] = "00:00:00"; // ถ้าโหลดไม่ได้
                resolve();
              };
            });
          }
        }
      }

      setVideoDurations(durations);
    };

    fetchVideoDurations();
  }, [groupedContent]);

  //ส่วนจัดการการเลือกลำดับของบทเรียน
  const goToNextLesson = () => {
    const topics = Object.values(groupedContent).flat(); // รวมทุกบทเรียน
    if (!topics.length) return;

    let currentIndex = topics.findIndex(
      (item) => item.id === selectedContent.id
    );

    // หาเนื้อหาที่ progress < 100%
    let nextIndex = (currentIndex + 1) % topics.length;
    while (
      progress[topics[nextIndex].id]?.progress === 100 &&
      nextIndex !== currentIndex
    ) {
      nextIndex = (nextIndex + 1) % topics.length;
    }

    setSelectedContent(topics[nextIndex]);
  };

  const restartLesson = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    if (selectedContent?.id) {
      setProgress((prev) => ({
        ...prev,
        [selectedContent.id]: { ...prev[selectedContent.id], progress: 0 },
      }));
      updateProgress(selectedContent.id, 0, documentId);
    }
  };

  const exitLesson = () => {
    console.log("ออกจากบทเรียนนี้...");
    navigate("/my-course");
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-full min-h-screen">
      <div className="w-full lg:w-[70%] bg-gray-100 p-4 lg:p-6 overflow-y-auto">
        {selectedContent && (
          <section>
            <h2 className="text-black text-xl lg:text-2xl font-bold mb-4">
              {selectedContent.content_title}
            </h2>

            {selectedContent.video_url ? (
              <div className="relative">
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

                {progress[selectedContent.id]?.progress === 100 && (
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-800/90">
                    <h1 className="mb-6 lg:mb-10 text-white text-2xl lg:text-3xl font-bold text-center px-4">
                      จบบทเรียน {selectedContent.content_title}
                    </h1>

                    <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-9">
                      <button
                        className="px-4 py-2 lg:px-6 lg:py-3 text-white text-base lg:text-lg font-bold rounded-full bg-gradient-to-r from-[#64c5d7] to-[#2563eb] hover:opacity-80"
                        onClick={() => restartLesson()}
                      >
                        ดูบทเรียนนี้อีกครั้ง
                      </button>

                      {overallProgress === 100 ? (
                        <button
                          className="px-4 py-2 lg:px-6 lg:py-3 text-white text-base lg:text-lg font-bold rounded-full bg-gradient-to-r from-[#64c5d7] to-[#2563eb] hover:opacity-80"
                          onClick={() => exitLesson()}
                        >
                          ออกจากบทเรียนนี้
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 lg:px-6 lg:py-3 text-white text-base lg:text-lg font-bold rounded-full bg-gradient-to-r from-[#64c5d7] to-[#2563eb] hover:opacity-80"
                          onClick={() => goToNextLesson()}
                        >
                          ไปบทเรียนถัดไป
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">ไม่มีวิดีโอ</p>
            )}

            <p className="text-gray-700">{selectedContent.detail}</p>
          </section>
        )}
      </div>

      <div className="w-full lg:w-[30%] bg-white p-4 lg:p-6 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">ความคืบหน้าของบทเรียน</h2>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mb-4">
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
        <h2 className="text-lg font-bold mb-4">เนื้อหาวิดีโอ</h2>
        <ul className="space-y-6">
          {Object.keys(groupedContent).length > 0 ? (
            Object.entries(groupedContent).map(([topic, contents]) => (
              <li key={topic}>
                <h3 className="text-gray-600 text-sm lg:text-base font-bold">
                  {topic}{" "}
                  <span className="text-gray-400 text-xs">
                    ({topicDurations[topic]})
                  </span>
                </h3>
                <h6 className="text-gray-400 text-xs font-bold">
                  จำนวน {contents.length} บทเรียน
                </h6>
                <ul className="ml-4 mt-2 space-y-2">
                  {contents.map((item) => (
                    <li key={item.id}>
                      <button
                        className={`flex items-center space-x-2 lg:space-x-4 text-left w-full ${
                          progress[item.id]?.progress === 100
                            ? "text-blue-500 text-xs"
                            : selectedContent?.id === item.id
                            ? "text-blue-500 font-bold text-xs"
                            : "text-gray-400 text-xs"
                        }`}
                        onClick={() => {
                          setSelectedContent(item);
                        }}
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
                          className="w-10 h-10 lg:w-14 lg:h-14"
                        />
                        <div className="flex flex-col w-full">
                          <span>{item.content_title}</span>
                          <div className="flex items-center justify-between w-full mt-1">
                            <div className="w-3/4 bg-gray-200 rounded-full dark:bg-gray-700">
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
                            <span className="text-gray-500 ml-2 text-xs">
                              {videoDurations[item.id] || "00:00:00"}
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
    </div>
  );
}

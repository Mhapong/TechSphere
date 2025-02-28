"use client"

import { useContext, useEffect, useState, useCallback, useRef } from "react"
import { AuthContext } from "../../context/Auth.context"
import ax from "../../conf/ax"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function SuggestCourse() {
    const { state } = useContext(AuthContext);
    const { documentId } = useParams();
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337";
   
    const [selectedOptions, setSelectedOptions] = useState(Array(12).fill(4)); // ค่าเริ่มต้นตรงกลาง (0)
    const [scores, setScores] = useState({
        "Web Develop": 0,
        "Data Analysis": 0,
        "IoT & Hardware": 0,
        "Network": 0,
        "Game Develop": 0,
        "AI": 0
    });

    const categories = [
        "Web Develop", "Data Analysis", "IoT & Hardware", "Network", "Game Develop", "AI",
        "Web Develop", "Data Analysis", "IoT & Hardware", "Network", "Game Develop", "AI"
    ];
    const questions = [
        "คุณรู้สึกชอบการพัฒนาเว็บไซต์มากแค่ไหน?",
        "คุณชอบการวิเคราะห์ข้อมูลหรือไม่?",
        "คุณสนใจ IoT & Hardware มากแค่ไหน?",
        "คุณคิดว่า Network สำคัญต่อการทำงานของคุณหรือไม่?",
        "คุณอยากพัฒนาเกมหรือไม่?",
        "คุณสนใจด้าน AI และ Machine Learning แค่ไหน?",
        "คุณชอบการเขียนเว็บแอปพลิเคชันหรือไม่?",
        "การทำงานกับ Big Data น่าสนใจสำหรับคุณหรือเปล่า?",
        "คุณต้องการเรียนรู้เกี่ยวกับการพัฒนาอุปกรณ์ IoT หรือไม่?",
        "คุณสนใจการดูแลและปรับปรุงระบบเครือข่ายหรือไม่?",
        "การพัฒนาเกมเป็นสิ่งที่คุณอยากลองทำใช่ไหม?",
        "คุณอยากเข้าใจเกี่ยวกับ AI ในชีวิตประจำวันมากขึ้นหรือไม่?"
    ];
    

    const handleOptionChange = (index, value) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = value;
        setSelectedOptions(newSelectedOptions);

        const newScores = { "Web Develop": 0, "Data Analysis": 0, "IoT & Hardware": 0, "Network": 0, "Game Develop": 0, "AI": 0 };
        newSelectedOptions.forEach((val, idx) => {
            newScores[categories[idx]] += val - 4;
        });

        setScores(newScores);
        console.log("Updated Scores:", newScores);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            {Array(12).fill(null).map((_, qIndex) => (
                <div key={qIndex} className="bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-lg mb-4">
                    <p className="text-lg font-semibold mb-4 text-center">{questions[qIndex]}</p>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm mr-2">ชอบน้อยที่สุด</span>
                        {[...Array(9)].map((_, index) => {
                            const size = 24 + Math.abs(4 - index) * 6;
                            return (
                                <label key={index} className="flex items-center justify-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`feedback-${qIndex}`}
                                        value={index}
                                        checked={selectedOptions[qIndex] === index}
                                        onChange={() => handleOptionChange(qIndex, index)}
                                        className="hidden"
                                    />
                                    <div
                                        style={{ width: `${size}px`, height: `${size}px` }}
                                        className={`rounded-full border border-gray-400 flex items-center justify-center transition-all ${selectedOptions[qIndex] === index ? 'bg-blue-500' : 'bg-gray-200'}`}
                                    />
                                </label>
                            );
                        })}
                        <span className="text-sm ml-2">ชอบมากที่สุด</span>
                    </div>
                </div>
            ))}
        </div>
    );
}







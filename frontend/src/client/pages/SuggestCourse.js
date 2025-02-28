import { useState } from "react";
// import { AuthContext } from "../../context/Auth.context";
// import ax from "../../conf/ax";
import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function SuggestCourse() {
  // const { state } = useContext(AuthContext);
  // const { documentId } = useParams();
  const navigate = useNavigate();
  //   const BASE_URL = conf.apiUrl;
  const [openCourse, setOpenCourse] = useState(false);
  const [maxCategory, setMaxCategory] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(Array(12).fill(4)); // ค่าเริ่มต้นตรงกลาง (0)
  const [scores, setScores] = useState({
    "Web Develop": 0,
    "Data Analysis": 0,
    "IoT & Hardware": 0,
    Network: 0,
    "Game Develop": 0,
    AI: 0,
  });

  const categories = [
    "Web Develop",
    "Data Analysis",
    "IoT & Hardware",
    "Network",
    "Game Develop",
    "AI",
    "Web Develop",
    "Data Analysis",
    "IoT & Hardware",
    "Network",
    "Game Develop",
    "AI",
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
    "คุณอยากเข้าใจเกี่ยวกับ AI ในชีวิตประจำวันมากขึ้นหรือไม่?",
  ];

  const handleOptionChange = (index, value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = value;
    setSelectedOptions(newSelectedOptions);

    const newScores = {
      "Web Develop": 0,
      "Data Analysis": 0,
      "IoT & Hardware": 0,
      Network: 0,
      "Game Develop": 0,
      AI: 0,
    };
    newSelectedOptions.forEach((val, idx) => {
      newScores[categories[idx]] += val - 4;
    });
    setScores(newScores);

    let maxCategory = "";
    let maxValue = -Infinity;

    for (let key in newScores) {
      if (newScores[key] > maxValue) {
        maxValue = newScores[key];
        maxCategory = key;
      }
    }
    setMaxCategory(maxCategory);
  };
  const CloseCourseView = () => {
    setSelectedOptions(Array(12).fill(4));
    setMaxCategory("");
    setOpenCourse(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center sm:text-left">
        <h2 className="flex items-center justify-center mb-3 text-3xl sm:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          สำรวจตัวเอง
        </h2>
        <p className="flex items-center justify-center font-light text-gray-500 mb-8 sm:mb-12 text-lg sm:text-xl dark:text-gray-400">
          ถึงเวลาเริ่มต้นทักษะใหม่ๆแล้ว มาตรวจสอบความชอบของตัวเองกัน!
        </p>
      </div>

      <div className="space-y-6">
        {Array(12)
          .fill(null)
          .map((_, qIndex) => (
            <div
              key={qIndex}
              className="bg-white border border-gray-200 text-gray-700 px-4 py-5 rounded-lg shadow-sm"
            >
              <p className="text-base sm:text-lg font-semibold mb-4 text-center">
                {questions[qIndex]}
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between w-full">
                <div className="hidden sm:flex justify-start">
                  <span className="text-sm text-black sm:mr-2">
                    ชอบน้อยที่สุด
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-1 sm:space-x-2 order-3 sm:order-none flex-1">
                  {[...Array(9)].map((_, index) => {
                    const size = 24 + Math.abs(4 - index) * 6;
                    return (
                      <label
                        key={index}
                        className="flex items-center justify-center cursor-pointer"
                      >
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
                          className={`rounded-full border border-gray-400 flex items-center justify-center transition-all ${
                            selectedOptions[qIndex] === index
                              ? "bg-blue-500 border-blue-600"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="hidden sm:flex justify-end">
                  <span className="text-sm text-black sm:ml-2">
                    ชอบมากที่สุด
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="col-span-full mt-6 p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="submit"
          className="block w-full bg-[#757575] hover:bg-[#4f4f4f] text-white font-bold py-3 px-4 rounded-full"
          onClick={() => CloseCourseView()}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className={`block w-full ${
            maxCategory
              ? "bg-[#054cc2] hover:bg-[#04388f]"
              : "bg-gray-800 cursor-not-allowed"
          } text-white font-bold py-3 px-4 rounded-full`}
          onClick={() => maxCategory && setOpenCourse(true)}
          disabled={!maxCategory}
          title={!maxCategory ? "กรุณาเลือกก่อน" : ""}
        >
          ค้นหา
        </button>
      </div>
      <Dialog
        open={openCourse}
        onClose={setOpenCourse}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      ไปหาคอร์สเรียนประเภท {maxCategory} กันเถอะ!
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณสามารถกลับมาสำรวจใหม่ได้เสมอ เริ่มต้นเรียน
                        และค้นหาสิ่งที่ตัวเองสนใจกัน
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    // handleRowDeleted(DeleteCourse);
                    // setDeleteCourse(null);
                    navigate("/explore", { state: maxCategory });
                    CloseCourseView(false);
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  ไปยังหน้ารวมคอร์สประเภท {maxCategory}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => CloseCourseView(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  ยกเลิกและค้นหาใหม่
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

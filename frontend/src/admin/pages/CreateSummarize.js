import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ax from "../../conf/ax";
import { Edit, Add } from "@mui/icons-material";

export default function CourseDetails() {
  const { courseid } = useParams();
  const [Course, setCourse] = useState("");
  const Navigate = useNavigate();
  const fetchCoures = async () => {
    try {
      const response = await ax.get(`courses/${courseid}?populate=*`);
      console.log(response.data.data);
      setCourse(response.data.data);
    } catch (e) {
      console.log("Error", e);
    }
  };
  const handleAddTopic = () => {
    Navigate(`/create-topic/${Course.id}/${Course.Name}`);
  };

  useEffect(() => {
    fetchCoures();
  }, []);
  return (
    // <div className="min-h-screen w-[1400px] mx-64  mt-11 bg-gray-50 p-4 md:p-8">
    <div className="w-[1000px] mx-96 mt-11 p-8">
      {/* Course Header */}
      <ol class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 sm:justify-center md:flex-row md:items-center lg:gap-6">
        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>
        <li class="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5 lg:flex-none">
          <svg
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p class="text-sm font-medium leading-tight text-gray-500 dark:text-gray-400">
            สร้างคอร์สใหม่
          </p>
        </li>

        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>

        <li class="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5 lg:flex-none">
          <svg
            class="h-5 w-5 text-primary-700 dark:text-primary-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p class="text-sm font-medium leading-tight text-primary-700 dark:text-primary-500">
            สรุปการสร้างคอร์ส
          </p>
        </li>

        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>

        <li class="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5 lg:flex-none">
          <svg
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p class="text-sm font-medium leading-tight text-gray-500 dark:text-gray-400">
            สร้างหัวข้อและเนื้อหาใหม่
          </p>
        </li>
        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>
      </ol>

      <div className="mb-8 flex items-center gap-4 mt-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-900 text-white">
          <span className="text-xl">
            <Edit />
          </span>
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">{Course.Name}</h1>
      </div>

      {/* Course Info Card */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              หัวข้อเรื่อง : {Course.Name}
            </h2>
            <button className="text-orange-500 hover:text-orange-600">
              <span className="text-xl">
                <Edit />
              </span>
            </button>
          </div>
          <p className="text-gray-600">
            ประเภท :{" "}
            {Course &&
              Course.categories.map((value) => (
                <div
                  key={value.id}
                  className="inline-flex bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-2 mt-0"
                >
                  {value.tag}
                </div>
              ))}
          </p>
          <div className="space-y-1">
            <p className="font-medium">รายละเอียด :</p>
            <p className="text-gray-600">{Course.Description}</p>
          </div>
          <p className="text-gray-600">
            จำนวนผู้เรียนที่รองรับ :
            {Course.lecturer_owner ? ` ${Course.lecturer_owner.length}` : " 0"}{" "}
            คน
          </p>
        </div>
      </div>

      {/* Course Modules */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">หัวข้อ</h3>
          <button
            onClick={handleAddTopic}
            className="text-teal-600 hover:text-teal-700"
          >
            <span className="text-xl flex items-center">
              <Add /> เพิ่ม
            </span>
          </button>
        </div>

        {/* Module List */}
        <div className="space-y-2">
          {Course.topic &&
            Course.topic.map((value, index) => (
              <div
                key={value.topic_title}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium">{`${index + 1}. ${
                    value.topic_title
                  }`}</span>
                  <span className="text-gray-600">เวลา {value.time} นาที</span>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <span className="text-sm">
                    {" "}
                    <Edit />
                  </span>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          ยกเลิก
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-[#8c0327] text-white rounded-md hover:bg-[#6c021f]">
          บันทึก
        </button>
      </div>
    </div>
  );
}

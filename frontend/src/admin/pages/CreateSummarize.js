import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ax from "../../conf/ax";
import { Edit, Add, Delete } from "@mui/icons-material";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import conf from "../../conf/main";
import Error from "../components/Image/404.png";

export default function CourseDetails() {
  const { courseid } = useParams();
  const [Course, setCourse] = useState("");
  const Navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [DeleteTopic, setDeleteTopic] = useState([]);
  const [image, setImage] = useState(null);

  const handleRowDeleted = async (itemId) => {
    try {
      await ax.delete(`Topics/${itemId}`);
      fetchCourse();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await ax.get(`courses/${courseid}?populate=*`);
      setCourse(response.data.data);
      console.log(response.data.data);
      if (response.data.data.image[0]) {
        const imageUrl = `${conf.apiUrl}${response.data.data.image[0].url}`;
        setImage(imageUrl);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };
  // const handleAddTopic = () => {
  // Navigate(`/create-topic/${Course.Id}/${Course.documentId}/${Course.Name}`);

  //   Navigate("/view-student", {
  //     state: { Value: items },
  //   });
  // };

  useEffect(() => {
    fetchCourse();
  }, []);
  return (
    // <div className="min-h-screen w-[1400px] mx-64  mt-11 bg-gray-50 p-4 md:p-8">
    // <div className="w-[1000px] mx-96 mt-11 p-8">
    <div className="w-full lg:w-[1000px] mt-11 lg:ml-96 pt-12 max-w-7xl p-8">
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
      <div className="p-2 h-auto">
        <div>
          <div>
            <label
              htmlFor="image-upload"
              className="w-full min-h-96 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
            >
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <img
                  src={Error}
                  alt="Preview"
                  className="w-full h-96 object-cover rounded-md"
                />
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              หัวข้อเรื่อง : {Course.Name}
            </h2>
            <button
              onClick={() => {
                Navigate(`/create-course`, {
                  state: { Value: Course },
                });
              }}
              className="text-orange-500 hover:text-orange-600"
            >
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
            จำนวนผู้เรียนในคอร์สทั้งหมด :
            {Course.user_owner ? ` ${Course.user_owner.length}` : " 0"} คน
          </p>
        </div>
      </div>

      {/* Course Modules */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">หัวข้อ</h3>
          <button
            onClick={() => {
              Navigate(`/create-topic/${Course.documentId}`, {
                state: { Value: Course },
              });
            }}
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
                <div className="flex gap-5">
                  <button
                    onClick={() => {
                      setOpen(true);
                      setDeleteTopic(value.documentId);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-sm">
                      {" "}
                      <Delete />
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      Navigate(`/create-topic/${value.documentId}`, {
                        state: { Value: Course },
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-sm">
                      {" "}
                      <Edit />
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-self-end w-3/12">
        <button
          className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
          onClick={() => Navigate(-1)}
        >
          ย้อนกลับ
        </button>
        {/* <button className="px-4 py-2 text-sm font-medium bg-[#8c0327] text-white rounded-md hover:bg-[#6c021f]">
          บันทึก
        </button> */}
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="size-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      แจ้งเตือนการลบหัวข้อ
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจแล้วหรือไม่ ว่าจะลบหัวข้อนี้?
                        ข้อมูลที่ลบไปจะไม่สามารถกู้คืนได้อีก
                        กรุณาตรวจสอบให้แน่ใจก่อนลบหัวข้อนี้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleRowDeleted(DeleteTopic);
                    setDeleteTopic(null);
                    setOpen(false);
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  ยืนยันการลบ
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  ยกเลิก
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

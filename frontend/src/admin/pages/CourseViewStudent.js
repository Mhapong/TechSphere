import React, { useEffect, useState } from "react";
// import ax from "../../conf/ax";
import usericon from "../components/Image/user-icon.webp";
import { useLocation, useNavigate } from "react-router";
import { Delete } from "@mui/icons-material";
import ax from "../../conf/ax";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const CourseStudentTable = () => {
  const [Student, setStudent] = useState([]);
  const Navigate = useNavigate();
  const location = useLocation();
  const { Value } = location.state || {};
  const [open, setOpen] = useState(false);
  const [DeleteStudent, setDeleteStudent] = useState([]);
  console.log(Value);
  useEffect(() => {
    if (Value) {
      setStudent(Value.user_owner);
    }
  }, [Student]);

  const handleDelete = async (userid) => {
    try {
      //   const response = await ax.get(`topics/${itemId}?populate=*`)
      const totalUser = Value.user_owner
        ? Value.user_owner.filter((item) => item.id !== userid)
        : [];
      await ax.put(`courses/${Value.documentId}`, {
        data: {
          user_owner: totalUser,
        },
      });
      fetchCourse();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await ax.get(`course/${Value.documentId}?populate=*`);
      console.log(response.data);
      setStudent(response.data.user_owner);
      // setStudent(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // useEffect(() => {
  //   const fetchCourseProgresses = async () => {
  //     try {
  //       const response = await ax.get(
  //         `course-progresses/${Value.sum_progresses.documentId}?populate=*`
  //       );
  //       console.log(response.data);
  //       // setStudent(response.data);
  //     } catch (error) {
  //       console.error("Error fetching team members:", error);
  //     }
  //   };

  //   fetchCourseProgresses();
  // }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen py-3 sm:py-5">
      <div className="w-full lg:w-[1200px] mt-11 lg:ml-96 max-w-7xl p-4">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            นักเรียนของคอร์ส {Value.Name}
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            นักเรียนที่ไว้ใจและเลือกเรียนกับ TechSphere คอร์ส [{Value.Name}]{" "}
            ทั้งหมด {Student.length} คน
          </p>
        </div>
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-900">นักเรียนทั้งหมด : </span>
                <span className="dark:text-white">{Student.length}</span>
              </h5>
            </div>
            <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
              <button
                onClick={() => Navigate("/sign-up")}
                type="button"
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-back rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                เพิ่มนักเรียนใหม่
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    ชื่อ-นามสกุล
                  </th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    ชื่อผู้ใช้งาน
                  </th>
                  {/* <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    สถานะ
                  </th> */}
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    การยืนยันตัวตน
                  </th>
                  {/* <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    เงินรวม
                  </th> */}

                  <th scope="col" className="flex ml-3 px-4 py-3">
                    ลบ
                  </th>
                </tr>
              </thead>
              <tbody>
                {Student.map((value) => (
                  <tr className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <th
                      scope="row"
                      className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        src={usericon}
                        alt="Image"
                        className="w-auto h-8 mr-3"
                      />
                      {value.first_name} {value.last_name}
                    </th>
                    <td className="px-4 py-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        {value.username}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center ml-3">
                        <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div>
                        {value?.role?.name}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <span
                        className={`inline-block pt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                          value.confirmed
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {value.confirmed
                          ? "ยืนยันตัวตนแล้ว"
                          : "ยังไม่ได้ยืนยันตัวตน"}
                      </span>
                    </td>
                    {/* <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <span>
                        {value?.owned_course?.reduce(
                          (sum, e) => sum + (e.Price || 0),
                          0
                        )}{" "}
                        บาท
                      </span>
                    </td> */}
                    {/* <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center ml-1">
                        <button className="ml-1 flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200">
                          <Add className="w-5 h-5" />
                        </button>
                      </div>
                    </td> */}

                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setOpen(true);
                            setDeleteStudent(value.id);
                          }}
                          className="ml-1 flex items-center justify-center w-9 h-9 rounded-full bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-500 transition-all duration-200"
                        >
                          <Delete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav
            className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing
              <span className="font-semibold text-gray-900 dark:text-white">
                1-{Student.length}
              </span>
              of
              <span className="font-semibold text-gray-900 dark:text-white">
                {Student.length}
              </span>
            </span>
          </nav>
        </div>
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
                      แจ้งเตือนการลบนักเรียนออกจากคอร์ส
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจแล้วหรือไม่ ว่าจะลบนักเรียนออกจากคอร์สนี้?
                        ข้อมูลที่ลบไปจะไม่สามารถกู้คืนได้อีก
                        กรุณาตรวจสอบให้แน่ใจก่อนลบนักเรียนออกจากคอร์สนี้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(DeleteStudent);
                    setDeleteStudent(null);
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
    </section>
  );
};

export default CourseStudentTable;

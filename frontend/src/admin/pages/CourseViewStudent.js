import React, { useEffect, useState } from "react";
// import ax from "../../conf/ax";
import usericon from "../components/Image/user-icon.webp";
import { useLocation, useNavigate } from "react-router";
import { Delete } from "@mui/icons-material";

const CourseStudentTable = () => {
  const [Student, setStudent] = useState([]);
  const Navigate = useNavigate();
  const location = useLocation();
  const { Value } = location.state || {};
  useEffect(() => {
    setStudent(Value.user_owner);
  }, []);

  // const handleDelete = async (itemId) => {
  //   try {
  //     setIsLoading(true);
  //     //   const response = await ax.get(`topics/${itemId}?populate=*`);
  //     await ax.delete(`topics/${itemId}`);
  //     const scores = response.data.data.score_id;
  //     for (const score of scores) {
  //       await ax.delete(`scores/${score.documentId}`);
  //     }

  //     message.success("Topic and associated scores deleted successfully!");
  //     fetchTopic();
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //   useEffect(() => {
  //     const fetchStudent = async () => {
  //       try {
  //         const response = await ax.get(
  //           "users?filters[role][name][$eq]=User&populate=*"
  //         );
  //         console.log(response.data);
  //         setStudent(response.data);
  //       } catch (error) {
  //         console.error("Error fetching team members:", error);
  //       }
  //     };

  //     fetchStudent();
  //   }, []);

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
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    สถานะ
                  </th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    การยืนยันตัวตน
                  </th>
                  <th scope="col" className="px-4 py-3 whitespace-nowrap">
                    เงินรวม
                  </th>

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
                        {/* <div className="inline-block w-4 h-4 mr-2 bg-green-700 rounded-full"></div> */}
                        {/* {value.role.name} */}
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
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <span>
                        {value?.owned_course?.reduce(
                          (sum, e) => sum + (e.Price || 0),
                          0
                        )}{" "}
                        บาท
                      </span>
                    </td>
                    {/* <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center ml-1">
                        <button className="ml-1 flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200">
                          <Add className="w-5 h-5" />
                        </button>
                      </div>
                    </td> */}

                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">
                        <button className="ml-1 flex items-center justify-center w-9 h-9 rounded-full bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-500 transition-all duration-200">
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
    </section>
  );
};

export default CourseStudentTable;

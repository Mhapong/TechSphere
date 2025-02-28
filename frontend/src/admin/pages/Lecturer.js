import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import usericon from "../components/Image/usertest.png";
import { Rating } from "@material-tailwind/react";
import { useNavigate } from "react-router";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import conf from "../../conf/main";

const LecturerAll = () => {
  const [Lecturer, setLecturer] = useState([]);
  const Navigate = useNavigate();
  const [queryLecturer, setQueryLecturer] = useState("");
  const [open, setOpen] = useState(false);
  const [DeleteLecturer, setDeleteLecturer] = useState([]);

  const handleRowDeleted = async (itemId) => {
    try {
      console.log("Delete");
      await ax.delete(`users/${itemId}`);
      fetchLecturer();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredLecturer = queryLecturer
    ? Lecturer.filter(
        (value) =>
          value.first_name
            .toLowerCase()
            .includes(queryLecturer.toLowerCase()) ||
          value.last_name.toLowerCase().includes(queryLecturer.toLowerCase())
      )
    : Lecturer;

  const fetchLecturer = async () => {
    try {
      const response = await ax.get(
        "users?filters[role][name][$eq]=Lecturer&populate=*"
      );
      setLecturer(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  useEffect(() => {
    // Fetch team values from Strapi

    fetchLecturer();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="w-full max-w-[1200px] mx-auto mt-11 p-8 sm:w-[100%] sm:flexmd:w-[80%] lg:w-[1200px] lg:ml-20 xl:ml-96">
        {/* <div className="w-full lg:w-[1000px] mt-11 lg:ml-96 pt-16 max-w-7xl p-4"> */}
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            อาจารย์ผู้สอน
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            อาจารย์ผู้สอนทั้งหมดที่มีคุณภาพของ TechSphere ทั้งหมด{" "}
            {Lecturer.length} คน
          </p>
          <div className="flex justify-center items-center space-x-3 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <label
              htmlFor="search"
              className="text-gray-700 text-lg font-medium"
            >
              ค้นหา :
            </label>
            <input
              id="search"
              title="ค้นหา"
              type="text"
              placeholder="ค้นหาโดยชื่ออาจารย์ผู้สอน"
              className="flex-1 bg-gray-100 focus:bg-white h-10 w-72 border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={queryLecturer}
              onChange={(e) => setQueryLecturer(e.target.value)}
            />
          </div>
        </div>
        {filteredLecturer.length > 0 ? (
          filteredLecturer.map((value) => (
            <motion.div
              key={value.id}
              initial={{ y: -5, opacity: 0, scale: 1.1 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0 }}
              className="inline-block w-full sm:w-auto mx-2 sm:mx-6 my-4 sm:my-0" // Adjusted margins and width for responsiveness
            >
              <div
                className="flex flex-col sm:flex-row items-center bg-gray-50 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 
    hover:-translate-y-2 transition-all duration-200 delay-75 hover:drop-shadow-5xl hover:shadow-blue-900"
              >
                {/* Buttons for Edit and Delete */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm sm:text-base"
                    onClick={() => Navigate(`/edit-profile/${value.id}`)}
                  >
                    <Edit /> Edit
                  </button>
                  <button
                    className="bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-3 rounded text-sm sm:text-base"
                    onClick={() => {
                      setOpen(true);
                      setDeleteLecturer(value.id);
                    }}
                  >
                    <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Profile Picture */}
                <a
                  href="#"
                  className="w-full sm:w-52 h-52 flex justify-center sm:justify-start"
                >
                  {value.profile_picture ? (
                    <img
                      className="w-full h-full sm:w-52 sm:h-52 rounded-lg sm:rounded-none sm:rounded-l-lg object-cover"
                      src={`${conf.apiUrl}${value.profile_picture[0].url}`}
                      alt={`${value.username} Avatar`}
                    />
                  ) : (
                    <img
                      className="w-40 h-40 sm:w-52 sm:h-52 rounded-lg sm:rounded-none sm:rounded-l-lg object-cover"
                      src={usericon}
                      alt={`${value.username} Avatar`}
                    />
                  )}
                </a>

                {/* Content Section */}
                <div className="p-4 sm:p-5 w-full">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">
                      {value.first_name} {value.last_name}
                    </a>
                  </h3>
                  <span className="text-gray-500 dark:text-gray-400">
                    {value.role?.name || "No Role"}
                  </span>
                  <p className="mb-2 sm:mb-4 font-light text-gray-500 dark:text-gray-400">
                    จำนวนคอร์สที่มี : {value.created_courses?.length || 0}
                  </p>
                  <p className="text-sm sm:text-base flex items-center justify-center sm:justify-start">
                    <span
                      className={`inline-block pt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                        value.background
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      สถานะ :{" "}
                      {value.background
                        ? "ใส่ประวัติของอาจารย์แล้ว"
                        : "ยังไม่ใส่ประวัติอาจารย์"}
                    </span>
                  </p>

                  {/* Rating Section */}
                  <div className="flex items-center mt-2">
                    {/* <div className="flex items-center mt-2"> */}
                    {/* ค่าเฉลี่ยรีวิว */}
                    <div className="flex items-center gap-2 font-bold text-blue-gray-500">
                      <Rating
                        value={
                          value.rating.length === 0
                            ? 0
                            : value.rating.reduce(
                                (sum, item) => sum + (item?.star || 0),
                                0
                              ) / value.rating.length
                        }
                        readonly
                      />
                    </div>

                    <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                    <span className="inline-flex items-center text-amber-700 w-full whitespace-nowrap">
                      {value.rating && value.rating === 0
                        ? "ยังไม่มีรีวิว"
                        : `(${value.rating?.length} reviews)`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="mx-auto my-7 flex items-center justify-center">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl px-6 py-8 text-center">
              <p className="text-gray-700 text-2xl font-semibold">
                ไม่พบข้อมูลอาจารย์ผู้สอนที่ค้นหา
              </p>
              <p className="text-gray-500 text-lg mt-2">
                กรุณาตรวจสอบคำค้นหาหรือเพิ่มอาจารย์ผู้สอนเข้าสู่ระบบ
              </p>
            </div>
          </div>
        )}
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
                      แจ้งเตือนการลบอาจารย์
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจแล้วหรือไม่ ว่าจะลบรายชื่ออาจารย์คนนี้?
                        ข้อมูลที่ลบไปจะไม่สามารถกู้คืนได้อีก
                        กรุณาตรวจสอบให้แน่ใจก่อนลบอาจารย์
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleRowDeleted(DeleteLecturer);
                    setDeleteLecturer(null);
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

export default LecturerAll;

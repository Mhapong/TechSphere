import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import datapic from "../../client/components/data.png";
import webpic from "../../client/components/web-100.png";
import gamepic from "../../client/components/game.png";
import hardwarepic from "../../client/components/hardware.png";
import networkpic from "../../client/components/network.png";
import morepic from "../../client/components/more.png";
import allpic from "../components/Image/All.png";
// import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";
// import remarkGfm from "remark-gfm";
import CourseEx from "../components/Image/htmlcssJS.webp";
import Select from "react-select";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Delete, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import conf from "../../conf/main";
import Error from "../components/Image/404.png";
import { Rating } from "@material-tailwind/react";

export function CourseView() {
  const [Course, setCourse] = useState([]);
  const Navigate = useNavigate();
  const [queryCourse, setQueryCourse] = useState("");
  const [open, setOpen] = useState(false);
  const [DeleteCourse, setDeleteCourse] = useState([]);

  const handleRowDeleted = async (itemId) => {
    try {
      await ax.delete(`Courses/${itemId}`);
      fetchCourse();
    } catch (err) {
      console.log(err);
    }
  };

  const categories = [
    { name: "ALL", img: allpic, path: "ALL" },
    { name: "Web Develop", img: webpic, path: "Web Develop" },
    { name: "Data Analysis", img: datapic, path: "Data Analysis" },
    { name: "IoT & Hardware", img: hardwarepic, path: "Hardware" },
    { name: "Network", img: networkpic, path: "Network" },
    { name: "Game Develop", img: gamepic, path: "Game Develop" },
    { name: "AI", img: morepic, path: "AI" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: (
      <div className="flex items-center space-x-2">
        <img
          src={cat?.img}
          alt={cat.name}
          className="w-8 h-8 object-cover rounded-full"
        />
        <span>{cat.name}</span>
      </div>
    ),
  }));

  const filteredCourse =
    queryCourse || selectedCategory
      ? Course.filter((value) => {
          if (selectedCategory === "ALL") {
            return true; // คืนค่าทุกคอร์ส
          }

          // ถ้าไม่มีค่า queryCourse ให้แสดงเฉพาะหมวดหมู่ที่เลือก
          if (!queryCourse) {
            return value.categories.some((cat) => cat.tag === selectedCategory);
          }

          return (
            value.Name.toLowerCase().includes(queryCourse.toLowerCase()) ||
            value.categories.some((cat) => cat.tag === selectedCategory)
          );
        })
      : Course;

  const fetchCourse = async () => {
    try {
      const response = await ax.get("courses?populate=*");
      console.log(response.data.data);
      setCourse(response.data.data);
      console.log(
        "Type of Description:",
        typeof response.data.data[0].Description
      );
      console.log("Description:", response.data.data[0].Description);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  useEffect(() => {
    // Fetch team values from Strapi

    fetchCourse();
  }, []);
  return (
    // <div className="w-[1200px] mx-96 mt-11 p-8 px-4 max-w-screen-2xl lg:px-12">
    <div className="w-full lg:w-[1200px] mt-11 lg:ml-96 max-w-7xl p-4">
      <div className="mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          คอร์สเรียนทั้งหมด
        </h2>
        <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
          คอร์สเรียนทั้งหมดที่มีใน TechSphere ทั้งหมด {Course.length} คอร์ส
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <label htmlFor="search" className="text-gray-700 text-lg font-medium">
            ค้นหา :
          </label>
          <input
            id="search"
            title="ค้นหา"
            type="text"
            placeholder="ค้นหาโดยชื่อคอร์สเรียน"
            className="flex-none lg:w-8/12 w-full bg-gray-100 focus:bg-white h-10  border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={queryCourse}
            onChange={(e) => setQueryCourse(e.target.value)}
          />
          <Select
            options={categoryOptions}
            value={categoryOptions.find(
              (option) => option.value === queryCourse
            )}
            onChange={(selectedOption) => {
              setSelectedCategory(selectedOption.value);
            }}
            placeholder="เลือกประเภท"
            className="text-gray-700 flex-auto lg:w-3/12 z-20 w-full"
            classNamePrefix="custom-select"
          />
        </div>
      </div>
      <div>
        {filteredCourse.length > 0 ? (
          <div className="h-full w-full my-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-stretch scrollbar-hide">
            {filteredCourse.map((items) => (
              <motion.div
                key={items.id}
                initial={{ y: -5, opacity: 0, scale: 1.1 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                exit={{ opacity: 0 }}
              >
                <div key={items.id} className="h-full relative group">
                  <Card className="w-auto max-w-[26rem] h-full shadow-lg flex flex-col">
                    <button
                      className="absolute top-2 right-2 z-10 bg-red-800 hover:bg-red-900 focus:ring-4 focus:ring-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition-all focus:outline-none opacity-0 group-hover:opacity-100"
                      onClick={() => {
                        setOpen(true);
                        setDeleteCourse(items.documentId);
                      }}
                    >
                      <Delete className="w-5 h-5" />
                      <span className="ml-2 text-sm">Delete</span>
                    </button>

                    <CardHeader floated={false} color="blue-gray">
                      {items.image ? (
                        <img
                          className="w-full h-36"
                          src={`${conf.apiUrl}${items.image[0].url}`}
                          alt="ui/ux review check"
                        />
                      ) : (
                        <img
                          className="w-full h-36"
                          src={CourseEx}
                          alt="ui/ux review check"
                        />
                      )}

                      <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
                    </CardHeader>

                    <CardBody>
                      <div className="mb-3 flex items-center justify-between">
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {items.Name}
                        </Typography>
                        <Typography
                          color="blue-gray"
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-2 font-normal"
                        >
                          {/* Rating Section */}
                          <div className="flex items-center gap-2">
                            <Rating
                              value={
                                items.rating.length === 0
                                  ? 0
                                  : items.rating.reduce(
                                      (sum, item) => sum + (item?.star || 0),
                                      0
                                    ) / items.rating.length
                              }
                              readonly
                            />
                            <span className="text-sm mt-2 text-amber-700 whitespace-nowrap">
                              {items.rating && items.rating.length === 0
                                ? "ยังไม่มีรีวิว"
                                : `(${items.rating.length} reviews)`}
                            </span>
                          </div>
                        </Typography>
                      </div>
                      <Typography color="gray">
                        {" "}
                        {items.Description && items.Description.length > 70
                          ? `${items.Description.slice(0, 70)}...`
                          : items.Description}
                      </Typography>
                      <div className="group mt-8 inline-flex flex-wrap items-center gap-3">
                        {items &&
                          items.categories.map((value) => (
                            <div
                              key={value.id}
                              className="inline-flex bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-2 mt-0 items-center"
                            >
                              {value.tag}
                              <Tooltip content={value.tag}>
                                <div key={value.id}>
                                  <img
                                    src={
                                      categories.find(
                                        (cat) => cat.name === value.tag
                                      )?.img
                                    }
                                    alt={value.tag}
                                    className="ml-1 w-[1rem] h-[1rem] object-cover rounded-full"
                                  />
                                </div>
                              </Tooltip>
                            </div>
                          ))}
                      </div>
                    </CardBody>
                    <CardFooter className="flex flex-col justify-between mt-auto pb-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => {
                            Navigate(`/create-summarize/${items.documentId}`);
                          }}
                          size="lg"
                          className="w-full"
                        >
                          ดูข้อมูลคอร์ส
                        </Button>
                        <Button
                          onClick={() => {
                            Navigate("/view-student", {
                              state: { Value: items },
                            });
                          }}
                          size="lg"
                          className="w-full"
                        >
                          ดูข้อมูลนักเรียน
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="my-7 flex items-center justify-center">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl px-6 py-8 text-center">
              <p className="text-gray-700 text-2xl font-semibold">
                ไม่พบข้อมูลคอร์สเรียนที่ค้นหา
              </p>
              <p className="text-gray-500 text-lg mt-2">
                กรุณาตรวจสอบคำค้นหาหรือเพิ่มคอร์สเรียน
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
                      แจ้งเตือนการลบคอร์ส
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจแล้วหรือไม่ ว่าจะลบคอร์สนี้?
                        ข้อมูลที่ลบไปจะไม่สามารถกู้คืนได้อีก
                        กรุณาตรวจสอบให้แน่ใจก่อนลบคอร์สนี้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleRowDeleted(DeleteCourse);
                    setDeleteCourse(null);
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

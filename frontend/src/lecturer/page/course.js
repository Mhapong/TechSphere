import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import React, { useEffect, useState, useContext } from "react";
import ax from "../../conf/ax";
import datapic from "../../client/components/data.png";
import webpic from "../../client/components/web-100.png";
import gamepic from "../../client/components/game.png";
import hardwarepic from "../../client/components/hardware.png";
import networkpic from "../../client/components/network.png";
import morepic from "../../client/components/more.png";
import allpic from "../../admin/components/Image/All.png";
import { useNavigate } from "react-router";
import CourseEx from "../../admin/components/Image/htmlcssJS.webp";
import Select from "react-select";
import { motion } from "framer-motion";
import conf from "../../conf/main";
import { AuthContext } from "../../context/Auth.context";

export function CourseLecturerView() {
  const [Course, setCourse] = useState([]);
  const Navigate = useNavigate();
  const [queryCourse, setQueryCourse] = useState("");
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;

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
            return value.Name.toLowerCase().includes(queryCourse.toLowerCase());
          }
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
      const response = await ax.get(
        `courses?filters[lecturer_owner][id][$eq]=${user.id}&&populate=*`
      );
      setCourse(response.data.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, []);
  return (
    <div className="w-full lg:w-[1200px] mt-12 lg:ml-96 max-w-7xl p-4">
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
                          className="flex items-center gap-1.5 font-normal"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="-mt-0.5 h-5 w-5 text-yellow-700"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                          5.0
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
    </div>
  );
}

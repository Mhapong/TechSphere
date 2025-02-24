import React, { useContext, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { AuthContext } from "../../context/Auth.context";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import datapic from "../components/data.png";
import webpic from "../components/web-100.png";
import gamepic from "../components/game.png";
import hardwarepic from "../components/hardware.png";
import networkpic from "../components/network.png";
import morepic from "../components/more.png";
import homepic from "../components/home-page.png";
import ax from "../../conf/ax";
import no_image from "../components/No_Image_Available.jpeg";
import { Toaster } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const [category, setCategory] = useState([]);
  const baseURL = "http://localhost:1337";

  const categorys = [
    { name: "Web Develop", img: webpic, path: "Web Develop" },
    { name: "Data Anlysis", img: datapic, path: "Data Analysis" },
    { name: "IoT & Hardware", img: hardwarepic, path: "Hardware" },
    { name: "Network", img: networkpic, path: "Network" },
    { name: "Game Develop", img: gamepic, path: "Game Develop" },
    { name: "AI", img: morepic, path: "AI" },
  ];

  const fetchCourse = async () => {
    try {
      const response = await ax.get("courses?populate=*");
      console.log(response.data.data);
      setCourseData(response.data.data);
    } catch {
      console.log(Error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await ax.get("categories?populate=*");
      setCategory(response.data.data);
      console.log(category);
    } catch {
      console.log(Error);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchCategory();
  }, []);

  const sideleft = () => {
    var slider = document.getElementById("slider");
  };

  return (
    <html className="!scorll-smooth max-w-[100%]">
      <div className="grid grid-cols-2 gap-0 max- h-[30rem]">
        <motion.div
          className="place-content-center ml-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src={homepic}></img>
        </motion.div>
        <div className="place-content-center mx-6">
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <p className="text-3xl font-bold">คอร์สเรียนออนไลน์</p>
            <p className="text-3xl font-bold">เพิ่มทักษะยุคดิจิทัล</p>
            <p className="text-xl">
              พร้อมเวิร์กชอปและ Bootcamp ที่จะช่วยอัปสกิล ให้คุณทำงานเก่งขึ้น!
            </p>
          </motion.div>
        </div>
      </div>

      {/* แบ่ง section */}
      <section className="mx-60">
        {/* headerหมวดหมู่คอร์ส*/}
        <div className="mt-5">
          <span className="text-3xl font-bold self-center text-start ">
            เลือกเรียนตามเรื่องที่คุณสนใจ
          </span>
        </div>

        {/*หมวดหมู่คอร์ส*/}
        <div className="relative   items-center">
          <div
            id="slider"
            className=" h-full w-full my-7 grid grid-cols-3 gap-2 items-center place-content-center scrollbar-hide"
          >
            {categorys.map((item) => (
              <motion.div
                initial={{ y: -30, opacity: 0, scale: 1.2 }}
                whileInView={{ y: 0, opacity: 1, scale: 1, duration: 0.7 }}
                whileHover={{ scale: 1.1, duration: 0 }}
                whileTap={{ scale: 0.95 }}
                exit={{ opacity: 0 }}
                className="inline-block mx-2 h-full overflow-visible"
              >
                <Card
                  className="h-fit my-3 cursor-pointer overflow-visible flex flex-col shadow-md shadow-blue-100 ring-2 ring-black ring-"
                  onClick={() => navigate("/explore", { state: item.name })}
                >
                  <CardBody className="flex-none h-24 justify-center self-center place-content-center">
                    <img src={item.img || no_image}></img>
                  </CardBody>
                  <CardBody className="flex-1 object-center place-items-center justify-items-center items-center">
                    <Typography className="text-black text-xl justify-center self-center text-center font-medium">
                      {item.name}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* คอร์สยอดนิยม*/}
        <div>
          <h2 className="text-2xl">คอร์สเรียนยอดนิยม</h2>
        </div>
        <div
          id="slider"
          className="flex h-[32rem] min-w-full overflow-visible scroll-y scroll my-7 scroll-smooth whitespace-nowrap gap-10 items-center place-content-center scrollbar-hide"
        >
          {courseData && courseData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <h1 className="text-3xl font-extrabold text-gray-600">
                ❌ ไม่พบคอร์สที่ต้องการ
              </h1>
              <p className="text-gray-500 mt-2">
                ลองเปลี่ยนหมวดหมู่หรือช่วงราคา แล้วค้นหาอีกครั้ง
              </p>
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {courseData.map((course) => (
                <motion.div
                  key={course.documentId}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="border rounded-lg shadow-lg cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/view-product/${course.Name}/${course.documentId}/`
                      )
                    }
                  >
                    <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center">
                      {course.image ? (
                        <img
                          src={`${baseURL}${course.image[0].url}`}
                          alt={course.Name}
                          className="object-cover w-full h-full rounded-t-lg"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold line-clamp-2">
                        {course.Name}
                      </h3>
                      <p className="text-gray-600 line-clamp-1">
                        {course.Description
                          ? course.Description
                          : "ไม่มีคำอธิบาย"}
                      </p>
                      <p className="text-blue-700 mt-1">
                        ⏳ ระยะเวลาเรียน: {course.Time_Usage} ชั่วโมง
                      </p>
                      <p className="text-green-700">
                        👨‍🏫 ผู้สอน:{" "}
                        {course.lecturer_owner !== null
                          ? `${
                              course.lecturer_owner?.first_name || "ไม่มีชื่อ"
                            } ${
                              course.lecturer_owner?.last_name || "ไม่มีนามสกุล"
                            }`
                          : "ไม่ระบุ"}
                      </p>
                      {/* <p className="text-gray-500">
                                  📅 เวลาหมดอายุ{" "}
                                  {new Date(course.start_date).toLocaleDateString()} ถึง{" "}
                                  {new Date(course.end_date).toLocaleDateString()}
                                </p> */}
                      <span className="text-amber-700 mt-2">
                        ⭐{" "}
                        {course.rating === 0
                          ? "ยังไม่มีรีวิว"
                          : `(${
                              course.rating && course.rating.length
                            } reviews)`}{" "}
                      </span>
                      <span className="text-end ml-2">
                        ขายแล้ว: {course.user_owner.length}
                      </span>
                    </div>
                    <div className="p-4 border-t flex  justify-end">
                      <span className="text-xl font-bold text-primary">
                        {course.Price} ฿
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </html>
  );
}

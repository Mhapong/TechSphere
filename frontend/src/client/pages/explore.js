"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/Cart.context";
import ax from "../../conf/ax";
import { Range, getTrackBackground } from "react-range";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLocation } from "react-router-dom";
import conf from "../../conf/main";
import Select from "react-select";
import datapic from "../components/data.png";
import webpic from "../components/web-100.png";
import gamepic from "../components/game.png";
import hardwarepic from "../components/hardware.png";
import networkpic from "../components/network.png";
import morepic from "../components/more.png";
import homepic from "../components/home-page.png";
import allpic from "../../admin/components/Image/All.png";
const Explore = () => {
  const [courseData, setCourseData] = useState([]);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || conf.apiUrl;
  const [queryCourse, setQueryCourse] = useState("");
  const category_from_home = location.state || "";
  const allcategories = [
    { name: "ALL", img: allpic, path: "ALL" },
    { name: "Web Develop", img: webpic, path: "Web Develop" },
    { name: "Data Analysis", img: datapic, path: "Data Analysis" },
    { name: "IoT & Hardware", img: hardwarepic, path: "Hardware" },
    { name: "Network", img: networkpic, path: "Network" },
    { name: "Game Develop", img: gamepic, path: "Game Develop" },
    { name: "AI", img: morepic, path: "AI" },
  ];

  useEffect(() => {
    // fetchCategories();
    fetchCourses();
    console.log(category_from_home);
    if (category_from_home) {
      setSelectedCategory(category_from_home);
    }
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await ax.get(`courses?populate=*`);
      setCourseData(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categoryOptions = allcategories.map((cat) => ({
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

  // const fetchCategories = async () => {
  //   try {
  //     const response = await ax.get(`categories`);
  //     setCategories(response.data.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const filteredCourses = courseData.filter((course) => {
    const matchesSearch = course.Name.toLowerCase().includes(
      query.toLowerCase()
    );
    const matchesCategory = selectedCategory
      ? selectedCategory === "ALL"
        ? true
        : course.categories.some((cat) => cat.tag === selectedCategory)
      : true;

    const matchesPrice =
      course.Price >= priceRange[0] && course.Price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        className="mb-8"
      >
        <div className="h-64 bg-blue-500 flex items-center justify-center">
          <h2 className="text-4xl text-white font-bold">Featured Courses</h2>
        </div>
        <div className="h-64 bg-green-500 flex items-center justify-center">
          <h2 className="text-4xl text-white font-bold">New Arrivals</h2>
        </div>
        <div className="h-64 bg-purple-500 flex items-center justify-center">
          <h2 className="text-4xl text-white font-bold">Special Offers</h2>
        </div>
      </Carousel>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Categories</h2>
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={(selectedOption) => {
                  setSelectedCategory(selectedOption.value);
                }}
                placeholder="เลือกประเภท"
                className="text-gray-700 flex-auto w-full z-20"
                classNamePrefix="custom-select"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Price Range</h2>
              <Range
                step={100}
                min={0}
                max={5000}
                values={priceRange}
                onChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-3 bg-gray-200 rounded-md"
                    style={{
                      background: getTrackBackground({
                        values: priceRange,
                        colors: ["#ccc", "#3b82f6", "#ccc"],
                        min: 0,
                        max: 5000,
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-5 h-5 bg-blue-500 rounded-full shadow focus:outline-none"
                  />
                )}
              />
              <div className="flex justify-between text-sm mt-2">
                <span>{priceRange[0]} THB</span>
                <span>{priceRange[1]} THB</span>
              </div>
            </div>
          </aside>

          <main className="w-full lg:w-3/4">
            <input
              type="text"
              placeholder="ค้นหาโดยใช้ชื่อวิชา..."
              className="w-full p-2 border mb-6 rounded-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <h1 className="text-3xl font-bold mb-6 ">
              ค้นหารายการ <span className="text-primary ">{query}</span>
            </h1>
            {filteredCourses.length === 0 ? (
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
                {filteredCourses.map((course) => (
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
                                course.lecturer_owner?.last_name ||
                                "ไม่มีนามสกุล"
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
                          {course.rating && course.rating === 0
                            ? "ยังไม่มีรีวิว"
                            : `(${course.rating?.length} reviews)`}{" "}
                        </span>
                        <span className="text-end ml-2">
                          ขายแล้ว: {course.user_owner?.length}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Explore;

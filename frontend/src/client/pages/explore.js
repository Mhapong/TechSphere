import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../context/Cart.context";
import ax from "../../conf/ax";
import { Range, getTrackBackground } from "react-range";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import conf from "../../conf/main";
import { Option, Select } from "@material-tailwind/react";

// Import images
import webpic from "../components/static/web-100.png";
import datapic from "../components/static/data.png";
import hardwarepic from "../components/static/hardware.png";
import networkpic from "../components/static/network.png";
import gamepic from "../components/static/game.png";
import morepic from "../components/static/more.png";
import allpic from "../../admin/components/Image/All.png";
import { Rating } from "@mui/material";
import header1 from "../components/static/header1.png";
import header2 from "../components/static/header2.png";

const Explore = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const baseURL = conf.apiUrl;
  const [loading, setLoading] = useState(true);
  const category_from_home = location.state || "";
  const [promotion, setPromotions] = useState([]);

  const categories = [
    { name: "ALL", img: allpic, path: "ALL" },
    { name: "Web Develop", img: webpic, path: "Web Develop" },
    { name: "Data Analysis", img: datapic, path: "Data Analysis" },
    { name: "IoT & Hardware", img: hardwarepic, path: "Hardware" },
    { name: "Network", img: networkpic, path: "Network" },
    { name: "Game Develop", img: gamepic, path: "Game Develop" },
    { name: "AI", img: morepic, path: "AI" },
  ];

  const fetchCourses = async () => {
    try {
      const response = await ax.get(`courses`, {
        params: {
          populate: {
            rating: true,
            user_owner: true,
            categories: true,
            lecturer_owner: true,
            image: {
              fields: ["formats"],
            },
          },
        },
      });

      setCourseData(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await ax.get("promotions?populate=*");
      console.log(response.data.data);
      setPromotions(response.data.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const header = [
    { img: header1 },
    { img: header2 },
    // { title: "Special Offers", bg: "bg-purple-600" },
  ];

  const headerData = [
    ...header,
    ...promotion.map((promo) => ({
      title: `โปรโมชั่น: ${promo.Code}`,
      detail: promo.detail,
      discount: promo.discount,
      img: `${conf.apiUrl}${promo?.picture_promotion?.url}`,
      bg: "bg-white",
    })),
  ];

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setPriceRange([0, 5000]);
    setSelectedRating(0);
  };

  const filteredCourses = useMemo(() => {
    try {
      return courseData.filter((course) => {
        return (
          course.Name.toLowerCase().includes(query.toLowerCase()) &&
          (selectedCategory === "ALL" ||
            selectedCategory === "" ||
            course.categories?.some((cat) => cat.tag === selectedCategory)) &&
          course.Price >= priceRange[0] &&
          course.Price <= priceRange[1] &&
          (selectedRating === 0 ||
            course.rating.reduce((sum, item) => sum + (item?.star || 0), 0) /
              course.rating.length >=
              selectedRating)
        );
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [courseData, query, selectedCategory, priceRange, selectedRating]);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchCourses();
    if (category_from_home) {
      setSelectedCategory(category_from_home);
    }
  }, [category_from_home]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        className="mb-2"
      >
        {headerData &&
          headerData.map((slide, index) => (
            <div
              key={index}
              className={`h-full lg:h-64 ${slide.bg} flex items-center justify-center relative`}
            >
              <img
                src={`${slide?.img}`}
                alt={slide?.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />{" "}
              {slide?.title && (
                <h2 className="text-4xl font-bold absolute top-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg">
                  {slide?.title}
                </h2>
              )}
              {slide?.discount && (
                <div className="text-5xl font-bold absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-lg">
                  ลดราคา:{" "}
                  <span className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-t from-teal-600 to-blue-800 ">
                    {slide?.discount}%
                  </span>
                </div>
              )}
            </div>
          ))}
      </Carousel>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      ) : (
        <div className=" container mx-auto py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside
              initial={{
                opacity: 0,
                y: -20,
              }}
              exit={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="lg:sticky md:static sm:static p-5 bg-white rounded-lg shadow-lg h-fit lg:w-1/4 top-20 overflow-visible"
            >
              <h2 className="text-2xl font-bold mb-4">ค้นหาแบบละเอียด</h2>
              <div>
                <h3 className="text-lg font-semibold mb-2">หมวดหมู่คอร์ส</h3>
                <Select
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  label="เลือกประเภท"
                  className="text-gray-700 flex-auto mb-2 w-full z-20"
                >
                  {categories.map((category) => (
                    <Option key={category.name} value={category.name}>
                      <div className="flex items-center space-x-2">
                        <img
                          src={category.img}
                          alt={category.name}
                          className="size-7 object-cover rounded-full"
                          loading="lazy"
                        />
                        <span className="text-md text-black">
                          {category.name}
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-semibold pb-2">ช่วงราคา</h3>
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
                    >
                      <div
                        className="h-3  rounded-md"
                        style={{
                          background: getTrackBackground({
                            values: priceRange,
                            colors: ["#ccc", "#3b82f6", "#ccc"],
                            min: 0,
                            max: 5000,
                          }),
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => (
                    <div
                      {...props}
                      className="-top-0 w-5 h-5 bg-black rounded-full shadow focus:outline-none"
                    />
                  )}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>{priceRange[0]} THB</span>
                  <span>{priceRange[1]} THB</span>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-semibold mb-2">คะแนน</h3>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`rating-${rating}`}
                      name="rating"
                      value={rating}
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="flex items-center"
                    >
                      <Rating
                        value={rating}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                      <span className="ml-1 text-sm text-gray-600">
                        {rating === 1 ? "ขึ้นไป" : "ขึ้นไป"}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={resetFilters}
                className="w-full p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-300"
              >
                รีเซ็ตค่าที่ใช้
              </button>
            </motion.aside>

            <main className="w-full lg:w-3/4">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <h1 className="text-3xl font-bold mb-6">
                คอร์สที่ค้นหา:{" "}
                {query && <span className="text-blue-600">"{query}"</span>}
              </h1>

              {filteredCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-600">
                    ❌ ไม่พบคอร์สที่ต้องการ
                  </h3>
                  <p className="text-gray-500 mt-2">
                    ลองเปลี่ยนหมวดหมู่หรือช่วงราคา แล้วค้นหาอีกครั้ง
                  </p>
                </div>
              ) : (
                <motion.div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.documentId}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
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
                              src={`${baseURL}${course.image[0].formats.small.url}`}
                              alt={course.Name}
                              className="object-cover w-full h-full rounded-t-lg"
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold line-clamp-1">
                            {course.Name}
                          </h3>
                          <p className="text-gray-600 line-clamp-1">
                            {course.Description
                              ? course.Description
                              : "ไม่มีคำอธิบาย"}
                          </p>
                          <p className="text-blue-700 mt-1">
                            ⏳ เวลาเรียน: {course.Time_Usage} ชั่วโมง
                          </p>
                          <p className="text-green-700">
                            👨‍🏫 ผู้สอน:{" "}
                            {course.lecturer_owner !== null
                              ? `${
                                  course.lecturer_owner?.first_name ||
                                  "ไม่มีชื่อ"
                                } ${
                                  course.lecturer_owner?.last_name ||
                                  "ไม่มีนามสกุล"
                                }`
                              : "ไม่ระบุ"}
                          </p>
                          <div className=" flex justify-between ">
                            <span className="text-amber-600 flex items-center gap-0.5">
                              {course?.rating.length === 0
                                ? 0
                                : (
                                    course.rating.reduce(
                                      (sum, item) => sum + (item?.star || 0),
                                      0
                                    ) / course.rating.length
                                  ).toFixed(1)}
                              <Rating
                                value={
                                  course.rating.length === 0
                                    ? 0
                                    : course.rating.reduce(
                                        (sum, item) => sum + (item?.star || 0),
                                        0
                                      ) / course.rating.length
                                }
                                size="small"
                                precision={0.5}
                                readOnly
                              />
                              ({course.rating.length})
                            </span>

                            <span>ขายแล้ว: {course.user_owner?.length}</span>
                          </div>
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
      )}
    </div>
  );
};

export default Explore;

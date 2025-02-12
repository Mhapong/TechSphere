import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import no_image from "../components/No_Image_Available.jpeg";
import axios from "axios";
import ax from "../../conf/ax";
import { Image } from "@mui/icons-material";
import { useCart } from "../../context/Cart.context";
import Footer from "../components/footer";
import { Option, Select } from "@material-tailwind/react";

// const categories = [
//   "AI",
//   "Web Develop",
//   "Hardware",
//   "Network",
//   "Data Analysis",
//   "Game Developer",
// ];

export default function Explore() {
  const [courseData, setCourseData] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const baseURL = "http://localhost:1337";

  const fetchCourses = async () => {
    try {
      const response = await ax.get(`courses?populate=*`);
      console.log(response.data.data);
      setCourseData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ax.get(`categories`);
      console.log(response.data.data);
      setCategories(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const filteredCourses = courseData.filter((course) => {
    const matchesSearch = course.Name.toLowerCase().includes(
      query.toLowerCase()
    );
    // const matchesCategory = course.categories.includes(query.toLowerCase());
    return matchesSearch;
    // && matchesCategory;
  });

  return (
    <html>
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-1/4 p-4 bg-gray-100 min-h-screen"
        >
          <h2 className="text-xl font-bold my-2 ml-4">หมวดหมู่สินค้า</h2>
          <Select
            className="bg-white text-black rounded-lg"
            label="เลือกหมวดหมู่"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e)}
          >
            {categories.map((category) => (
              <Option key={category} value={category.tag}>
                {category.tag}
              </Option>
            ))}
          </Select>
          <ul className="mx-8">
            {categories &&
              categories.map((category) => (
                <li
                  key={category.tag}
                  className={`p-2 cursor-pointer rounded-lg hover:bg-blue-200 ${
                    selectedCategory === category.tag
                      ? "bg-blue-400 text-white"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category.tag === selectedCategory ? null : category.tag
                    )
                  }
                >
                  {category.tag}
                </li>
              ))}
          </ul>
        </motion.aside>

        {/* Main Content */}
        <div className="w-3/4 p-4">
          {/* Search Bar */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="ค้นหาชื่อวิชา..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="p-2 bg-blue-500 text-white rounded-lg">
              ค้นหา
            </button>
          </div>

          <h1 className="text-4xl font-extrabold my-3">
            ค้นหารายการ <span className="text-teal-600">{query}</span>
          </h1>

          {/* Course List */}
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredCourses.map((items) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300"
                onClick={() =>
                  navigate(`/view-product/${items.Name}/${items.documentId}/`)
                }
              >
                {/* Course Image */}
                <div className="relative">
                  {items.image !== null ? (
                    <img
                      src={`${baseURL}${items.image[0].url}`}
                      alt="Product Image"
                      class="w-full h-56 object-cover"
                    />
                  ) : (
                    <Image
                      alt="Product Image"
                      class="w-full h-56 object-cover"
                    />
                  )}
                </div>

                {/* Course Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-auto">
                    {items.Name}
                  </h3>
                  {items.category}

                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-yellow-500 mt-2">
                    {"⭐".repeat(items.rating)}{" "}
                    <span className="text-gray-500 text-sm">
                      ({items.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500 mt-2">
                    <span className="text-lg font-bold">⭐ 4.9</span>
                    <span className="text-gray-900 text-sm ml-2">
                      {items.Time_Usage} ชั่วโมง
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-xl font-bold text-blue-600">
                        {items.Price} THB
                      </span>
                      {items.discount && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {items.originalPrice} THB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              // <motion.div
              //   key={items.id}
              //   className="p-4 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer"
              //   whileHover={{ scale: 1.05 }}
              //   onClick={() =>
              //     navigate(`/view-product/${items.Name}/${items.documentId}/`)
              //   }
              // >
              //   {items.image !== null ? (
              //     <img
              //       src={`${baseURL}${items.image[0].url}`}
              //       alt="Product Image"
              //       class="object-contain w-full h-[270px] fill"
              //     />
              //   ) : (
              //     <Image
              //       alt="Product Image"
              //       class="object-contain w-full h-[270px] fill"
              //     />
              //   )}
              //   <h3 className="text-lg font-semibold">{items.Name}</h3>
              //   <p className="text-gray-600">{items.Price} THB</p>
              // </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </html>
  );
}

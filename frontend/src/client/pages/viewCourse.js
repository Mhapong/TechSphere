import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import ax from "../../conf/ax";
import { useCart } from "../../context/Cart.context";
import { AuthContext } from "../../context/Auth.context";
import { Image } from "@mui/icons-material";
import { FaStar, FaClock, FaShoppingCart } from "react-icons/fa";

export default function ViewCourse(props) {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { addToCart, cartItems } = useCart();
  const { name, documenId } = useParams();
  const [course, setCourse] = useState([]);
  const [showLoginModal, setshowLoginModal] = useState(false);
  const baseURL = "http://localhost:1337";

  const fetchCourse = async () => {
    try {
      const response = await ax.get(
        `courses?filters[documentId][$eq]=${documenId}&populate=*`
      );
      const now_course = response.data.data;
      setCourse(now_course[0]);
      console.log(now_course[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = (course) => {
    addToCart({ ...course, course_id: course.documentId });
    console.log(cartItems);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <html class="">
      <div class="bg-white pb-8">
        <div class="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* <!-- Product Images --> */}
            <div className="relative">
              {course.image &&
                (course.image[0] !== null ? (
                  <img
                    src={`${baseURL}${course.image[0].url}`}
                    alt="Product Image"
                    class="size-96 mx-auto rounded-lg shadow-md mb-4"
                  />
                ) : (
                  <Image
                    alt="Product Image"
                    class="object-contain w-full h-[270px] fill"
                  />
                ))}
              {/* class="w-full h-auto rounded-lg shadow-md mb-4"
              id="mainImage" */}
            </div>

            {/* <div>
              <img
                src="https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxMnx8aGVhZHBob25lfGVufDB8MHx8fDE3MjEzMDM2OTB8MA&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Thumbnail 1"
                class="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                onclick="changeImage(this.src)"
              />
              <img
                src="https://images.unsplash.com/photo-1484704849700-f032a568e944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw0fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Thumbnail 2"
                class="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                onclick="changeImage(this.src)"
              />
              <img
                src="https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Thumbnail 3"
                class="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                onclick="changeImage(this.src)"
              />
              <img
                src="https://images.unsplash.com/photo-1528148343865-51218c4a13e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwzfHxoZWFkcGhvbmV8ZW58MHwwfHx8MTcyMTMwMzY5MHww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Thumbnail 4"
                class="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                onclick="changeImage(this.src)"
              />
            </div>
          </div> */}

            {/* <!-- Product Details --> */}
            <div>
              <h2 class="text-3xl font-bold mb-2">{course.Name}</h2>
              <p class="text-gray-600">SKU: {course.documentId}</p>
              <div class="flex items-center mb-4">
                <div className="flex items-center mt-3 text-yellow-400">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar />
                  <FaStar className="text-gray-300" />
                  <span className="ml-2 text-gray-700">4.8 (320 รีวิว)</span>
                </div>
              </div>
              <div className="flex items-center text-blue-500 mt-3">
                <FaClock className="mr-2" /> ระยะเวลาเรียน 3 ชั่วโมง
              </div>
              {course.lecturer_owner !== null ? (
                <div className="flex items-center text-green-900 mt-3">
                  <FaChalkboardTeacher className="mr-2" /> ครูผู้สอน :{" "}
                  {course.lecturer_owner}
                </div>
              ) : (
                <div className="flex items-center text-red-900 mt-3">
                  <FaChalkboardTeacher className="mr-2" /> ครูผู้สอน :
                  ไม่มีครูผู้สอนระบุ
                </div>
              )}

              <div className="mt-6">
                {/* <span className="text-xl font-semibold text-green-500">
                  {course.Price}฿
                </span> */}
                <span class="text-2xl font-bold mr-2">{course.Price}฿</span>
                {/* <span className="text-gray-400 line-through ml-2">฿ 990</span> */}
              </div>

              <div class="flex space-x-4 mb-6">
                {/* <button
                  class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700 cursor-pointer"
                  onClick={() =>
                    !state.isLoggedIn
                      ? navigate("/login")
                      : handleAddToCart(course)
                  }
                >
                  <FaShoppingCart className="mr-2" /> */}
                {cartItems.some((item) => item.id === course.id) ? (
                  <button
                    class="mt-6 w-full text-center items-center justify-center bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex cursor-not-allowed"
                    onClick={() =>
                      !state.isLoggedIn
                        ? navigate("/login")
                        : handleAddToCart(course)
                    }
                  >
                    Already in cart
                  </button>
                ) : (
                  <button
                    class="mt-6 w-full text-center items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg flex hover:bg-blue-700 cursor-pointer"
                    onClick={() =>
                      !state.isLoggedIn
                        ? navigate("/login")
                        : handleAddToCart(course)
                    }
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                )}
                {/* </button> */}
                {/* <button class="bg-gray-200 flex gap-2 items-center  text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  Wishlist
                </button> */}
              </div>

              {/* <div>
              <h3 class="text-lg font-semibold mb-2">Key Features:</h3>
              <ul class="list-disc list-inside text-gray-700">
                <li>Industry-leading noise cancellation</li>
                <li>30-hour battery life</li>
                <li>Touch sensor controls</li>
                <li>Speak-to-chat technology</li>
              </ul>
            </div> */}
            </div>
          </div>
        </div>
        {function changeImage(src) {
          document.getElementById("mainImage").src = src;
        }}
        {/* Course Description */}
        <div className="max-w-5xl mx-auto mt-2">
          <h2 className="text-3xl font-bold text-gray-900">เกี่ยวกับคอร์ส</h2>
          <p className="mt-4 text-gray-700">{course.Description}</p>
        </div>

        {/* Reviews Section */}
        <div className="max-w-5xl mx-auto mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            รีวิวจากผู้เรียน
          </h2>

          <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-800">
              ⭐⭐⭐⭐⭐ <br />
              "คอร์สนี้อธิบายได้ดีมาก เหมาะกับมือใหม่!"
            </p>
            <p className="text-sm text-gray-500 mt-2">- คุณสมชาย</p>
          </div>

          <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-800">
              ⭐⭐⭐⭐ <br />
              "มีตัวอย่างให้ทำตาม เข้าใจง่ายครับ"
            </p>
            <p className="text-sm text-gray-500 mt-2">- คุณมานะ</p>
          </div>
        </div>
      </div>
    </html>
  );
}

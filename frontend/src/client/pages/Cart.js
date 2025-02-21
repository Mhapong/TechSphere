"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../context/Cart.context";
import { Image } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ax from "../../conf/ax";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:1337";
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [suggestedCourses, setSuggestedCourses] = useState([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.Price, 0);
  const total = subtotal - discount;

  useEffect(() => {
    fetchSuggestedCourses();
  }, []);

  const fetchSuggestedCourses = async () => {
    try {
      const response = await ax.get("courses?limit=6&populate=*");
      console.log(response.data.data);
      setSuggestedCourses(response.data.data);
    } catch (err) {
      console.error("Error fetching suggested courses:", err);
    }
  };

  const applyPromoCode = () => {
    // This is a mock function. In a real application, you would validate the promo code with your backend.
    if (promoCode === "DISCOUNT10") {
      setDiscount(subtotal * 0.1);
    } else {
      alert("Invalid promo code");
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-4 bg-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center bg-white p-4 rounded-lg shadow-sm"
              >
                {item.image ? (
                  <img
                    src={`${baseURL}${item.image}`}
                    alt={item.name}
                    className="size-28 object-cover rounded"
                  />
                ) : (
                  <div className="size-28 bg-gray-200 rounded flex items-center justify-center">
                    <Image />
                  </div>
                )}
                <div className="ml-4 flex-grow relative -top-5">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.Time_Usage} hours
                  </p>
                  <p className="text-gray-600 mt-1 text-sm">
                    ระยะเวลาเรียน: {item.Time_Usage} ชั่วโมง
                  </p>
                </div>
                <div className="relative -top-5">
                  <h1 className=" font-bold mt-1 text-primary text-xl">
                    ฿{item.Price}
                  </h1>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-6 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>฿{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-฿{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>฿{total}</span>
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-grow p-2 border rounded"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                onClick={applyPromoCode}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Apply
              </button>
            </div>
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              onClick={() =>
                navigate("/purchase", { state: { total, cartItems } })
              }
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>

          {/* You might be interested in */}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg my-16 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          You might be interested in
        </h2>
        <div className="space-y-4">
          {!suggestedCourses ? (
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
              className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {suggestedCourses.map((course) => (
                <motion.div
                  key={course.documentId}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="border rounded-lg shadow-lg cursor-pointer w-full"
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
                        {!course.rating
                          ? "ยังไม่มีรีวิว"
                          : `(${course.rating.length} reviews)`}{" "}
                      </span>
                      <span className="text-end ml-2">
                        ขายแล้ว:{" "}
                        {!course.user_owner ? "0" : course.user_owner.length}
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
      </div>
    </div>
  );
};

export default Cart;

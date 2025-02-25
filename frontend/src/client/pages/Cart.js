"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/Cart.context";
import ax from "../../conf/ax";
import { Toaster, toast } from "sonner";
import { ShoppingCart, Tag, X, Clock, User, Star, Image } from "lucide-react";
import { color } from "@mui/system";
import { Rating } from "@mui/material";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || "http://localhost:1337";
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [allPromo, setAllPromo] = useState([]);
  const [promoId, setPromoId] = useState(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.Price, 0);
  const total = subtotal - discount;

  useEffect(() => {
    fetchSuggestedCourses();
    fetchAllPromoCode();
  }, []);

  const fetchSuggestedCourses = async () => {
    try {
      const response = await ax.get("courses?limit=4&populate=*");
      setSuggestedCourses(response.data.data);
    } catch (err) {
      console.error("Error fetching suggested courses:", err);
    }
  };

  const fetchAllPromoCode = async () => {
    try {
      const response = await ax.get("promotions");
      setAllPromo(response.data.data);
    } catch (err) {
      console.error("Error fetching promo codes:", err);
    }
  };

  const handleRemoveFromCart = (courseId) => {
    removeFromCart(courseId);
    setDiscount(0);
    setPromoCode("");
    toast.warning("Item removed. Promo code has been reset.", {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const applyPromoCode = () => {
    const matchedPromo = allPromo.find(
      (promo) =>
        promo.Code === promoCode && promo.status_promotion === "Activate"
    );

    if (matchedPromo) {
      const discountAmount = total * (matchedPromo.discount / 100);
      setPromoId(matchedPromo.id);
      setDiscount(discountAmount);
      toast.success(`Promo applied! You got ${matchedPromo.discount}% off.`, {
        position: "bottom-right",
        duration: 3000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
          color: "green",
        },
      });
    } else {
      toast.error("Invalid or inactive promo code", {
        position: "bottom-right",
        duration: 3000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
          color: "red",
        },
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
          รถเข็นของคุณ
        </h1>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-4">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-8 rounded-lg shadow-sm text-center"
                >
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-600 mb-4">รถเข็นว่างอยู่</p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    สำรวจคอร์ส
                  </button>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col sm:flex-row items-center bg-white p-3 sm:p-6 rounded-lg shadow-sm"
                  >
                    {item.image ? (
                      <img
                        src={`${baseURL}${item.image}`}
                        alt={item.name}
                        className="size-24 sm:size-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="size-24 sm:size-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="sm:ml-4 top flex-grow mt-2 sm:mt-0">
                      <h3 className="font-semibold text-base sm:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {item.Time_Usage} hours
                      </p>
                      <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                        เวลาเรียน: {item.Time_Usage} ชั่วโมง
                      </p>
                    </div>
                    <div className="sm:self-start mt-2 sm:mt-0">
                      <h1 className="font-bold text-primary text-lg sm:text-xl">
                        ฿{item.Price}
                      </h1>
                      <button
                        onClick={() => handleRemoveFromCart(item.course_id)}
                        className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                สรุปยอดรวม
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>ราคาก่อนลด</span>
                  <span>฿{subtotal.toFixed(2)}</span>
                </div>
                {discount === 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>ลดราคา</span>
                    <span>ไม่มีส่วนลดถูกใช้งาน</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ลดราคา</span>
                    <span>-฿{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-800">
                  <span>จำนวนที่ต้องชำระ</span>
                  <span>฿{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-grow p-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={applyPromoCode}
                  className={`flex items-center justify-center px-3 py-2 rounded-md transition ${
                    !discount
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  disabled={discount > 0}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Apply
                </button>
              </div>
              <button
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={() =>
                  navigate("/purchase", {
                    state: { total, cartItems, promoId },
                  })
                }
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Courses */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            You might be interested in
          </h2>
          <motion.div
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
                            course.lecturer_owner?.first_name || "ไม่มีชื่อ"
                          } ${
                            course.lecturer_owner?.last_name || "ไม่มีนามสกุล"
                          }`
                        : "ไม่ระบุ"}
                    </p>
                    <div className=" flex justify-between ">
                      <span className="text-amber-900 flex items-center gap-0.5">
                        {course.rating.length === 0
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
        </div>
      </div>
    </div>
  );
};

export default Cart;

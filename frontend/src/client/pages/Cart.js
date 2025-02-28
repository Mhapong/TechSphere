import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/Cart.context";
import ax from "../../conf/ax";
import { toast } from "sonner";
import { ShoppingCart, TrashIcon } from "lucide-react";
import { Rating } from "@mui/material";
import { PhotoIcon } from "@heroicons/react/24/outline";
import conf from "../../conf/main";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const baseURL = conf.apiUrl;
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

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3 space-y-4">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center"
                >
                  <ShoppingCart className="w-20 h-20 text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    ตะกร้าว่างอยู่
                  </h3>
                  <p className="text-gray-500 mb-6">
                    กรุณาเพิ่มคอร์สเรียนเพื่อเริ่มต้น
                  </p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    ค้นหาคอร์สเรียน
                  </button>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-5 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 gap-4"
                  >
                    {/* Product Image */}
                    <div className="md:col-span-1 aspect-square">
                      {item.image ? (
                        <img
                          src={`${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="md:col-span-3 flex flex-col place-self-start">
                      <h3 className="text-lg font-semibold mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        โดย {item.lecturer_owner || "ไม่ระบุผู้สอน"}
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-teal-600 font-bold">ขายดี</span>
                        <Rating
                          value={item?.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <span className="text-gray-500 text-sm">
                          ({item.rating?.toLocaleString() || "ยังไม่มีรีวิว"}{" "}
                          คะแนน)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>⏳ {item.Time_Usage} ชั่วโมง</span>
                        {/* <span>● {item.difficulty || "ทุกระดับ"}</span> */}
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="md:col-span-1 flex flex-col gap-4 justify-between">
                      <button
                        onClick={() => handleRemoveFromCart(item.course_id)}
                        className="text-red-500 hover:text-red-700 flex items-center justify-center gap-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="text-sm">ลบออก</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                สรุปคำสั่งซื้อ
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>จำนวนคอร์ส</span>
                  <span>{cartItems.length} คอร์ส</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ราคารวม</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด</span>
                    <span>-฿{discount.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด</span>
                    <span>-฿0</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>ยอดรวมสุทธิ</span>
                  <span className="text-primary">
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  โปรโมชั่น
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ใส่โค้ดส่วนลด"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={discount > 0}
                  />
                  <button
                    onClick={applyPromoCode}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      discount > 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={discount > 0}
                  >
                    ใช้โค้ด
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                onClick={() =>
                  navigate("/purchase", {
                    state: { total, cartItems, promoId },
                  })
                }
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                ดำเนินการชำระเงิน
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
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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

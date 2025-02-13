import React, { useContext, useEffect, useState } from "react";
import { useCart } from "../../context/Cart.context";
import { Image } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ax from "../../conf/ax";

const Cart = () => {
  const location = useLocation();
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const baseURL = "http://localhost:1337";
  const totalPrice = cartItems.reduce((sum, item) => sum + item.Price, 0);
  console.log(cartItems);
  const [course, setCourse] = useState([]);

  const fetchCourse = async () => {
    try {
      const response = await ax.get(
        "courses?filters[documentId][$eq]=course_id"
      );
      console.log(response.data);
    } catch (err) {}
  };

  return (
    <div className="container mx-auto min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        <div className="md:w-2/3 space-y-4">
          <h2 className="text-2xl font-bold">ตะกร้าสินค้า</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="flex items-center bg-white p-4 rounded-xl shadow"
              >
                {item.image !== null ? (
                  <img
                    src={item.image}
                    alt="Product Image"
                    class="size-32  object-cover rounded-lg"
                  />
                ) : (
                  <Image alt="Product Image" class="size-32 object-cover" />
                )}
                <div className="flex-auto ml-6 min-w-72 self-start justify-self-center">
                  <span className="text-lg font-semibold">{item.name}</span>
                  <p className="text-black text-xl self-end justify-end font-extrabold ">
                    ราคา: {item.Price} ฿
                  </p>
                  <p className="text-gray-600">
                    เวลาที่ใช้: {item.Time_Usage} ชั่วโมง
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex-none bg-red-500 mr-3 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  ลบ
                </button>
              </motion.div>
            ))
          )}
        </div>
        {/* Sidebar - Total Price & Checkout Button */}
        <div className="md:w-1/3 p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
          <p className="text-lg font-medium">
            ราคารวม:{" "}
            <span className="text-green-600 font-extrabold">฿{totalPrice}</span>
          </p>
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() =>
              navigate(`/purchease`, {
                state: {
                  total: totalPrice,
                  course_id: cartItems.map((course) => course.id),
                  course_name: cartItems
                    .map((course) => course.name)
                    .join(", "),
                },
              })
            }
          >
            ดำเนินการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

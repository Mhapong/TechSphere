import React, { useContext, useEffect } from "react";
import { useCart } from "../../context/Cart.context";
import { Image } from "@mui/icons-material";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const baseURL = "http://localhost:1337";
  const totalPrice = cartItems.reduce((sum, item) => sum + item.Price, 0);
  console.log(cartItems);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        <div className="md:w-2/3 space-y-4">
          <h2 className="text-2xl font-bold">ตะกร้าสินค้า</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
              >
                {item.image &&
                  (item.image[0] !== null ? (
                    <img
                      src={item.image}
                      alt="Product Image"
                      class="w-32 h-32"
                    />
                  ) : (
                    <Image
                      alt="Product Image"
                      class="object-contain w-fit h-fit"
                    />
                  ))}
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">ราคา: ฿{item.Price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  ลบ
                </button>
              </div>
            ))
          )}
        </div>
        {/* Sidebar - Total Price & Checkout Button */}
        <div className="md:w-1/3 bg-gray-100 p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
          <p className="text-lg font-medium">
            ราคารวม: <span className="text-green-600">฿{totalPrice}</span>
          </p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            ดำเนินการชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

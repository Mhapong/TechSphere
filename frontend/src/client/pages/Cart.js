// import React from "react";
// import { useState, useEffect } from "react";

// export default function Cart() {
//   return (
//     <div class="bg-gray-100 h-screen py-8">
//       <div class="container mx-auto px-4">
//         <h1 class="text-2xl font-semibold mb-4">Shopping Cart</h1>
//         <div class="flex flex-col md:flex-row gap-4">
//           <div class="md:w-3/4">
//             <div class="bg-white rounded-lg h-2/3 shadow-md p-6 mb-4">
//               <table class="w-full">
//                 <thead>
//                   <tr>
//                     <th class="text-left font-semibold">Product</th>
//                     <th class="text-left font-semibold">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td class="py-4">
//                       <div class="flex items-center">
//                         {/* <img class="h-16 w-16 mr-4" src="https://via.placeholder.com/150" alt="Product image"> */}
//                         <span class="font-semibold">Product name</span>
//                       </div>
//                     </td>
//                     <td class="py-4">$19.99</td>
//                     <td class="py-4"></td>
//                     <td class="py-4">$19.99</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div class="md:w-1/4">
//             <div class="bg-white rounded-lg shadow-md p-6">
//               <h2 class="text-lg font-semibold mb-4">Summary</h2>
//               <div class="flex justify-between mb-2">
//                 <span>Subtotal</span>
//                 <span>$19.99</span>
//               </div>
//               <div class="flex justify-between mb-2">
//                 <span>Taxes</span>
//                 <span>$1.99</span>
//               </div>
//               <div class="flex justify-between mb-2">
//                 <span>Shipping</span>
//                 <span>$0.00</span>
//               </div>
//               <hr class="my-2" />
//               <div class="flex justify-between mb-2">
//                 <span class="font-semibold">Total</span>
//                 <span class="font-semibold">$21.98</span>
//               </div>
//               <button class="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full">
//                 Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useContext, useEffect } from "react";
import cartContext from "../context/cartContext";

const Cart = () => {
  const {
    isCartOpen,
    cartItems,
    toggleCart,
    removeItem,
    incrementItem,
    decrementItem,
  } = useContext(cartContext);

  // disable the body-scroll when the Cart is open
  useEffect(() => {
    const docBody = document.body;

    isCartOpen
      ? docBody.classList.add("overflow_hide")
      : docBody.classList.remove("overflow_hide");
  }, [isCartOpen]);

  // closing the Cart on clicking outside of it
  useEffect(() => {
    const outsideClose = (e) => {
      if (e.target.id === "cart") {
        toggleCart(false);
      }
    };

    window.addEventListener("click", outsideClose);

    return () => {
      window.removeEventListener("click", outsideClose);
    };
  }, [toggleCart]);

  const cartQuantity = cartItems.length;

  const cartTotal = cartItems
    .map((item) => item.price * item.quantity)
    .reduce((prevValue, currValue) => prevValue + currValue, 0);

  return (
    <>
      {isCartOpen && (
        <div id="cart">
          <div className="cart_content">
            <div className="cart_head">
              <h2>
                Cart <small>({cartQuantity})</small>
              </h2>
              <div
                title="Close"
                className="close_btn"
                onClick={() => toggleCart(false)}
              >
                <span>&times;</span>
              </div>
            </div>

            <div className="cart_body">
              {cartQuantity === 0 ? (
                <h2>Cart is empty</h2>
              ) : (
                cartItems.map((item) => {
                  const { id, img, title, price, quantity } = item;
                  const itemTotal = price * quantity;

                  return (
                    <div className="cart_items" key={id}>
                      <figure className="cart_items_img">
                        <img src={img} alt="product-img" />
                      </figure>

                      <div className="cart_items_info">
                        <h4>{title}</h4>
                        <h3 className="price">
                          ₹ {itemTotal.toLocaleString()}
                        </h3>
                      </div>

                      <div className="cart_items_quantity">
                        <span onClick={() => decrementItem(id)}>&#8722;</span>
                        <b>{quantity}</b>
                        <span onClick={() => incrementItem(id)}>&#43;</span>
                      </div>

                      <div
                        title="Remove Item"
                        className="cart_items_delete"
                        onClick={() => removeItem(id)}
                      >
                        <span>&times;</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="cart_foot">
              <h3>
                <small>Total:</small>
                <b>₹ {cartTotal.toLocaleString()}</b>
              </h3>

              <button
                type="button"
                className="checkout_btn"
                disabled={cartQuantity === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;

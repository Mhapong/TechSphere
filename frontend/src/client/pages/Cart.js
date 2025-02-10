import React, { useContext, useEffect } from "react";
import cartContext from "../../context/Cart.context";

const Cart = () => {
  const { cartItems } = useContext(cartContext);
  console.log(cartItems);

  return (
    <div className="flex flex-col justify-center bg-gray-100">
      <div className="flex justify-between items-center px-20 py-5">
        <h1 className="text-2xl uppercase font-bold mt-10 text-center mb-10">
          Shop
        </h1>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-10">
        {cartItems.map((cartItem) => (
          <div
            key={cartItem.id}
            className="bg-white shadow-md rounded-lg px-10 py-10"
          >
            <img
              src={cartItem.thumbnail}
              alt={cartItem.title}
              className="rounded-md h-48"
            />
            <div className="mt-4">
              <h1 className="text-lg uppercase font-bold">{cartItem.title}</h1>
              <p className="mt-2 text-gray-600 text-sm">
                {cartItem.description.slice(0, 40)}...
              </p>
              <p className="mt-2 text-gray-600">${cartItem.price}</p>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;

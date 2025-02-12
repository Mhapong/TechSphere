import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      if (state.some((item) => item.id === action.payload.id)) return state;
      return [...state, action.payload];
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);
    default:
      return state;
  }
};
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem("cartItems");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course) => {
    setCartItems({
      type: "ADD_TO_CART",
      payload: {
        id: course.id,
        name: course.Name,
        Price: course.Price,
        image:
          course.image?.length > 0
            ? `http://localhost:1337${course.image[0].url}`
            : null,
      },
    });
  };

  const removeFromCart = (courseId) => {
    setCartItems({ type: "REMOVE_FROM_CART", payload: { id: courseId } });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ ใช้ export default สำหรับ CartProvider
export default CartProvider;
export const useCart = () => useContext(CartContext);

// import { useCart } from "../../context/Cart.context";

// const CartIcon = () => {
//   const { cartItems } = useCart();
//   const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <div className="relative">
//       <svg
//         className="w-8 h-8"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//         />
//       </svg>
//       {itemCount > 0 && (
//         <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
//           {itemCount}
//         </span>
//       )}
//     </div>
//   );
// };

// export default CartIcon;

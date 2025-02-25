import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaCartShopping } from "react-icons/fa6";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/Auth.context";
import { useCart } from "../../context/Cart.context";
import conf from "../../conf/main";

import usericon from "../../admin/components/Image/user-icon.webp";
import logopic from "./TechSphere_logopic.png";
import textpic from "./logo.png";
import ax from "../../conf/ax";

const navigation = [
  { name: "หน้าแรก", href: "/", current: true },
  { name: "สำรวจ", href: "/explore", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const { cartItems } = useCart();
  const { state, logout } = useContext(AuthContext);
  const { user } = state;
  const isAuthenticated = !!user;
  const [notifications, setNotifications] = useState([]);

  const fetchPromotion = async () => {
    const promotion = await ax.get("/promotions");
    setNotifications(promotion.data.data);
    console.log(notifications);
  };

  useEffect(() => {
    fetchPromotion();
  }, []);

  const NavMenu = [
    { name: "หน้าแรก", href: "/", current: true },
    { name: "สำรวจ", href: "/explore", current: true },
    { name: "เกี่ยวกับเรา", href: "/about", current: true },
    ...(isAuthenticated
      ? [{ name: "คอร์สของคุณ", href: "/my-course", current: false }]
      : []),
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-sm sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-12 w-auto"
                    src={logopic || "/placeholder.svg"}
                    alt="TechSphere"
                  />
                  <img
                    className="h-14 w-auto ml-2 hidden sm:block"
                    src={textpic || "/placeholder.svg"}
                    alt="TechSphere"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block place-content-center">
                  <div className="flex space-x-4 py-auto">
                    {NavMenu.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-black"
                            : "text-gray-700 hover:bg-gray-50 hover:text-black",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isAuthenticated && (
                  <Link to="/cart" className="">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <FaCartShopping className="h-6 w-6 text-gray-700 hover:text-gray-900" />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                          {cartItems.length}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                )}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="rounded-full bg-white p-1 text-gray-700 hover:text-gray-900 relative">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="size-6" aria-hidden="true" />
                      {/* แสดงจุดแดงถ้ามีการแจ้งเตือนที่ยังไม่อ่าน */}
                      {notifications.some((n) => !n.read) && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600" />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md mr-3 bg-white shadow-lg  max-h-96 overflow-y-auto">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                          การแจ้งเตือน
                        </div>
                        {notifications.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            ไม่มีการแจ้งเตือน
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <Menu.Item key={notification.id}>
                              {({ active }) => (
                                <div
                                  className={`px-4 py-2 text-sm ${
                                    !notification.read
                                      ? "bg-blue-50 font-medium text-blue-800"
                                      : "text-gray-700"
                                  } ${active ? "bg-gray-100" : ""}`}
                                >
                                  {notification.Code} สำหรับส่วนลด{" "}
                                  {notification.discount}%
                                </div>
                              )}
                            </Menu.Item>
                          ))
                        )}
                        <div className="border-t">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={`block w-full px-4 py-2 text-sm text-left ${
                                  active ? "bg-gray-100" : ""
                                } text-blue-600`}
                              >
                                ดูการแจ้งเตือนทั้งหมด
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {isAuthenticated ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            user.userProfile
                              ? `${conf.apiUrl}${user.userProfile.url}`
                              : usericon
                          }
                          alt={`${user.username} Avatar`}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/explore"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              View
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/checkstatus"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Check Status
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/User"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="hidden sm:flex sm:items-center sm:ml-6">
                    <Link
                      to="/login"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      to="/sign-up"
                      className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      สมัครสมาชิก
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {NavMenu.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

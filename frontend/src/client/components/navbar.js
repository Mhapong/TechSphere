import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaCartShopping } from "react-icons/fa6";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/Auth.context";
import { useCart } from "../../context/Cart.context";
import conf from "../../conf/main";

import usericon from "../../admin/components/Image/user-icon.webp";
import logopic from "./static/TechSphere_logopic.png";
import textpic from "./static/logo.png";
import ax from "../../conf/ax";
import { Calendar, Tag, TicketPercent } from "lucide-react";
import { toast } from "sonner";

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
  };

  useEffect(() => {
    fetchPromotion();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const NavMenu = [
    { name: "หน้าแรก", href: "/", current: true },
    { name: "สำรวจคอร์ส", href: "/explore", current: true },
    { name: "เกี่ยวกับเรา", href: "/about", current: true },
    ...(isAuthenticated
      ? [{ name: "คอร์สของคุณ", href: "/my-course", current: false }]
      : []),
  ];

  const markAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    try {
      await ax.put(`/promotions/${notificationId}`, { read: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));

    try {
      await ax.put("/promotions/mark-all-read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      toast.success("อ่านทั้งหมดแล้ว!", {
        position: "bottom-center",
        duration: 1000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
        },
      });
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("คัดลอกคูปองสำเร็จ!", {
      position: "bottom-left",
      duration: 2000,
      style: {
        fontSize: "1.5rem",
        padding: "20px",
        fontWeight: "bold",
        textAlign: "center",
        borderRadius: "10px",
        color: "green",
      },
    });
  };

  const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      locale: "th-TH",
    };
    return date
      .toLocaleDateString("th-TH", options)
      .replace("พ.ค.", "พฤษภาคม")
      .replace("ม.ค.", "มกราคม");
    // เพิ่มรูปแบบเดือนอื่นๆ ตามต้องการ
  };

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
                            ? " text-black hover:bg-gray-100 transition-all delay-[50]"
                            : "text-black hover:bg-gray-50 hover:text-black",
                          "rounded-md px-3 py-2 text-md font-medium"
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
                      <TicketPercent
                        className="size-7 mx-2"
                        aria-hidden="true"
                      />
                      {notifications.some((n) => !n.read) && (
                        <span className="absolute top-0 right-1 block h-2.5 w-2.5 rounded-full bg-red-600" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <div className="px-4 py-2 flex items-center justify-between border-b">
                          <h3 className="text-sm font-semibold text-gray-900">
                            โปรโมชั่น
                          </h3>
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            ทำทั้งหมดเป็นอ่านแล้ว
                          </button>
                        </div>

                        {notifications.length === 0 ? (
                          <div className="p-4 text-center">
                            <TicketPercent className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              ไม่มีโปรโมชั่น
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <Menu.Item key={notification.id}>
                              {({ active }) => (
                                <div
                                  className={`flex items-start px-4 py-3 border-b last:border-0 ${
                                    !notification.read
                                      ? "bg-blue-50 border-l-4 border-blue-500"
                                      : "bg-white"
                                  } ${active ? "bg-gray-50" : ""}`}
                                >
                                  <div className="flex-shrink-0 pt-1">
                                    <Tag className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-900">
                                        ส่วนลด {notification.discount}%
                                      </p>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notification.id);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <XMarkIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                      <div>
                                        <p className="text-sm text-gray-600">
                                          ใช้รหัส:
                                          <span className="font-mono ml-2 bg-gray-100 px-2 py-1 rounded">
                                            {notification.Code}
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          <Calendar className="inline h-3 w-3 mr-1" />{" "}
                                          หมดอายุ{" "}
                                          {formatThaiDate(
                                            notification.end_date
                                          )}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() =>
                                          copyToClipboard(notification.Code)
                                        }
                                        className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                      >
                                        คัดลอก
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Menu.Item>
                          ))
                        )}

                        <div className="border-t">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/notifications"
                                className={`block px-4 py-3 text-sm ${
                                  active ? "bg-gray-50" : ""
                                } text-center text-blue-600 hover:text-blue-800`}
                              >
                                ดูโปรโมชั่นทั้งหมด →
                              </Link>
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
                              to="/checkstatus"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              สถานะการซื้อ
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/suggest-course"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              สำรวจตัวเอง
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
                              โปรไฟล์
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block w-full text-left px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              ลงชื่อออก
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
                      ? "bg-white text-black"
                      : "text-black hover:bg-gray-50 hover:text-gray-900",
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
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-900 hover:bg-gray-50 hover:text-gray-900"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium  border-double text-blue-700 hover:bg-blue-700 hover:text-gray-200"
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

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logopic from "./TechSphere_logopic.png";
import textpic from "./logo.png";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/Auth.context";
import { motion } from "framer-motion";
import { useCart } from "../../context/Cart.context";
import { FaCartShopping } from "react-icons/fa6";

const navigation = [
  { name: "Sign in", href: "/login", current: true },
  { name: "Sign up", href: "/sign-up", current: true },
  { name: "View", href: "/view", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const NavMenu = [
    { name: "หน้าแรก", href: "/", current: true },
    { name: "สำรวจ", href: "/explore", current: true },
    { name: "คอร์สของคุณ", href: "/my-course", current: true },
  ];
  const { state, logout } = useContext(AuthContext);

  return (
    <header className="bg-white drop-shadow-sm w-full h-1/6 sticky z-50 top-0 md:w-auto">
      <Disclosure as="nav" className="flex">
        <div className="max-w-8xl px-2 sm:px-6 lg:px-8 w-screen">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="sm:items-stretch sm:justify-start"
            >
              <div className="flex items-center space-x-4">
                <img
                  alt="TectSphere.logopic"
                  src={logopic}
                  className="h-12 w-auto top-8 mt-2"
                />
                <img
                  alt="TectSphere.textpic"
                  src={textpic}
                  className="h-24 w-auto -left-6 top-8"
                />
                {NavMenu.map((menu) => (
                  <button
                    className="hover:ease-out px-5 mt-2 hover:animate-pulse text-black"
                    key={menu.name}
                  >
                    <a href={menu.href}>
                      <span className="text-lg font-medium">{menu.name}</span>
                    </a>
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {state.isLoggedIn ? (
                <a href="/cart">
                  <motion.div
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.1 }}
                    className="mr-3 cursor-pointer"
                  >
                    <button
                      type="button"
                      className="relative rounded-full transition-all p-1 text-black hover:text-black/10"
                    >
                      <FaCartShopping className="size-5" />
                    </button>
                    {cartItems.length > 0 ? (
                      <span className="absolute top-3 right-20 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                        {cartItems.length}
                      </span>
                    ) : (
                      ""
                    )}
                  </motion.div>
                </a>
              ) : (
                ""
              )}
              <button
                type="button"
                className="relative rounded-full transition-all p-1 text-black hover:text-black/10"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              {state.isLoggedIn ? (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <a
                        href="/view"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        href="/"
                      >
                        Logout
                      </a>
                    </MenuItem>
                  </MenuItems>

                  <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                      {navigation.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          aria-current={item.current ? "page" : undefined}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-black"
                              : "text-gray-300 hover:bg-gray-700 hover:text-black",
                            "block rounded-md px-3 py-2 text-base font-medium"
                          )}
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Menu>
              ) : (
                <div className="flex space-x-4">
                  <a
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    เข้าสู่ระบบ
                  </a>
                  <a
                    href="/sign-up"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    สมัครสมาชิก
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Disclosure>
    </header>
  );
}

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


const navigation = [
  { name: "Sign in", href: "/login", current: true },
  { name: "Sign up", href: "/sign-up", current: true },
  { name: "View", href: "/view", current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const NavMenu = [
    { name: "หน้าแรก", href: "/", current: true },
    { name: "ค้นหา", href: "/explore", current: true },
    { name: "คอร์สของคุณ", href: "/my-course", current: true },
  ];
  const [searchBar, setSearchBar] = useState(false);
  const { state, logout } = useContext(AuthContext);
  function openSearchbar() {
    setSearchBar(true);
  }


  return (
    < header className="bg-white drop-shadow-sm  w-full h-1/6 sticky z-20 top-0 md:w-auto">

      <Disclosure as="nav" className="flex ">

        <div className=" max-w-8xl px-2 sm:px-6 lg:px-8 w-screen">
          <div className="relative flex h-16 items-center justify-between">

            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>

            <div className=" sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 right-3 place-items-center">
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
                    className="hover:ease-out mx-7 mt-4 hover:animate-pulse"
                    key={menu.name}
                  ><a href={menu.href}>
                      <span
                        className="text-lg font-medium"
                      >
                        {menu.name}
                      </span>
                    </a>
                  </button>
                ))}
              </div>



            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

              <button className="mr-2  transition-colors">
                <a href="/cart">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </a>
              </button>

              <button
                type="button"
                className="relative rounded-full transition-all p-1 text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}{state.isLoggedIn ?
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
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        view
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
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
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "block rounded-md px-3 py-2 text-base font-medium"
                          )}
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Menu>
                :
                <div className="">
                  <button className="mx-5">
                    <a href="/login">
                      <span>
                        เข้าสู่ระบบ
                      </span>
                    </a>
                  </button>
                  <button>
                    <a href="/sign-up">
                      <span>
                        สมัครสมาชิก
                      </span>
                    </a>
                  </button>
                </div>
              }
            </div>
          </div>
        </div>

      </Disclosure>
      {/* {
        searchBar ? (
          <div className="w-screen h-16 bg-amber-100 animate-appear items-center">
            <div className=" self-center justify-center justify-self-center ">
              <form class="flex flex-row rounded-md max-w-screen-lg md:max-w-screen-md min-w ms-2 lg:ms-9 me-2 sm:items-stretch sm:justify-center ">
                <div class="relative mx-auto my-2.5 items-center  justify-items-center flex-row lg:w-screen max-w-full md:w-fit">
                  <input
                    type="search"
                    id="search-dropdown"
                    class="flex-1 p-2.5 w-full min-w-20 z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg"
                    placeholder="Find your interest..."
                    required
                  />
                  <button
                    type="submit"
                    class="absolute -right-0.5 p-2.5 text-sm font-medium h-full text-white bg-red-200 rounded-e-lg "
                  >
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                    <span class="sr-only">Search</span>
                  </button>
                </div>
              </form>

            </div>
            <button onClick={() => setSearchBar(false)} type="submit" className="justify-end right-0 self-center text-sm font-medium h-full ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

          </div>
        ) : console.log("no search bar showing")
      } */}
    </header>
  );
}

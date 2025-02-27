import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth.context";
import logo from "./Image/TECHSPHERE.png";
import usericon from "./Image/user-icon.webp";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StorageIcon from "@mui/icons-material/Storage";
import PaymentIcon from "@mui/icons-material/Payment";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Groups3Icon from "@mui/icons-material/Groups3";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DiscountIcon from "@mui/icons-material/Discount";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ax from "../../conf/ax";
import conf from "../../conf/main";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AutoGraphIcon from "@mui/icons-material/AutoGraph";

export default function NavAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { state: ContextState, logout } = useContext(AuthContext);
  // console.log(ContextState);
  const { user } = ContextState;
  const [Count, setCount] = useState(null);
  const [NavMenu, setNavMenu] = useState([]);
  const [rotated, setRotated] = useState(false);
  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (user.userRole === "Admin") {
          const response = await ax.get(`counts`);
          setCount(response.data.counts);
        } else if (user.userRole === "Lecturer") {
          const response = await ax.get(`count-lecturer/${user.id}`);
          setCount(response.data.counts);
        }
      } catch (e) {
        console.log("Error", e);
      }
    };
    fetchCount();
    if (user.userRole === "Admin") {
      setNavMenu(NavAdminMenu);
    } else if (user.userRole === "Lecturer") {
      setNavMenu(NavLecturerMenu);
    }
  }, []);

  const NavAdminMenu = [
    {
      name: "หน้าแรก",
      href: "/",
      current: true,
      key: "",
      icon: <HomeIcon />,
    },
    {
      name: "สร้างคอร์สใหม่",
      href: "/create-course",
      current: true,
      key: "",
      icon: <AddCircleOutlineIcon />,
    },
    // {
    //   name: "กราฟแสดงสถานะ",
    //   href: "/graph",
    //   current: true,
    //   icon: <AutoGraphIcon />,
    // },
    {
      name: "โปรโมชั่น",
      href: "/promotion",
      current: true,
      key: `${Count ? `${Count["promotion"]}` : "0"}`,
      icon: <DiscountIcon />,
    },
    {
      name: "คอร์สทั้งหมด",
      href: "/view",
      current: true,
      key: `${Count ? `${Count?.course}` : "0"}`,
      icon: <StorageIcon />,
    },
    {
      name: "สร้างอาจารย์",
      href: "/create-lecturer",
      current: true,
      icon: <GroupAddIcon />,
    },
    {
      name: "อาจารย์ทั้งหมด",
      href: "/lecturer",
      current: true,
      key: `${Count ? `${Count?.users?.Lecturer}` : "0"}`,
      icon: <Groups3Icon />,
    },
    {
      name: "นักเรียนทั้งหมด",
      href: "/student",
      current: true,
      key: `${Count ? `${Count?.users?.User}` : "0"}`,
      icon: <PeopleAltIcon />,
    },
    {
      name: "รีวิวทั้งหมด",
      href: "/review",
      current: true,
      // key: `${Count ? `${Count.users.User}` : "0"}`,
      icon: <ReviewsIcon />,
    },
    {
      name: "การเงิน",
      href: "/finance",
      current: true,
      key: `${Count ? `${Count["confirm-purchase"]}` : ""}`,
      icon: <PaymentIcon />,
    },
    {
      name: "บัญชีผู้ใช้งาน",
      href: "/user",
      current: true,
      key: "",
      icon: <AccountCircleIcon />,
    },
    {
      name: "ลงชื่อออก",
      href: "/",
      current: true,
      key: "",
      icon: <LogoutIcon />,
      action: () => {
        logout();
        window.location.href = "/";
      },
    },
  ];

  const NavLecturerMenu = [
    {
      name: "หน้าแรก",
      href: "/",
      current: true,
      key: "",
      icon: <HomeIcon />,
    },
    {
      name: "สร้างคอร์สใหม่",
      href: "/create-course",
      current: true,
      key: "",
      icon: <AddCircleOutlineIcon />,
    },
    {
      name: "คอร์สทั้งหมดของคุณ",
      href: "/course",
      current: true,
      key: `${Count ? `${Count.course}` : "0"}`,
      icon: <StorageIcon />,
    },
    {
      name: "รีวิวของคุณ",
      href: "/review",
      current: true,
      key: `${Count ? `${Count["lecturer-review"] + Count["review"]}` : "0"}`,
      icon: <ReviewsIcon />,
    },
    {
      name: "บัญชีผู้ใช้งาน",
      href: "/user",
      current: true,
      key: "",
      icon: <AccountCircleIcon />,
    },
    {
      name: "ลงชื่อออก",
      href: "/",
      current: true,
      key: "",
      icon: <LogoutIcon />,
      action: () => {
        logout();
        window.location.href = "/";
      },
    },
  ];

  const toggleSidebar = () => {
    setRotated(!rotated);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="/" className="flex ms-2 md:me-24">
                <img src={logo} className="h-8 me-3" alt="Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  TechSphere {user.userRole} Panel
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    onClick={toggleDropdown}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.userProfile ? (
                      <img
                        className="w-8 h-8 rounded-full"
                        src={
                          `${conf.apiUrl}${user.userProfile.url}` ||
                          "/placeholder.svg"
                        }
                        alt={`${user.username} Avatar`}
                      />
                    ) : (
                      <img
                        className="w-8 h-8 rounded-full"
                        src="/usericon.png"
                        alt={`${user.username} Avatar`}
                      />
                    )}
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="z-50 absolute right-3 mt-28 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm text-gray-900 dark:text-white"
                        role="none"
                      >
                        {user.username}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {NavMenu.map((menu, index) => (
              <li key={index}>
                <a
                  href={menu.href}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={(e) => {
                    if (menu.action) {
                      e.preventDefault();
                      menu.action();
                    }
                  }}
                >
                  <span className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white flex items-center justify-center">
                    {menu.icon}
                  </span>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {menu.name}
                  </span>
                  {menu.key && (
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                      {menu.key}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
import usericon from "../components/Image/usertest.png";
import background from "../components/Image/background.png";
import {
  Facebook,
  Twitter,
  GitHub,
  Instagram,
  YouTube,
  Edit,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useLocation } from "react-router";
import conf from "../../conf/main";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [UserData, setUserData] = useState(null);
  const [Role, setRole] = useState(null);
  const [Image, setImage] = useState(null);
  const location = useLocation();
  const { Value } = location.state || {};
  console.log(Value);
  console.log(user);
  useEffect(() => {
    if (Value) {
      console.log(1);
      setUserData(Value);
      setRole(Value.role.name);
      setImage(user.userProfile);
    } else {
      console.log(2);
      setUserData(user);
      setRole(user.userRole);
      setImage(user.userProfile);
    }
  }, []);

  return (
    <div
      className={`font-sans antialiased leading-normal tracking-wider bg-cover min-h-screen flex items-center justify-center ${
        darkMode ? "text-gray-100" : "text-gray-900"
      }`}
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="max-w-4xl flex flex-wrap items-center mx-auto my-32 lg:my-0">
          {/* Profile Card */}

          <div
            id="profile"
            className={`w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl p-4 md:p-12 text-center lg:text-left opacity-75 ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div
              className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  UserData?.userProfile?.url
                    ? `${conf.apiUrl}${UserData?.userProfile.url}`
                    : usericon
                })`,
              }}
            ></div>
            <h1 className="text-6xl font-bold pt-8 lg:pt-0">
              {`${UserData?.username} : `}
              <a href={`/edit-profile/${UserData?.id}`}>
                <BorderColorIcon className="h-6 w-6 text-blue-500" />
              </a>
            </h1>
            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
            <p className="text-3xl pt-4 font-bold flex items-center justify-center lg:justify-start">
              {" "}
              Name : {UserData?.first_name} {UserData?.last_name}
            </p>
            <p className="pt-4 text-2xl font-bold flex items-center justify-center lg:justify-start">
              Role : {Role}
            </p>
            <p className="pt-2 lg:text-1xl flex items-center justify-center lg:justify-start">
              Email : {UserData?.email}
            </p>
            <p className="pt-2 text-2xl lg:text-sm flex items-center justify-center lg:justify-start">
              <span
                className={`inline-block pt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  UserData?.confirmed
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                สถานะ :{" "}
                {UserData?.confirmed
                  ? "ยืนยันตัวตนแล้ว"
                  : "ยังไม่ได้ยืนยันตัวตน"}
              </span>
            </p>
            {UserData?.userRole === "Admin" && (
              <div className="pt-12 pb-8">
                <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full">
                  ประวัติเพิ่มเติม
                </button>
              </div>
            )}
            <div className="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
              {[
                { platform: "facebook", Icon: Facebook },
                { platform: "twitter", Icon: Twitter },
                { platform: "github", Icon: GitHub },
                { platform: "instagram", Icon: Instagram },
                { platform: "youtube", Icon: YouTube },
              ].map(({ platform, Icon }) => (
                <a key={platform} className="link" href="#">
                  <Icon className="h-6 fill-current text-gray-600 hover:text-green-700" />
                  <title>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </title>
                </a>
              ))}
            </div>
          </div>

          {/* Profile Image */}
          <div className="w-full lg:w-2/5">
            <img
              src={Image?.url ? `${conf.apiUrl}${Image.url}` : usericon}
              className="hidden sm:block aspect-[9/16] object-cover rounded-lg shadow-2xl"
              alt="Profile"
              style={{ width: "550px" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

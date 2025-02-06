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
import BorderColorIcon from "@mui/icons-material/BorderColor";
export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  useEffect(() => {}, []);

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
              backgroundImage: `url(${usericon})`,
            }}
          ></div>
          <h1 className="text-6xl font-bold pt-8 lg:pt-0">
            {`${user.username} : `}
            <a href={`/edit-profile/${user.id}`}>
              <BorderColorIcon className="h-6 w-6 text-blue-500" />
            </a>
          </h1>
          <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
          <p className="text-3xl pt-4 font-bold flex items-center justify-center lg:justify-start">
            {" "}
            Name : {user.first_name} {user.last_name}
          </p>
          <p className="pt-4 text-2xl font-bold flex items-center justify-center lg:justify-start">
            Role : {user.userRole}
          </p>
          <p className="pt-2 lg:text-1xl flex items-center justify-center lg:justify-start">
            Email : {user.email}
          </p>
          <p className="pt-2 text-2xl lg:text-sm flex items-center justify-center lg:justify-start">
            <span
              className={`inline-block pt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                user.confirmed
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              สถานะ :{" "}
              {user.confirmed ? "ยืนยันตัวตนแล้ว" : "ยังไม่ได้ยืนยันตัวตน"}
            </span>
          </p>
          {user.userRole === "Admin" && (
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
            src={
              user.userProfile?.url
                ? `http://localhost:1337${user.userProfile.url}`
                : usericon
            }
            className="aspect-[9/16] object-cover rounded-lg shadow-2xl"
            alt="Profile"
            style={{ width: "550px" }}
          />
        </div>
      </div>
    </div>
  );
}

import React from "react";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetState } from "react-use";
import conf from "../../conf/main";
import background from "../../admin/components/Image/background.png";
import people from "../components/people-icon.webp";

export default function SignUp(props) {
  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  };
  const [state, setState] = useSetState(initialState);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${conf.apiUrl}/api/auth/local/register`;

      await axios.post(url, state);
      navigate("/login");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
      <div class="h-screen flex">
        <div
          class="hidden lg:flex bg-black w-full lg:w-1/2 login_img_section
          justify-around items-center"
          style={{
            backgroundImage: `url(${background})`,
          }}
        >
          <div class="w-full mx-auto  px-20 flex-col items-center space-y-6">
            <h1 class="text-white font-bold text-4xl font-sans">TechSphere</h1>
            <p class="text-white mt-1">
              ศูนย์กลางด้านเทคโนโลยี และความรู้ที่ทันสมัย
              เพื่อปรับตัวเข้ากับปัจจุบัน
            </p>
            <div class="flex justify-center lg:justify-start mt-6">
              <a
                href="/"
                class="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-indigo-800 mt-4 px-4 py-2 rounded-2xl font-bold mb-2"
              >
                เริ่มต้นเรียน
              </a>
            </div>
          </div>
        </div>
        <div class="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
          <div class="w-full px-8 md:px-32 lg:px-24">
            <div
              className="block lg:hidden rounded-full shadow-xl mx-auto mb-3 -mt-16 h-48 w-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(${people})`,
              }}
            ></div>
            <form
              class="bg-white rounded-md shadow-2xl p-5 "
              onSubmit={onSubmit}
            >
              <h1 class="text-gray-800 font-bold text-2xl mb-1">
                สร้างบัญชีผู้ใช้งานใหม่
              </h1>
              <p class="text-sm font-normal text-gray-600 mb-8">
                ยินดีต้อนรับสู่ TechSphere
              </p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-5">
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl w-full md:w-1/2 min-h-[48px]">
                  <input
                    id="first_name"
                    onChange={(e) => setState({ first_name: e.target.value })}
                    value={state.first_name}
                    className="flex-1 pl-2 outline-none border-none bg-transparent"
                    type="text"
                    name="first_name"
                    placeholder="ชื่อจริง"
                    required
                  />
                </div>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl w-full md:w-1/2 min-h-[48px]">
                  <input
                    id="last_name"
                    onChange={(e) => setState({ last_name: e.target.value })}
                    value={state.last_name}
                    className="flex-1 pl-2 outline-none border-none bg-transparent"
                    type="text"
                    name="last_name"
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>

              <div class="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="email"
                  onChange={(e) => setState({ email: e.target.value })}
                  value={state.email}
                  class="  pl-2 w-[98%] outline-none border-none"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div class="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  ></path>
                  <circle cx="12" cy="7" r="4" strokeWidth="2"></circle>
                </svg>

                <input
                  id="username"
                  onChange={(e) => setState({ username: e.target.value })}
                  value={state.username}
                  class="w-[98%] pl-2 w-f outline-none border-none"
                  type="username"
                  name="username"
                  placeholder="ชื่อผู้ใช้งาน"
                  required
                />
              </div>
              <div class="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  class="w-[98%] pl-2 w-f outline-none border-none"
                  onChange={(e) => setState({ password: e.target.value })}
                  value={state.password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="รหัสผ่าน"
                  required
                />
              </div>
              <button
                type="submit"
                class="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                value="Sign-up"
              >
                ลงทะเบียน
              </button>
              <div class="flex justify-between mt-4">
                <span class="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">
                  {" "}
                </span>

                <a
                  href="/login"
                  class="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all"
                >
                  มีบัญชีอยู่แล้ว?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useContext, useEffect } from "react";
import { useSetState } from "react-use";
import { AuthContext } from "../../context/Auth.context.js";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import background from "../../admin/components/Image/background.png";
import WebDev_Logo from "../../admin/components/Image/WebDev_Logo.png";

const initialState = {
  username: "",
  password: "",
};

export default function Login() {
  const { state: ContextState, login } = useContext(AuthContext);
  const { isLoginPending, isLoggedIn, loginError } = ContextState;
  const [state, setState] = useSetState(initialState);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginError) {
      toast.error(`${loginError}`, {
        position: "bottom-left",
        duration: 5000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
          color: "red",
        },
      });
    }
    if (isLoggedIn) {
      toast.success(`Welcome. Login Successfully`, {
        position: "bottom-left",
        duration: 5000,
        style: {
          fontSize: "1.1rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
          color: "green",
        },
      });
      setHasLoggedIn(true);
    }
  }, [loginError, isLoggedIn, hasLoggedIn]);

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = state;
    if (!username || !password) {
      toast.error("Please enter both username and password.", {
        position: "bottom-left",
        duration: 4000,
      });
      return;
    }
    login(username, password, navigate);
    setState({ username: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="absolute inset-0 z-0">
        <img
          src={background}
          alt=""
          class="w-full h-full object-cover filter blur-sm brightness-10"
        />
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full z-10 max-w-md md:max-w-2xl lg:max-w-4xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 lg:w-3/5 mb-6 md:mb-0 md:mr-8">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
              ยินดีต้อนรับสู่ TECHSPHERE
            </h1>
            <p className="text-gray-500 text-center mb-8">ล็อคอินเข้าสู่ระบบ</p>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  ชื่อของผู้ใช้งาน
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรุณาใส่ชื่อผู้ใช้งาน"
                  value={state.username}
                  onChange={(e) => setState({ username: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรุณาใส่รหัสผ่าน"
                  value={state.password}
                  onChange={(e) => setState({ password: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
              >
                เข้าสู่ระบบ
              </button>
            </form>
            {isLoginPending && (
              <p className="text-blue-500 mt-4 text-center">
                กำลังรอการล็อกอิน...
              </p>
            )}
            {isLoggedIn && (
              <p className="text-green-500 mt-4 text-center">ล็อกอินสำเร็จ!</p>
            )}
            {loginError && (
              <p className="text-red-500 mt-4 text-center">
                {loginError.message}
              </p>
            )}
            <div className="text-center mt-5">
              <a
                href="/sign-up"
                className="text-base text-blue-500 hover:underline"
              >
                ไม่มีบัญชีผู้ใช้? สมัครสมาชิก
              </a>
            </div>
          </div>
          <div className="w-full lg:w-2/5 flex justify-center">
            <img
              src={WebDev_Logo}
              className="hidden sm:block aspect-[3/4] object-cover rounded-2xl shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)]"
              alt="WebDev Logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

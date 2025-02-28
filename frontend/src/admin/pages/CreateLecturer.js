import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetState } from "react-use";
import conf from "../../conf/main";
import PreUser from "../components/Image/usertest.png";
import ax from "../../conf/ax";

export default function CreateLecturer() {
  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  };
  const [state, setState] = useSetState(initialState);
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${conf.apiUrl}/api/auth/local/register`;

      const response = await axios.post(url, state);
      const userId = response.data.user.id;

      let imageData = null;

      // ถ้ามีรูปภาพใหม่ที่อัปโหลด
      if (image) {
        const formData = new FormData();
        formData.append("files", image);

        const imageUploadResponse = await ax.post(`upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const {
          data: [{ id, url }],
        } = imageUploadResponse;

        imageData = { id, url };
      }

      const updateData = {
        background: description,
        role: 4,
        profile_picture: imageData ? [imageData.id] : null,
      };
      await ax.put(`users/${userId}`, updateData);
      navigate("/lecturer");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
      <div className="h-screen flex flex-col lg:flex-row pt-11 lg:ml-40">
        {/* Left Section (Image and Welcome Message) */}
        <div
          className="hidden lg:flex bg-black w-full lg:w-1/2 login_img_section justify-around items-center"
          style={{
            backgroundImage: `url(${PreUser})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full mx-auto px-8 lg:px-20 flex flex-col items-center space-y-6">
            <h1 className="text-white font-bold text-3xl lg:text-4xl font-sans">
              TechSphere
            </h1>
            <p className="text-white text-center lg:text-left mt-1">
              สร้างอาจารย์ผู้สอนใหม่ เพื่อยกระดับคุณภาพ
            </p>
            <div className="flex justify-center lg:justify-start mt-6">
              <a
                href="/lecturer"
                className="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-indigo-800 mt-4 px-4 py-2 rounded-2xl font-bold mb-2"
              >
                ดูอาจารย์ผู้สอนทั้งหมด
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8 py-8 lg:py-0">
          <div className="w-full px-4 md:px-8 lg:px-24">
            <form
              className="bg-white rounded-md shadow-2xl p-5"
              onSubmit={onSubmit}
            >
              <h1 className="text-gray-800 font-bold text-xl lg:text-2xl mb-1">
                สร้างอาจารย์ผู้สอนใหม่สำหรับ TECHSPHERE
              </h1>
              <p className="text-sm font-normal text-red-600">
                กรุณากรอกข้อมูลให้ครบถ้วน
              </p>

              <div className="p-2 h-auto">
                <div>
                  <div>
                    <label
                      htmlFor="image-upload"
                      className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50 overflow-hidden"
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          {" "}
                          <div className="mb-2">
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("image-upload").click()
                              }
                              className="bg-[#15489b] hover:bg-[#132f63] text-white rounded-full py-1 px-3 text-sm" // ปรับขนาดปุ่มและตัวอักษร
                            >
                              Select from the computer
                            </button>
                          </div>
                          <p className="text-gray-500 text-xs">
                            or drag photo here
                          </p>{" "}
                          <p className="text-gray-500 text-xs mt-1">
                            PNG, JPG, SVG
                          </p>{" "}
                        </div>
                      )}
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 mb-5">
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl w-full">
                  <input
                    id="first_name"
                    onChange={(e) => setState({ first_name: e.target.value })}
                    value={state.first_name}
                    className="flex-1 pl-2 outline-none border-none"
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex items-center border-2 py-2 px-3 rounded-2xl w-full">
                  <input
                    id="last_name"
                    onChange={(e) => setState({ last_name: e.target.value })}
                    value={state.last_name}
                    className="flex-1 pl-2 outline-none border-none"
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
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
                  className="pl-2 w-full outline-none border-none"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                />
              </div>

              {/* Username Input */}
              <div className="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-2 outline-none border-none"
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
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
                  className="w-full pl-2 outline-none border-none"
                  onChange={(e) => setState({ password: e.target.value })}
                  value={state.password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  required
                />
              </div>
              {/* <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                ใส่ข้อมูลประวัติของอาจารย์ :
              </label> */}
              <div className="flex items-start border-2 border-gray-300 bg-white shadow-sm mb-12 py-3 px-4 rounded-2xl w-full">
                {/* SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 mt-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v16c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V4zm16 0H5v16h14V4zM8 14l2.5-3 1.5 2 2-3 3 4h-9z" />
                </svg>

                {/* Textarea */}
                <textarea
                  id="background"
                  name="background"
                  rows="3"
                  placeholder="Background Lecturer"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="pl-3 pt-1 outline-none border-none w-full resize-none bg-transparent text-gray-700 placeholder-gray-400"
                ></textarea>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                value="Sign-up"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

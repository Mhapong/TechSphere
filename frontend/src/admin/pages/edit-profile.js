import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ax from "../../conf/ax.js";

const EditProfile = () => {
  // State management for each form field
  const [User, setUser] = useState("");
  //   const [Username, setUsername] = useState("");
  //   const [category, setCategory] = useState("");
  //   const [description, setDescription] = useState("");
  //   const [image, setImage] = useState(null);
  //   const [Email, setEmail] = useState("");
  //   const [First_Name, setFirst_Name] = useState("");
  //   const [Last_Name, setLast_Name] = useState("");
  //   const [organizerAddress, setOrganizerAddress] = useState("");
  //   const [startDate, setStartDate] = useState("");
  //   const [endDate, setEndDate] = useState("");
  //   const [status, setStatus] = useState("");
  //   const [tags, setTags] = useState("");
  const [Username, setUsername] = useState(User?.username || "");
  const [Email, setEmail] = useState(User?.email || "");
  const [First_Name, setFirst_Name] = useState(User?.first_name || "");
  const [Last_Name, setLast_Name] = useState(User?.last_name || "");
  const navigate = useNavigate();
  const { userid } = useParams();
  const [file, setFile] = useState(null); // State สำหรับเก็บไฟล์รูปภาพ
  const [previewUrl, setPreviewUrl] = useState(""); // State สำหรับแสดงรูปภาพตัวอย่าง
  const [uploading, setUploading] = useState(false); // State สำหรับแสดงสถานะการอัพโหลด

  const fetchUser = async () => {
    try {
      const response = await ax.get(`users/${userid}`);
      console.log(response.data);
      setUser(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // สร้าง URL สำหรับแสดงรูปภาพตัวอย่าง
    }
  };
  const handleUpload = async () => {
    if (!file) {
      alert("กรุณาเลือกรูปภาพ");
      return;
    }

    setUploading(true);

    try {
      // สร้าง FormData เพื่อส่งไฟล์
      const formData = new FormData();
      formData.append("files", file);

      // อัพโหลดไฟล์ไปยัง Strapi
      const uploadResponse = await ax.post(
        "http://localhost:1337/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // รับ URL ของไฟล์ที่อัพโหลด
      const fileUrl = uploadResponse.data[0].url;

      // อัปเดตข้อมูลโปรไฟล์ผู้ใช้ใน Strapi
      const updateResponse = await ax.put(`users/${userid}`, {
        profile_picture: fileUrl, // ใช้ ID ของไฟล์ที่อัพโหลด
      });

      console.log("อัพโหลดสำเร็จ:", updateResponse.data);
      alert("อัพโหลดรูปภาพสำเร็จ!");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัพโหลด:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ax.put(`users/${userid}`, {
        username: Username,
        email: Email,
        first_name: First_Name,
        last_name: Last_Name,
      });
      alert("อัปเดตข้อมูลสำเร็จ!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (User && Object.keys(User).length > 0) {
      setUsername(User.username || "");
      setEmail(User.email || "");
      setFirst_Name(User.first_name || "");
      setLast_Name(User.last_name || "");
    }
  }, [User]);

  return (
    <div className="w-[800px] mx-auto mt-10 p-4">
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div>
          <label
            htmlFor="image-upload"
            className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
          >
            <div className="text-center">
              <div className="mb-2">
                <button
                  type="button"
                  className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4"
                >
                  Select from the computer
                </button>
              </div>
              <p className="text-gray-500">or drag photo here</p>
              <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
            </div>
          </label>
          <input
            id="image-upload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="sr-only"
          />
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">อัพโหลดรูปภาพโปรไฟล์</h2>

        {/* ปุ่มเลือกไฟล์ */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {/* แสดงรูปภาพตัวอย่าง */}
        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        {/* ปุ่มอัพโหลด */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูปภาพ"}
        </button>
      </div>{" "}
      <h1 className="text-3xl font-bold text-black mb-6 flex items-center justify-center">
        Edit Profile
      </h1>
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="p-2">
          <input
            type="text"
            id="Username"
            name="Username"
            placeholder="Username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Category */}
        {/* <div className="p-2">
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          >
            <option value="">Select a category</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Arts</option>
            <option>Technology</option>
          </select>
        </div> */}

        {/* Description and Image Upload */}
        {/* <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        {/* Description */}
        {/* <div>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            ></textarea>
          </div> */}

        {/* Image Upload */}
        {/* <div>
            <label
              htmlFor="image-upload"
              className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
            >
              <div className="text-center">
                <div className="mb-2">
                  <button
                    type="button"
                    className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4"
                  >
                    Select from the computer
                  </button>
                </div>
                <p className="text-gray-500">or drag photo here</p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
              </div>
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
        </div> */}

        {/* Email */}
        <div className="p-2">
          <input
            type="email"
            id="Email"
            name="Email"
            placeholder="Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Organizer Name and Email */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organizer Name */}
          <div>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="First Name"
              value={First_Name}
              onChange={(e) => setFirst_Name(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>

          {/* Organizer Email */}
          <div>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              value={Last_Name}
              onChange={(e) => setLast_Name(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>

        {/* Start Date and End Date */}
        {/* <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        {/* Start Date */}
        {/* <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
            <span className="flex-shrink-0 flex items-center mr-3 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v2M19 3v2M5 10h14M4 21h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z"
                ></path>
              </svg>
              <span className="ml-2">Start Date</span>
            </span>
            <input
              type="datetime-local"
              id="start-date"
              name="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div> */}

        {/* End Date */}
        {/* <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
            <span className="flex-shrink-0 flex items-center mr-3 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v2M19 3v2M5 10h14M4 21h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z"
                ></path>
              </svg>
              <span className="ml-2">End Date</span>
            </span>
            <input
              type="datetime-local"
              id="end-date"
              name="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div> */}

        {/* Status and Tags */}
        {/* <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6"> */}
        {/* Status */}
        {/* <div className="flex items-center bg-[#f6f6f6] rounded-md">
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50"
              style={{ backgroundColor: "#f6f6f6", padding: "0" }}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}

        {/* Tags */}
        {/* <div>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div> */}

        {/* Registration Button */}
        <div className="col-span-full mt-6 p-2">
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
          >
            Submit Edit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

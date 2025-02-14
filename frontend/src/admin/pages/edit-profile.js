import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ax from "../../conf/ax.js";

const EditProfile = () => {
  const [User, setUser] = useState("");
  const [Username, setUsername] = useState(User?.username || "");
  const [Email, setEmail] = useState(User?.email || "");
  const [First_Name, setFirst_Name] = useState(User?.first_name || "");
  const [Last_Name, setLast_Name] = useState(User?.last_name || "");
  const [background, setBackground] = useState(User?.background || "");
  const navigate = useNavigate();
  const { userid } = useParams();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await ax.get(`users/${userid}?populate=*`);
      console.log(response.data);
      setUser(response.data);
      setPreviewUrl(response.data.profile_picture[0].url);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleFileChange = ({ target: { files } }) => {
    if (files?.length) {
      const { type } = files[0];
      if (type === "image/png" || type === "image/jpeg") {
        setFile(files[0]);
        setPreviewUrl(URL.createObjectURL(files[0]));
      }
    }
  };

  const updateUserProfilePicture = async (avatarId, avatarUrl) => {
    try {
      await ax.put(`users/${userid}`, {
        profile_picture: [{ id: avatarId, url: avatarUrl }],
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const handleImageUpload = async () => {
    if (!file) {
      console.log("Not File");

      return;
    }

    setUploading(true);

    try {
      const files = new FormData();
      files.append("files", file);
      files.append("name", `${User.username} avatar`);

      const response = await ax.post("upload", files, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const {
        data: [{ id, url }],
      } = response;
      console.log(id, url);

      await updateUserProfilePicture(id, url);
      setFile(null);
      setPreviewUrl(url);
    } catch (error) {
      console.log({ error });
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
      setBackground(User.background || "");
    }
  }, [User]);

  return (
    <div className="w-[800px] mx-auto mt-10 p-4">
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        {/* แสดงรูปภาพตัวอย่าง */}
        {previewUrl && (
          <div className="mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        {/* ปุ่มอัพโหลด */}
        <div className="mt-4">
          <button
            onClick={handleImageUpload}
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูปภาพ"}
          </button>
        </div>
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
        {User.role &&
          User.role.name === "Lecturer" &&
          User.background?.history && (
            <div className="p-2">
              <div>
                <textarea
                  id="background"
                  name="background"
                  rows="5"
                  placeholder="background lecturer"
                  value={background?.history || "None"}
                  onChange={(e) =>
                    setBackground((prev) => ({
                      ...prev,
                      history: e.target.value,
                    }))
                  }
                  className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
                  style={{ backgroundColor: "#f6f6f6", whiteSpace: "pre-wrap" }}
                ></textarea>
              </div>
            </div>
          )}

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

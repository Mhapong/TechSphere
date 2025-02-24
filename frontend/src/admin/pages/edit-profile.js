import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ax from "../../conf/ax.js";
import { Toaster, toast } from "sonner";
import conf from "../../conf/main.js";

const EditProfile = () => {
  const [User, setUser] = useState("");
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [First_Name, setFirst_Name] = useState("");
  const [Last_Name, setLast_Name] = useState("");
  const [background, setBackground] = useState("");
  const location = useLocation();
  // const [userProfile, setuserProfile] = useState(
  //   User?.profile_picture[0]?.url || ""
  // );
  const navigate = useNavigate();
  const { userid } = useParams();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await ax.get(`users/${userid}?populate=*`);
      setUser(response.data);
      console.log(response.data);
      if (response.data.profile_picture) {
        const imageUrl = `${conf.apiUrl}${response.data?.profile_picture[0]?.url}`;
        setPreviewUrl(imageUrl);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e, path) => {
    e.preventDefault();
    try {
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
        console.log("New image uploaded successfully:", url);
        console.log(User?.profile_picture);
      } else if (User?.profile_picture[0]) {
        imageData = {
          id: User.profile_picture[0].id,
          url: User.profile_picture[0].url,
        };
        console.log("Using existing image:", imageData.url);
      }
      // const UserData = {
      //   username: Username,
      //   email: Email,
      //   first_name: First_Name,
      //   last_name: Last_Name,
      //   background: background,
      // };

      // if (imageData) {
      //   UserData.profile_picture = [imageData.id];
      // } else {
      //   UserData.profile_picture = null;
      // }
      // console.log("Sending UserData:", UserData);

      const response = await ax.put(`users/${userid}`, {
        username: Username,
        email: Email,
        first_name: First_Name,
        last_name: Last_Name,
        background: background,
        profile_picture: imageData ? [imageData.id] : null,
      });
      // const response = await ax.put(`users/${userid}?populate=*`, {
      //   UserData,
      // });

      // console.log("Response from API:", response.data);
      // console.log(User.id);
      // const response = await ax.put(`users/${User.id}?populate=*`, {
      //   data: UserData,
      // });

      // console.log(response);
      setTimeout(
        () =>
          navigate("/user", {
            state: { Value: response.data },
          }),
        500
      );
      fetchUser();
      console.log("Data successfully uploaded to Strapi!");
      toast.success("บันทึกข้อมูลผู้ใช้สำเร็จ!", {
        // position: "top-center",
        duration: 5000,
        style: {
          fontSize: "1.5rem",
          padding: "20px",
          fontWeight: "bold",
          textAlign: "center",
          borderRadius: "10px",
        },
      });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (User && Object.keys(User).length > 0) {
      setUsername(User.username);
      setEmail(User.email);
      setFirst_Name(User.first_name);
      setLast_Name(User.last_name);
      setBackground(User.background);
      // setuserProfile(User.setuserProfile?.url || "");
    }
  }, [User]);

  // const GetPic
  return (
    <div className="w-[800px] mx-auto mt-12 p-4">
      <h1 className="text-3xl font-bold text-black mb-6 flex items-center justify-center">
        Edit Profile
      </h1>
      <div className="p-2 h-auto">
        <div>
          <div>
            <label
              htmlFor="image-upload"
              className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50 overflow-hidden" // เปลี่ยนเป็นวงกลม
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
                      className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-1 px-3 text-sm" // ปรับขนาดปุ่มและตัวอักษร
                    >
                      Select from the computer
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs">or drag photo here</p>{" "}
                  <p className="text-gray-500 text-xs mt-1">PNG, JPG, SVG</p>{" "}
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
      {/* <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {previewUrl && !showUpload ? (
          <div className="flex flex-col items-center">
            <img
              src={`${API_URL}${previewUrl}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <button
              onClick={() => setShowUpload(true)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              เปลี่ยนรูปภาพ
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
          >
            <div className="text-center">
              <button
                type="button"
                className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4"
              >
                Select from the computer
              </button>
              <p className="text-gray-500">or drag photo here</p>
              <p className="text-gray-500 text-sm mt-1">PNG, JPG</p>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        )}

        {previewUrl && (
          <div className="mt-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        {previewUrl && showUpload && (
          <div className="mt-4">
            <button
              onClick={handleImageUpload}
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {uploading ? "กำลังอัพโหลด..." : "อัพโหลดรูปภาพ"}
            </button>
            <button
              onClick={() => setShowUpload(false)}
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div> */}

      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="p-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            ชื่อผู้ใช้งาน :
          </label>
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
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Email ของผู้ใช้งาน :
          </label>
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อของผู้ใช้งาน :
            </label>
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              นามสกุลของผู้ใช้งาน :
            </label>
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
        {User.role && User.role.name === "Lecturer" && (
          <div className="p-2">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                รายละเอียดตัวเอง :
              </label>
              <textarea
                id="background"
                name="background"
                rows="5"
                placeholder="background lecturer"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                // onChange={(e) =>
                //   setBackground((prev) => ({
                //     ...prev,
                //     history: e.target.value,
                //   }))
                // }
                className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
                style={{ backgroundColor: "#f6f6f6", whiteSpace: "pre-wrap" }}
              ></textarea>
            </div>
          </div>
        )}

        {/* Registration Button */}
        <div className="col-span-full mt-6 p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            ยกเลิกการบันทึก
          </button>
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
          >
            สร้าง/บันทึกคอร์สใหม่
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

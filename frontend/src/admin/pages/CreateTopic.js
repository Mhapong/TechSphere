import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ax from "../../conf/ax";

const AddTopic = () => {
  // State management for each form field
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  const [allcategory, setallCategory] = useState(null);
  const [lecturer, setLecturer] = useState("");
  const [lecturerOwner, setlecturerOwner] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [TimeUsage, setTimeUsage] = useState("");
  const [TimeUsageContent, setTimeUsageContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [detail, setDetail] = useState("");
  const Navigate = useNavigate();
  const { courseid, coursename } = useParams();
  const [content, setContent] = useState("");
  const [openAddContent, setopenAddContent] = useState(false);

  // const handleSelectChange = (e) => {
  //   const selectedValues = Array.from(e.target.selectedOptions).map(
  //     (option) => ({
  //       id: option.value,
  //       name: option.getAttribute("data-name"),
  //     })
  //   );
  //   setCategory((prevCategory) => [
  //     ...new Set([...prevCategory, ...selectedValues]),
  //   ]);
  // };

  // const handleRemoveCategory = (value) => {
  //   setCategory((prevCategory) =>
  //     prevCategory.filter((item) => item.id !== value)
  //   );
  // };
  const handleAddContent = () => {
    console.log("ADDCONTENT");
    setopenAddContent(true);
  };

  const handleSubmit = async (e, path) => {
    e.preventDefault();
    try {
      const categoryid = category.map((item) => item.id);
      const response = await ax.post(`courses?populate=*`, {
        data: {
          Name: title,
          Description: description,
          start_date: startDate,
          end_date: endDate,
          categories: categoryid,
          Time_Usage: TimeUsage,
        },
      });
      alert(`สร้างคอร์สสำเร็จ กำลังพาคุณไปยัง ${path}!`);
      console.log("Data successfully uploaded to Strapi!");
      Navigate(`${path}/${response.data.data.id}`);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleSubmitContent = async (e, path) => {
    e.preventDefault();
    try {
      const categoryid = category.map((item) => item.id);
      const response = await ax.post(`courses?populate=*`, {
        data: {
          Name: title,
          Description: description,
          start_date: startDate,
          end_date: endDate,
          categories: categoryid,
          Time_Usage: TimeUsage,
          course_owner: lecturerOwner,
        },
      });
      alert(`สร้างคอร์สสำเร็จ กำลังพาคุณไปยัง ${path}!`);
      console.log("Data successfully uploaded to Strapi!");
      Navigate(`${path}/${response.data.data.id}`);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  // Handle image upload
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage(file);
  //   }
  // };

  // const fetchCourse = async () => {
  //   try {
  //     const response = await ax.get(`Course/${courseid}`);
  //     // console.log(response.data.data);
  //     setallCategory(response.data.data);
  //   } catch (e) {
  //     console.log("Error", e);
  //   }
  // };

  // const fetchLecturer = async () => {
  //   try {
  //     const response = await ax.get(
  //       `users?filters[role][name][$eq]=Lecturer&populate=*`
  //     );
  //     // console.log(response.data);
  //     setLecturer(response.data);
  //   } catch (e) {
  //     console.log("Error", e);
  //   }
  // };

  useEffect(() => {
    // fetchLecturer();
    // fetchCourse();
    // fetchStatus();
  }, []);

  return (
    <div className="w-[1000px] mx-96 mt-11 p-8">
      <h1 className="flex items-center justify-center text-3xl font-bold text-black mb-6">
        สร้างหัวข้อใหม่
      </h1>

      <form
        className="grid grid-cols-1 gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Title */}
        <div className="p-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            สร้างหัวข้อใหม่ :
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="ใส่ชื่อหัวข้อใหม่"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              จำนวนเวลารวมของหัวข้อ :
            </label>
            <input
              type="number"
              id="TimeUsage"
              name="TimeUsage"
              placeholder="จำนวนเวลารวมของหัวข้อ (หน่วยชั่วโมง)"
              value={TimeUsage}
              min="0"
              onChange={(e) => setTimeUsage(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              กำลังเพิ่มอยู่ในคอร์ส :
            </label>
            <input
              type="text"
              value={`${coursename}`}
              readOnly
              className="block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">เนื้อหา</h3>
            <button
              onClick={handleAddContent}
              className="text-teal-600 hover:text-teal-700"
            >
              <span className="text-sm">✏️ เพิ่ม</span>
            </button>
          </div>
          {openAddContent && (
            <form
              className="p-4 bg-white shadow-md rounded-md"
              onSubmit={handleSubmitContent}
            >
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                สร้างเนื้อหาใหม่
              </h2>

              {/* ชื่อหัวข้อ */}
              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-3">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ชื่อเนื้อหาใหม่:
                  </label>
                  <input
                    type="text"
                    id="content_title"
                    name="content_title"
                    placeholder="กรอกชื่อเนื้อหา"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
                    style={{ backgroundColor: "#f6f6f6" }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    จำนวนเวลารวมของเนื้อหา:
                  </label>
                  <input
                    type="number"
                    id="TimeUsageContent"
                    name="TimeUsageContent"
                    placeholder="จำนวนเวลารวมของคอร์สเรียน (หน่วยชั่วโมง)"
                    value={TimeUsageContent}
                    min="0"
                    onChange={(e) => setTimeUsageContent(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
                    style={{ backgroundColor: "#f6f6f6" }}
                  />
                </div>
              </div>
              {/* รายละเอียด */}
              <div className="mb-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  รายละเอียด:
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="กรอกรายละเอียด..."
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 h-24 resize-none"
                  style={{ backgroundColor: "#f6f6f6" }}
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  ใส่วิดีโอของคลิป:
                </label>
                <label
                  htmlFor="image-upload"
                  className=" w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
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
                  // onChange={handleImageUpload}
                  className="sr-only"
                />
              </div>
              {/* ปุ่มกด */}
              <div className="flex justify-end gap-5 mt-2">
                <button
                  type="button"
                  onClick={() => setopenAddContent(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8c0327] text-white rounded-md hover:bg-[#6c021f]"
                >
                  บันทึก
                </button>
              </div>
            </form>
          )}
          {/* Module List */}
          <div className="space-y-2">
            {content &&
              content.map((value) => (
                <div
                  key={value}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{value}</span>
                    <span className="text-gray-600">เวลา 30 นาที</span>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <span className="text-sm">✏️</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Registration Button */}
        <p className="text-red-500 flex items-center justify-center">
          **หมายเหตุต้องหัวข้อก่อนถึงจะสร้างเนื้อหาต่อไปได้**
        </p>
        <div className="col-span-full  p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="submit"
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, "/create-summarize")}
          >
            สร้างคอร์สใหม่และจบการสร้างคอร์ส
          </button>
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, `/create-topic`)}
          >
            สร้างคอร์สใหม่และสร้างหัวข้อใหม่
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTopic;

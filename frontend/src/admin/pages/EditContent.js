import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ax from "../../conf/ax";
import { Toaster, toast } from "sonner";
import { Edit } from "@mui/icons-material";

const EditContent = () => {
  const location = useLocation();
  const { Value } = location.state || {};
  const [title, setTitle] = useState(Value?.topic_title || "");
  const [TimeUsage, setTimeUsage] = useState(Value?.time || "");
  const [detail, setDetail] = useState(Value?.detail || "");
  console.log(Value);
  useEffect(() => {
    if (Value) {
      setTitle(Value.content_title);
      setTimeUsage(Value.time);
      setDetail(Value.detail);
    }
  }, [Value]);

  const Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Update");
      await ax.put(`contents/${Value.documentId}?populate=*`, {
        data: {
          content_title: title,
          time: TimeUsage,
          detail: detail,
        },
      });
      toast.success("บันทึกข้อมูลเนื้อหาสำเร็จ!", {
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
      console.log("Data successfully uploaded to Strapi!");
      // Navigate(`/create-topic/${data.documentId}`, {
      //   state: { Value: data },
      // });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div className="w-[1000px] mx-96 mt-11 p-8">
      <Toaster />
      <ol class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 sm:justify-center md:flex-row md:items-center lg:gap-6">
        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>
        <li class="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5 lg:flex-none">
          <svg
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p class="text-sm font-medium leading-tight text-gray-500 dark:text-gray-400">
            สร้างคอร์สใหม่
          </p>
        </li>

        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>

        <li class="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5 lg:flex-none">
          <svg
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p class="text-sm font-medium leading-tight text-gray-500 dark:text-gray-400">
            สรุปการสร้างคอร์ส
          </p>
        </li>

        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>

        <li class="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5 lg:flex-none">
          <svg
            class="h-5 w-5 text-primary-700 dark:text-primary-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p class="text-sm font-medium leading-tight text-primary-700 dark:text-primary-500">
            สร้างหัวข้อและเนื้อหาใหม่
          </p>
        </li>
        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>
      </ol>
      <h1 className="flex items-center justify-center text-3xl font-bold text-black mb-6 mt-4">
        แก้ไขเนื้อหา {Value.content_title}
      </h1>

      <form className="grid grid-cols-1 gap-6">
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              สร้างชื่อเนื้อหาหม่ :
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="ใส่ชื่อเนื้อหาใหม่"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              จำนวนเวลารวมของเนื้อหา :
            </label>
            <input
              type="number"
              id="TimeUsage"
              name="TimeUsage"
              placeholder="จำนวนเวลารวมของเนื้อหา (หน่วยชั่วโมง)"
              value={TimeUsage}
              min="0"
              onChange={(e) => setTimeUsage(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>
        <div className="p-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            คำอธิบายเนื้อหา :
          </label>
          <div>
            <textarea
              id="Detail"
              name="Detail"
              rows="3"
              placeholder="ใส่คำอธิบายเนื้อหา"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            ></textarea>
          </div>
        </div>
        <div className="mb-3">
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

        <div className="col-span-full  p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button" // Add this to prevent form submission
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            // onClick={() => Navigate(`/create-topic/${contentid}`)}
            onClick={() => Navigate(-1)}
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, Value)}
          >
            บันทึกหัวข้อใหม่
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContent;

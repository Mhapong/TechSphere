import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ax from "../../conf/ax";
import { Toaster, toast } from "sonner";

const AddCourse = () => {
  // State management for each form field
  const location = useLocation();
  const { Value } = location.state || {};
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  const [allcategory, setallCategory] = useState(null);
  const [lecturer, setLecturer] = useState("");
  const [lecturerOwner, setlecturerOwner] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [TimeUsage, setTimeUsage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [Price, setPrice] = useState("");
  const Navigate = useNavigate();
  console.log(Value);
  useEffect(() => {
    if (Value && Array.isArray(Value.topic)) {
      setTitle(Value.Name);
      setDescription(Value.Description);
      setPrice(Value.Price);
      setStartDate(formatDateForInput(Value.start_date));
      setEndDate(formatDateForInput(Value.end_date));

      setStatus(Value.status_coure);
      setTimeUsage(Value.Time_Usage);
      setlecturerOwner(Value.lecturer_owner.id);
      setCategory(Value.categories.map((category) => category.id));
    }
  }, [Value]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };
  const handleSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions).map(
      (option) => ({
        id: option.value,
        name: option.getAttribute("data-name"),
      })
    );
    setCategory((prevCategory) => [
      ...new Set([...prevCategory, ...selectedValues]),
    ]);
  };

  const handleRemoveCategory = (value) => {
    setCategory((prevCategory) =>
      prevCategory.filter((item) => item.id !== value)
    );
  };
  const handleSubmit = async (e, path) => {
    e.preventDefault();
    try {
      const categoryid = category.map((item) => item.id);
      // let response;
      if (Value) {
        const response = await ax.put(
          `courses/${Value.documentId}?populate=*`,
          {
            data: {
              Name: title,
              Description: description,
              start_date: startDate,
              end_date: endDate,
              categories: categoryid,
              Time_Usage: TimeUsage,
              Price: Price,
              lecturer_owner: lecturerOwner,
              status_coure: status,
            },
          }
        );
        setTimeout(
          () => Navigate(`${path}/${response.data.data.documentId}`),
          500
        );
        // setTopic(response.data.data);
      } else {
        const response = await ax.post(`courses?populate=*`, {
          data: {
            Name: title,
            Description: description,
            start_date: startDate,
            end_date: endDate,
            categories: categoryid,
            Time_Usage: TimeUsage,
            Price: Price,
            lecturer_owner: lecturerOwner,
            status_coure: status,
          },
        });
        setTimeout(
          () => Navigate(`${path}/${response.data.data.documentId}`),
          500
        );
        // setTopic(response.data.data);
      }
      console.log("Data successfully uploaded to Strapi!");
      toast.success("บันทึกข้อมูลคอร์สสำเร็จ!", {
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

      // alert(`สร้างคอร์สสำเร็จ กำลังพาคุณไปยัง ${path}!`);
      // Navigate(`${path}/${response.data.data.id}`);
      // Navigate(`${path}/d3cekbvx03qmt7fuprb2ymty`);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await ax.get(`categories`);
      // console.log(response.data.data);
      setallCategory(response.data.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const fetchLecturer = async () => {
    try {
      const response = await ax.get(
        `users?filters[role][name][$eq]=Lecturer&populate=*`
      );
      // console.log(response.data);
      setLecturer(response.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    fetchLecturer();
    fetchCategory();
    // fetchStatus();
  }, []);

  return (
    <div className="w-[1000px] mx-96 mt-11 p-8">
      <Toaster />
      <ol class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 sm:justify-center md:flex-row md:items-center lg:gap-6">
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
            สร้างหัวข้อและเนื้อหาใหม่
          </p>
        </li>
        <div class="hidden h-px w-8 shrink-0 bg-gray-200 dark:bg-gray-700 md:block xl:w-16"></div>
      </ol>

      <h1 className="flex items-center justify-center text-3xl font-bold text-black mb-6 mt-5">
        สร้างคอร์สใหม่ 📝
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
            สร้างชื่อคอร์สใหม่ :
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title Course"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div>

        {/* Category */}
        <div className="p-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            คำอธิบายคอร์ส :
          </label>
          <div>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Description Course"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            ></textarea>
          </div>
        </div>

        {/* Description and Image Upload */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-0">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              เลือกประเภทของคอร์ส (เลือกได้หลายประเภท) :
            </label>
            <div className="p-2">
              {/* <p className="mt-0">เลือกประเภทของคอร์ส:</p> */}
              <select
                id="category"
                name="category"
                multiple
                value={category}
                onChange={handleSelectChange}
                className="block w-full h-32  px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8c0327] focus:border-[#8c0327] transition-all duration-300 ease-in-out hover:bg-gray-50"
                style={{ backgroundColor: "#f6f6f6" }}
              >
                {allcategory &&
                  allcategory.map((value, index) => (
                    <option
                      key={value.id}
                      value={value.id}
                      data-name={value.tag}
                    >
                      {index + 1}. {value.tag}
                    </option>
                  ))}
              </select>
              <div className="mt-2">
                {category.map((value) => (
                  <div
                    key={value.id}
                    className="inline-flex bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-2 mt-0"
                  >
                    {value.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(value.id)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Description */}

          {/* Image Upload */}
          <div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                เลือกประเภทของคอร์ส (เลือกได้หลายประเภท) :
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
                onChange={handleImageUpload}
                className="sr-only"
              />
            </div>
          </div>
        </div>

        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              จำนวนเวลาที่ใช้ทั้งหมดของคอร์ส :
            </label>
            <input
              type="number"
              id="TimeUsage"
              name="TimeUsage"
              placeholder="จำนวนเวลารวมของคอร์สเรียน (หน่วยชั่วโมง)"
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
              ราคาคอร์สเรียน :
            </label>
            <input
              type="number"
              id="Price"
              name="Price"
              placeholder="ราคาคอร์สเรียน (หน่วยบาท)"
              min="0"
              value={Price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>

        {/* Start Date and End Date */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              เวลาเริ่มต้นใช้งานคอร์ส :
            </label>
            <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
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
            </div>
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              เวลาสิ้นสุดการใช้งานคอร์ส :
            </label>
            <div className="flex items-center bg-[#f6f6f6] rounded-md p-2">
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
          </div>
        </div>

        {/* Status and Tags */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              สถานะของคอร์สเรียน :
            </label>
            <div className="flex items-center bg-[#f6f6f6] rounded-md">
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50"
                style={{ backgroundColor: "#f6f6f6", padding: "0" }}
              >
                <option value="">เลือกสถานะคอร์ส</option>
                <option value="Activate">เปิดใช้งาน</option>
                <option value="Deactivate">ปิดใช้งาน</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              อาจารย์ผู้สอนคอร์ส :
            </label>
            <div className="flex items-center bg-[#f6f6f6] rounded-md">
              <select
                id="lecturer"
                name="lecturer"
                value={lecturerOwner}
                onChange={(e) => setlecturerOwner(e.target.value)}
                className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50"
                style={{ backgroundColor: "#f6f6f6", padding: "0" }}
              >
                <option value="">เลือกอาจารย์ผู้สอน</option>
                {lecturer &&
                  lecturer.map((person) => {
                    return (
                      <option key={person.id} value={person.id}>
                        {`${person.first_name} ${person.last_name}`}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>

        {/* Registration Button */}
        <div className="col-span-full mt-6 p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="submit"
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            onClick={() => Navigate(-1)}
          >
            ยกเลิกการบันทึก
          </button>
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, `/create-summarize`)}
          >
            สร้าง/บันทึกคอร์สใหม่
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;

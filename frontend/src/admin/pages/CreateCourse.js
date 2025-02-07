import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ax from "../../conf/ax";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

const AddCourse = () => {
  // State management for each form field
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
      await ax.post(`courses?populate=*`, {
        data: {
          Name: title,
          Description: description,
          start_date: startDate,
          end_date: endDate,
          categories: categoryid,
          Time_Usage: TimeUsage,
          Price: Price,
          course_owner: lecturerOwner,
          status_coure: status,
        },
      });
      alert(`สร้างคอร์สสำเร็จ กำลังพาคุณไปยัง ${path}!`);
      console.log("Data successfully uploaded to Strapi!");
      Navigate(path);
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
      <h1 className="flex items-center justify-center text-3xl font-bold text-black mb-6">
        สร้างคอร์สใหม่
      </h1>

      <form
        className="grid grid-cols-1 gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Title */}
        <div className="p-2">
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
          <select
            id="category"
            name="category"
            multiple
            value={category}
            onChange={handleSelectChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          >
            {allcategory &&
              allcategory.map((value, index) => (
                <option key={value.id} value={value.id} data-name={value.tag}>
                  {value.tag}
                </option>
              ))}
          </select>
          <div className="mt-2">
            {category.map((value) => (
              <div
                key={value.id}
                className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                {value.name} {/* โชว์ชื่อหมวดหมู่ */}
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

          <p className="mt-2">เลือกประเภทของคอร์ส: {category.join(", ")}</p>

          {/* แสดงค่าเลือกพร้อมปุ่มลบ */}
        </div>

        {/* Description and Image Upload */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
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

          {/* Image Upload */}
          <div>
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

        {/* Location */}
        {/* <div className="p-2">
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div> */}

        {/* Organizer Name and Email */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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

        {/* Organizer Address */}
        {/* <div className="p-2">
          <input
            type="text"
            id="organizer-address"
            name="organizer-address"
            placeholder="Organizer Address"
            value={organizerAddress}
            onChange={(e) => setOrganizerAddress(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
            style={{ backgroundColor: "#f6f6f6" }}
          />
        </div> */}

        {/* Start Date and End Date */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
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

          {/* End Date */}
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

        {/* Status and Tags */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
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

          {/* Status */}
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

        {/* Registration Button */}
        <div className="col-span-full mt-6 p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="submit"
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, "/finish-course")}
          >
            สร้างคอร์สใหม่และจบการสร้างคอร์ส
          </button>
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, "/new-topic")}
          >
            สร้างคอร์สใหม่และสร้างหัวข้อใหม่
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;

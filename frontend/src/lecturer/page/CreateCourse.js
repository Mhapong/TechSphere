import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ax from "../../conf/ax";
import { toast } from "sonner";
import datapic from "../../client/components/static/data.png";
import webpic from "../../client/components/static/web-100.png";
import gamepic from "../../client/components/static/game.png";
import hardwarepic from "../../client/components/static/hardware.png";
import networkpic from "../../client/components/static/network.png";
import morepic from "../../client/components/static/more.png";
import Select from "react-select";
import conf from "../../conf/main";

const AddCourse = () => {
  // State management for each form field
  const location = useLocation();
  const { Value } = location.state || {};
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  // const [allcategory, setallCategory] = useState(null);
  const [lecturer, setLecturer] = useState("");
  const [lecturerOwner, setlecturerOwner] = useState(null);
  const [description, setDescription] = useState("");
  const [TimeUsage, setTimeUsage] = useState("");
  const [status, setStatus] = useState("");
  const [Price, setPrice] = useState("");
  const Navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categories = [
    { label: "Web Develop", value: 2, img: webpic },
    { label: "Data Analysis", value: 6, img: datapic },
    { label: "IoT & Hardware", value: 4, img: hardwarepic },
    { label: "Network", value: 5, img: networkpic },
    { label: "Game Develop", value: 3, img: gamepic },
    { label: "AI", value: 1, img: morepic },
  ];

  useEffect(() => {
    if (Value && Array.isArray(Value.topic)) {
      setTitle(Value.Name);
      setDescription(Value.Description);
      setPrice(Value.Price);
      setStatus(Value.status_coure);
      setTimeUsage(Value.Time_Usage);
      setlecturerOwner(Value.lecturer_owner?.id);
      setCategory(
        Value.categories.map((category) => ({
          id: category.id,
          tag: category.tag,
        }))
      );
      if (Value?.image) {
        const imageUrl = `${conf.apiUrl}${Value?.image[0]?.url}`;
        setPreviewUrl(imageUrl);
      }
    }
  }, [Value]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedArray = Array.isArray(selectedOptions)
      ? selectedOptions
      : [selectedOptions];

    const selectedValues = selectedArray.map((option) => ({
      id: String(option.value),
      tag: option.label,
    }));

    setCategory((prevCategory) => {
      const prevArray = Array.isArray(prevCategory) ? prevCategory : [];
      const idSet = new Set(prevArray.map((item) => String(item.id)));

      const newCategories = selectedValues.filter(
        (item) => !idSet.has(String(item.id))
      );

      return [...prevArray, ...newCategories];
    });
  };

  const handleRemoveCategory = (value) => {
    setCategory((prevCategory) =>
      prevCategory.filter((item) => item.id !== value)
    );
  };
  const handleSubmit = async (e, path) => {
    e.preventDefault();
    try {
      let imageData = null;

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
      } else if (Value?.image) {
        imageData = {
          id: Value.image[0].id,
          url: Value.image[0].url,
        };
      }

      const categoryid = category.map((item) => item.id);
      const CourseData = {
        Name: title,
        Description: description,
        categories: categoryid,
        Time_Usage: TimeUsage,
        Price: Price,
        lecturer_owner: lecturerOwner,
        status_coure: status,
      };

      if (imageData) {
        CourseData.image = [imageData.id];
      } else {
        CourseData.image = null;
      }
      if (Value) {
        const response = await ax.put(
          `courses/${Value.documentId}?populate=*`,
          {
            data: CourseData,
          }
        );
        setTimeout(
          () => Navigate(`${path}/${response.data.data.documentId}`),
          500
        );
      } else {
        const response = await ax.post(`courses?populate=*`, {
          data: CourseData,
        });
        setTimeout(
          () => Navigate(`${path}/${response.data.data.documentId}`),
          500
        );
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // const fetchCategory = async () => {
  //   try {
  //     const response = await ax.get(`categories`);
  //     setallCategory(response.data.data);
  //   } catch (e) {
  //     console.log("Error", e);
  //   }
  // };

  const fetchLecturer = async () => {
    try {
      const response = await ax.get(
        `users?filters[role][name][$eq]=Lecturer&populate=*`
      );
      setLecturer(response.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    fetchLecturer();
    // fetchCategory();
    // fetchStatus();
  }, []);

  return (
    // <div className="w-[1000px] mx-96 mt-11 p-8">
    <div className="w-full lg:w-[1000px] mt-11 lg:ml-96 max-w-7xl p-4">
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
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-0">
          <div>
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
              placeholder="ชื่อคอร์ส"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              กำนหดสถานะคอร์ส :
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
                <option value="Activate">กำลังใช้งาน</option>
                <option value="Deactivate">หยุดใช้งาน</option>
              </select>
            </div>
          </div>
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
              placeholder="กรุณาใส่คำอธิบายคอร์ส"
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
              <Select
                options={categories}
                value={categories.find((c) => c.value === category.id)}
                onChange={handleSelectChange}
                placeholder="เลือกประเภท"
                className="text-gray-700 flex-auto"
                getOptionLabel={(e) => (
                  <div className="flex items-center">
                    <img src={e.img} alt={e.label} className="w-6 h-6 mr-2" />
                    {e.label}
                  </div>
                )}
              />
              <div className="mt-2">
                {category.map((value) => (
                  <div
                    key={value.id}
                    className="inline-flex bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-2 mt-0"
                  >
                    {value.tag}
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
        <div className="p-2 h-auto">
          <div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                เลือกรูปภาพหน้าปกของคอร์ส :
              </label>
              <label
                htmlFor="image-upload"
                className="w-full min-h-96 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                        className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4"
                      >
                        เลือกจากคอมพิวเตอร์ของคุณ
                      </button>
                    </div>
                    <p className="text-gray-500">หรือวางรูปภาพของคุณตรงนี้</p>
                    <p className="text-gray-500 text-sm mt-1">
                      รองรับเฉพาะ PNG, JPG, SVG
                    </p>
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

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ax from "../../conf/ax";
import { Toaster, toast } from "sonner";
import { Edit, Delete } from "@mui/icons-material";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   DialogTitle,
// } from "@headlessui/react";
// import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const AddTopic = () => {
  // State management for each form field
  const [Topic, setTopic] = useState(null);
  const { topicid } = useParams();
  const location = useLocation();
  const { Value } = location.state || {};
  const [CourseTitle, setCourseTitle] = useState("");
  const [title, setTitle] = useState(Topic?.topic_title || "");
  const [titleContent, setTitleContent] = useState("");
  const [TimeUsage, setTimeUsage] = useState(Topic?.time || "");
  const [open, setOpen] = useState(false);
  const [DeleteContent, setDeleteContent] = useState([]);

  const handleRowDeleted = async (itemId) => {
    try {
      await ax.delete(`Contents/${itemId}`);
      fetchTopic();
      Navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (Value && Array.isArray(Value.topic)) {
      setCourseTitle(Value.Name);
      const foundTopic = Value.topic.find((t) => t.documentId === topicid);
      if (foundTopic) {
        setTopic(foundTopic);
        setTitle(foundTopic.topic_title);
        setTimeUsage(foundTopic.time);
        fetchTopic(foundTopic.documentId);
      }
    }
  }, [topicid, Value]);

  const [image, setImage] = useState(null);
  const [TimeUsageContent, setTimeUsageContent] = useState("");
  const [detail, setDetail] = useState("");
  const Navigate = useNavigate();
  const [content, setContent] = useState("");
  const [openAddContent, setopenAddContent] = useState(false);

  const handleAddContent = () => {
    console.log("ADDCONTENT");
    setopenAddContent(true);
  };

  const fetchTopic = async (documentId) => {
    try {
      const response = await ax.get(`topics/${documentId}?populate=*`);
      setContent(response.data.data.content);
    } catch (e) {
      console.log(`Error`, e);
    }
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      if (Topic) {
        console.log("Update");
        const response = await ax.put(`topics/${Topic.documentId}?populate=*`, {
          data: {
            topic_title: title,
            time: TimeUsage,
            topic_id: Value.id,
          },
        });
        setTopic(response.data.data);
      } else {
        console.log("Create");
        const response = await ax.post(`topics?populate=*`, {
          data: {
            topic_title: title,
            time: TimeUsage,
            topic_id: Value.id,
          },
        });
        setTopic(response.data.data);
      }
      toast.success("บันทึกข้อมูลหัวข้อสำเร็จ!", {
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
      // Navigate(`/create-topic/${data.documentId}`, {
      //   state: { Value: data },
      // });
      console.log("Data successfully uploaded to Strapi!");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleSubmitContent = async (e, data) => {
    e.preventDefault();
    try {
      const response = await ax.post(`contents?populate=*`, {
        data: {
          content_title: titleContent,
          time: TimeUsageContent,
          content_id: Topic.id,
          detail: detail,
        },
      });
      console.log(response.data.data.topic.id);
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
      fetchTopic();
      // Navigate(`/create-topic/${data.documentId}`, {
      //   state: { Value: data },
      // });
      setopenAddContent(false);
      console.log("Data successfully uploaded to Strapi!");
      // Navigate(`${path}/${response.data.data.id}`);
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
        สร้างหัวข้อใหม่
      </h1>

      <form className="grid grid-cols-1 gap-6">
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
              value={CourseTitle}
              readOnly
              className="block w-full rounded-md text-gray-600 border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>
        {Topic && (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">เนื้อหา</h3>
              <button
                type="button" // Add this to prevent form submission
                onClick={handleAddContent}
                className="text-teal-600 hover:text-teal-700"
              >
                <span className="text-sm">✏️ เพิ่ม</span>
              </button>
            </div>
            {openAddContent && (
              <form
                className="p-4 bg-white shadow-md rounded-md"
                // onSubmit={handleSubmitContent} // ใช้ onSubmit เพื่อจัดการการส่ง form
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  สร้างเนื้อหาใหม่
                </h2>

                {/* ชื่อหัวข้อ */}
                <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <label
                      htmlFor="content_title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ชื่อเนื้อหาใหม่:
                    </label>
                    <input
                      type="text"
                      id="content_title"
                      name="content_title"
                      placeholder="กรอกชื่อเนื้อหา"
                      value={titleContent}
                      onChange={(e) => setTitleContent(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
                      style={{ backgroundColor: "#f6f6f6" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="TimeUsageContent"
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
                  <div className="mt-5">
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
                        <p className="text-gray-500 text-sm mt-1">
                          PNG, JPG, SVG
                        </p>
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
                    // className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
                    onClick={(e) => handleSubmitContent(e, Value)}
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
                    key={value.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{value.content_title}</span>
                      <span className="text-gray-600">
                        เวลา {value.time} นาที
                      </span>
                      <span className="text-gray-600">
                        {value.detail && value.detail.length > 30
                          ? `${value.detail.slice(0, 30)}...`
                          : value.detail}
                      </span>
                    </div>
                    <div className="flex gap-5">
                      <button
                        onClick={() => {
                          // setOpen(true);
                          handleRowDeleted(value.documentId);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <span className="text-sm">
                          {" "}
                          <Delete />
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          Navigate(`/edit-content/${Value.documentId}`, {
                            state: { Value: value },
                          });
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <span className="text-sm">
                          {" "}
                          <Edit />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Registration Button */}
        <p className="text-red-500 flex items-center justify-center">
          **หมายเหตุต้องหัวข้อก่อนถึงจะสร้างเนื้อหาต่อไปได้**
        </p>
        <div className="col-span-full  p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button" // Add this to prevent form submission
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            onClick={() => Navigate(`/create-summarize/${Value.documentId}`)}
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
      {/* <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="size-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      แจ้งเตือนการลบหัวข้อ
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจแล้วหรือไม่ ว่าจะลบหัวข้อนี้?
                        ข้อมูลที่ลบไปจะไม่สามารถกู้คืนได้อีก
                        กรุณาตรวจสอบให้แน่ใจก่อนลบหัวข้อนี้
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleRowDeleted(DeleteContent);
                    setDeleteContent(null);
                    setOpen(false);
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  ยืนยันการลบ
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  ยกเลิก
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog> */}
    </div>
  );
};

export default AddTopic;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ax from "../../conf/ax";
import { toast } from "sonner";
import conf from "../../conf/main";

const AddEditPromotion = () => {
  const location = useLocation();
  const { Value } = location.state || {};
  const [Code, setCode] = useState("");
  const [Detail, setDetail] = useState("");
  const [Discount, setDiscount] = useState("");
  const [status, setStatus] = useState("");
  const Navigate = useNavigate();
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (Value) {
      setCode(Value.Code);
      setDetail(Value.detail);
      setStatus(Value.status_promotion);
      setDiscount(Value.discount);
      setEndDate(Value.end_date);
      if (Value.picture_promotion) {
        const imageUrl = `${conf.apiUrl}${Value.picture_promotion.url}`;
        setPreviewUrl(imageUrl);
      }
    }
  }, [Value]);

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
      } else if (Value?.picture_promotion) {
        imageData = {
          id: Value.picture_promotion.id,
          url: Value.picture_promotion.url,
        };
      }

      const promotionData = {
        Code: Code,
        detail: Detail,
        discount: Discount,
        status_promotion: status,
        end_date: endDate,
      };

      if (imageData) {
        promotionData.picture_promotion = [imageData.id];
      } else {
        promotionData.picture_promotion = null;
      }

      if (Value) {
        await ax.put(`promotions/${Value.documentId}?populate=*`, {
          data: promotionData,
        });
      } else {
        await ax.post(`promotions?populate=*`, {
          data: promotionData,
        });
      }

      setTimeout(() => Navigate(`${path}`), 500);
      toast.success("บันทึกข้อมูลโปรโมชั่นสำเร็จ!", {
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

  return (
    // <div className="w-[1000px] mx-96 mt-11 p-8">
    <div className="w-full lg:w-[1000px] mt-11 lg:ml-96 pt-16 max-w-7xl p-4">
      <h1 className="flex items-center justify-center text-3xl font-bold text-black mb-6 mt-5">
        สร้าง/แก้ไขโปรโมชั่น {Value?.Code} 📝
      </h1>

      <form
        className="grid grid-cols-1 gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Code */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="Code"
              className="block text-sm font-medium text-gray-700"
            >
              Code โปรโมชั่นใหม่ :
            </label>
            <input
              type="text"
              id="Code"
              name="Code"
              placeholder="Code Promotion"
              value={Code}
              onChange={(e) => setCode(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
          <div>
            <label
              htmlFor="Code"
              className="block text-sm font-medium text-gray-700"
            >
              กำหนด เปอร์เซ็นส่วดลด โปรโมชั่น :
            </label>
            <input
              type="number"
              id="Discount"
              name="Discount"
              placeholder="เปอร์เซ็นส่วดลด"
              value={Discount}
              min="0"
              onChange={(e) => setDiscount(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
        </div>
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              สถานะของโปรโมชั่น :
            </label>
            <div className="flex items-center bg-[#f6f6f6] rounded-md">
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full h-14 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50"
                style={{ backgroundColor: "#f6f6f6", padding: "0" }}
              >
                <option value="">เลือกสถานะโปรโมชั่น</option>
                <option value="Activate">กำลังใช้งาน</option>
                <option value="Deactivate">หยุดใช้งาน</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              กำหนดวันหมดอายุโปรโมชั่น :
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
                type="date"
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

        {/* Category */}
        <div className="p-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            คำอธิบายโปรโมชั่น :
          </label>
          <div>
            <textarea
              id="Detail"
              name="Detail"
              rows="3"
              placeholder="คำอธิบายโปรโมชั่น"
              value={Detail}
              onChange={(e) => setDetail(e.target.value)}
              className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            ></textarea>
          </div>
        </div>

        <div className="p-2 h-auto">
          <div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                เลือกรูปภาพโปรโมตของโปรโมชั่น :
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
                        Select from the computer
                      </button>
                    </div>
                    <p className="text-gray-500">or drag photo here</p>
                    <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
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
            onClick={(e) => handleSubmit(e, `/promotion`)}
          >
            สร้าง/บันทึกโปรโมชั่นใหม่
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditPromotion;

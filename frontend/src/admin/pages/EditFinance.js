import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ax from "../../conf/ax";
import { toast } from "sonner";
import conf from "../../conf/main";

const EditFinance = () => {
  const location = useLocation();
  const { Value } = location.state || {};
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const Navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (Value) {
      setName(
        `${Value.users_purchase.first_name} ${Value.users_purchase.last_name}`
      );
      setEmail(Value.users_purchase.email);
      setStatus(Value.status_confirm);
      setAmount(Value.amount);
      if (Value.picture_purchase) {
        const imageUrl = `${conf.apiUrl}${Value.picture_purchase.url}`;
        setPreviewUrl(imageUrl);
      }
    }
  }, [Value]);

  const handleSubmit = async (e, path) => {
    e.preventDefault();
    try {
      const confirmPurchasesData = {
        status_confirm: status,
      };
      await ax.put(`confirm-purchases/${Value.documentId}?populate=*`, {
        data: confirmPurchasesData,
      });

      setTimeout(() => Navigate(`${path}`), 500);
      console.log("Data successfully uploaded to Strapi!");
      toast.success("บันทึกข้อมูลโปรโมชั่นสำเร็จ!", {
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

  return (
    <div className="w-full lg:w-[1000px] mt-11 lg:ml-96 max-w-7xl p-4">
      <h1 className="flex items-center justify-center text-3xl font-bold text-black mb-6 mt-5">
        แก้ไขสถานะ การเงิน 📝
      </h1>

      <form
        className="grid grid-cols-1 gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Name */}
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อนามสกุลผู้ซื้อ :
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              placeholder="Name Promotion"
              value={Name}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium text-gray-700"
            >
              Name โปรโมชั่นใหม่ :
            </label>
            <input
              type="text"
              id="Email"
              name="Email"
              placeholder="Email"
              value={Email}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2 h-12"
              style={{ backgroundColor: "#f6f6f6" }}
              readOnly
            />
          </div>
        </div>
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              สถานะ :
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
                <option value="">เลือกสถานะ</option>
                <option value="waiting">รอตรวจสอบ</option>
                <option value="confirmed">อนุมัติแล้ว</option>
                <option value="unapproved">ไม่อนุมัติ</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="Name"
              className="block text-sm font-medium text-gray-700"
            >
              จำนวนเงินทั้งหมด :
            </label>
            <input
              type="number"
              id="Amount"
              name="Amount"
              placeholder="เปอร์เซ็นส่วดลด"
              value={Amount}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 h-14"
              style={{ backgroundColor: "#f6f6f6" }}
              readOnly
            />
          </div>
        </div>
        <div className="p-2 h-auto">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-96 h-fit lg:ml-72 object-cover rounded-md"
            />
          )}
        </div>

        <div className="col-span-full mt-6 p-2  grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="submit"
            className="block w-full bg-[#3b3f44] hover:bg-[#000000] text-white font-bold py-3 px-4 rounded-full"
            onClick={() => Navigate(-1)}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
            onClick={(e) => handleSubmit(e, `/finance`)}
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFinance;

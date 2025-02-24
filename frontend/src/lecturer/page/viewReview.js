import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
import ax from "../../conf/ax";
// import { SearchIcon } from "@heroicons/react";
import Confirm from "../../admin/components/Image/confirm.png";
import Unapproved from "../../admin/components/Image/unapproved.png";
import Error from "../../admin/components/Image/404.png";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router";

const ReviewLecturer = () => {
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [review, setReview] = useState(null);
  const Navigate = useNavigate();

  const fetchReview = async () => {
    try {
      const response = await ax.get(
        `lecturer-reviews?filters[id][$eq]=${user.id}&&populate=*`
      );
      console.log(response.data.data);
      setReview(response.data.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl mt-11">
      {/* <div className="w-[1200px] mx-96 mt-11 p-8 ml-32"> */}
      <div className="mx-auto text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          รีวิวของคุณ
        </h2>
        {/* <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
          มีคอร์สรอยืนยันของ TechSphere ทั้งหมด {payments.length} คอร์ส
        </p> */}
      </div>

      <div className="space-y-4">
        {review ? (
          review.map((payment) => (
            <div
              key={payment.id}
              className={`relative group rounded-xl p-5 shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              {(payment.status_confirm === "confirmed" ||
                payment.status_confirm === "unapproved") && (
                <button
                  className="absolute top-2 right-2 z-30 bg-blue-800 hover:bg-blue-900 focus:ring-4 
                           focus:ring-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md 
                           transform transition-all focus:outline-none opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    Navigate(`/edit-finance/${payment.id}`, {
                      state: { Value: payment },
                    })
                  }
                >
                  <Edit className="mr-1" /> Edit
                </button>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">
                    หมายเลขการสั่งซื้อ : {payment.id}
                  </p>
                  {payment.users_purchase !== null ? (
                    <p className="font-medium">
                      ผู้ซื้อ : {payment.users_purchase.first_name}{" "}
                      {payment.users_purchase.last_name}
                    </p>
                  ) : (
                    "ผู้ซื้อ : ไม่มีชื่อ"
                  )}
                  <p className="font-medium">
                    Email :{" "}
                    {payment.users_purchase !== null
                      ? payment.users_purchase.email
                      : "ไม่มีอีเมล"}
                  </p>
                  <p className="text-sm text-gray-600">
                    เวลาการยืนยันชำระเงิน :{" "}
                    {new Date(payment.createdAt).toLocaleDateString("th-TH")}{" "}
                    {new Date(payment.createdAt).toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    คอร์สที่ซื้อ :{" "}
                    {payment.course_purchase
                      .map((course) =>
                        course.Name.length > 30
                          ? course.Name.slice(0, 30) + "..."
                          : course.Name
                      )
                      .join(", ")}
                  </p>
                </div>
                {payment.status_confirm === "confirmed" && (
                  // <div className="bg-green-700 text-white text-2xl px-3 py-1 rounded-full">
                  //   ยืนยันการชำระเงินแล้ว
                  // </div>
                  <img
                    src={Confirm}
                    className="px-3 py-1 rounded-full"
                    alt="Confirm"
                    style={{ width: "150px" }}
                  />
                )}
                {payment.status_confirm === "unapproved" && (
                  // <div className="bg-green-700 text-white text-2xl px-3 py-1 rounded-full">
                  //   ยืนยันการชำระเงินแล้ว
                  // </div>
                  <img
                    src={Unapproved}
                    className="px-3 py-1 rounded-full"
                    alt="Confirm"
                    style={{ width: "150px" }}
                  />
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg">
                  จำนวนเงินที่ต้องชำระ : {payment.amount} บาท
                </p>
                {/* {payment.status_confirm === "waiting" && (
                  <button>
                //     onClick={() => {
                //       openModal(payment.picture_purchase, payment);
                //     }}
                //     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                //   >
                    ตรวจสอบการชำระ
                  </button>
                )} */}
              </div>
            </div>
          ))
        ) : (
          <div className="mx-auto my-7 flex items-center justify-center">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl px-6 py-8 text-center">
              <p className="text-gray-700 text-2xl font-semibold">
                ไม่พบข้อมูลการเงินที่ค้นหา
              </p>
              <p className="text-gray-500 text-lg mt-2">
                กรุณาตรวจสอบคำค้นหาข้อมูลการเงิน
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewLecturer;

import { useEffect, useState } from "react";
import ax from "../../conf/ax";
// import { SearchIcon } from "@heroicons/react";
import Confirm from "../components/Image/confirm.png";
import Error from "../components/Image/404.png";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Edit, Search } from "@mui/icons-material";

const FinanceOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);
  const [open, setOpen] = useState(false);
  const [queryPayments, setQueryPayments] = useState("");
  const [currentData, setCurrentData] = useState(null);

  const openModal = (data) => {
    setCurrentData(data);
    console.log("Open modal...");
    setOpen(true);
  };

  const closeModal = () => {
    setCurrentData(null);
    console.log("Closing modal...");
    setOpen(false);
  };

  const handleSearch = () => {
    setSearchTerm(queryPayments);
  };
  const filteredPayments = queryPayments
    ? payments.filter(
        (payment) =>
          payment.users_purchase.first_name
            .toLowerCase()
            .includes(queryPayments.toLowerCase()) ||
          payment.users_purchase.last_name
            .toLowerCase()
            .includes(queryPayments.toLowerCase()) ||
          payment.status_confirm
            .toLowerCase()
            .includes(queryPayments.toLowerCase())
      )
    : payments;

  const fetchConfirmPurchase = async () => {
    try {
      const response = await ax.get("confirm-purchases?populate=*");
      console.log(response.data.data);
      setPayments(response.data.data);
    } catch (e) {
      console.log("error", e);
    }
  };

  useEffect(() => {
    fetchConfirmPurchase();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl mt-11">
      {/* <div className="w-[1200px] mx-96 mt-11 p-8 ml-32"> */}
      <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          การเงิน
        </h2>
        <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
          มีคอร์สรอยืนยันของ TechSphere ทั้งหมด {payments.length} คอร์ส
        </p>

        <div className="mb-1">
          {/* <h2 className="text-lg font-semibold mb-2">ตัวกรอง:</h2> */}
          <div className="flex justify-center items-center text-base">
            {`ค้นหา : `}
            <input
              title="ค้นหา"
              type="text"
              placeholder="ค้นหาโดยชื่อผู้ซื้อ"
              className="flex-1 bg-white h-10 w-max border-2  border-gray-300 rounded-lg px-2"
              value={queryPayments}
              onChange={(e) => setQueryPayments(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-3xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={`rounded-xl p-5 shadow-md transition-all duration-300 ${
              payment.status_confirm == "confirmed"
                ? "bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-300"
                : "bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">
                  หมายเลขการสั่งซื้อ : {payment.id}
                </p>
                <p className="font-medium">
                  ผู้ซื้อ : {payment.users_purchase.first_name}{" "}
                  {payment.users_purchase.last_name}
                </p>
                <p className="font-medium">
                  Email : {payment.users_purchase.email}
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
              {payment.status_confirm == "confirmed" && (
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
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm">
                จำนวนเงินที่ต้องชำระ : {payment.amount} บาท
              </p>
              {payment.status_confirm == "waiting" && (
                <button
                  onClick={() => {
                    openModal(payment.picture_purchase);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  ตรวจสอบการชำระ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                    <Edit aria-hidden="true" className="size-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      ยืนยันการชำระเงิน
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        โปรดตรวจสอบสลิปนี้กับเงินว่าได้เข้าในบัญชีของคุณหรือไม่
                        โปรดตรวจสอบให้แน่ใจก่อนทำการอนุมัติ?
                      </p>
                      <img
                        src={
                          currentData?.url
                            ? `http://localhost:1337${currentData.url}`
                            : Error
                        }
                        className="px-3 py-1 flex justify-center"
                        alt="Img"
                        style={{ width: "550px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="inline-flex w-max justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  อนุมัติ
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-max justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  ไม่อนุมัติ
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  ยกเลิก
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* </div> */}
    </div>
  );
};

export default FinanceOrder;

import { useContext, useEffect, useState } from "react";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth.context";
import { useCart } from "../../context/Cart.context";
import ax from "../../conf/ax";
import promptpay from "../components/static/promptpay2.png";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function BuyProduct() {
  const { state } = useContext(AuthContext);
  const { removeFromCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const promptPayNumber = "0922695522";
  const amount = location.state.total;

  const [qrCode, setQrCode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    if (!promptPayNumber || !amount) return;

    let formattedNumber = promptPayNumber;
    if (promptPayNumber.length === 10) {
      formattedNumber = promptPayNumber.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "$1-$2-$3"
      );
    } else if (promptPayNumber.length === 13) {
      formattedNumber = promptPayNumber.replace(
        /(\d{1})(\d{4})(\d{5})(\d{2})/,
        "$1-$2-$3-$4"
      );
    }

    const payload = generatePayload(formattedNumber, {
      amount: Number.parseFloat(amount),
    });
    const qrImage = await QRCode.toDataURL(payload, { width: 300 });
    setQrCode(qrImage);
  };

  const handleOpenModal = () => setOpenModal(!openModal);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setReceipt(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const courseIds = location.state.cartItems.map((item) => item.course_id);

  const handleConfirmPurchase = async () => {
    if (!courseIds) {
      console.error("Error: Course_id is missing");
      return;
    }
    if (!receipt) {
      console.error("Error: No receipt uploaded");
      return;
    }

    try {
      const files = new FormData();
      files.append("files", receipt);
      files.append(
        "name",
        `${state.username}_${location.state.cartItems[0].name}_receipt`
      );

      const receiptUpload = await ax.post("/upload", files, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const {
        data: [{ id, url }],
      } = receiptUpload;

      await ax.post("confirm-purchases?populate=*", {
        data: {
          users_purchase: state.user.id,
          email: state.email,
          amount: location.state.total,
          course_purchase: courseIds,
          promocode: location.state.promoId,
          picture_purchase: [{ id, url }],
        },
      });

      courseIds.forEach((courseId) => {
        if (courseId) {
          removeFromCart(courseId); // ตรวจสอบว่า courseId ถูกต้องก่อนลบ
        } else {
          console.error("Invalid courseId:", courseId);
        }
      });

      navigate("/payment-succeed");
    } catch (error) {
      console.error("Error:", error.response || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 ">
      <div className="max-w-md w-full space-y-3 bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <img src={promptpay} alt="PromptPay" className="mx-auto h-44" />

          <p className="my-2 text-ทก text-black">
            นาย ทนุธรรม ศุภผล 092-269-5522
          </p>
          <p className="mt-1 text-sm text-gray-600">
            สแกน QR Code เพื่อชำระเงิน
          </p>
          <div className="mt-1 h-px bg-gray-100"></div>
        </div>

        <div className="space-y-4">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex flex-col items-center">
              {qrCode && (
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <img
                    src={qrCode || "/placeholder.svg"}
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                </div>
              )}
              <p className="mt-3 text-xl font-bold text-gray-900">
                จำนวนที่ต้องชำระ: ฿{amount}
              </p>
              <a
                href={qrCode}
                download="promptpay_qr.png"
                className="my-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Download QR Code
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={handleOpenModal}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload Payment Receipt
            </button>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-30 bg-black/75 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center place-content-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 py-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Payment Receipt
              </h3>
              <input
                type="file"
                onChange={handleChange}
                className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {previewUrl && (
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Receipt preview"
                  className="max-h-80 mx-auto mb-4"
                />
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                {previewUrl ? (
                  <button
                    onClick={handleConfirmPurchase}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Confirm Purchase
                  </button>
                ) : (
                  <Tippy
                    content={<span>กรุณาใส่รูปถาพยืนยันการชำระเงิน</span>}
                    className="font-bold p-2 rounded-lg shadow-lg"
                  >
                    <div className="relative">
                      <button
                        title="Please upload an image first."
                        className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
                        disabled
                      >
                        Confirm Purchase
                      </button>
                    </div>
                  </Tippy>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

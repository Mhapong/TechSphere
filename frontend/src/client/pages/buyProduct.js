import { useContext, useEffect, useState } from "react";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ax from "../../conf/ax";
import { AuthContext } from "../../context/Auth.context";
import { useCart } from "../../context/Cart.context";

export default function BuyProduct() {
  const { state } = useContext(AuthContext);
  const { removeFromCart } = useCart();
  const location = useLocation();
  const promptPayNumber = "0922695522";
  const amount = location.state.total;
  const [courseId, setCourseId] = useState({});
  const [qrCode, setQrCode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [reciept, setReciept] = useState();
  console.log(location.state);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  function handleChange(e) {
    console.log(e.target.files);
    setReciept(URL.createObjectURL(e.target.files[0]));
    console.log(reciept);
  }

  console.log(state.user.id);

  const handleComfirmPurchease = async () => {
    try {
      if (!location.state?.course_id) {
        console.error("Error: course_id is missing");
        return;
      }

      const response = await ax.post("confirm-purchases?populate=*", {
        data: {
          users_purchase: [state.user.id],
          amount: location.total,
          course_purchase: location.state.course_id,
        },
      });
      location.state.course_id.forEach((id) => removeFromCart(id.id));
      console.log(response);
      navigate("/payment-succeed");
    } catch (err) {
      console.error("Error:", err.response || err.message);
    }
  };

  const generateQRCode = async () => {
    if (!promptPayNumber || !amount) return alert("โปรดป้อนข้อมูลให้ครบ!");
    if (parseFloat(amount) < 0)
      return alert("จำนวนเงินต้องมากกว่าหรือเท่ากับ 0 บาท!");

    let formattedNumber;
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
    } else {
      return alert("รหัสพร้อมเพย์ไม่ถูกต้อง!");
    }

    const payload = generatePayload(formattedNumber, {
      amount: parseFloat(amount),
    });
    const qrImage = await QRCode.toDataURL(payload, { width: 300 });
    setQrCode(qrImage);
  };

  useEffect(() => generateQRCode, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">
          จำนวนเงินที่ต้องชำระ: {location.state.total} ฿
        </h1>
        {qrCode && (
          <div className="mt-4 flex flex-col items-center">
            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            <a
              href={qrCode}
              download="promptpay_qr.png"
              className="mt-2 text-blue-500 underline"
            >
              ดาวน์โหลด QR Code
            </a>
          </div>
        )}
        <button
          data-dialog-target="modal"
          class=" mx-auto mt-6 center  rounded-md bg-slate-800 bg-green-800 text-white py-2 px-4 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
          onClick={handleOpenModal}
        >
          ส่งใบเสร็จโอนเงิน
        </button>
        <Dialog open={openModal} handler={handleOpenModal}>
          <DialogHeader>โปรดใส่รูปใบเสร็จ</DialogHeader>
          <DialogBody>
            <input type="file" onChange={handleChange} required />
            <img src={reciept} className="h-96 mx-auto" />
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpenModal}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              type="submit"
              onClick={handleComfirmPurchease}
            >
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
}

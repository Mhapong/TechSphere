import { useNavigate } from "react-router-dom";

export default function PaymentSucceed() {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate(`/`);
  }, 5000);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-0">
      <div className="w-full max-w-2xl p-4 bg-white shadow-2xl dark:bg-gray-900 sm:p-8 md:p-10 sm:rounded-3xl">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-green-100 rounded-full dark:bg-green-700">
            <svg
              className="h-8 w-8 sm:h-12 sm:w-12 text-green-600 dark:text-green-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-700 dark:text-green-400 mb-2">
            การชำระเงินสำเร็จ!
          </h1>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-800 dark:text-gray-300">
            ขอบคุณที่ใช้บริการของเรา
          </p>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-blue-600 dark:text-blue-400">
            คอร์สเรียนของคุณจะถูกแสดงหลังแอดมินยืนยัน
          </p>
          <div className="mt-4 sm:mt-6 text-sm text-gray-700 dark:text-gray-400">
            <p>
              หากมีคำถามหรือต้องการความช่วยเหลือเพิ่มเติม ติดต่อเราได้ที่:
              <br />
              <a
                href="mailto:admin@eliteai.tools"
                className="font-medium text-indigo-600 dark:text-indigo-400 underline break-words"
              >
                092-269-5522
              </a>
            </p>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center">
          <a
            href="/"
            className="inline-block px-5 py-2 sm:px-6 sm:py-2 text-sm sm:text-base md:text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600"
          >
            กลับสู่หน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
}

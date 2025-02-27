import { useEffect, useState } from "react";
import ax from "../../conf/ax";
import { Copy, CheckCircle, Calendar, Tag } from "lucide-react";

export default function NotificationPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const baseURL = "http://localhost:1337";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await ax.get("/promotions?populate=*");
      setPromotions(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load promotions. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const formatThaiDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", options);
  };

  return (
    <div className="container min-h-screen mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 font-noto">
        โปรโมชั่นทั้งหมด
      </h1>

      <div className="space-y-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-gradient-to-tr from-teal-500 to-blue-500 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* ส่วนภาพทางซ้าย */}
              <div className="md:w-1/3 relative">
                {promo.picture_promotion ? (
                  <img
                    src={`${baseURL}${promo.picture_promotion.url}`}
                    alt={promo.Code}
                    className="object-cover w-full h-48 md:h-full"
                  />
                ) : (
                  <div className="bg-gray-400 h-48 md:h-full flex items-center justify-center">
                    <span className="text-white text-sm">ไม่มีภาพประกอบ</span>
                  </div>
                )}
              </div>

              {/* ส่วนข้อมูลทางขวา */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  {/* ส่วนหัว */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-extrabold text-white">
                      ส่วนลด {promo.discount}%
                    </h3>
                    {promo.isPopular && (
                      <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm">
                        ยอดนิยม 🔥
                      </span>
                    )}
                  </div>

                  {/* รายละเอียด */}
                  <p className="text-white mb-4">
                    {promo.detail || "ใช้ได้กับบริการทั้งหมดในเว็บไซต์"}
                  </p>
                </div>

                {/* ส่วนคูปองและวันหมดอายุ */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="border-2 border-dashed border-emerald-500 px-4 py-2 rounded-lg">
                      <span className="font-mono font-bold text-white text-lg">
                        {promo.Code}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(promo.Code)} // แก้ไขการส่งพารามิเตอร์
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        copiedCode === promo.Code
                          ? "bg-green-100 text-green-700"
                          : "bg-white/70 hover:bg-white/90"
                      }`}
                    >
                      {copiedCode === promo.Code ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          คัดลอกแล้ว!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5 mr-2" />
                          คัดลอกรหัส
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center text-sm text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>ใช้ได้จนถึง {formatThaiDate(promo.end_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {promotions.length === 0 && (
        <div className="text-center py-12">
          <img
            src="/images/empty-promo.svg"
            className="w-48 mx-auto mb-4"
            alt="ไม่มีโปรโมชั่น"
          />
          <p className="text-gray-500 text-lg">ขณะนี้ยังไม่มีโปรโมชั่น</p>
        </div>
      )}
    </div>
  );
}

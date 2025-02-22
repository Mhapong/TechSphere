import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ax from "../../conf/ax";
import DownloadDoneOutlinedIcon from "@mui/icons-material/DownloadDoneOutlined";
import { Add } from "@mui/icons-material";

const PromotionAdminPage = () => {
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  const [queryPromotion, setQueryPromotion] = useState("");

  const filteredPromotions = queryPromotion
    ? promotions.filter((value) =>
        value.Code.toLowerCase().includes(queryPromotion.toLowerCase())
      )
    : promotions;

  useEffect(() => {
    // Fetch promotions from Strapi
    const fetchPromotions = async () => {
      try {
        const response = await ax.get("promotions?populate=*");
        console.log(response.data.data);
        setPromotions(response.data.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    // <div className="container mx-auto px-4 py-8 max-w-6xl mt-11 flex lg:justify-end">
    // <div className="w-[1200px] mx-96 mt-11 p-8 ml-80 px-4 max-w-screen-2xl lg:px-12">
    <div className="container mx-auto px-4 py-8 max-w-10xl mt-11 ml-72">
      <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          โปรโมชั่นทั้งหมด
        </h2>
        {/* <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            อาจารย์ผู้สอนทั้งหมดที่มีคุณภาพของ TechSphere ทั้งหมด{" "}
            {Lecturer.length} คน
          </p> */}
        <div className="flex justify-center items-center space-x-3 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <label htmlFor="search" className="text-gray-700 text-lg font-medium">
            ค้นหา :
          </label>
          <input
            id="search"
            title="ค้นหา"
            type="text"
            placeholder="ค้นหาโดยรหัสโปรโมชั่น"
            className="flex-1 bg-gray-100 focus:bg-white h-10 w-72 border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={queryPromotion}
            onChange={(e) => setQueryPromotion(e.target.value)}
          />
          <div>
            <button
              onClick={() => navigate(`/promotion/view`)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-200"
            >
              <Add className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full lg:max-w-10xl">
        {filteredPromotions.length > 0 ? (
          filteredPromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex mb-8"
            >
              <div className="flex-1 bg-white dark:bg-gray-800 px-6 py-8 lg:p-12">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                  {promotion.Code}
                </h3>
                <p className="mt-6 text-base text-gray-600 dark:text-gray-300">
                  {promotion.detail}
                </p>
                <div className="mt-8">
                  <div className="flex items-center">
                    <h4 className="flex-shrink-0 pr-4 bg-white dark:bg-gray-800 text-sm tracking-wider font-semibold uppercase text-rose-600">
                      สถานะโปรโมชั่น
                    </h4>
                    <div className="flex-1 border-t-2 border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <ul
                    role="list"
                    className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5"
                  >
                    <li className="flex items-start lg:col-span-1">
                      <div className="flex-shrink-0">
                        <DownloadDoneOutlinedIcon
                          aria-hidden="true"
                          className={`ml-1 flex items-center justify-center w-9 h-9 rounded-full 
                      ${
                        promotion.status_promotion === "Activate"
                          ? "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
                          : "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500"
                      } 
                      text-white transition-all duration-200`}
                        />
                      </div>
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        {promotion.status_promotion}
                      </p>
                    </li>

                    <li className="flex items-start lg:col-span-1">
                      <div className="flex-shrink-0">
                        <DownloadDoneOutlinedIcon
                          aria-hidden="true"
                          className={`ml-1 flex items-center justify-center w-9 h-9 rounded-full 
                      ${
                        new Date(promotion.end_date).getTime() <= Date.now()
                          ? "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500"
                          : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
                      } 
                      text-white transition-all duration-200`}
                        />
                      </div>
                      <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        {new Date(promotion.end_date).getTime() <= Date.now()
                          ? "โปรโมชั่นหมดอายุ"
                          : "โปรโมชั่นยังไม่หมดอายุ"}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="py-8 px-6 text-center bg-gradient-to-r from-purple-300 to-blue-400 dark:from-purple-700 dark:to-blue-800 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
                <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  เปอร์เซ็นต์การลด
                </p>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-900 dark:text-white">
                    {promotion.discount}
                  </span>
                  <span className="text-6xl font-bold text-gray-900 dark:text-white">
                    %
                  </span>
                </div>
                <div className="mt-6">
                  <div class="rounded-md shadow">
                    <a
                      onClick={() =>
                        navigate(`/promotion/view`, {
                          state: { Value: promotion },
                        })
                      }
                      class="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600"
                    >
                      แก้ไขโปรโมชั่นนี้
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-auto my-7 flex items-center justify-center">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl px-6 py-8 text-center">
              <p className="text-gray-700 text-2xl font-semibold">
                ไม่พบข้อมูลโปรโมชั่นที่ค้นหา
              </p>
              <p className="text-gray-500 text-lg mt-2">
                กรุณาตรวจสอบคำค้นหาหรือเพิ่มโปรโมชั่นใหม่
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionAdminPage;

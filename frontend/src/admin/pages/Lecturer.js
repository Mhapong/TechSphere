import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import usericon from "../components/Image/usertest.png";
import { Rating, Card, CardBody, Typography } from "@material-tailwind/react";

const LecturerAll = () => {
  const [Lecturer, setLecturer] = useState([]);

  useEffect(() => {
    // Fetch team values from Strapi
    const fetchLecturer = async () => {
      try {
        const response = await ax.get(
          "users?filters[role][name][$eq]=Lecturer&populate=*"
        );
        console.log(response.data);
        setLecturer(response.data);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchLecturer();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      {/* <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6"> */}
      <div className="w-[1200px] mx-96 mt-11 p-8 ml-80">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            อาจารย์ผู้สอน {Lecturer.length}
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            อาจารย์ผู้สอนทั้งหมดที่มีคุณภาพของ TechSphere ทั้งหมด{" "}
            {Lecturer.length} คน
          </p>
        </div>
        <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
          {Lecturer.map((value) => (
            <div
              key={value.id}
              className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700"
            >
              <a href="#">
                <img
                  className="w-52 rounded-lg sm:rounded-none sm:rounded-l-lg"
                  src={usericon}
                  alt={`${value.username} Avatar`}
                />
              </a>
              <div className="p-5">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">
                    {value.first_name} {value.last_name}
                  </a>
                </h3>
                <span className="text-gray-500 dark:text-gray-400">
                  {value.role.name}
                </span>
                <p className="mb-4 font-light text-gray-500 dark:text-gray-400">
                  จำนวนคอร์สที่มี : {value.owned_courses.length}
                </p>
                <p className="text-2xl lg:text-sm flex items-center justify-center lg:justify-start">
                  <span
                    className={`inline-block pt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                      value.background
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    สถานะ :{" "}
                    {value.background
                      ? "ใส่ประวัติของอาจารย์แล้ว"
                      : "ยังไม่ใส่ประวัติอาจารย์"}
                  </span>
                </p>
                <div key={value.id} className="flex items-center mt-2">
                  <div className="flex items-center gap-2 font-bold text-blue-gray-500">
                    <span>{4}</span>
                    {/* <Rating value={averageRating} readOnly /> */}
                    {/* {value.reduce((acc, curr) => acc + curr.rating.star, 0)} */}
                    <Rating value={4} readonly />
                    {/* <Typography color="blue-gray" className="font-medium text-blue-gray-500">
        Based on 134 Reviews
      </Typography> */}
                  </div>
                  <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    {value.rating.length} reviews
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LecturerAll;

import React, { useContext } from "react";
import { Button, } from "@mui/material";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Nav from "../components/navbar";
import { AuthContext } from "../../context/Auth.context";
import { motion } from 'framer-motion'
import datapic from "../components/data.png"
// import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
// import axios from "axios";

// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";


export default function Home() {
  const { state } = useContext(AuthContext);
  const category = [
    { name: "Web Develop" },
    { name: "Data Analysis", img: datapic },
    { name: "Hardware" },
    { name: "Networking" },
    { name: "Game Dev" },
    { name: "ดูทั้งหมด" }

  ]

  const sideleft = () => {
    var slider = document.getElementById('slider')


  }

  return (
    <html className="!scorll-smooth max-w-[100%]">
      <div className="grid grid-cols-2 gap-0 max- h-96">
        <div className="">

        </div>
        <div className="place-content-center">
          <div className="mx-32" >
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1, }}
              transition={{ duration: 1.5 }}>
              <p className="text-3xl font-bold">
                คอร์สเรียนออนไลน์
              </p>
              <p className="text-3xl font-bold">
                เพิ่มทักษะยุคดิจิทัล
              </p>
              <p className="text-xl">
                พร้อมเวิร์กชอปและ Bootcamp ที่จะช่วยอัปสกิล
                ให้คุณทำงานเก่งขึ้น!
              </p>
            </motion.div>
          </div>
        </div>
      </div >


      <section className="mx-60">
        {/* headerหมวดหมู่คอร์ส*/}
        <div >

          <span className="text-3xl font-bold self-center text-start ">
            เลือกเรียนตามเรื่องที่คุณสนใจ
          </span>
        </div>

        {/*หมวดหมู่คอร์ส*/}
        <div className="relative flex items-center">
          <div id="slider" className=" h-full w-full overflow-x-auto overflow-y-hidden scroll-y scroll my-7 scroll-smooth whitespace-nowrap gap-10 items-center place-content-center scrollbar-hide">
            {category.map((item) => (
              <motion.div
                initial={{ y: -30, opacity: 0, scale: 1.2 }}
                whileInView={{ y: 0, opacity: 1, scale: 1, duration: 0.5 }}
                whileHover={{ scale: 1.1, duration: 0 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block mx-4 h-60 "
              >

                <Card className="w-52 h-52 my-4 cursor-pointer z-50 flex flex-col shadow-lg ring-2 ring-black ring-" onClick={() => console.log("need more mana")}>
                  <CardBody className="flex-none h-32 justify-center self-center place-content-center">
                    <img src={item.img}>
                    </img>
                  </CardBody>
                  <CardBody className=" object-center place-items-center justify-items-center items-center">
                    <Typography className="text-black text-xl justify-center self-center  font-semibold">
                      {item.name}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* คอร์สยอดนิยม*/}
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
            <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
              <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <div className="h-screen">

      </div>
    </html >
  );
}

// import ButtonAppBar from "../admin/components/Navbar";

// export default function Home() {
//   return (
// }

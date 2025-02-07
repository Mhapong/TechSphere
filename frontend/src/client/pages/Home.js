import React, { useContext, useEffect } from "react";
import { Button, } from "@mui/material";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Nav from "../components/navbar";
import { AuthContext } from "../../context/Auth.context";
import { motion } from 'framer-motion'
import datapic from "../components/data.png"
import webpic from "../components/web-100.png"
import gamepic from "../components/game.png"
import hardwarepic from "../components/hardware.png"
import networkpic from "../components/network.png"
import morepic from "../components/more.png"
import homepic from "../components/home-page.png"
import ax from "../../conf/ax";
import { Image } from "@mui/icons-material";
// import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
// import axios from "axios";

// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";


export default function Home() {
  const { state } = useContext(AuthContext);
  const [courseData, setCourseData] = useState([]);
  const [category, setCategory] = useState([]);
  const categorys = [
    { name: "พัฒนาเว็ปไซต์", img: webpic },
    { name: "วิเคราะห์ข้อมูล", img: datapic },
    { name: "ฮาร์ดแวร์", img: hardwarepic },
    { name: "สร้างเครือข่าย", img: networkpic },
    { name: "การพัฒนาเกม", img: gamepic },
    { name: "ดูทั้งหมด", img: morepic }

  ]

  const fetchCourse = async () => {
    try {
      const response = await ax.get(
        "http://localhost:1337/api/courses?populate=*")
      console.log(response.data.data)
      setCourseData(response.data.data)
    } catch {
      console.log(Error);

    }
  }

  const fetchCategory = async () => {
    try {
      const response = await ax.get(
        "http://localhost:1337/api/categories?populate=*")
      setCategory(response.data.data)
      console.log(category)
    } catch {
      console.log(Error);

    }
  }

  useEffect(() => {
    fetchCourse();
    fetchCategory();
  }, []);

  const sideleft = () => {
    var slider = document.getElementById('slider')


  }

  return (
    <html className="!scorll-smooth max-w-[100%]">
      <div className="grid grid-cols-2 gap-0 max- h-[30rem]">
        <motion.div className="place-content-center ml-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          <img src={homepic}></img>
        </motion.div>
        <div className="place-content-center">
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
      </div >


      <section className="mx-60">
        {/* headerหมวดหมู่คอร์ส*/}
        <div className="mt-5">

          <span className="text-3xl font-bold self-center text-start ">
            เลือกเรียนตามเรื่องที่คุณสนใจ
          </span>
        </div>

        {/*หมวดหมู่คอร์ส*/}
        <div className="relative flex items-center">
          <div id="slider" className=" h-full w-full overflow-x-auto overflow-y-hidden scroll-y scroll my-7 scroll-smooth whitespace-nowrap gap-10 items-center place-content-center scrollbar-hide">
            {categorys.map((item) => (
              <motion.div
                initial={{ y: -30, opacity: 0, scale: 1.2 }}
                whileInView={{ y: 0, opacity: 1, scale: 1, duration: 0.7 }}
                whileHover={{ scale: 1.1, duration: 0 }}
                whileTap={{ scale: 0.95 }}
                exit={{ opacity: 0 }}
                className="inline-block mx-6 h-64 "
              >

                <Card className="w-52 h-52 my-4 cursor-pointer z-30 flex flex-col shadow-md shadow-blue-100 ring-2 ring-black ring-" onClick={() => console.log("need more mana")}>
                  <CardBody className="flex-none h-32 justify-center self-center place-content-center">
                    <img src={item.img}>
                    </img>
                  </CardBody>
                  <CardBody className=" object-center place-items-center justify-items-center items-center">
                    <Typography className="text-black text-xl justify-center self-center  font-medium">
                      {item.name}
                    </Typography>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* คอร์สยอดนิยม*/}
        <div>
          <h2 className="text-2xl">
            คอร์สเรียนยอดนิยม
          </h2>
        </div>
        <div div id="slider" className="flex h-[32rem] w-full overflow-x-auto overflow-y-hidden scroll-y scroll my-7 scroll-smooth whitespace-nowrap gap-10 items-center place-content-center scrollbar-hide">
          {courseData.map((items) => (
            <motion.div
              animate={{}}
              whileHover={{ scale: 1.1 }}
              class=" w-80 border border-blue-200 rounded-lg shadow-md p-4">
              {/* <!-- Discount Badge --> */}
              <div class="relative">
                <span
                  class="absolute top-2 left-2 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  -20%
                </span>
                {/* <!-- Wishlist Icon --> */}
                <button
                  class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
                {/* <!-- Product Image --> */}
                <div>
                  <Image
                    src="https://primecomputer.com.bd/wp-content/uploads/2024/07/oraimo-headphones.jpg"
                    alt="Product Image"
                    class="object-contain w-full h-[270px] fill"

                  />
                </div>
                {/* <!-- Quick Actions --> */}
                <div
                  class="absolute inset-x-0 bottom-4 flex justify-center space-x-2">
                  <button
                    class="bg-white px-3 py-1 text-sm text-gray-700 rounded-full shadow">
                    Quick View
                  </button>
                  <button
                    class="bg-white px-3 py-1 text-sm text-gray-700 rounded-full shadow">
                    Quick Order
                  </button>
                </div>
              </div>

              {/* <!-- Product Details --> */}
              <div class="mt-4">
                <p class="text-black text-lg font-semibold line-clamp-[calc(var(--characters)/20)] h-full w-full">
                  {items.Name}
                </p>
                {
                  items.course_owner !== null ? <p class="uppercase text-green-600 text-xs font-medium">
                    {items.course_owner.first_name} {items.course_owner.last_name}
                  </p>
                    :
                    <p class="uppercase text-green-600 text-xs font-medium">
                      ไม่มีผู้สอน
                    </p>
                }
                {/* <!-- Ratings --> */}
                <div class="flex space-x-1 text-orange-500 text-sm mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927C9.349 2.2 10.651 2.2 10.951 2.927l1.558 3.779 4.004.37c.85.079 1.194 1.139.572 1.724l-2.922 2.658.87 3.917c.181.816-.68 1.448-1.419 1.034L10 13.01l-3.614 1.96c-.74.414-1.6-.218-1.419-1.034l.87-3.917-2.922-2.658c-.622-.585-.278-1.645.572-1.724l4.004-.37L9.049 2.927z" />
                  </svg>
                </div>
                {/* <!-- Pricing --> */}
                <div class="flex items-end justify-between">
                  <div class="flex items-baseline space-x-2 mt-2">
                    <span class="text-blue-600 text-xl font-semibold">{items.Price} THB</span>
                    <span class="text-gray-400 text-sm line-through">{items.Price * 1.2} THB</span>
                  </div>
                  <button
                    class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                  </button>
                </div>
              </div>
            </motion.div>

            // <Card class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            //   <a href="#">
            //     <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
            //   </a>
            //   <div class="p-5">
            //     <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{items.Price}</h5>

            //     <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
            //     <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            //       Read more
            //       <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            //         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            //       </svg>
            //     </a>
            //   </div>
            // </Card>
          ))}
        </div>
      </section>
    </html >
  );
}

// import ButtonAppBar from "../admin/components/Navbar";

// export default function Home() {
//   return (
// }

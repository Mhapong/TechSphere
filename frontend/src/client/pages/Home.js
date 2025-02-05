import React from "react";
import { Button, } from "@mui/material";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Nav from "../components/navbar";
// import axios from "axios";

// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";


export default function Home() {

  const category = ["Programming", "DataBase", "Business"]

  return (
    <html className="!scorll-smooth">

      <div className="">

      </div>
      {/* <div className="bg-pink-800 z-0 h-96 w-screen">
        <Card className="ml-8 w-[45%] h-64 z-50 top-11 bg-white hover:-translate-y-[0.1] transition-all shadow-light-blue-800 shadow-md">
            <CardBody>
              <article class="prose lg:prose-xl">
                <h1 className="lg:text-5xl sm:text-3xl sm:my-0 lg:my-1 lg:ml-5 font-bold text-black">
                  <span className="text-pink-500">Future-proof</span> your career
                </h1>
                <p className=" sm:text-base lg:text-lg sm:my-3 lg:my-5 lg:ml-5 font-medium ">
                  Make your next career move with online courses from 200+ world-class universities and brands.
                </p>
                <button className="bg-pink-400 ml-5 rounded-lg w-36 h-12 text-white hover:bg-pink-700 font-bold"> Explore courses</button>
              </article>
            </CardBody>
          </Card>
      </div> */}
      <div className="flex flex-row bg-teal-700 w-screen h-96">
        <div>

        </div>
        <div>

        </div>
      </div>

      <div>
        <Card className="animate-rubber-band -top-12 h-36 mx-[25%] place-content-center">
          <span className="text-6xl font-bold self-center text-center">
            หมวดหมู่คอร์สเรียน
          </span>
        </Card>
      </div>

      <div className="flex flex-row flex-auto h-52 my-7 w-screen gap-10 items-center place-content-center">

        {category.map((item) => (

          <Card className="w-52 h-52">
            <CardBody className="justify-items-end place-content-end">
              <span>
                item
              </span>
            </CardBody>
          </Card>
        ))}


      </div>
    </html>
  );
}

// import ButtonAppBar from "../admin/components/Navbar";

// export default function Home() {
//   return (
// }

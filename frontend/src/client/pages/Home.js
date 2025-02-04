import React from "react";
import { Button, } from "@mui/material";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Nav from "../components/navbar";
// import axios from "axios";

// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";

export default function Home() {
  return (
    <div>
      <div>

        <div className="bg-pink-800 z-0 h-96 w-screen">
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
        </div>

        <div>
          <Card className="-top-8 h-24">
            <Typography>
              halo
            </Typography>
          </Card>
        </div>


      </div>
    </div>
  );
}

// import ButtonAppBar from "../admin/components/Navbar";

// export default function Home() {
//   return (
// }

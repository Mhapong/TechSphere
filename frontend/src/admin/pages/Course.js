import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import ReactMarkdown from "react-markdown";
import usericon from "../components/Image/usertest.png";
import { useNavigate } from "react-router";
import { Edit, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Image } from "@mui/icons-material";
import remarkGfm from "remark-gfm";
import CourseEx from "../components/Image/htmlcssJS.webp";
// import datapic from "../components/data.png";
// import webpic from "../components/web-100.png";
// import gamepic from "../components/game.png";
// import hardwarepic from "../components/hardware.png";
// import networkpic from "../components/network.png";
// import morepic from "../components/more.png";
// import homepic from "../components/home-page.png";

export function CourseView() {
  const [Course, setCourse] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch team values from Strapi
    const fetchCourse = async () => {
      try {
        const response = await ax.get("courses?populate=*");
        console.log(response.data.data);
        setCourse(response.data.data);
        console.log(
          "Type of Description:",
          typeof response.data.data[0].Description
        );
        console.log("Description:", response.data.data[0].Description);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchCourse();
  }, []);
  return (
    <div className="w-[1200px] mx-96 mt-11 p-8 ml-80 px-4 max-w-screen-2xl lg:px-12">
      <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          คอร์สเรียนทั้งหมด
        </h2>
        <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
          คอร์สเรียนทั้งหมดที่มีใน TechSphere ทั้งหมด {Course.length} คอร์ส
        </p>
      </div>
      {/* <div className="relative   items-center">
          <div
            id="slider"
            className=" h-full w-full my-7 grid grid-cols-3 gap-2 items-center place-content-center scrollbar-hide"
          > */}
      <div className="h-full w-full my-7 grid grid-cols-3 gap-10 items-stretch place-content-center scrollbar-hide">
        {Course.map((items) => (
          <div key={items.id} className="h-full">
            <Card className="w-auto max-w-[26rem] h-full shadow-lg flex flex-col">
              <CardHeader floated={false} color="blue-gray">
                <img src={CourseEx} alt="ui/ux review check" />
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
                {/* <IconButton
                  size="sm"
                  color="red"
                  variant="text"
                  className="!absolute top-4 right-4 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </IconButton> */}
              </CardHeader>

              <CardBody>
                <div className="mb-3 flex items-center justify-between">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {items.Name}
                  </Typography>
                  <Typography
                    color="blue-gray"
                    className="flex items-center gap-1.5 font-normal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="-mt-0.5 h-5 w-5 text-yellow-700"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                    5.0
                  </Typography>
                </div>
                <Typography color="gray">
                  {" "}
                  {items.Description && items.Description.length > 70
                    ? `${items.Description.slice(0, 70)}...`
                    : items.Description}
                </Typography>
                <div className="group mt-8 inline-flex flex-wrap items-center gap-3">
                  {items &&
                    items.categories.map((value) => (
                      <div
                        key={value.id}
                        className="inline-flex bg-gray-200 rounded-full px-3 py-0 text-sm font-semibold text-gray-700 mr-2 mb-2 mt-0 items-center"
                      >
                        {value.tag}
                        <Tooltip content={value.tag}>
                          <span className="cursor-pointer grid rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70 ml-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-5 w-5"
                            >
                              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                              <path
                                fillRule="evenodd"
                                d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                                clipRule="evenodd"
                              />
                              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                            </svg>
                          </span>
                        </Tooltip>
                      </div>
                    ))}
                </div>
              </CardBody>
              <CardFooter className="flex flex-col justify-between mt-auto pb-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      Navigate(`/create-summarize/${items.documentId}`);
                    }}
                    size="lg"
                    className="w-full"
                  >
                    ดูข้อมูลคอร์ส
                  </Button>
                  <Button
                    onClick={() => {
                      Navigate("/view-student", { state: { Value: items } });
                    }}
                    size="lg"
                    className="w-full"
                  >
                    ดูข้อมูลนักเรียน
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

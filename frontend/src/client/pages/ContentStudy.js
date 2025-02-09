import React, { useContext, useEffect } from "react";
import { Button } from "@mui/material";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Nav from "../components/navbar";
import { AuthContext } from "../../context/Auth.context";
import { motion } from "framer-motion";
import datapic from "../components/data.png";
import webpic from "../components/web-100.png";
import gamepic from "../components/game.png";
import hardwarepic from "../components/hardware.png";
import networkpic from "../components/network.png";
import morepic from "../components/more.png";
import homepic from "../components/home-page.png";
import ax from "../../conf/ax";
import { Image } from "@mui/icons-material";

export default function ContentStudy() {
  const { state } = useContext(AuthContext);
  const [contentData, setContentData] = useState([]);

  const fetchContent = async () => {
    try {
      const response = await ax.get(
        "http://localhost:1337/api/contents?populate=*"
      );
      console.log(response.data.data);
      setContentData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <html className="!scorll-smooth max-w-[100%]">
      {contentData.map((items) => (
        <div>
          <section>
            <iframe
              width="1120"
              height="630"
              src={items.yt_link}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <h1 className="text-black text-xl justify-center self-center  font-medium">
              {items.content_title}
            </h1>
            <p>{items.detail}</p>
          </section>
        </div>
      ))}
    </html>
  );
}

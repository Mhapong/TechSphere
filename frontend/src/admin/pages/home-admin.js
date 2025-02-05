import React from "react";
import { Button, Box, AppBar } from "@mui/material";
import { useState } from "react";
import Nav from "../../client/components/navbar";
import { StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_BASE_URL || "http://localhost:1337";

export default function Home_Admin() {
  return (
    <div className="bg-white">
      <Nav></Nav>
    </div>
  );
}

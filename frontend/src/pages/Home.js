import React from "react";
import { Button, Box, AppBar } from "@mui/material";
import { useState } from "react";
import Navbar from "../components/Navbar";
// import axios from "axios";

// axios.defaults.baseURL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:1337";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <div>
        <h1>Hello</h1>
        <Button variant="contained">Hello world</Button>
      </div>
    </div>
  );
}

// import ButtonAppBar from "../admin/components/Navbar";

// export default function Home() {
//   return (
// }

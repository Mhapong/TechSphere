import {
  Link,
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./context/Auth.context";

import Home from "./client/pages/Home";
import Login from "./client/pages/Login";
import SignUp from "./client/pages/SignUp";
import View from "./admin/pages/view";
import Cart from "./client/pages/Cart";
import { Navbar } from "@material-tailwind/react";
import Nav from "./client/components/navbar";

function App() {
  const { state } = useContext(AuthContext);
  console.log(state.user);

  if (!state.isLoggedIn)
    return (<>
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
    );
  else
    return (<>

      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/view" element={<View />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
    );
}

export default App;

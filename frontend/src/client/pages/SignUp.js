
import React from "react";
import { useState } from "react";
import Nav from "../components/navbar";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storeUser } from "../components/storeUser";
import toast from "react-hot-toast";


export default function SignUp(props) {
    const initialUser = { identifier: "", password: "" };
    const [errMsg, setErrMsg] = useState(null);
    const [user, setUser] = useState(initialUser);
    const navigate = useNavigate();

    const register = async (formData) => {
        try {
            const url = "http://localhost:1337/api/auth/local/register";
            if (formData) {
                const data = await axios.post(url, {
                    ...formData
                });
                console.log(data);
                if (data.jwt) {
                    storeUser(data)
                    toast.success('Logged in successfully!!')
                    setUser(initialUser);
                    props.SignupSuccess();
                    navigate('/login')
                    console.log(data)
                }
            }
        } catch (error) {
            console.log({ error })
            setErrMsg(error.message)
        } finally {

        }
    };

    return (
        <div>
            <div class="h-screen flex">
                <div class="hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center">
                    <div
                        class=" 
                  bg-black 
                  opacity-20 
                  inset-0 
                  z-0"
                    >

                    </div>
                    <div class="w-full mx-auto px-20 flex-col items-center space-y-6">
                        <h1 class="text-white font-bold text-4xl font-sans">TechSphere</h1>
                        <p class="text-white mt-1">Online learning for those who want to improve programming skill</p>
                        <div class="flex justify-center lg:justify-start mt-6">
                            <a href="/" class="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-indigo-800 mt-4 px-4 py-2 rounded-2xl font-bold mb-2">Get Started</a>
                        </div>
                    </div>
                </div>
                <div class="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
                    <div class="w-full px-8 md:px-32 lg:px-24">
                        <form class="bg-white rounded-md shadow-2xl p-5">
                            <h1 class="text-gray-800 font-bold text-2xl mb-1">Hello new user let's create your account</h1>
                            <p class="text-sm font-normal text-gray-600 mb-8">Welcome to our community</p>
                            <div class="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                                <input id="first_name" class=" focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:invalid:ring-red-800 focus:ring-3 pl-2 w-f focus:invalid:ring-red-800ull outline-none border-none" type="first_name" name="first_name" placeholder="First Name" required />
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <text stroke="grey" font-size="200">|</text>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                                <input id="last_name" class=" focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:invalid:ring-red-800 focus:ring-3 pl-2 w-f focus:invalid:ring-red-800ull outline-none border-none" type="last_name" name="last_name" placeholder="Last Name" required />
                            </div>
                            <div class="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <input id="email" class=" focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:invalid:ring-red-800 focus:ring-3 pl-2 w-f focus:invalid:ring-red-800ull outline-none border-none" type="email" name="email" placeholder="Email Address" required />
                            </div>
                            <div class="flex items-center border-2 mb-5 py-2 px-3 rounded-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4" strokeWidth="2"></circle>
                                </svg>
                                <input id="username" class=" focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:invalid:ring-red-800 focus:ring-3 pl-2 w-f focus:invalid:ring-red-800ull outline-none border-none" type="username" name="username" placeholder="Username" required />
                            </div>
                            <div class="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <input class="focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:invalid:ring-red-800 focus:ring-3 pl-2 w-f focus:invalid:ring-red-800ull outline-none border-none" type="password" name="password" id="password" placeholder="Password" required />

                            </div>
                            <button type="submit" class="block w-full bg-red-400 mt-5 py-2 rounded-2xl hover:bg-red-500 hover:text-white-100 hover:-translate-y-1 transition-all duration-500 text-white-100 font-semibold mb-2">Sign up</button>
                            <div class="flex justify-between mt-4">
                                <span class="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all"> </span>

                                <a href="/login" class="text-sm ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all">Already have an account?</a>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

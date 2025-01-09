import React from "react";
import { useState } from "react";
import Navibar from "../../components/navbar";

export default function Home() {
    return (

        <div>

            <body>
                <StickyNavbar />
                <h1 className="text-3xl font-bold underline">
                    Hello world!
                </h1>

            </body>
        </div>
    );
};

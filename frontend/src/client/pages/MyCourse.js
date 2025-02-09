import React from "react";
import { Card } from "@mui/material";
import Nav from "../components/navbar";

export default function MyCourse() {
    return (
        <div>
            <div className="container mx-auto mt-10 p-5">
                <h1 className="text-2xl font-bold mb-5">คอร์สที่เป็นเจ้าของ</h1>
                <Card sx={{ p: 3, boxShadow: 3 }}>
                    <p>เนื้อหาคอร์สจะถูกแสดงที่นี่</p>
                </Card>
            </div>
        </div>
    );
}
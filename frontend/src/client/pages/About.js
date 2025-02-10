import React from "react";
import techspherepic from "../components/logo.png";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8">
      {/* โลโก้ */}
      <div className="w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        <img
          className="object-cover object-center w-full h-96"
          src={techspherepic}
          alt="Techsphere"
        />
      </div>

      {/* ชื่อและคำอธิบาย */}
      <div className="text-center space-y-4">
        <p className="text-4xl font-bold text-gray-900">ศูนย์กลางการเรียนรู้ด้านเทคโนโลยี</p>
        <p className="text-3xl font-semibold text-blue-600">TechSphere</p>
      </div>

      {/* คำบรรยาย TechSphere */}
      <blockquote className="max-w-3xl text-lg leading-relaxed text-center text-gray-700">
        <p className="italic font-semibold">
          "TechSphere คือองค์กรที่มุ่งเน้นการเสริมสร้างความรู้และทักษะด้านเทคโนโลยีสมัยใหม่
          ผ่านการเรียนการสอนที่เข้มข้นและมีประสิทธิภาพ ไม่ว่าจะเป็นการพัฒนาซอฟต์แวร์ ปัญญาประดิษฐ์
          ความปลอดภัยทางไซเบอร์ หรือเทคโนโลยีอื่น ๆ ที่กำลังเปลี่ยนแปลงโลก
          เราเชื่อว่าการเรียนรู้เทคโนโลยีไม่ควรจำกัดอยู่แค่ในห้องเรียน แต่ควรเป็นประสบการณ์ที่สามารถนำไปใช้ได้จริงในชีวิตและอาชีพ
          ด้วยหลักสูตรที่ออกแบบโดยผู้เชี่ยวชาญและอัปเดตให้ทันสมัยอยู่เสมอ TechSphere เป็นศูนย์กลางแห่งการเรียนรู้ที่เปิดโอกาสให้ผู้เรียนทุกระดับ
          ไม่ว่าจะเป็นผู้เริ่มต้น นักพัฒนา หรือแม้แต่องค์กรที่ต้องการพัฒนาทักษะทีมงาน
          เราพร้อมพาคุณก้าวสู่อนาคตของเทคโนโลยีด้วยการเรียนรู้ที่มีประสิทธิภาพและสนุกสนาน"
        </p>
      </blockquote>
    </div>
  );
};

export default AboutPage;

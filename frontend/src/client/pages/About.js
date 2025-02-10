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
            <section class="bg-white dark:bg-gray-900">
                {/*ช่องที่ 1*/}
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
                    <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
                        <a href="#" class="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-blue-400 mb-2">
                            <svg class="w-4 h-4 me-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z" />
                            </svg>
                            All courses
                        </a>
                        <h1 class="text-gray-900 dark:text-white text-3xl md:text-4xl font-extrabold mb-2">เปลี่ยนตัวเองให้พร้อมสำหรับอนาคตดิจิทัล!</h1>
                        <p class="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">เพิ่มพูนทักษะดิจิทัลของคุณ และก้าวสู่อนาคตอย่างมั่นใจ.</p>
                        <a href="/explore" class="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                            เลือกคอร์สเรียน
                            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </a>
                    </div>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                            <a href="#" class="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 mb-2">
                                <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M17 11h-2.722L8 17.278a5.512 5.512 0 0 1-.9.722H17a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1ZM6 0H1a1 1 0 0 0-1 1v13.5a3.5 3.5 0 1 0 7 0V1a1 1 0 0 0-1-1ZM3.5 15.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM16.132 4.9 12.6 1.368a1 1 0 0 0-1.414 0L9 3.55v9.9l7.132-7.132a1 1 0 0 0 0-1.418Z" />
                                </svg>
                                Design
                            </a>
                            <h2 class="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">Start with Flowbite Design System</h2>
                            <p class="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.</p>
                            <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more
                                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12">
                            <a href="#" class="bg-purple-100 text-purple-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-purple-400 mb-2">
                                <svg class="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4 1 8l4 4m10-8 4 4-4 4M11 1 9 15" />
                                </svg>
                                Code
                            </a>
                            <h2 class="text-gray-900 dark:text-white text-3xl font-extrabold mb-2">Best react libraries around the web</h2>
                            <p class="text-lg font-normal text-gray-500 dark:text-gray-400 mb-4">Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.</p>
                            <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more
                                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;

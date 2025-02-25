import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPhone,
  FaLine,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#0A2A3A] text-gray-300 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold text-white">ติดตามข่าวสาร</h3>
          <p className="text-sm text-gray-400 mt-2">
            ไม่พลาดทุกข่าวสารด้านเทคโนโลยี
          </p>
          <div className="flex space-x-4 mt-4">
            <FaFacebook className="text-2xl hover:text-blue-400 cursor-pointer" />
            <FaTwitter className="text-2xl hover:text-blue-300 cursor-pointer" />
            <FaLinkedin className="text-2xl hover:text-blue-500 cursor-pointer" />
            <a href="https://github.com/Mhapong/TechSphere">
              <FaGithub
                className="text-2xl hover:text-gray-500 cursor-pointer"
                href="https://github.com/Mhapong/TechSphere/tree/main"
              />
            </a>
          </div>
        </div>

        {/* Learning Section */}
        <div>
          <h3 className="text-lg font-semibold text-white">เลือกเรียนรู้</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="hover:text-teal-400 cursor-pointer">
              🔥 คอร์สเรียนพรีเมียม
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              🎥 ความรู้ฟรีที่ YouTube
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              🏢 หลักสูตรสำหรับองค์กร
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold text-white">ช่วยเหลือ</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="hover:text-teal-400 cursor-pointer">
              ❓ คำถามที่พบบ่อย
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              🔐 นโยบายความเป็นส่วนตัว
            </li>
            <li className="hover:text-teal-400 cursor-pointer">
              💰 นโยบายการคืนเงิน
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-white">ติดต่อเรา</h3>
          <p className="text-sm text-gray-400 mt-2">
            สนใจข้อมูลเพิ่มเติม สามารถติดต่อได้ที่:
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center">
              <FaPhone className="mr-2" /> 092-269-5522
            </p>
            <p className="flex items-center">
              <FaLine className="mr-2" /> ID Line: @techsphere
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
        <p>© 2025 TechSphere - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;

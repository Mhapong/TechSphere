import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
// import { BarChart } from "@mui/x-charts/BarChart";
import { Line } from "react-chartjs-2";
import ax from "../../conf/ax";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeAdmin = () => {
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [Count, setCount] = useState(null);
  const [PurchaseAmount, setPurchaseAmount] = useState([]);
  const [PurchaseDay, setPurchaseDay] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await ax.get(`counts`);
        setCount(response.data.counts);
      } catch (e) {
        console.log("Error", e);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await ax.get(`confirm-purchases?populate=*`);
        const confirmedData = response.data.data
          .filter((item) => item.status_confirm === "confirmed")
          .map((item) => ({
            amount: item.amount,
            date: new Date(item.updatedAt).toLocaleDateString("th-TH"), // แปลงเป็น วัน/เดือน/ปี
          }));

        // แยกเป็นสองตัวแปร
        const amounts = confirmedData.map((item) => item.amount);
        const dates = confirmedData.map((item) => item.date);
        setPurchaseAmount(amounts);
        setPurchaseDay(dates);
      } catch (e) {
        console.log("Error", e);
      }
    };
    fetchPurchase();
  }, []);

  const data = {
    labels: PurchaseDay,
    datasets: [
      {
        label: "Income",
        data: PurchaseAmount,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(43, 63, 229, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Daily Income and Expenses",
      },
    },
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-indigo-50 min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <main className="w-[1200px] mx-96 mt-11 ml-80 pt-16 max-w-7xl p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Welcome Card */}
          <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl text-blue-900">
              Welcome to <br />
              <strong>DashBoard {user.userRole}</strong>
            </h2>
            <span className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-indigo-800">
              คุณ {user.first_name} {user.last_name}
            </span>
          </div>

          {/* Inbox Card */}
          <div className="flex-1 bg-blue-100 border border-blue-200 rounded-xl p-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl text-blue-900">
              ตรวจสอบสถานะการจ่ายเงิน <br />
              <strong>
                รอตรวจสอบ : {Count ? `${Count["confirm-purchase"]}` : "0"}
              </strong>
            </h2>
            <a
              href="/finance"
              className="inline-block mt-8 px-8 py-2 rounded-full text-xl font-bold text-white bg-blue-800 hover:bg-blue-900 transition-transform duration-300 hover:scale-105"
            >
              ไปที่หน้าตรวจสอบ
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-xl font-bold text-indigo-800">
              จำนวนคอร์สทั้งหมดของ TechSphere
            </h3>
            <p className="text-9xl md:text-7xl text-blue-900 mt-4 flex justify-center">
              <strong className="text-9xl">
                {Count ? `${Count.course}` : 0}
              </strong>
              <h3 className="flex items-end">คอร์ส</h3>
            </p>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-indigo-800">
              นักเรียนทั้งหมดของ TechSphere
            </h3>
            <p className="text-9xl md:text-7xl text-blue-900 mt-4 flex justify-center">
              <strong className="text-9xl">
                {Count ? `${Count.users.User}` : 0}
              </strong>
              <h3 className="flex items-end">คน</h3>
            </p>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-xl font-bold text-indigo-800">
              อาจารย์ผู้สอนทั้งหมดของ TechSphere
            </h3>
            <p className="text-9xl md:text-7xl text-blue-900 mt-4 flex justify-center">
              <strong className="text-9xl">
                {Count ? `${Count.users.Lecturer}` : 0}
              </strong>
              <h3 className="flex items-end">คน</h3>
            </p>
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in mt-5">
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-max transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="dataCard revenueCard">
              {/* <div className="w-full max-w-2xl h-[400px] sm:h-[300px] mx-auto bg-white p-4 rounded-2xl shadow-lg"> */}
              <Line data={data} options={options} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeAdmin;

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
// import { BarChart } from "@mui/x-charts/BarChart";
import ax from "../../conf/ax";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HomeLecturer = () => {
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [Count, setCount] = useState(null);
  const [PurchaseAmount, setPurchaseAmount] = useState([]);
  const [PurchaseDay, setPurchaseDay] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await ax.get(`/count-lecturer/${user.id}`);
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
            date: new Date(item.updatedAt).toLocaleDateString("th-TH"),
          }));

        const totalPerDay = {};
        confirmedData.forEach(({ amount, date }) => {
          if (totalPerDay[date]) {
            totalPerDay[date] += amount;
          } else {
            totalPerDay[date] = amount;
          }
        });

        const dates = Object.keys(totalPerDay);
        const amounts = Object.values(totalPerDay);

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
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return "rgba(75, 192, 192, 0.2)";

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(43, 63, 229, 0.5)");
          gradient.addColorStop(1, "rgba(43, 63, 229, 0)");

          return gradient;
        },
        borderColor: "rgba(43, 63, 229, 0.8)",
        borderWidth: 3,
        pointBackgroundColor: "rgba(43, 63, 229, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
        pointHoverBackgroundColor: "#ff6384",
        tension: 0.4, // ทำให้เส้นโค้งขึ้น
        fill: true, // ให้มีเงาใต้กราฟ
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Daily Income and Expenses",
        font: { size: 18, weight: "bold" },
        color: "#333",
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fff",
        borderWidth: 1,
        cornerRadius: 5,
      },
      legend: {
        display: true,
        labels: {
          color: "#333",
          font: { size: 14 },
          boxWidth: 20,
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        type: "category",
        ticks: {
          color: "#666",
          font: { size: 12 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#666",
          font: { size: 12 },
        },
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div className="bg-green-50 min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <main className="w-full lg:w-[1200px] mt-11 lg:ml-80 pt-16 max-w-7xl p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Welcome Card */}
          <div className="flex-1 bg-green-200 border border-green-300 rounded-xl p-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-green-900">
              Welcome to <br />
              <strong>Dashboard {user.userRole}</strong>
            </h2>
            <span className="inline-block mt-4 md:mt-8 px-4 md:px-8 py-2 rounded-full text-lg md:text-xl font-bold text-white bg-green-800">
              คุณ {user.first_name} {user.last_name}
            </span>
          </div>

          {/* Inbox Card */}
          <div className="flex-1 bg-green-100 border border-green-200 rounded-xl p-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl lg:text-3xl text-green-900">
              จำนวนคอร์สทั้งหมดของ <br />
              <strong>
                คุณ {user.first_name} {user.last_name} มี{" "}
                {Count ? `${Count.course}` : 0}
              </strong>
            </h2>
            <a
              href="/course"
              className="inline-block mt-4 md:mt-8 px-4 md:px-8 py-2 rounded-full text-lg md:text-xl font-bold text-white bg-green-800 hover:bg-green-900 transition-transform duration-300 hover:scale-105"
            >
              ไปที่หน้าตรวจสอบ
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-white rounded-xl shadow-lg p-4 md:p-6 h-auto md:h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-lg md:text-xl font-bold text-green-800">
              คอร์สทั้งหมดของ คุณ {user.first_name} {user.last_name}
            </h3>
            <div className="text-5xl md:text-7xl text-green-900 mt-4 flex flex-col md:flex-row items-center justify-center">
              <strong className="text-6xl md:text-9xl">
                {Count ? `${Count?.course}` : 0}
              </strong>
              <span className="text-xl md:text-2xl md:self-end md:mb-3">
                คอร์ส
              </span>
            </div>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-4 md:p-6 h-auto md:h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-lg md:text-xl font-bold text-green-800">
              รีวิวของคอร์สของคุณ {user.first_name} {user.last_name}
            </h3>
            <div className="text-5xl md:text-7xl text-green-900 mt-4 flex flex-col md:flex-row items-center justify-center">
              <strong className="text-6xl md:text-9xl">
                {Count ? `${Count?.review}` : 0}
              </strong>
              <span className="text-xl md:text-2xl md:self-end md:mb-3">
                คน
              </span>
            </div>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-4 md:p-6 h-auto md:h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-lg md:text-xl font-bold text-green-800">
              รีวิวทั้งหมดของ คุณ {user.first_name} {user.last_name}
            </h3>
            <div className="text-5xl md:text-7xl text-green-900 mt-4 flex flex-col md:flex-row items-center justify-center">
              <strong className="text-6xl md:text-9xl">
                {Count ? `${Count["lecturer-review"]}` : 0}
              </strong>
              <span className="text-xl md:text-2xl md:self-end md:mb-3">
                คน
              </span>
            </div>
          </div>
        </div>

        {/* <div className="bg-green-100 border border-green-200 rounded-xl p-4 md:p-6 animate-fade-in mt-5">
          <div
            className="bg-white rounded-xl shadow-lg p-4 md:p-6 h-auto transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="dataCard revenueCard">
              <ChartComponent data={data} options={options} />
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default HomeLecturer;

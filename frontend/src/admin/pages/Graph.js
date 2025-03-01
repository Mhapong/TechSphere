import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/Auth.context";
// import { BarChart } from "@mui/x-charts/BarChart";
import ax from "../../conf/ax";
import { Line, Doughnut } from "react-chartjs-2";
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

const GraphAdmin = () => {
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const [Count, setCount] = useState(null);
  const [PurchaseAmount, setPurchaseAmount] = useState([]);
  const [PurchaseDay, setPurchaseDay] = useState([]);
  const [reviewCount, setReviewCount] = useState(null);

  const fetchCount = async () => {
    try {
      const response = await ax.get(`counts`);
      setCount(response.data.counts);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const fetchReview = async () => {
    try {
      const response = await ax.get(`reviews?populate=*`);
      const starCount = response.data.data.reduce((acc, review) => {
        acc[review.star] = (acc[review.star] || 0) + 1;
        return acc;
      }, {});
      const reviewCount = [
        starCount[5] || 0,
        starCount[4] || 0,
        starCount[3] || 0,
        starCount[2] || 0,
        starCount[1] || 0,
      ];
      setReviewCount(reviewCount);
    } catch (e) {
      console.log("error", e);
    }
  };

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

  useEffect(() => {
    fetchCount();
    fetchReview();
  }, []);

  const dataPurchase = {
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

  const optionsPurchase = {
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

  const chartData = {
    labels: ["5 ดาว", "4 ดาว", "3 ดาว", "2 ดาว", "1 ดาว"], // Labels for the star ratings
    datasets: [
      {
        data: reviewCount, // ข้อมูลจำนวนรีวิวในแต่ละดาว (ที่คุณได้จากการคำนวณ starCount)
        backgroundColor: [
          "#4caf50",
          "#ffeb3b",
          "#ff9800",
          "#f44336",
          "#9e9e9e",
        ], // สีที่ใช้ในกราฟ
        hoverBackgroundColor: [
          "#388e3c",
          "#fbc02d",
          "#f57c00",
          "#d32f2f",
          "#616161",
        ], // สีเมื่อ hover
      },
    ],
  };

  const chartOptions = {
    responsive: true, // ให้กราฟตอบสนองตามขนาดของจอ
    plugins: {
      legend: {
        position: "top", // ตั้งตำแหน่งของ legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.raw + " รีวิว"; // เปลี่ยนข้อความใน tooltip
          },
        },
      },
    },
  };

  return (
    <div className="bg-indigo-50 min-h-screen overflow-x-hidden">
      {/* Main Content */}
      <main className="w-full lg:w-[1200px] mt-11 lg:ml-80 pt-16 max-w-7xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-48 sm:h-64 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-indigo-800">
              นักเรียนทั้งหมดของ TechSphere
            </h3>
            <p className="text-6xl sm:text-7xl lg:text-9xl text-blue-900 mt-2 sm:mt-4 flex justify-center">
              <strong>{Count ? `${Count.users.User}` : 0}</strong>
              <h3 className="flex items-end text-lg sm:text-7xl">คน</h3>
            </p>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-48 sm:h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* <Doughnut data={chartData} />; */}
          </div>
        </div>

        <div className="flex-1 bg-indigo-100 border border-indigo-200 rounded-xl p-6 animate-fade-in mt-5">
          <div
            className="bg-white rounded-xl shadow-lg p-6 h-max transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="dataCard revenueCard">
              <Line data={dataPurchase} options={optionsPurchase} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GraphAdmin;

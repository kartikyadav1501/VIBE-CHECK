import React, { useEffect, useState } from "react";
import { getAnalytics, getMonthlyTrend } from "./api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {
  const [stats, setStats] = useState({
    Concern: 0,
    Appreciation: 0,
    Suggestion: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAnalytics();
    setStats(res.data);

    try {
      const trend = await getMonthlyTrend();
      setMonthlyData(trend.data);
    } catch {}
  };

  const pieData = {
    labels: ["Concern", "Appreciation", "Suggestion"],
    datasets: [
      {
        data: [
          stats.Concern,
          stats.Appreciation,
          stats.Suggestion
        ],
      },
    ],
  };

  const barData = {
    labels: monthlyData.map((item) => `Month ${item.month}`),
    datasets: [
      {
        label: "Feedback Count",
        data: monthlyData.map((item) => item.count),
      },
    ],
  };

  return (
    <div>
      <h2>Campus Vibe Dashboard</h2>

      <div style={{ width: "60%", margin: "30px auto" }}>
        <Pie data={pieData} />
      </div>

      <div style={{ width: "60%", margin: "30px auto" }}>
        <Bar data={barData} />
      </div>
    </div>
  );
}

export default Dashboard;

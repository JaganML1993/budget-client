import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; // Import the Line component for rendering the chart

const Dashboard = () => {
  const [dailyTotals, setDailyTotals] = useState([]);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/dashboard/index`);
        setDailyTotals(response.data);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      }
    };

    fetchMonthlyData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Get the current date
  const currentDate = new Date();
  const currentDay = currentDate.getDate(); // Today's day of the month

  // Limit the labels and data to the current day
  const labels = Array.from({ length: currentDay }, (_, i) => i + 1); // Labels from 1 to today's date
  const data = dailyTotals.slice(0, currentDay); // Ensure data is only up to today's date

  const chartExample2 = {
    labels: labels, // Updated to use only the days up to today
    datasets: [
      {
        label: "Monthly Expenses",
        fill: true,
        backgroundColor: "rgba(29,140,248,0.2)",
        borderColor: "#1f8ef1",
        borderWidth: 2,
        data: data, // Use the truncated data for the chart
      },
    ],
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <Line data={chartExample2} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;

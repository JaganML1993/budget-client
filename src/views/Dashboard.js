import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from 'reactstrap';

const Dashboard = () => {
  const [dailyTotals, setDailyTotals] = useState([]);
  const [monthlyCategoryExpenses, setMonthlyCategoryExpenses] = useState([]);

  const categoryMap = {
    1: "House Expenses",
    2: "Shopping",
    3: "EMI",
    4: "Cash",
    5: "Others",
    6: "Bill Payment",
    7: "Savings",
  };

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error("No userId found in localStorage.");
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/dashboard/index`, {
          params: { userId }
        });

        setDailyTotals(response.data.dailyTotals);
        setMonthlyCategoryExpenses(response.data.monthlyCategoryExpenses);
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
    plugins: {
      datalabels: {
        display: true, // Always show data labels
        anchor: 'end', // Position the label at the end of the line
        align: 'end', // Align the label at the end of the line
        color: 'black',
        font: {
          weight: 'bold',
          size: 10,
        },
        formatter: (value) => `₹${value.toFixed(2)}`, // Display values with Rupee symbol
      },
    },
  };

  const chartData = {
    labels: Array.from({ length: dailyTotals.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Monthly Expenses",
        fill: true,
        backgroundColor: "rgba(29,140,248,0.2)",
        borderColor: "#1f8ef1",
        borderWidth: 2,
        data: dailyTotals.map(amount => parseFloat(amount)),
        tension: 0.4, // Set tension for a smooth curve
      },
    ],
  };

  // Define an array of colors for the bar chart
  const barColors = [
    'rgba(255, 99, 132, 0.6)', // Red
    'rgba(54, 162, 235, 0.6)', // Blue
    'rgba(255, 206, 86, 0.6)', // Yellow
    'rgba(75, 192, 192, 0.6)', // Green
    'rgba(153, 102, 255, 0.6)', // Purple
    'rgba(255, 159, 64, 0.6)', // Orange
    'rgba(255, 205, 86, 0.6)', // Light Yellow
  ];

  const barChartData = {
    labels: monthlyCategoryExpenses.map(expense => categoryMap[expense._id]),
    datasets: [
      {
        label: 'Expenses by Category',
        data: monthlyCategoryExpenses.map(expense => expense.totalAmount),
        backgroundColor: monthlyCategoryExpenses.map((_, index) => barColors[index % barColors.length]), // Assign colors
        borderColor: monthlyCategoryExpenses.map((_, index) => barColors[index % barColors.length].replace('0.6', '1')), // Assign border colors
        borderWidth: 1,
      },
    ],
  };

  // Calculate the most spent category
  const mostSpentCategory = monthlyCategoryExpenses.reduce((prev, current) => {
    return (prev.totalAmount > current.totalAmount) ? prev : current;
  }, { totalAmount: 0 });

  const mostSpentCategoryLabel = categoryMap[mostSpentCategory._id] || 'N/A'; // Default to 'N/A' if not found

  return (
    <div className="content">
      <Row>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Monthly Expenses Overview</h5>
              <CardTitle tag="h4">
                Total Monthly Spending - ₹{dailyTotals.reduce((a, b) => a + b, 0) || 0}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Spending by Category</h5>
              <CardTitle tag="h4">
                Most Spending Category: {mostSpentCategoryLabel} - ₹{mostSpentCategory.totalAmount || 0}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* ...Other Rows/Columns */}
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels'; // Import the plugin
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

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
      
      if (!userId) {
        console.error("No userId found in localStorage.");
        return;
      }

      try {
        // Send the userId in the API request as a query parameter
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/dashboard/index`, {
          params: { userId }  // Include userId in the request
        });

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
    plugins: {
      datalabels: {
        display: true, // Show labels
        color: 'black', // Label color
        align: 'top', // Position the label on top of the data point
        font: {
          weight: 'bold',
          size: 10, // Adjust the label font size
        },
        formatter: (value) => `$${value.toFixed(2)}`, // Format the label as currency (optional)
      },
    },
  };

  const chartData = {
    labels: Array.from({ length: dailyTotals.length }, (_, i) => i + 1), // Labels for each day of the month
    datasets: [
      {
        label: "Monthly Expenses",
        fill: true,
        backgroundColor: "rgba(29,140,248,0.2)",
        borderColor: "#1f8ef1",
        borderWidth: 2,
        data: dailyTotals.map(amount => parseFloat(amount)), // Ensure data is in number format
      },
    ],
  };

  return (
    <div className="content">
      <Row>
        <Col xs="12">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Monthly Expenses</h5>
              <CardTitle tag="h3">  
                <i className="tim-icons icon-bell-55 text-info" /> {dailyTotals.reduce((a, b) => a + b, 0) || 0} {/* Total Expenses */}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Line data={chartData} options={chartOptions} />
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

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
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';

const Dashboard = () => {
  const [dailyTotals, setDailyTotals] = useState([]);
  const [monthlyCategoryExpenses, setMonthlyCategoryExpenses] = useState([]);
  const [commitmentsData, setCommitmentsData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyTotals, setMonthlyTotals] = useState([]);

  const categoryMap = {
    1: "House Expenses",
    2: "Shopping",
    3: "EMI",
    4: "Cash",
    5: "Others",
    6: "Bill Payment",
    7: "Savings",
  };

  // Set default dates to the current month and fetch data
  const setDefaultDates = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDayOfMonth.toISOString().slice(0, 10)); // YYYY-MM-DD
    setEndDate(lastDayOfMonth.toISOString().slice(0, 10)); // YYYY-MM-DD
  };

  useEffect(() => {
    setDefaultDates();
    fetchMonthlyData(); // Fetch data on component mount
  }, []);

  const fetchMonthlyData = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("No userId found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/dashboard/index`, {
        params: { userId, startDate, endDate } // Include dates in the request
      });

      setDailyTotals(response.data.dailyTotals);
      setMonthlyCategoryExpenses(response.data.monthlyCategoryExpenses);
      setCommitmentsData(response.data.commitments);
      setMonthlyTotals(response.data.monthlyTotals); // Set monthly totals
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  // Call fetchMonthlyData only when the search button is clicked
  const handleSearch = () => {
    fetchMonthlyData();
  };

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
        display: true,
        anchor: 'end',
        align: 'end',
        color: 'black',
        font: {
          weight: 'bold',
          size: 10,
        },
        formatter: (value) => `₹${value.toFixed(2)}`,
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
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 0.5,
        data: dailyTotals.map(amount => parseFloat(amount)),
        tension: 0.4,
      },
    ],
  };

  const barColors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 205, 86, 0.6)',
  ];

  const barChartData = {
    labels: monthlyCategoryExpenses.map(expense => categoryMap[expense._id]),
    datasets: [
      {
        label: 'Expenses by Category',
        data: monthlyCategoryExpenses.map(expense => expense.totalAmount),
        backgroundColor: monthlyCategoryExpenses.map((_, index) => barColors[index % barColors.length]),
        borderColor: monthlyCategoryExpenses.map((_, index) => barColors[index % barColors.length].replace('0.6', '1')),
        borderWidth: 0,
      },
    ],
  };

  const mostSpentCategory = monthlyCategoryExpenses.reduce((prev, current) => {
    return (prev.totalAmount > current.totalAmount) ? prev : current;
  }, { totalAmount: 0 });

  const mostSpentCategoryLabel = categoryMap[mostSpentCategory._id] || '-';

  // Prepare stacked bar chart data from commitments
  const stackedBarChartData = {
    labels: commitmentsData.map(commitment => commitment.payFor),
    datasets: [
      {
        label: 'Total Paid',
        data: commitmentsData.map(commitment => commitment.totalPaid),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Total Pending',
        data: commitmentsData.map(commitment => commitment.totalPending),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const stackedBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  // Add a line chart for monthly total expenses
  const monthlyChartData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })), // Month names
    datasets: [
      {
        label: "Monthly Total Expenses",
        backgroundColor: monthlyTotals.map((_, index) => {
          const colors = [
            'rgba(29,140,248,0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(201, 203, 207, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ];
          return colors[index % colors.length];
        }),
        borderColor: monthlyTotals.map((_, index) => {
          const colors = [
            'rgba(29,140,248,1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 0,
        data: monthlyTotals.map(amount => parseFloat(amount)), // Monthly totals data
      },
    ],
  };

  return (
    <div className="content">
      {/* Date Range Filter Inline */}
      <Row>
        <Col lg="12">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Date Range Filter</h5>
              <div className="d-flex flex-wrap" style={{ alignItems: 'center' }}>
                <FormGroup className="mr-2 mb-2" style={{ flex: '1 0 30%' }}>
                  <Label for="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="mr-2 mb-2" style={{ flex: '1 0 30%' }}>
                  <Label for="endDate">End Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" size="sm" className='mt-3' onClick={handleSearch}>Search</Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      {/* Charts */}
      <Row>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Daily Expenses Overview</h5>
              <CardTitle tag="h4">
                Total Monthly Spending - ₹{(dailyTotals.reduce((a, b) => a + b, 0) || 0).toFixed(2)}
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
      <Row>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Commitments: Paid & Pending</h5>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <h5 className="card-category">Monthly Total Expenses</h5>
            </CardHeader>
            <CardBody>
              <div className="chart-area">
                <Bar data={monthlyChartData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

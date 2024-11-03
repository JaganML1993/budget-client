import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { FaSearch } from 'react-icons/fa';
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
  const [totalSavings, setTotalSavings] = useState([]);

  const categoryMap = {
    1: "House Expenses",
    2: "Shopping",
    3: "EMI",
    4: "Cash",
    5: "Others",
    6: "Bill Payment",
    7: "Savings",
  };

  const setDefaultDates = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setStartDate(firstDayOfMonth.toISOString().slice(0, 10));
    setEndDate(lastDayOfMonth.toISOString().slice(0, 10));
  };

  useEffect(() => {
    setDefaultDates();
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("No userId found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/dashboard/index`, {
        params: { userId, startDate, endDate }
      });

      setDailyTotals(response.data.dailyTotals);
      setMonthlyCategoryExpenses(response.data.monthlyCategoryExpenses);
      setCommitmentsData(response.data.commitments);
      setMonthlyTotals(response.data.monthlyTotals);
      setTotalSavings(response.data.totalSavings);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

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

  // Format in Indian Rupees
  const formatInRupees = (amount) => amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });

  // Area chart data for daily totals
  const areaChartData = {
    labels: Array.from({ length: dailyTotals.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Daily Expenses",
        fill: true,
        backgroundColor: "rgba(29,140,248,0.4)", // Gradient fill
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 0.5,
        data: dailyTotals.map(amount => parseFloat(amount)),
      },
    ],
  };

  const pieChartData = {
    labels: monthlyCategoryExpenses.map(expense => categoryMap[expense._id]),
    datasets: [
      {
        label: 'Expenses by Category',
        data: monthlyCategoryExpenses.map(expense => expense.totalAmount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
        borderColor: 'rgba(0, 0, 0, 0)', // Set border color to transparent
        borderWidth: 0, // Remove the border
      },
    ],
  };

  const mostSpentCategory = monthlyCategoryExpenses.reduce((prev, current) => {
    return (prev.totalAmount > current.totalAmount) ? prev : current;
  }, { totalAmount: 0 });

  const mostSpentCategoryLabel = categoryMap[mostSpentCategory._id] || '-';

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

  const monthlyChartData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' })),
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
        data: monthlyTotals.map(amount => parseFloat(amount)),
      },
    ],
  };

  const totalPaidAmountBefore = commitmentsData.reduce((total, commitment) => total + parseFloat(commitment.totalPaid), 0);
  const totalPendingAmountBefore = commitmentsData.reduce((total, commitment) => total + parseFloat(commitment.totalPending), 0);

  const totalPaidAmount = formatInRupees(totalPaidAmountBefore);
  const totalPendingAmount = formatInRupees(totalPendingAmountBefore);

  return (
    <div className="content">
      {/* Date Range Filter Inline */}
      <Row>
        <Col lg="8">
          <Card className="card-chart" style={{ height: '180px' }}>
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
                <Button color="primary" size="sm" className="mt-3" onClick={handleSearch}>
                  <FaSearch />
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>

        <Col lg="4">
          <Card className="card-chart text-center" style={{ height: '180px', backgroundColor: '#27293d', color: '#fff', borderRadius: '8px' }}>
            <CardHeader>
              <h5 className="card-category" style={{ fontSize: '1.0rem', fontWeight: '600', color: '#00f2c3' }}>Total Savings</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex justify-content-center align-items-center" style={{ fontSize: '2.0rem', fontWeight: 'bold', color: '#00f2c3' }}>
                {formatInRupees( totalSavings )}
              </div>
              <p style={{ color: '#9A9A9A', marginTop: '10px', fontSize: '0.9rem' }}>Overall savings</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Daily Expenses Overview</CardTitle>
              <h6 style={{ color: '#FFB3BA', fontWeight: 300 }}>
                Total Monthly Spending - <span style={{ color: '#00f2c3' }}>{formatInRupees(dailyTotals.reduce((a, b) => a + b, 0) || 0)}</span>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <Bar data={areaChartData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Spending by Category</CardTitle>
              <h6 style={{ color: '#FFB3BA', fontWeight: 300 }}>
                Most Spending Category: <span style={{ color: '#00f2c3' }}>{mostSpentCategoryLabel}</span> - <span style={{ color: '#00f2c3' }}>{formatInRupees(mostSpentCategory.totalAmount) || 0}</span>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <Doughnut data={pieChartData} options={chartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="6">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Commitments: Paid & Pending</CardTitle>
              <h6 style={{ color: '#FFB3BA', fontWeight: 300 }}>
                Total Paid: <span style={{ color: '#00f2c3' }}>{totalPaidAmount}</span>
                &nbsp;&nbsp;|&nbsp;&nbsp;
                Total Pending: <span style={{ color: '#00f2c3' }}>{totalPendingAmount}</span>
              </h6>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
                <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>

      </Row>
      <Row>
        <Col lg="12">
          <Card className="card-chart">
            <CardHeader>
              <CardTitle tag="h4">Monthly Total Expenses</CardTitle>
            </CardHeader>
            <CardBody>
              <div style={{ height: '300px' }}>
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
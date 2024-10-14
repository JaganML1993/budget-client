import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Input,
  Label,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"; // Import necessary components
import { useAuth } from "contexts/AuthContext";
import Loader from "components/Loader";
import { FaSyncAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Import the necessary icons

function Tables() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("thisMonth"); // Default to this month
  const { userId } = useAuth();

  // State for modal
  const [modal, setModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Toggle modal visibility
  const toggleModal = () => setModal(!modal);

  // Color mapping for each category
  const categoryBadgeMap = {
    1: "primary",  // House Expenses - blue
    2: "warning",  // Shopping - yellow
    3: "danger",   // EMI - red
    4: "info",     // Cash - light blue
    5: "secondary",// Others - gray
    6: "success",  // Bill Payment - green
    7: "success",  // Savings - green
  };
  // Mapping for category IDs to category names
  const categoryMap = {
    1: "House Expenses",
    2: "Shopping",
    3: "EMI",
    4: "Cash",
    5: "Others",
    6: "Bill Payment",
    7: "Savings",
  };

  // Function to format the date to d-m-y
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert string to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear(); // Get year
    return `${day}-${month}-${year}`; // Return formatted date
  };

  // Calculate the total amount spent
  const totalAmountSpent = expenses.reduce((total, expense) => {
    const amount = typeof expense.amount === 'object' ? parseFloat(expense.amount.$numberDecimal) : parseFloat(expense.amount);
    return total + (isNaN(amount) ? 0 : amount); // Ensure we add only valid numbers
  }, 0);

  // Effect to fetch expenses based on the selected filter
  useEffect(() => {
    const fetchExpenses = async () => {
      const params = {};
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Add date range logic here
      if (selectedFilter === "thisMonth") {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        params.startDate = firstDayOfMonth.toISOString().split("T")[0];
        params.endDate = lastDayOfMonth.toISOString().split("T")[0];
        setStartDate(params.startDate);
        setEndDate(params.endDate);
      } else if (selectedFilter === "lastMonth") {
        const today = new Date();
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        params.startDate = firstDayOfLastMonth.toISOString().split("T")[0];
        params.endDate = lastDayOfLastMonth.toISOString().split("T")[0];
        setStartDate(params.startDate);
        setEndDate(params.endDate);
      } else if (selectedFilter === "thisWeek") {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6));
        params.startDate = firstDayOfWeek.toISOString().split("T")[0];
        params.endDate = lastDayOfWeek.toISOString().split("T")[0];
        setStartDate(params.startDate);
        setEndDate(params.endDate);
      } else if (selectedFilter === "lastWeek") {
        const today = new Date();
        const firstDayOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        const lastDayOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 1));
        params.startDate = firstDayOfLastWeek.toISOString().split("T")[0];
        params.endDate = lastDayOfLastWeek.toISOString().split("T")[0];
        setStartDate(params.startDate);
        setEndDate(params.endDate);
      } else if (selectedFilter === "today") {
        const today = new Date();
        params.startDate = today.toISOString().split("T")[0];
        params.endDate = today.toISOString().split("T")[0];
        setStartDate(params.startDate);
        setEndDate(params.endDate);
      } else if (selectedFilter === "yesterday") {
        const today = new Date();
        const yesterday = new Date(today.setDate(today.getDate() - 1));
        params.startDate = yesterday.toISOString().split("T")[0];
        params.endDate = yesterday.toISOString().split("T")[0];
        setStartDate(params.startDate);
        setEndDate(params.endDate);
      }

      try {
        params.createdBy = userId;
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/expenses`, { params });
        setExpenses(response.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [category, selectedFilter, startDate, endDate, userId]); // Added startDate and endDate to the dependency array


  // Filter button handler
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  // Function to handle navigation to the View Expense page
  const goToViewExpense = (id) => {
    navigate(`/admin/expenses/view/${id}`);
  };

  // Function to handle navigation to the Edit Expense page
  const goToEditExpense = (id) => {
    navigate(`/admin/expenses/edit/${id}`);
  };

  // Function to handle navigation to the Update Balance page
  const goToUpdateBalance = (id) => {
    navigate(`/admin/expenses/history-update-balance/${id}`);
  };

  // Function to handle the delete button click
  const handleDeleteClick = (id) => {
    deleteExpense(id);
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/expenses/${id}`);
      // Remove the deleted expense from the state to update the UI
      setExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card className="card-plain">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4">Expenses</CardTitle>
                <Button className="btn-fill" color="primary" onClick={() => navigate("/admin/expenses/create")}>
                  Add
                </Button>
              </CardHeader>
              <CardBody>
                {/* Filtering form */}
                <Row className="mb-3">
                  <Col md="4">
                    <Label for="categorySelect">Filter by Category</Label>
                    <Input
                      type="select"
                      id="categorySelect"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="1">House Expenses</option>
                      <option value="2">Shopping</option>
                      <option value="3">EMI</option>
                      <option value="4">Cash</option>
                      <option value="5">Others</option>
                      <option value="6">Bill Payment</option>
                      <option value="7">Savings</option>
                    </Input>
                  </Col>
                  <Col md="4">
                    <Label for="startDate">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col md="4">
                    <Label for="endDate">End Date</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>

                {/* Time filter buttons */}
                <Row className="mb-3">
                  {["thisMonth", "lastMonth", "thisWeek", "lastWeek", "today", "yesterday"].map((filter) => (
                    <Col key={filter} md="2" className="mb-2">
                      <Button
                        color={selectedFilter === filter ? "primary" : "secondary"}
                        onClick={() => handleFilterClick(filter)}
                        style={{
                          width: "100%",
                          fontSize: "small", // Set smaller font size
                          padding: "5px 10px", // Set smaller padding
                        }}
                      >
                        {filter.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </Button>
                    </Col>
                  ))}
                </Row>

                {/* Display total amount spent below the title */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-left">
                    <span>Total Amount Spent:</span>
                    <span style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#ff8d72",
                      marginLeft: "5px"
                    }}>
                      ₹ {totalAmountSpent.toFixed(2)}
                    </span>
                  </h5>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th className="text-center">Amount</th>
                        <th>Category</th>
                        <th>Paid On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense, index) => (
                        <tr key={expense._id}>
                          <td>{index + 1}</td>
                          <td>{expense.name}</td>
                          <td className="text-center">
                            {typeof expense.amount === 'object'
                              ? parseFloat(expense.amount.$numberDecimal).toFixed(2)
                              : parseFloat(expense.amount)?.toFixed(2) || '0.00'} {/* Display '0.00' if NaN */}
                          </td>

                          <td>
                            <span className={`badge badge-${categoryBadgeMap[expense.category]}`}>
                              {categoryMap[expense.category] || 'Unknown'}
                            </span>
                          </td>
                          <td>{formatDate(expense.paidOn)}</td>
                          <td>
                            {/* View Button with Icon */}
                            <Button
                              color="success"
                              size="sm"
                              style={{ marginRight: '5px' }}
                              onClick={() => goToViewExpense(expense._id)}
                              id={`view-tooltip-${expense._id}`}
                              aria-label="View Expense"
                            >
                              <FaEye />
                            </Button>
                            <UncontrolledTooltip
                              placement="top"
                              target={`view-tooltip-${expense._id}`}
                            >
                              View Expense
                            </UncontrolledTooltip>

                            {/* Edit Button with Icon */}
                            <Button
                              color="info"
                              size="sm"
                              style={{ marginRight: '5px' }}
                              onClick={() => goToEditExpense(expense._id)}
                              id={`edit-tooltip-${expense._id}`}
                              aria-label="Edit Expense"
                            >
                              <FaEdit />
                            </Button>
                            <UncontrolledTooltip
                              placement="top"
                              target={`edit-tooltip-${expense._id}`}
                            >
                              Edit Expense
                            </UncontrolledTooltip>

                            {/* Delete Button with Icon */}
                            <Button
                              color="danger"
                              size="sm"
                              style={{ marginRight: '5px' }}
                              onClick={() => handleDeleteClick(expense._id)}
                              id={`delete-tooltip-${expense._id}`}
                              aria-label="Delete Expense"
                            >
                              <FaTrash />
                            </Button>

                            <UncontrolledTooltip
                              placement="top"
                              target={`delete-tooltip-${expense._id}`}
                            >
                              Delete Expense
                            </UncontrolledTooltip>

                            {/* Update Balance Button with Icon (Only for Savings Category) */}
                            {expense.category === 7 && (
                              <>
                                <Button
                                  color="info"
                                  size="sm"
                                  onClick={() => goToUpdateBalance(expense._id)}
                                  id={`update-balance-tooltip-${expense._id}`}
                                  aria-label="Update Balance"
                                >
                                  <FaSyncAlt />
                                </Button>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`update-balance-tooltip-${expense._id}`}
                                >
                                  Update Balance
                                </UncontrolledTooltip>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Tables;

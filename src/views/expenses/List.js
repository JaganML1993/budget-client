import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "reactstrap";
import { useAuth } from "contexts/AuthContext";
import Loader from "components/Loader";
import { FaSyncAlt, FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Tables() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { userId } = useAuth();
  const [totalAmountSpent, setTotalAmountSpent] = useState(0);
  const limit = 10;

  const categoryBadgeMap = {
    1: "primary",
    2: "warning",
    3: "danger",
    4: "info",
    5: "secondary",
    6: "warning",
    7: "success",
    8: "danger",
  };

  const categoryMap = {
    1: "House Expenses",
    2: "Shopping",
    3: "EMI",
    4: "Cash",
    5: "Others",
    6: "Bill Payment",
    7: "Savings",
    8: "Interest Paid",
  };

  const fetchExpenses = async () => {
    setLoading(true); // Set loading to true when fetching data
    const params = {
      page: currentPage,
      limit,
      createdBy: userId,
      ...(category && { category }),
      startDate,
      endDate,
    };

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/expenses`, { params });
      setExpenses(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalAmountSpent(response.data.totalAmountSpent);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses."); // Show toast on error
    } finally {
      setLoading(false); // Set loading to false when fetch completes
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category, startDate, endDate, userId, currentPage]);

  const goToViewExpense = (id) => {
    navigate(`/admin/expenses/view/${id}`);
  };

  const goToEditExpense = (id) => {
    navigate(`/admin/expenses/edit/${id}`);
  };

  const goToUpdateBalance = (id) => {
    navigate(`/admin/expenses/history-update-balance/${id}`);
  };

  const handleDeleteClick = (id) => {
    deleteExpense(id);
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/expenses/${id}`);
      setExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense."); // Show toast on error
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatInRupees = (amount) => amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });

  return (
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
                    <option value="8">Interest Paid</option>
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

              {/* Display total amount spent below the title */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-left">
                  <span>Total Amount Spent: </span>
                  <span className="text-success">{formatInRupees(totalAmountSpent)}</span>
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
                        <td>{(currentPage - 1) * limit + index + 1}</td> {/* Update index for pagination */}
                        <td>{expense.name}</td>
                        <td className="text-center">
                          {typeof expense.amount === 'object'
                            ? formatInRupees(parseFloat(expense.amount.$numberDecimal))
                            : formatInRupees(parseFloat(expense.amount)) || '0.00'}
                        </td>
                        <td>
                          <span className={`badge badge-${categoryBadgeMap[expense.category]}`}>
                            {categoryMap[expense.category]}
                          </span>
                        </td>
                        <td>{new Date(expense.paidOn).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}</td>

                        <td>
                          <Button color="info" size="sm" onClick={() => goToViewExpense(expense._id)}>
                            <FaEye />
                          </Button>
                          <Button color="warning" size="sm" onClick={() => goToEditExpense(expense._id)}>
                            <FaEdit />
                          </Button>
                          <Button color="danger" size="sm" onClick={() => handleDeleteClick(expense._id)}>
                            <FaTrash />
                          </Button>

                          {expense.category == "7" && (
                            <Button color="success" size="sm" onClick={() => goToUpdateBalance(expense._id)}>
                              <FaSyncAlt />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="w-100 d-flex justify-content-end">
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(1)} // Go to first page
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    <FaChevronLeft /><FaChevronLeft />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    <FaChevronLeft />
                  </Button>
                  <span className="mx-2 mt-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="me-2"
                  >
                    <FaChevronRight />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(totalPages)} // Go to last page
                    disabled={currentPage === totalPages}
                    className="me-2"
                  >
                    <FaChevronRight /><FaChevronRight />
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </div>
  );
}

export default Tables;

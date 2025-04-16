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
  const [totalAmountSaved, setTotalAmountSaved] = useState(0);
  const limit = 10;

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
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/house-savings`, { params });
      setExpenses(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalAmountSaved(response.data.totalAmountSaved);
    } catch (error) {
      toast.error("Failed to fetch house savings."); // Show toast on error
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

  const handleDeleteClick = (id) => {
    deleteExpense(id);
  };

  const deleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this house savings?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/expenses/${id}`);
      setExpenses((prevExpenses) => prevExpenses.filter(expense => expense._id !== id));
    } catch (error) {
      toast.error("Failed to delete house savings."); // Show toast on error
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card className="card-plain">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">House Savings</CardTitle>
              <Button className="btn-fill" color="primary" onClick={() => navigate("/admin/house-savings/create")}>
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
                    <option value="">All Saving Types</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Money Bank">Money Bank</option>
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
                  <span>Total Amount Saved: </span>
                  <span className="text-success">{totalAmountSaved}</span>
                </h5>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>#</th>
                      <th>Saving Type</th>
                      <th className="text-center">Amount</th>
                      <th>Created On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => (
                      <tr key={expense._id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td> {/* Update index for pagination */}
                        <td>{expense.saving_type?.toUpperCase()}</td>
                        <td className="text-center">
                          {typeof expense.amount === 'object' 
                            ? parseFloat(expense.amount.$numberDecimal)
                            : parseFloat(expense.amount) || '0.00'}
                        </td>
                        <td>{new Date(expense.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}</td>

                        <td>
                          <Button color="primary" size="sm" onClick={() => goToEditExpense(expense._id)}>
                            <FaEdit />
                          </Button>
                          <Button color="danger" size="sm" onClick={() => handleDeleteClick(expense._id)}>
                            <FaTrash />
                          </Button>
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

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "reactstrap";
import { useAuth } from "contexts/AuthContext";
import Loader from "components/Loader";
import { FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Tables() {
  const navigate = useNavigate();
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userId } = useAuth();
  const limit = 10;

  useEffect(() => {
    const fetchCommitments = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments`, {
          params: { limit, page: currentPage, createdBy: userId },
        });

        setCommitments(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching commitments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitments();
  }, [currentPage, userId]);

  const goToViewCommitment = (id) => {
    navigate(`/admin/commitments/view/${id}`);
  };

  const goToEditCommitment = (id) => {
    navigate(`/admin/commitments/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    deleteCommitment(id, userId);
  };

  const deleteCommitment = async (id, userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this commitment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments/${id}`, {
        data: { userId }
      });

      toast.success("Commitment deleted successfully!", {
        autoClose: 2000,
      });

      setCommitments((prevCommitments) =>
        prevCommitments.filter(commitment => commitment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting commitment:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete the commitment. Please try again.";
      toast.error(errorMessage || "Failed to update commitment.", { autoClose: 2000 });
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to convert numeric values to readable text
  const getPayType = (payType) => (payType === 1 ? "Expenses" : "Savings");
  const getCategory = (category) => (category === 1 ? "EMI" : "Full");
  const getStatus = (status) => (status === 1 ? "Ongoing" : "Completed");

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card className="card-plain">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Commitments</CardTitle>
              <Button
                className="btn-fill"
                color="primary"
                onClick={() => navigate("/admin/commitments/create")}
              >
                Add
              </Button>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Loader />
              ) : (
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>#</th>
                      <th>Pay For</th>
                      <th>Total EMI</th>
                      <th>Paid</th>
                      <th>Pending</th>
                      <th>EMI Amount</th>
                      <th>Paid Amount</th>
                      <th>Balance Amount</th>
                      <th>Pay Type</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commitments.map((commitment, index) => (
                      <tr key={commitment._id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>
                          <Link to={`/admin/commitments/history/${commitment._id}`}>
                            {commitment.payFor}
                          </Link>
                        </td>
                        <td>{commitment.totalEmi?.$numberDecimal || commitment.totalEmi}</td>
                        <td>{commitment.paid?.$numberDecimal || commitment.paid}</td>
                        <td>{commitment.pending?.$numberDecimal || commitment.pending}</td>
                        <td>₹ {commitment.emiAmount?.$numberDecimal || commitment.emiAmount}</td>
                        <td>₹ {commitment.paidAmount?.$numberDecimal || commitment.paidAmount}</td>
                        <td>₹ {commitment.balanceAmount?.$numberDecimal || commitment.balanceAmount}</td>
                        <td>{getPayType(commitment.payType)}</td>
                        <td>{getCategory(commitment.category)}</td>
                        <td>{getStatus(commitment.status)}</td>
                        <td>{commitment.dueDate}</td>
                        <td>
                          <Button color="info" size="sm" onClick={() => goToViewCommitment(commitment._id)}>
                            <FaEye />
                          </Button>
                          <Button color="warning" size="sm" onClick={() => goToEditCommitment(commitment._id)}>
                            <FaEdit />
                          </Button>
                          <Button color="danger" size="sm" onClick={() => handleDeleteClick(commitment._id)}>
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
                    <FaChevronLeft />
                    <FaChevronLeft />
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
                    className="ms-2"
                  >
                    <FaChevronRight />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handlePageChange(totalPages)} // Go to last page
                    disabled={currentPage === totalPages}
                    className="ms-2"
                  >
                    <FaChevronRight />
                    <FaChevronRight />
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

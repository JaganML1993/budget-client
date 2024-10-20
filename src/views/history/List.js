import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { FaEye, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";
import axios from "axios"; // Import axios

function Tables() {
  const navigate = useNavigate();
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of items per page
  const { commitmentId } = useParams();
  const [commitmentDetails, setCommitmentDetails] = useState(null);

  // Fetch commitment details
  useEffect(() => {
    const fetchCommitmentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments/view/${commitmentId}`);
        setCommitmentDetails(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch commitment details.", { autoClose: 2000 });
      }
    };

    fetchCommitmentDetails();
  }, [commitmentId]);

  // Fetch commitments dynamically from API
  useEffect(() => {
    const fetchCommitments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments/history/${commitmentId}`, {
          params: { page: currentPage, limit },
        });

        if (response.data && response.data.data) {
          const { data, totalPages } = response.data;
          setCommitments(data); // Update commitments state
          setTotalPages(totalPages); // Update total pages
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        console.error("Error fetching commitments:", error);
        toast.error("Failed to load commitments.", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    fetchCommitments();
  }, [currentPage, commitmentId]); // Moved here

  const goToViewCommitment = (id) => {
    navigate(`/admin/commitments/history/${id}`);
  };

  const goToEditCommitment = (id) => {
    navigate(`/admin/commitments/history/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this commitment?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments/history/${id}`); // Adjust endpoint as needed

      setCommitments((prevCommitments) =>
        prevCommitments.filter((commitment) => commitment._id !== id)
      );

      toast.success("Commitment deleted successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Failed to delete the commitment. Please try again.", { autoClose: 2000 });
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page); // Update current page
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card className="card-plain">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">
                Commitment Histories of {commitmentDetails && commitmentDetails.payFor}
              </CardTitle>

              <Button
                className="btn-fill"
                color="primary"
                onClick={() => navigate(`/admin/commitments/history/create/${commitmentId}`)}
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
                      <th>Amount Paid</th>
                      <th>EMI</th>
                      <th>Paid Date</th>
                      <th>Remarks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commitments.length > 0 ? (
                      commitments.map((commitment) => (
                        <tr key={commitment._id}>
                          <td>₹ {commitment.amount?.$numberDecimal || commitment.amount}</td>
                          <td>{commitment.currentEmi}</td>
                          <td>{new Date(commitment.paidDate).toLocaleDateString()}</td>
                          <td>
                            <Link to={`/admin/commitments/history/${commitment._id}`}>
                              {commitment.remarks || "-"}
                            </Link>
                          </td>
                          <td>
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => goToEditCommitment(commitment._id)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(commitment._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No commitments found.
                        </td>
                      </tr>
                    )}
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

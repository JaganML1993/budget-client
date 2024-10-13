// src/components/UpdateBalance.js
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loader from "components/Loader";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Table,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash  } from "react-icons/fa"; // Import Font Awesome Icons

function UpdateBalance() {
  const { id } = useParams(); // Expense ID
  const navigate = useNavigate();

  const [balanceData, setBalanceData] = useState({
    amount: "",
    remarks: "", // Initialize remarks as empty
    paidOn: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/expenses/list-update-balance/${id}`
        );
        const data = response.data.data;

        setBalanceData({
          amount: data.expense.amount,
          remarks: "", // Keep remarks empty on load
          paidOn: new Date(data.expense.paidOn).toISOString().split("T")[0],
        });
        setHistory(data.history);
      } catch (error) {
        toast.error("Failed to load expense details.", { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExpenseData();
    } else {
      toast.error("Invalid expense ID.", { autoClose: 2000 });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBalanceData({
      ...balanceData,
      [name]: value,
    });
  };

  const handleEditClick = (index) => {
    const record = history[index];
    let amount;
    if (typeof record.amount === 'object' && record.amount.$numberDecimal) {
      amount = record.amount.$numberDecimal;
    } else {
      amount = record.amount.toString();
    }

    setBalanceData({
      amount: amount,
      remarks: record.remarks,
      paidOn: new Date(record.paidOn).toISOString().split("T")[0],
    });
    setEditIndex(index); // Set edit index to indicate which record is being edited
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate amount
    const formattedAmount = parseFloat(balanceData.amount).toFixed(2);
    if (!formattedAmount || isNaN(formattedAmount)) {
      toast.error("Please enter a valid amount.", { autoClose: 2000 });
      return;
    }

    if (editIndex !== null) {
      // Update existing history record
      const historyRecordId = history[editIndex]._id;
      setLoading(true);

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/admin/expenses/update-history/${historyRecordId}`,
          {
            amount: formattedAmount,
            remarks: balanceData.remarks,
            paidOn: balanceData.paidOn,
          }
        );

        const updatedHistory = [...history];
        updatedHistory[editIndex] = {
          ...updatedHistory[editIndex],
          amount: formattedAmount,
          remarks: balanceData.remarks,
          paidOn: balanceData.paidOn,
          updatedAt: new Date().toISOString(),
        };

        setHistory(updatedHistory);
        toast.success(response.data.message || "Row updated successfully!", {
          autoClose: 2000,
        });

        // Reset for next entry
        setEditIndex(null);
        setBalanceData({
          amount: "",
          remarks: "",
          paidOn: new Date().toISOString().split("T")[0],
        });
      } catch (error) {
        if (error.response) {
          const data = error.response.data;
          if (data.errors && data.errors.length > 0) {
            data.errors.forEach((err) => {
              toast.error(err.msg, { autoClose: 2000 });
            });
          } else {
            toast.error(data.message || "Failed to update row.", {
              autoClose: 2000,
            });
          }
        } else {
          toast.error("An error occurred. Please try again.", {
            autoClose: 2000,
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Add new entry
      setLoading(true);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/admin/expenses/add-balance/${id}`,
          {
            amount: formattedAmount,
            remarks: balanceData.remarks,
            paidOn: balanceData.paidOn,
          }
        );

        // Add the new entry to the history
        const newRecord = {
          _id: response.data.data._id, // Assuming the response returns the new record's ID
          amount: formattedAmount,
          remarks: balanceData.remarks,
          paidOn: balanceData.paidOn,
          updatedAt: new Date().toISOString(),
        };

        setHistory((prevHistory) => [...prevHistory, newRecord]);
        toast.success("New balance added successfully!", { autoClose: 2000 });

        // Reset the form
        setBalanceData({
          amount: "",
          remarks: "",
          paidOn: new Date().toISOString().split("T")[0],
        });
      } catch (error) {
        if (error.response) {
          const data = error.response.data;
          if (data.errors && data.errors.length > 0) {
            data.errors.forEach((err) => {
              toast.error(err.msg, { autoClose: 2000 });
            });
          } else {
            toast.error(data.message || "Failed to add new row.", {
              autoClose: 2000,
            });
          }
        } else {
          toast.error("An error occurred. Please try again.", {
            autoClose: 2000,
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteClick = async (index) => {
    const historyRecordId = history[index]._id;

    if (window.confirm("Are you sure you want to delete this record?")) {
      setLoading(true);

      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/admin/expenses/delete-history/${historyRecordId}`
        );

        // Remove the deleted record from the history state
        const updatedHistory = history.filter((_, i) => i !== index);
        setHistory(updatedHistory);

        toast.success(response.data.message || "Record deleted successfully!", {
          autoClose: 2000,
        });
      } catch (error) {
        toast.error("Failed to delete the record. Please try again.", {
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    }
  };


  const handleBack = () => {
    navigate("/admin/expenses");
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Update Balance</h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Amount</label>
                        <Input
                          name="amount"
                          placeholder="Enter amount"
                          type="number"
                          step="0.01"
                          value={balanceData.amount}
                          onChange={handleChange}
                          disabled={loading} // Disable input when loading
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Remarks</label>
                        <Input
                          name="remarks"
                          placeholder="Enter remarks"
                          type="text"
                          value={balanceData.remarks}
                          onChange={handleChange}
                          disabled={loading} // Disable input when loading
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Paid On</label>
                        <Input
                          name="paidOn"
                          type="date"
                          value={balanceData.paidOn}
                          onChange={handleChange}
                          disabled={loading} // Disable input when loading
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <CardFooter>
                    <Button
                      className="mr-2"
                      color="secondary"
                      type="button"
                      onClick={handleBack}
                      disabled={loading} // Disable button when loading
                      size="sm" // Small button size
                    >
                      Back
                    </Button>
                    <Button
                      className="btn-fill"
                      color="primary"
                      type="submit" // Submit form for Add or Update
                      disabled={loading} // Disable button when loading
                      size="sm" // Small button size
                    >
                      {loading
                        ? "Saving..."
                        : editIndex !== null
                          ? "Update"
                          : "Add New"}
                    </Button>
                  </CardFooter>
                </Form>

                {/* Display Expense History */}
                <Card className="mt-4">
                  <CardHeader>
                    <h5 className="title">Expense History</h5>
                  </CardHeader>
                  <CardBody>
                    {loading ? (
                      <Loader />
                    ) : (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Remarks</th>
                            <th>Paid On</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.length > 0 ? (
                            history.map((record, index) => (
                              <tr key={record._id || index}>
                                <td>
                                  {typeof record.amount === "object" &&
                                    record.amount !== null
                                    ? record.amount.$numberDecimal
                                    : record.amount}
                                </td>
                                <td>{record.remarks}</td>
                                <td>
                                  {new Date(record.paidOn).toLocaleDateString()}
                                </td>
                                <td>
                                  <Button
                                    color="info"
                                    size="sm" // Small button size
                                    onClick={() => handleEditClick(index)}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteClick(index)} // Call delete handler
                                  >
                                    <FaTrash  />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No history available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </>
  );
}

export default UpdateBalance;

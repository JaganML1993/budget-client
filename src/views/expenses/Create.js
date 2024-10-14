import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import Axios

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
} from "reactstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

function CreateExpense() {
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState({
    name: "",
    amount: "",
    category: "1",
    paidOn: new Date().toISOString().split("T")[0], // Sets current date
    remarks: "", // Added remarks
    attachment: null, // For storing the selected file
  });

  const { userId } = useAuth();

  const [redirect, setRedirect] = useState(false); // State for redirecting

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({
      ...expenseData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setExpenseData({
      ...expenseData,
      attachment: file, // Store the file in state
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("name", expenseData.name);
    formData.append("amount", expenseData.amount);
    formData.append("category", expenseData.category);
    formData.append("paidOn", expenseData.paidOn);
    formData.append("remarks", expenseData.remarks);
    if (expenseData.attachment) {
      formData.append("attachment", expenseData.attachment);
    }

    formData.append("createdBy", userId);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/expense/store`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });

      const data = response.data; // Parse the response

      // Success - Show success toast
      toast.success(data.message || "Expense created successfully!", {
        autoClose: 2000, // Close after 2 seconds
      });

      // Clear the form fields after successful submission
      setExpenseData({
        name: "",
        amount: "",
        category: "1", // Default category
        paidOn: new Date().toISOString().split("T")[0],
        remarks: "",
        attachment: null,
      });

      setRedirect(true); // Set redirect state to true

    } catch (error) {
      // Error handling
      if (error.response) {
        const data = error.response.data;
        if (error.response.status === 400 && data.errors) {
          // Validation error - Show error messages from server
          data.errors.forEach((error) => {
            toast.error(error.msg, { autoClose: 2000 }); // Close after 2 seconds
          });
        } else {
          // General error handling for non-400 errors
          toast.error(data.message || "Failed to create expense.", { autoClose: 2000 }); // Close after 2 seconds
        }
      } else {
        // If an error occurs (e.g., network issues), catch it here
        toast.error("An error occurred. Please try again.", { autoClose: 2000 }); // Close after 2 seconds
      }
    }
  };

  // Redirect if redirect state is true
  if (redirect) {
    return <Navigate to="/admin/expenses" />;
  }

  const handleBack = () => {
    navigate("/admin/expenses"); // Navigate back to the expenses list
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Create Expense</h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Expense Name</label>
                        <Input
                          name="name"
                          placeholder="Enter expense name"
                          type="text"
                          value={expenseData.name}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Amount</label>
                        <Input
                          name="amount"
                          placeholder="Enter amount"
                          type="number"
                          value={expenseData.amount}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Category</label>
                        <Input
                          type="select"
                          name="category"
                          value={expenseData.category}
                          onChange={handleChange}
                        >
                          <option value="">Select a category</option>
                          <option value="1">House Expenses</option>
                          <option value="2">Shopping</option>
                          <option value="3">EMI</option>
                          <option value="6">Bill Payment</option>
                          <option value="4">Cash</option>
                          <option value="7">Savings</option>
                          <option value="5">Others</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>Paid On</label>
                        <Input
                          name="paidOn"
                          type="date"
                          value={expenseData.paidOn}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Remarks</label>
                        <Input
                          name="remarks"
                          placeholder="Enter remarks"
                          type="text"
                          value={expenseData.remarks}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Attachment</label>
                        <Input
                          name="attachment"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*" // Accepts image files only
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
                    >
                      Back
                    </Button>
                    <Button className="btn-fill" color="primary" type="submit">
                      Save
                    </Button>
                  </CardFooter>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <ToastContainer />
    </>
  );
}

export default CreateExpense;

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import Axios

// Reactstrap components
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
  Label,
} from "reactstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

function CreateCommitment() {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [commitmentData, setCommitmentData] = useState({
    payFor: "",
    totalEmi: "", // Keep as string initially
    emiAmount: "", // Keep as string initially
    payType: "1", // Default to Expenses
    category: "1", // Default to EMI
    remarks: "",
    attachment: null, // For storing selected files
    status: "1", // Default to Ongoing
  });

  const [redirect, setRedirect] = useState(false); // State for redirecting

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommitmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for React Quill (Remarks)
  const handleRemarksChange = (value) => {
    setCommitmentData((prevData) => ({
      ...prevData,
      remarks: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setCommitmentData((prevData) => ({
      ...prevData,
      attachment: file, // Store the file in state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("payFor", commitmentData.payFor);
    formData.append("totalEmi", parseInt(commitmentData.totalEmi)); // Convert to integer
    formData.append("emiAmount", parseFloat(commitmentData.emiAmount)); // Convert to float
    formData.append("payType", parseInt(commitmentData.payType)); // Convert to integer
    formData.append("category", parseInt(commitmentData.category)); // Convert to integer
    formData.append("remarks", commitmentData.remarks); // HTML content
    formData.append("status", parseInt(commitmentData.status)); // Convert to integer
    formData.append("createdBy", userId);

    // Append attachment if present
    if (commitmentData.attachment) {
      formData.append("attachment", commitmentData.attachment);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/commitments/store`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      // Success - Show success toast
      toast.success(data.message || "Commitment created successfully!", {
        autoClose: 2000, // Close after 2 seconds
      });

      // Clear the form fields after successful submission
      setCommitmentData({
        payFor: "",
        totalEmi: "", // Keep as string initially
        emiAmount: "", // Keep as string initially
        payType: "1", // Default to Expenses
        category: "1", // Default to EMI
        remarks: "",
        attachment: null, // For storing selected files
        status: "1", // Default to Ongoing

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
    return <Navigate to="/admin/commitments" />;
  }

  const handleBack = () => {
    navigate("/admin/commitments"); // Navigate back to the commitments list
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="10" lg="8" xl="6">
            <Card>
              <CardHeader>
                <h5 className="title">Create Commitment</h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  {/* Pay For */}
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="payFor">Pay For</Label>
                        <Input
                          id="payFor"
                          name="payFor"
                          placeholder="Enter purpose of payment"
                          type="text"
                          value={commitmentData.payFor}
                          onChange={handleChange}
                          required // Optional: Add required if necessary
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Total EMI and EMI Amount */}
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="totalEmi">Total EMI</Label>
                        <Input
                          id="totalEmi"
                          name="totalEmi"
                          placeholder="Enter total EMIs"
                          type="number"
                          value={commitmentData.totalEmi}
                          onChange={handleChange}
                          min="1"
                          required // Optional: Add required if necessary
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <Label for="emiAmount">EMI Amount</Label>
                        <Input
                          id="emiAmount"
                          name="emiAmount"
                          placeholder="Enter EMI amount"
                          type="number"
                          value={commitmentData.emiAmount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          required // Optional: Add required if necessary
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Pay Type and Category */}
                  <Row>
                    {/* Pay Type */}
                    <Col md="6">
                      <FormGroup>
                        <Label for="payType">Pay Type</Label>
                        <Input
                          type="select"
                          name="payType"
                          id="payType"
                          value={commitmentData.payType}
                          onChange={handleChange}
                        >
                          <option value="1">Expenses</option>
                          <option value="2">Savings</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Category */}
                    <Col md="6">
                      <FormGroup>
                        <Label for="category">Category</Label>
                        <Input
                          type="select"
                          name="category"
                          id="category"
                          value={commitmentData.category}
                          onChange={handleChange}
                        >
                          <option value="1">EMI</option>
                          <option value="2">Full</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Remarks with Rich Text Editor */}
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="remarks">Remarks</Label>
                        <Input
                          type="textarea"
                          id="remarks"
                          name="remarks"
                          value={commitmentData.remarks}
                          onChange={handleChange}
                          rows="5" // Adjust the number of rows as needed
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Attachment */}
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="attachment">Attachment</Label>
                        <Input
                          name="attachment"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*" // Accepts image files only
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* Status */}
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label for="status">Status</Label>
                        <Input
                          type="select"
                          name="status"
                          id="status"
                          value={commitmentData.status}
                          onChange={handleChange}
                        >
                          <option value="1">Ongoing</option>
                          <option value="2">Completed</option>
                        </Input>
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
                      Create
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

export default CreateCommitment;

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
import { useNavigate, useParams } from "react-router-dom";

function CreateCommitment() {
  const navigate = useNavigate();
  const { commitmentId } = useParams();

  const [commitmentData, setCommitmentData] = useState({
    commitmentId: commitmentId,
    amount: "",
    currentEmi: "",
    paidDate: new Date().toISOString().split("T")[0],
    remarks: "",
    attachment: null,
  });

  const [commitmentDetails, setCommitmentDetails] = useState(null);
  const [redirect, setRedirect] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommitmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCommitmentData((prevData) => ({
      ...prevData,
      attachment: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!commitmentData.amount || !commitmentData.currentEmi || !commitmentData.paidDate) {
      toast.error("Please fill in all required fields.", { autoClose: 2000 });
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("commitmentId", commitmentData.commitmentId);
    formData.append("amount", commitmentData.amount.toString()); // String format
    formData.append("currentEmi", commitmentData.currentEmi.toString()); // String format
    formData.append("paidDate", commitmentData.paidDate);
    formData.append("remarks", commitmentData.remarks);

    if (commitmentData.attachment) {
      formData.append("attachment", commitmentData.attachment);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/commitments/history/store`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      toast.success(data.message || "Commitment history created successfully!", {
        autoClose: 2000,
      });

      // Reset form data
      setCommitmentData({
        commitmentId: commitmentId,
        amount: "",
        currentEmi: "",
        paidDate: new Date().toISOString().split("T")[0],
        remarks: "",
        attachment: null,
      });

      setRedirect(true);

    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        if (error.response.status === 400 && data.errors) {
          data.errors.forEach((error) => {
            toast.error(error.msg, { autoClose: 2000 });
          });
        } else {
          toast.error(data.message || "Failed to create commitment history.", { autoClose: 2000 });
        }
      } else {
        toast.error("An error occurred. Please try again.", { autoClose: 2000 });
      }
    }
  };

  if (redirect) {
    navigate(-1);
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="10" lg="8" xl="6">
            <Card>
              <CardHeader>
                <h5 className="title">Create Commitment History for</h5>
                {commitmentDetails && (
                  <h3 style={{ color: "#2980b9" }}>{commitmentDetails.payFor}</h3>
                )}
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Input
                          id="amount"
                          name="amount"
                          placeholder="Enter Amount"
                          type="number"
                          value={commitmentData.amount}
                          onChange={handleChange}
                          step="0.01"
                          required // Make this field required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="currentEmi">Current EMI</Label>
                        <Input
                          id="currentEmi"
                          name="currentEmi"
                          placeholder="Enter Current EMI"
                          type="number"
                          value={commitmentData.currentEmi}
                          onChange={handleChange}
                          required // Make this field required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="paidDate">Paid Date</Label>
                        <Input
                          id="paidDate"
                          name="paidDate"
                          type="date"
                          value={commitmentData.paidDate}
                          onChange={handleChange}
                          required // Make this field required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="remarks">Remarks</Label>
                        <Input
                          id="remarks"
                          name="remarks"
                          placeholder="Enter remarks"
                          type="textarea"
                          value={commitmentData.remarks}
                          onChange={handleChange}
                          rows="3"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Label for="attachment">Attachment</Label>
                        <Input
                          name="attachment"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
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

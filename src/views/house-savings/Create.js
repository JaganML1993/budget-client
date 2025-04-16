import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

function CreateSaving() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [savingData, setSavingData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    saving_type: "bank_transfer",
    remarks: "",
  });
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...savingData,
      createdBy: userId,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/house-savings/store`,
        payload
      );
      toast.success(
        response.data.message || "Saving entry created successfully!",
        { autoClose: 2000 }
      );
      setSavingData({
        amount: "",
        date: new Date().toISOString().split("T")[0],
        saving_type: "bank_transfer",
        remarks: "",
      });
      setRedirect(true);
    } catch (error) {
      const data = error.response?.data;
      if (error.response?.status === 400 && data?.errors) {
        data.errors.forEach((err) => {
          toast.error(err.msg, { autoClose: 2000 });
        });
      } else {
        toast.error(data?.message || "Failed to create saving entry.", {
          autoClose: 2000,
        });
      }
    }
  };

  if (redirect) {
    return <Navigate to="/admin/house-savings" />;
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add House Savings</h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Amount</label>
                        <Input
                          type="number"
                          name="amount"
                          placeholder="Enter amount"
                          value={savingData.amount}
                          onChange={(e) =>
                            setSavingData({
                              ...savingData,
                              amount: e.target.value,
                            })
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Date</label>
                        <Input
                          type="date"
                          name="date"
                          value={savingData.date}
                          onChange={(e) =>
                            setSavingData({
                              ...savingData,
                              date: e.target.value,
                            })
                          }
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Saving Type</label>
                        <div className="d-flex gap-4">
                          {["bank transfer", "cash", "money bank"].map(
                            (type) => (
                              <FormGroup check key={type}>
                                <Label check>
                                  <Input
                                    type="radio"
                                    name="saving_type"
                                    value={type}
                                    checked={savingData.saving_type === type}
                                    onChange={(e) =>
                                      setSavingData({
                                        ...savingData,
                                        saving_type: e.target.value,
                                      })
                                    }
                                  />
                                  {type.toUpperCase()}
                                </Label>
                              </FormGroup>
                            )
                          )}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Remarks</label>
                        <Input
                          type="text"
                          name="remarks"
                          placeholder="Enter remarks"
                          value={savingData.remarks}
                          onChange={(e) =>
                            setSavingData({
                              ...savingData,
                              remarks: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <CardFooter>
                    <Button
                      color="secondary"
                      onClick={() => navigate("/admin/house-savings")}
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

export default CreateSaving;

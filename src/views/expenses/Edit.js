import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import {
  FaHome,
  FaShoppingCart,
  FaMoneyBillWave,
  FaWallet,
  FaPiggyBank,
  FaTags,
  FaCreditCard,
  FaHandHoldingUsd,
} from "react-icons/fa";
import axios from "axios";
import { Navigate, useParams, useNavigate } from "react-router-dom";

function EditExpense() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expenseData, setExpenseData] = useState({
    name: "",
    amount: "",
    category: "1",
    paidOn: new Date().toISOString().split("T")[0],
    remarks: "",
    attachment: null,
  });
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/expenses/edit/${id}`
        );
        setExpenseData({
          name: response.data.data.name,
          amount: Number(response.data.data.amount.$numberDecimal),
          category: String(response.data.data.category),
          paidOn: response.data.data.paidOn.split("T")[0],
          remarks: response.data.data.remarks,
          attachment: null,
        });
      } catch (error) {
        toast.error("Failed to fetch expense data.", { autoClose: 2000 });
      }
    };
    fetchExpenseData();
  }, [id]);

  const handleCategoryChange = (category) => {
    setExpenseData({ ...expenseData, category });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", expenseData.name);
    formData.append("amount", expenseData.amount);
    formData.append("category", expenseData.category);
    formData.append("paidOn", expenseData.paidOn);
    formData.append("remarks", expenseData.remarks);
    if (expenseData.attachment) {
      formData.append("attachment", expenseData.attachment);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/expenses/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.message || "Expense updated successfully!", {
        autoClose: 2000,
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
          toast.error(data.message || "Failed to update expense.", {
            autoClose: 2000,
          });
        }
      } else {
        toast.error("An error occurred. Please try again.", {
          autoClose: 2000,
        });
      }
    }
  };

  if (redirect) {
    return <Navigate to="/admin/expenses" />;
  }

  const categories = [
    { value: "1", label: "House Expenses", icon: <FaHome /> },
    { value: "2", label: "Shopping", icon: <FaShoppingCart /> },
    { value: "3", label: "EMI", icon: <FaCreditCard /> },
    { value: "4", label: "Cash", icon: <FaWallet /> },
    { value: "5", label: "Others", icon: <FaTags /> },
    { value: "6", label: "Bill Payment", icon: <FaMoneyBillWave /> },
    { value: "7", label: "Savings", icon: <FaPiggyBank /> },
    { value: "8", label: "Interest Paid", icon: <FaHandHoldingUsd /> },
  ];

  const handleBack = () => navigate("/admin/expenses");

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Expense</h5>
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
                          onChange={(e) =>
                            setExpenseData({ ...expenseData, name: e.target.value })
                          }
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
                          onChange={(e) =>
                            setExpenseData({ ...expenseData, amount: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Category</label>
                        <div className="d-flex flex-wrap">
                          {categories.map((cat) => (
                            <Button
                              key={cat.value}
                              className={`m-2 ${expenseData.category === cat.value
                                ? "btn-primary"
                                : "btn-outline-secondary"
                                }`}
                              onClick={() => handleCategoryChange(cat.value)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "5px",
                                width: "80px",
                              }}
                            >
                              {cat.icon}
                              <span
                                className="mt-2"
                                style={{ fontSize: "0.65rem", fontWeight: "300" }}
                              >
                                {cat.label}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Paid On</label>
                        <Input
                          name="paidOn"
                          type="date"
                          value={expenseData.paidOn}
                          onChange={(e) =>
                            setExpenseData({ ...expenseData, paidOn: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Remarks</label>
                        <Input
                          name="remarks"
                          placeholder="Enter remarks"
                          type="text"
                          value={expenseData.remarks}
                          onChange={(e) =>
                            setExpenseData({ ...expenseData, remarks: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <CardFooter>
                    <Button color="secondary" onClick={handleBack}>
                      Back
                    </Button>
                    <Button className="btn-fill" color="primary" type="submit">
                      Update
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

export default EditExpense;

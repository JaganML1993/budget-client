import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import Axios

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Row,
    Col,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify"; // Import Toast for notifications
import "react-toastify/dist/ReactToastify.css";

function ViewExpense() {
    const { id } = useParams(); // Get the expense ID from the URL
    const [expenseData, setExpenseData] = useState({
        name: "",
        amount: "",
        category: "",
        paidOn: "",
        attachment: "", // Use single string for one attachment
    });
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error handling

    // Category mapping
    const categoryMapping = {
        "1": "House Expenses",
        "2": "Shopping",
        "3": "EMI",
        "6": "Bill Payment",
        "5": "Transferred To",
        "4": "Cash",
    };

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/expenses/view/${id}`);

                if (response.data && response.data.data) {
                    const expense = response.data.data;
                    const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`; // Ensure this is correct

                    setExpenseData({
                        name: expense.name,
                        amount: expense.amount?.$numberDecimal || expense.amount,
                        category: expense.category,
                        paidOn: new Date(expense.paidOn).toLocaleDateString("en-GB"),
                        attachment: `${BASE_URL}/${expense.attachment.replace(/\\/g, '/')}`, // Format path correctly
                    });
                } else {
                    throw new Error("No expense data found");
                }
            } catch (error) {
                setError(error.message || "Failed to fetch expense data");
                toast.error("Failed to fetch expense data.", { autoClose: 2000 });
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id]);

    // Show a loading message while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show an error message if fetching failed
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="8">
                        <Card>
                            <CardHeader>
                                <h5 className="title">View Expense</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Name</label>
                                            <p className="form-control-static">{expenseData.name}</p>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Amount</label>
                                            <p className="form-control-static">{expenseData.amount}</p>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Category</label>
                                            <p className="form-control-static">
                                                {categoryMapping[expenseData.category] || "Unknown Category"}
                                            </p>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Paid On</label>
                                            <p className="form-control-static">{expenseData.paidOn}</p>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {expenseData.attachment && ( // Display attachment if exists
                                    <Row>
                                        <Col md="12">
                                            <FormGroup>
                                                <label>Attachment</label>
                                                <div>
                                                    <img
                                                        src={expenseData.attachment}
                                                        alt="Expense Attachment"
                                                        style={{ maxWidth: "100%", height: "auto" }} // Responsive image
                                                    />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                )}
                            </CardBody>
                            <CardBody>
                                <Button className="btn-fill" color="primary" onClick={() => window.history.back()}>
                                    Back
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
            <ToastContainer /> {/* Toast for notifications */}
        </>
    );
}

export default ViewExpense;

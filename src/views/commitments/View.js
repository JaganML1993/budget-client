import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import Axios
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";

function ViewCommitment() {
    const { id } = useParams(); // Get the commitment ID from the URL
    const [commitmentData, setCommitmentData] = useState({
        payFor: "",
        totalEmi: "",
        paid: "",
        pending: "",
        emiAmount: "",
        paidAmount: "",
        balanceAmount: "",
        payType: "",
        category: "",
        remarks: "",
        attachment: [],
        createdBy: "",
        status: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const payTypeMapping = {
        1: "Expenses",
        2: "Savings",
    };

    const categoryMapping = {
        1: "EMI",
        2: "Full",
    };

    const statusMapping = {
        1: "Ongoing",
        2: "Completed",
    };

    useEffect(() => {
        const fetchCommitment = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments/view/${id}`);

                if (response.data && response.data.data) {
                    const commitment = response.data.data;
                    const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;

                    setCommitmentData({
                        payFor: commitment.payFor,
                        totalEmi: commitment.totalEmi,
                        paid: commitment.paid?.$numberDecimal || commitment.paid,
                        pending: commitment.pending?.$numberDecimal || commitment.pending,
                        emiAmount: commitment.emiAmount?.$numberDecimal || commitment.emiAmount,
                        paidAmount: commitment.paidAmount?.$numberDecimal || commitment.paidAmount,
                        balanceAmount: commitment.balanceAmount?.$numberDecimal || commitment.balanceAmount,
                        payType: commitment.payType,
                        category: commitment.category,
                        remarks: commitment.remarks || "",
                        attachment: commitment.attachment?.map((file) => `${BASE_URL}/${file.replace(/\\/g, '/')}`),
                        createdBy: commitment.createdBy,
                        status: commitment.status,
                    });
                } else {
                    throw new Error("No commitment data found");
                }
            } catch (error) {
                setError(error.message || "Failed to fetch commitment data");
                toast.error("Failed to fetch commitment data.", { autoClose: 2000 });
            } finally {
                setLoading(false);
            }
        };

        fetchCommitment();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

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
                                <h5 className="title">View Commitment</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Pay For</label>
                                            <p className="form-control-static" style={{ color: "#3498db" }}>{commitmentData.payFor}</p> {/* Blue Color */}
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Total EMI</label>
                                            <p className="form-control-static" style={{ color: "#e74c3c" }}>{commitmentData.totalEmi}</p> {/* Red Color */}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Paid Amount</label>
                                            <p className="form-control-static" style={{ color: "#27ae60" }}>{commitmentData.paid}</p> {/* Green Color */}
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Pending Amount</label>
                                            <p className="form-control-static" style={{ color: "#f39c12" }}>{commitmentData.pending}</p> {/* Orange Color */}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>EMI Amount</label>
                                            <p className="form-control-static" style={{ color: "#9b59b6" }}>{commitmentData.emiAmount}</p> {/* Purple Color */}
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Balance Amount</label>
                                            <p className="form-control-static" style={{ color: "#2980b9" }}>{commitmentData.balanceAmount}</p> {/* Blue Color */}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Pay Type</label>
                                            <p className="form-control-static" style={{ color: "#8e44ad" }}>
                                                {payTypeMapping[commitmentData.payType] || "Unknown Pay Type"}
                                            </p> {/* Purple Color */}
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Category</label>
                                            <p className="form-control-static" style={{ color: "#c0392b" }}>
                                                {categoryMapping[commitmentData.category] || "Unknown Category"}
                                            </p> {/* Red Color */}
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>
                                            <label>Status</label>
                                            <p className="form-control-static" style={{ color: "#2ecc71" }}>
                                                {statusMapping[commitmentData.status] || "Unknown Status"}
                                            </p> {/* Green Color */}
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <FormGroup>
                                            <label>Remarks</label>
                                            <p className="form-control-static" style={{ color: "#2980b9" }}>{commitmentData.remarks}</p> {/* Blue Color */}
                                        </FormGroup>
                                    </Col>

                                </Row>
                                {commitmentData.attachment.length > 0 && ( // Display attachment if exists
                                    <Row>
                                        <Col md="12">
                                            <FormGroup>
                                                <label>Attachments</label>
                                                <div>
                                                    {commitmentData.attachment.map((file, index) => (
                                                        <img
                                                            key={index}
                                                            src={file}
                                                            alt={`Attachment ${index + 1}`}
                                                            style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }} // Responsive image
                                                        />
                                                    ))}
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

export default ViewCommitment;

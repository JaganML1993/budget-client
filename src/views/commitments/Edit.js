import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardHeader, CardBody, CardFooter, FormGroup, Form, Input, Row, Col, Label } from "reactstrap";
import { useAuth } from "contexts/AuthContext";
import Loader from "components/Loader";

function EditCommitment() {
    const { id } = useParams(); // Get the commitment ID from the URL
    const navigate = useNavigate();
    const { userId } = useAuth();

    const [commitmentData, setCommitmentData] = useState({
        payFor: "",
        totalEmi: "",
        emiAmount: "",
        payType: "1",
        category: "1",
        remarks: "",
        attachment: null,
        status: "1",
    });

    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchCommitment = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/commitments/view/${id}`);
                const commitment = response.data.data;

                setCommitmentData({
                    payFor: commitment.payFor,
                    totalEmi: commitment.totalEmi.toString(),
                    emiAmount: commitment.emiAmount.$numberDecimal,
                    payType: commitment.payType.toString(),
                    category: commitment.category.toString(),
                    remarks: commitment.remarks || "",
                    attachment: commitment.attachment ? commitment.attachment[0] : null,
                    status: commitment.status.toString(),
                });
            } catch (error) {
                setError(error.message || "Failed to load commitment.");
                toast.error("Failed to load commitment.", { autoClose: 2000 });
            } finally {
                setLoading(false);
            }
        };

        fetchCommitment();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommitmentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRemarksChange = (value) => {
        setCommitmentData((prevData) => ({
            ...prevData,
            remarks: value,
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

        const formData = new FormData();
        formData.append("payFor", commitmentData.payFor);
        formData.append("totalEmi", parseInt(commitmentData.totalEmi));
        formData.append("emiAmount", parseFloat(commitmentData.emiAmount));
        formData.append("payType", parseInt(commitmentData.payType));
        formData.append("category", parseInt(commitmentData.category));
        formData.append("remarks", commitmentData.remarks);
        formData.append("status", parseInt(commitmentData.status));
        formData.append("createdBy", userId);

        if (commitmentData.attachment) {
            formData.append("attachment", commitmentData.attachment);
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/admin/commitments/update/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(response.data.message || "Commitment updated successfully!", {
                autoClose: 2000,
            });

            navigate("/admin/commitments");

        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                if (error.response.status === 400 && data.errors) {
                    data.errors.forEach((error) => {
                        toast.error(error.msg, { autoClose: 2000 });
                    });
                } else {
                    toast.error(data.message || "Failed to update commitment.", { autoClose: 2000 });
                }
            } else {
                toast.error("An error occurred. Please try again.", { autoClose: 2000 });
            }
        }
    };

    const handleBack = () => {
        navigate("/admin/commitments");
    };

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
                    <Col md="10" lg="8" xl="6">
                        <Card>
                            <CardHeader>
                                <h5 className="title">Edit Commitment</h5>
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
                                                    type="text"
                                                    value={commitmentData.payFor}
                                                    onChange={handleChange}
                                                    required
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
                                                    type="number"
                                                    value={commitmentData.totalEmi}
                                                    onChange={handleChange}
                                                    min="1"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="emiAmount">EMI Amount</Label>
                                                <Input
                                                    id="emiAmount"
                                                    name="emiAmount"
                                                    type="number"
                                                    value={commitmentData.emiAmount}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* Pay Type and Category */}
                                    <Row>
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

                                    {/* Remarks */}
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
                                                    accept="image/*"
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

export default EditCommitment;

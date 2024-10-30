import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import Axios
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles

import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    Label,
} from "reactstrap";
import { useAuth } from "contexts/AuthContext";

function Notes() {
    const { userId } = useAuth();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        attachment: null,
    });

    const fetchNotes = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/admin/notes`, {
                params: { userId } // Pass userId as a query parameter
            });
            setNotes(response.data.data); // Make sure to match the response structure
        } catch (error) {
            toast.error("Failed to fetch notes. Please try again.");
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewNote((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewNote((prev) => ({ ...prev, attachment: file }));
    };

    const addNote = async () => {
        if (!newNote.title || !newNote.content) {
            toast.error("Please fill in both title and content.");
            return;
        }

        const formData = new FormData();
        formData.append("title", newNote.title);
        formData.append("content", newNote.content); // Note: content is already in rich text format
        formData.append("createdBy", userId);
        if (newNote.attachment) formData.append("attachment", newNote.attachment);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/admin/notes/create`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            toast.success("Note added successfully!");
            setNewNote({ title: "", content: "", attachment: null });
            fetchNotes();
        } catch (error) {
            toast.error("Failed to add note.");
        }
    };

    const handleNoteChange = async (id, field, value) => {
        setNotes((prev) =>
            prev.map((note) => (note._id === id ? { ...note, [field]: value } : note))
        );

        try {
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/notes/${id}`, {
                [field]: value,
            });
            // toast.success("Note updated successfully!");
        } catch (error) {
            toast.error("Failed to update note.");
        }
    };

    const deleteNote = async (id) => {
        // Show confirmation alert
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return; // Exit if the user cancels

        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/notes/${id}`);
            // Update state to remove deleted note
            setNotes((prev) => prev.filter((note) => note._id !== id));
            toast.success("Note deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete note.");
        }
    };

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12" lg="12">
                        <Card>
                            <CardBody>
                                <Form>
                                    <Row form>
                                        {/* Title */}
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="title">Title</Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    placeholder="Enter title"
                                                    type="text"
                                                    value={newNote.title}
                                                    onChange={handleInputChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        {/* Content - Replace textarea with ReactQuill */}
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="content">Content</Label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={newNote.content}
                                                    onChange={(content) => setNewNote((prev) => ({ ...prev, content }))} />
                                            </FormGroup>
                                        </Col>

                                        {/* Attachment */}
                                        <Col md={2}>
                                            <FormGroup>
                                                <Label for="attachment">Attachment</Label>
                                                <Input
                                                    id="attachment"
                                                    name="attachment"
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Button color="primary" onClick={addNote}>
                                        Add Note
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md="12">
                        <Row>
                            {notes.map((note) => (
                                <Col md="4" key={note._id} style={{ marginBottom: "-10px" }}>
                                    <Card>
                                        <CardBody>
                                            {/* Delete Button (Trash Icon) */}
                                            <button
                                                onClick={() => deleteNote(note._id)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#e14eca',
                                                }}
                                            >
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                            </button>

                                            {/* Editable Title */}
                                            <Input
                                                type="text"
                                                value={note.title}
                                                onChange={(e) =>
                                                    handleNoteChange(note._id, "title", e.target.value)
                                                }
                                                style={{
                                                    fontSize: "1.2rem",
                                                    fontWeight: "bold",
                                                    border: "none",
                                                    outline: "none",
                                                }}
                                            />

                                            {/* Editable Content */}
                                            <ReactQuill
                                                theme="snow"
                                                value={note.content}
                                                onChange={(content) =>
                                                    handleNoteChange(note._id, "content", content)
                                                }
                                                style={{
                                                    marginTop: "10px",
                                                    border: "none",
                                                    outline: "none",
                                                }}
                                            />

                                            {/* Attachment preview */}
                                            {note.attachment && (
                                                <img
                                                    src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${note.attachment}`}
                                                    alt="attachment"
                                                    style={{
                                                        width: "100%",
                                                        marginTop: "10px",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            )}
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </div>
            <ToastContainer />
        </>
    );
}

export default Notes;

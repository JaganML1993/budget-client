import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // Import Axios

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
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
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
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

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
        formData.append("content", newNote.content);
        formData.append("createdBy", userId);
        if (newNote.attachment) formData.append("attachment", newNote.attachment);

        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/admin/notes/create`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            toast.success("Note added successfully!");
            setNewNote({ title: "", content: "", attachment: null });
            fetchNotes();
            toggleModal(); // Close modal after adding note
        } catch (error) {
            toast.error("Failed to add note.");
        }
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleNoteChange = async (id, field, value) => {
        setNotes((prev) =>
            prev.map((note) => (note._id === id ? { ...note, [field]: value } : note))
        );

        try {
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/admin/notes/${id}`, {
                [field]: value,
            });
        } catch (error) {
            toast.error("Failed to update note.");
        }
    };

    const deleteNote = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/notes/${id}`);
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
                                <Row>
                                    {notes.map((note) => (
                                        <Col md="4" key={note._id} style={{ marginBottom: "-10px" }}>
                                            <Card>
                                                <CardBody>
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

                                                    <Input
                                                        type="text"
                                                        value={note.title}
                                                        onChange={(e) =>
                                                            handleNoteChange(note._id, "title", e.target.value)
                                                        }
                                                        style={{
                                                            fontSize: "1.0rem",
                                                            fontWeight: "bold",
                                                            border: "none",
                                                            outline: "none",
                                                        }}
                                                    />

                                                    <FormGroup>
                                                        <Input
                                                            id="content"
                                                            name="content"
                                                            type="textarea"
                                                            rows="3"
                                                            value={note.content}
                                                            onChange={(e) =>
                                                                handleNoteChange(note._id, "content", e.target.value)
                                                            }
                                                            style={{
                                                                border: "none",
                                                                outline: "none",
                                                            }}
                                                        />
                                                    </FormGroup>

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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Button
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    padding: '15px',
                    height: '45px',
                    borderRadius: '50%',
                    
                }}
                size="sm"
                color="primary"
                onClick={toggleModal}
            >
                <i className="fa fa-plus" aria-hidden="true"></i>
            </Button>

            {/* Modal for adding new note */}
            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add New Note</ModalHeader>
                <ModalBody>
                    <Form>
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
                        <FormGroup>
                            <Label for="content">Content</Label>
                            <Input
                                id="content"
                                name="content"
                                placeholder="Enter note content"
                                type="textarea"
                                rows="3"
                                value={newNote.content}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
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
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addNote}>Add Note</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <ToastContainer />
        </>
    );
}

export default Notes;

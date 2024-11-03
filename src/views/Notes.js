import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchNotes = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/admin/notes`, {
                params: { userId }
            });
            setNotes(response.data.data);
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

    const handleColorChange = (id, color) => {
        handleNoteChange(id, "color", color);
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

    // Filter notes based on search query
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const adjustTextareaHeight = (textarea) => {
        if (textarea) {
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        notes.forEach((note) => {
            const textarea = document.getElementById(`content-${note._id}`);
            adjustTextareaHeight(textarea);
        });
    }, [notes]);

    const predefinedColors = ["#2E365A", "#6D2932", "#006A67", "#C96868", "#708871", "#605678"];

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12" lg="12">
                        {/* Search Input */}
                        <FormGroup>
                            <Input
                                type="text"
                                placeholder="Search by title or content"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </FormGroup>
                        <Row>
                            {filteredNotes.map((note) => (
                                <Col md="4" key={note._id}>
                                    <Card style={{ marginBottom: "10px", backgroundColor: note.color || "#27293d" }}>
                                        <CardBody>
                                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                                <button
                                                    onClick={() => deleteNote(note._id)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#f3a4b5',
                                                    }}
                                                >
                                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>

                                            <Input
                                                type="text"
                                                value={note.title}
                                                onChange={(e) =>
                                                    handleNoteChange(note._id, "title", e.target.value)
                                                }
                                                style={{
                                                    fontSize: "0.9rem",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    outline: "none",
                                                }}
                                            />

                                            <FormGroup>
                                                <Input
                                                    id={`content-${note._id}`}
                                                    name="content"
                                                    type="textarea"
                                                    value={note.content}
                                                    onChange={(e) =>
                                                        handleNoteChange(note._id, "content", e.target.value)
                                                    }
                                                    onInput={(e) => adjustTextareaHeight(e.target)}
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        maxHeight: "400px",
                                                        resize: "none",
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

                                            {/* Color Picker Circles moved below title and content */}
                                            <div style={{ display: 'flex', marginTop: '10px', gap: '5px', float: 'right' }}>
                                                {predefinedColors.map((color) => (
                                                    <div
                                                        key={color}
                                                        onClick={() => handleColorChange(note._id, color)}
                                                        style={{
                                                            backgroundColor: color,
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer',
                                                            border: '1px solid white',
                                                            boxShadow: note.color === color ? '0 0 5px #fff' : 'none' // Optional shadow for selected
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </div>

            <Button
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0',
                    color: '#f3a4b5'
                }}
                size="sm"
                onClick={toggleModal}
            >
                <i className="fa fa-plus" aria-hidden="true" style={{ fontSize: '20px' }}></i>
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
                                type="textarea"
                                value={newNote.content}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="attachment">Attachment</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addNote}>
                        Add Note
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            <ToastContainer />
        </>
    );
}

export default Notes;

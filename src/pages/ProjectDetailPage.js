import React, { useEffect, useState } from 'react';
import { Container, Alert, Card, Spinner, Button, Form, Row, Col, ListGroup, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectControllerService, UserControllerService } from '../api-client/';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [error, setError] = useState('');
    const [editingField, setEditingField] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectData = await ProjectControllerService.getProjectById(id);
                setProject(projectData);
                setUpdatedName(projectData.name);
                setUpdatedDescription(projectData.description);
                const userData = await ProjectControllerService.getUsersByProjectId(id);
                setUsers(userData);
            } catch (err) {
                setError('Error loading project: ' + err.message);
            }
        };
        fetchProject();
    }, [id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await UserControllerService.getAllUsers();
                setAllUsers(userData);
            } catch (err) {
                setError('Error loading users: ' + err.message);
            }
        };
        fetchUsers();
    }, []);

    const handleUpdate = async () => {
        try {
            await ProjectControllerService.updateProject(id, { name: updatedName, description: updatedDescription });
            setSuccess('Project updated successfully!');
            setEditingField('');
            setProject({ ...project, name: updatedName, description: updatedDescription, updatedAt: new Date().toISOString() });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error updating project: ' + err.message);
        }
    };

    const handleAddUser = async (userId) => {
        try {
            await ProjectControllerService.addUserToProject(id, userId);
            const userData = await ProjectControllerService.getUsersByProjectId(id);
            setUsers(userData);
            setSuccess('User added successfully!');
            setShowAddUserModal(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error adding user: ' + err.message);
            setShowAddUserModal(false);
        }
    };

    const handleDeleteProject = async () => {
        try {
            await ProjectControllerService.deleteProject(id);
            navigate(-1); // Navigate to the previous page
        } catch (err) {
            setError('Error deleting project: ' + err.message);
        }
    };

    const filteredUsers = allUsers.filter((user) =>
        user.login.toLowerCase().includes(searchTerm.toLowerCase()) && !users.some((u) => u.id === user.id)
    ).slice(0, 5);

    const humanReadableDate = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!project) {
        return (
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Spinner animation="border" role="status">
                    <span>Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row className="mb-4 text-muted">
                Created on {humanReadableDate(project.createdAt)}, updated on {humanReadableDate(project.updatedAt)}
            </Row>
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    {success && <Alert variant="success">{success}</Alert>}
                    <div onClick={() => setEditingField('name')}>
                        <Card.Title className="display-5 mb-3">
                            {editingField === 'name' ? (
                                <Form.Control
                                    type="text"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    onBlur={handleUpdate}
                                    autoFocus
                                />
                            ) : (
                                project.name
                            )}
                        </Card.Title>
                    </div>
                    <div onClick={() => setEditingField('description')}>
                        {editingField === 'description' ? (
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                                onBlur={handleUpdate}
                                autoFocus
                            />
                        ) : (
                            <ReactMarkdown>{project.description}</ReactMarkdown>
                        )}
                    </div>
                    <Button variant="outline-primary mt-3" onClick={() => setEditingField('description')}>
                        Edit Description
                    </Button>
                    <Button variant="danger mt-3 ms-2" onClick={() => setShowDeleteModal(true)}>
                        Delete Project
                    </Button>
                </Card.Body>
            </Card>
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Card.Title>Project Users</Card.Title>
                    <ListGroup className="mb-3">
                        {users.map((user) => (
                            <ListGroup.Item key={user.id}>{user.login}</ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Button variant="outline-primary" onClick={() => setShowAddUserModal(true)}>
                        Add User
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User to Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <ListGroup>
                        {filteredUsers.map((user) => (
                            <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                                {user.login}
                                <Button variant="success" size="sm" onClick={() => handleAddUser(user.id)}>
                                    Add
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the project "{project.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteProject}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProjectDetailPage;

import React, { useContext, useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Table, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProjectControllerService } from '../api-client/services/ProjectControllerService';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [projects, setProjects] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await ProjectControllerService.getAllProjects();
                setProjects(response);
            } catch (err) {
                setError('Error loading projects: ' + err.message);
            }
        };

        fetchProjects();
    }, []);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleCreateProject = async () => {
        setError('');
        try {
            const newProject = await ProjectControllerService.createProject({
                name: projectName,
                description: projectDescription,
            });
            setProjects([...projects, newProject]);
            setSuccess('Project created successfully!');
            setTimeout(() => setSuccess(''), 3000);
            handleClose();
            navigate(`/projects/${newProject.id}`);
        } catch (error) {
            setError('Failed to create project: ' + error.message);
        }
    };

    const handleProjectClick = (id) => {
        navigate(`/projects/${id}`);
    };

    const handleDelete = async () => {
        try {
            await ProjectControllerService.deleteProject(selectedProject.id);
            setProjects(projects.filter(project => project.id !== selectedProject.id));
            setShowDeleteModal(false);
            setSuccess('Project deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to delete project: ' + error.message);
            setShowDeleteModal(false);
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="mt-4">
            <h2>Your Projects</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search by project name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredProjects.map((project, index) => (
                    <tr key={index} onClick={() => handleProjectClick(project.id)} style={{ cursor: 'pointer' }}>
                        <td>{project.name}</td>
                        <td>{project.description}</td>
                        <td>
                            <Button variant="link" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setShowDeleteModal(true);
                            }}>
                                <i className="bi bi-trash"></i>
                            </Button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan="3" className="text-center">
                        <Button
                            variant="outline-primary"
                            onClick={handleShow}
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                        >
                            <i className="bi bi-plus-lg"></i>
                        </Button>
                    </td>
                </tr>
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="projectName" className="mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter project name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="projectDescription" className="mb-3">
                            <Form.Label>Project Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter project description"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateProject}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the project "{selectedProject?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProjectsPage;

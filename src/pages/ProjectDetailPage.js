import React, { useEffect, useState } from 'react';
import { Container, Alert, Card, Spinner, Button, Form, Row, Table, ListGroup, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectControllerService, UserControllerService, TaskControllerService } from '../api-client/';
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
    const [tasks, setTasks] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('PENDING');
    const [taskPriority, setTaskPriority] = useState('MEDIUM');
    const [assignedUserId, setAssignedUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await ProjectControllerService.getProjectById(id);
                setProject(projectData);
                setUpdatedName(projectData.name);
                setUpdatedDescription(projectData.description);

                const userData = await ProjectControllerService.getUsersByProjectId(id);
                setUsers(userData);

                const taskData = await TaskControllerService.getTasksByProjectId(id);
                setTasks(taskData);
            } catch (err) {
                setError('Error loading data: ' + err.message);
            }
        };
        fetchData();
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
            setProject({
                ...project,
                name: updatedName,
                description: updatedDescription,
                updatedAt: new Date().toISOString(),
            });
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
            navigate(-1);
        } catch (err) {
            setError('Error deleting project: ' + err.message);
        }
    };

    const handleAddTask = async () => {
        try {
            const newTask = await TaskControllerService.createTask({
                title: taskTitle,
                description: taskDescription,
                status: taskStatus,
                priority: taskPriority,
                projectId: id,
                assignedUserId: assignedUserId,
            });
            setTasks([...tasks, newTask]);
            setSuccess('Task added successfully!');
            setShowAddTaskModal(false);
            setTimeout(() => setSuccess(''), 3000);
            navigate(`/tasks/${newTask.id}`)
        } catch (err) {
            setError('Error adding task: ' + err.message);
        }
    };

    const filteredUsers = allUsers
        .filter((user) => user.login.toLowerCase().includes(searchTerm.toLowerCase()) && !users.some((u) => u.id === user.id))
        .slice(0, 5);

    const humanReadableDate = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <Container className="mt-5">
            {success && (
                <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1 }}>
                    {success}
                </Alert>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

            {!project ? (
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <Spinner animation="border" role="status">
                        <span>Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <Row className="mb-4 text-muted">
                        Created on {humanReadableDate(project.createdAt)}, updated on {humanReadableDate(project.updatedAt)}
                    </Row>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
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
                            <div className="editable-field mb-3" onClick={() => setEditingField('description')}>
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
                            <Button variant="outline-primary" onClick={() => setEditingField('description')}>
                                Edit Description
                            </Button>
                            <Button variant="danger ms-2" onClick={() => setShowDeleteModal(true)}>
                                Delete Project
                            </Button>
                        </Card.Body>
                    </Card>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
                            <Card.Title>Tasks</Card.Title>
                            <Table striped bordered hover className="mb-3">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Assigned User</th>
                                </tr>
                                </thead>
                                <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} style={{ cursor: 'pointer' }}>
                                        <td>{task.title}</td>
                                        <td>{task.status}</td>
                                        <td>{task.priority}</td>
                                        <td>{task.assignedUser?.login || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <Button variant="outline-primary" onClick={() => setShowAddTaskModal(true)}>
                                Add Task
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

                    <Modal show={showAddTaskModal} onHide={() => setShowAddTaskModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="taskTitle" className="mb-3">
                                    <Form.Label>Task Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter task title"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="taskDescription" className="mb-3">
                                    <Form.Label>Task Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter task description"
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="taskStatus" className="mb-3">
                                    <Form.Label>Task Status</Form.Label>
                                    <Form.Control as="select" value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="taskPriority" className="mb-3">
                                    <Form.Label>Task Priority</Form.Label>
                                    <Form.Control as="select" value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="assignedUser" className="mb-3">
                                    <Form.Label>Assign User</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={assignedUserId}
                                        onChange={(e) => {
                                            setAssignedUserId(e.target.value);
                                        }}
                                    >
                                        <option value="">Select user</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.login}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" onClick={handleAddTask}>
                                    Add Task
                                </Button>
                            </Form>
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
                </>
            )}
        </Container>
    );
};

export default ProjectDetailPage;

import React, { useEffect, useState } from 'react';
import { Container, Alert, Card, Spinner, Form, Row, Button, Modal, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskControllerService, ProjectControllerService, CommentControllerService } from '../api-client';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const TaskDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingField, setEditingField] = useState('');
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [updatedPriority, setUpdatedPriority] = useState('');
    const [assignedUserId, setAssignedUserId] = useState('');
    const [projectUsers, setProjectUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await TaskControllerService.getTaskById(id);
                setTask(response);
                setUpdatedTitle(response.title);
                setUpdatedDescription(response.description);
                setUpdatedStatus(response.status);
                setUpdatedPriority(response.priority);
                setAssignedUserId(response.assignedUser?.id || '');

                if (response.projectId) {
                    const projectResponse = await ProjectControllerService.getProjectById(response.projectId);
                    setProject(projectResponse);
                    fetchProjectUsers(response.projectId);
                }

                fetchComments(id);
            } catch (err) {
                setError('Error loading task or project: ' + err.message);
            }
        };

        const fetchProjectUsers = async (projectId) => {
            try {
                const userData = await ProjectControllerService.getUsersByProjectId(projectId);
                setProjectUsers(userData);
            } catch (err) {
                setError('Error loading project users: ' + err.message);
            }
        };

        const fetchComments = async (taskId) => {
            try {
                const commentsData = await CommentControllerService.getCommentsByTaskId(taskId);
                setComments(commentsData);
            } catch (err) {
                setError('Error loading comments: ' + err.message);
            }
        };

        fetchTask();
    }, [id]);

    const handleUpdate = async (field, value) => {
        try {
            await TaskControllerService.updateTask(id, {
                ...task,
                [field]: value,
                updatedAt: new Date().toISOString(),
            });
            setTask((prev) => ({ ...prev, [field]: value }));
            setSuccess('Task updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error updating task: ' + err.message);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await TaskControllerService.deleteTask(id);
            navigate(-1);
        } catch (err) {
            setError('Error deleting task: ' + err.message);
        }
    };

    const handleCreateComment = async () => {
        try {
            const newCommentObject = await CommentControllerService.createComment({ content: newCommentContent, taskId: parseInt(id) });
            setComments([...comments, newCommentObject]);
            setNewCommentContent('');
        } catch (err) {
            setCommentError('Error creating comment: ' + err.message);
        }
    };

    const handleEditComment = async (commentId, content) => {
        try {
            await CommentControllerService.updateComment(commentId, { content, taskId: parseInt(id) });
            setComments(comments.map(comment => (comment.id === commentId ? { ...comment, content } : comment)));
            setEditingComment(null);
        } catch (err) {
            setCommentError('Error editing comment: ' + err.message);
        }
    };

    const humanReadableDate = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <Container className="mt-5 full-page-scroll">
            {success && (
                <Alert variant="success" className="position-fixed top-0 end-0 m-3" style={{ zIndex: 1 }}>
                    {success}
                </Alert>
            )}
            {error && <Alert variant="danger">{error}</Alert>}

            {!task ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <Row className="mb-3">
                        <h6 className="text-muted">
                            {project ? (
                                <Link to={`/projects/${project.id}`} className="text-decoration-none">
                                    {project.name}
                                </Link>
                            ) : (
                                'Project'
                            )} / {task.title}
                        </h6>
                    </Row>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
                            <div onClick={() => setEditingField('title')}>
                                <Card.Title className="display-5 mb-3 editable-field" style={{ cursor: 'pointer', borderBottom: editingField === 'title' ? '1px dashed #007bff' : 'none' }}>
                                    {editingField === 'title' ? (
                                        <Form.Control
                                            type="text"
                                            value={updatedTitle}
                                            onChange={(e) => setUpdatedTitle(e.target.value)}
                                            onBlur={() => {
                                                handleUpdate('title', updatedTitle);
                                                setEditingField('');
                                            }}
                                            autoFocus
                                        />
                                    ) : (
                                        task.title
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
                                        onBlur={() => {
                                            handleUpdate('description', updatedDescription);
                                            setEditingField('');
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <ReactMarkdown>{task.description}</ReactMarkdown>
                                )}
                            </div>
                            <Button
                                variant="outline-primary mb-3"
                                onClick={() => setEditingField('description')}
                            >
                                Edit Description
                            </Button>
                            <Form.Group className="my-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={updatedStatus}
                                    onChange={(e) => {
                                        setUpdatedStatus(e.target.value);
                                        handleUpdate('status', e.target.value);
                                    }}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="my-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={updatedPriority}
                                    onChange={(e) => {
                                        setUpdatedPriority(e.target.value);
                                        handleUpdate('priority', e.target.value);
                                    }}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Assigned User</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={assignedUserId}
                                    onChange={(e) => {
                                        setAssignedUserId(e.target.value);
                                        handleUpdate('assignedUserId', e.target.value);
                                    }}
                                >
                                    <option value="">None</option>
                                    {projectUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.login}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <div>
                                <Button
                                    variant="danger"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete Task
                                </Button>
                                <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
                                    Back
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                    <Row className="text-muted mb-3">
                        Created on {humanReadableDate(task.createdAt)}, updated on {humanReadableDate(task.updatedAt)}
                    </Row>

                    {/* Comments Section */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header>Comments</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {comments.map((comment) => (
                                    <ListGroup.Item key={comment.id}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>{comment.author?.login}</strong>
                                                <ReactMarkdown>{comment.content}</ReactMarkdown>
                                                <small className="text-muted">
                                                    Created at: {humanReadableDate(comment.createdAt)}<br />
                                                    Updated at: {humanReadableDate(comment.updatedAt)}
                                                </small>
                                            </div>
                                            {comment?.allowEdit && <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => setEditingComment(comment.id)}
                                            >
                                                Edit
                                            </Button>}
                                        </div>
                                        {editingComment === comment.id && (
                                            <Form.Control
                                                as="textarea"
                                                value={comment.content}
                                                onChange={(e) => {
                                                    setComments(comments.map(c => c.id === comment.id ? { ...c, content: e.target.value } : c));
                                                }}
                                                onBlur={() => handleEditComment(comment.id, comment.content)}
                                                autoFocus
                                            />
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Add a comment..."
                                value={newCommentContent}
                                onChange={(e) => setNewCommentContent(e.target.value)}
                                className="mt-3"
                            />
                            <Button variant="primary" className="mt-2" onClick={handleCreateComment}>
                                Add Comment
                            </Button>
                            {commentError && <Alert variant="danger" className="mt-2">{commentError}</Alert>}
                        </Card.Body>
                    </Card>
                </>
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the task "{task?.title}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteTask}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TaskDetailPage;

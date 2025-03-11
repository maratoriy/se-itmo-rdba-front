import React, { useEffect, useState } from 'react';
import { Container, Alert, Card, Spinner, Button, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ProjectControllerService } from '../api-client/services/ProjectControllerService';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState('');
    const [editingField, setEditingField] = useState('');
    const [updatedName, setUpdatedName] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await ProjectControllerService.getProjectById(id);
                setProject(response);
                setUpdatedName(response.name);
                setUpdatedDescription(response.description);
            } catch (err) {
                setError('Error loading project: ' + err.message);
            }
        };

        fetchProject();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await ProjectControllerService.updateProject(id, {
                name: updatedName,
                description: updatedDescription,
            });
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
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProjectDetailPage;

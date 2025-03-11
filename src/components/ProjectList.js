import React, { useEffect, useState, useContext } from 'react';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { ProjectControllerService } from '../api-client/services/ProjectControllerService';
import { AuthContext } from '../context/AuthContext';

const ProjectList = () => {
    const { authToken } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authToken) return;

        const fetchProjects = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await ProjectControllerService.getAllProjects();
                setProjects(response);
            } catch (err) {
                setError('Error fetching projects: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [authToken]);

    if (!authToken) {
        return <Alert variant="warning" className="mt-4">Please login to view projects.</Alert>;
    }

    if (loading) {
        return (
            <Spinner animation="border" role="status" className="d-block mx-auto mt-5">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-4">{error}</Alert>;
    }

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Project List</h2>
            <Row className="g-4">
                {projects.map((project) => (
                    <Col md={6} lg={4} key={project.id}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-primary">{project.name}</Card.Title>
                                <Card.Text>{project.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {projects.length === 0 && <Alert variant="info" className="mt-4">No projects available.</Alert>}
        </Container>
    );
};

export default ProjectList;

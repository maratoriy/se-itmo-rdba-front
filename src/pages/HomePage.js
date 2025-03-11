import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProjectControllerService } from '../api-client/services/ProjectControllerService';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await ProjectControllerService.getAllProjects();
                setProjects(response);
            } catch (err) {
                setError('Error loading projects: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (!authToken) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center vh-100">
                <h1 className="mb-4">Welcome to ANTTM</h1>
                <p className="mb-4">Please login to view your projects and their details.</p>
                <div className="d-flex">
                    <Button variant="primary" className="mx-2" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                    <Button variant="secondary" className="mx-2" onClick={() => navigate('/register')}>
                        Register
                    </Button>
                </div>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger" className="d-flex justify-content-center align-items-center vh-100">{error}</Alert>;
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span>Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Project Overview</h2>
            <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
                {projects.map((project) => (
                    <Col
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Card className="shadow-sm border-0 h-100" style={{ minHeight: '150px' }}>
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Title>{project.name}</Card.Title>
                                <Card.Text>{project.description.slice(0, 100)}...</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage;

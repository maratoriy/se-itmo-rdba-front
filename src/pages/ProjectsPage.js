import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProjectList from '../components/ProjectList';
import { AuthContext } from '../context/AuthContext';

const ProjectsPage = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Your Projects</h2>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <ProjectList />
        </Container>
    );
};

export default ProjectsPage;

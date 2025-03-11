import React, { useContext } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { authToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="text-center shadow-lg" style={{ width: '24rem', borderColor: '#007bff', borderWidth: '2px' }}>
                <Card.Body>
                    <Card.Title className="mb-4" style={{ color: '#007bff' }}>Welcome to Project Tracker</Card.Title>
                    {!authToken ? (
                        <>
                            <Card.Text className="mb-4" style={{ fontSize: '1.1rem' }}>
                                Please log in or register to continue.
                            </Card.Text>
                            <Button
                                variant="primary"
                                onClick={() => handleNavigation('/login')}
                                className="m-2"
                                style={{ width: '100px' }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => handleNavigation('/register')}
                                className="m-2"
                                style={{ width: '100px' }}
                            >
                                Register
                            </Button>
                        </>
                    ) : (
                        <>
                            <Card.Text className="mb-4" style={{ fontSize: '1.1rem' }}>
                                You are already logged in.
                            </Card.Text>
                            <Button
                                variant="success"
                                onClick={() => navigate('/')}
                                className="m-2"
                                style={{ width: '180px' }}
                            >
                                Go to Projects
                            </Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Home;

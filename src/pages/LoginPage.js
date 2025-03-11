import React, { useState, useContext } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthControllerService } from '../api-client/services/AuthControllerService';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const token = await AuthControllerService.login({
                login: loginInput,
                password,
            });
            login(token.token);
            navigate('/');
        } catch (error) {
            setError('Login failed: ' + error.message);
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '24rem' }} className="shadow-lg p-4">
                <h2 className="mb-3 text-center text-primary">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formLogin" className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter login"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mb-2">
                        Login
                    </Button>
                    <Button variant="link" onClick={() => navigate('/register')} className="w-100 text-decoration-none">
                        Don't have an account? Register
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default LoginPage;

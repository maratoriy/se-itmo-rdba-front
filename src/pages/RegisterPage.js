import React, { useState, useContext } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthControllerService } from '../api-client/services/AuthControllerService';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loginInput, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await AuthControllerService.register({
                login: loginInput,
                email,
                password,
            });
            const token = response.token;
            login(token);
            navigate('/');
            setSuccess('Registration successful!');
        } catch (error) {
            setError('Registration failed: ' + error.message);
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: '24rem' }} className="shadow-lg p-4">
                <h2 className="mb-3 text-center text-secondary">Register</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleRegister}>
                    <Form.Group controlId="formLogin" className="mb-3">
                        <Form.Label>Login</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter login"
                            value={loginInput}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <Button variant="secondary" type="submit" className="w-100 mb-2">
                        Register
                    </Button>
                    <Button variant="link" onClick={() => navigate('/login')} className="w-100 text-decoration-none">
                        Already have an account? Login
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default RegisterPage;

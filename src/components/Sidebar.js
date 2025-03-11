import React, { useContext } from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{
            width: '240px',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'fixed'
        }}>
            <div className="p-3">
                <h5>ANTTM</h5>
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
                </Nav>
            </div>
            <Button variant="danger" className="m-3" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Sidebar;

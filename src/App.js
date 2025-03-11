import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import HomePage from './pages/HomePage';
import Sidebar from './components/Sidebar';
import { Container } from 'react-bootstrap';
import TaskDetailPage from './pages/TaskDetailPage';
import AllTasksPage from './pages/AllTasksPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

const AppRoutes = () => {
    const { authToken } = useContext(AuthContext);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {authToken && <Sidebar />}
            <div style={{ flexGrow: 1, marginLeft: authToken ? '240px' : '0', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/projects" element={authToken ? <ProjectsPage /> : <Navigate to="/login" />} />
                    <Route path="/projects/:id" element={authToken ? <ProjectDetailPage /> : <Navigate to="/login" />} />
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                    <Route path="/all-tasks" element={<AllTasksPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                </Routes>
            </div>
        </div>
    );

};

export default App;

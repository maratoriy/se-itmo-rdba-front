import React, { useEffect, useState, useCallback } from 'react';
import { Container, Alert, ListGroup, Spinner, Button } from 'react-bootstrap';
import { NotificationControllerService } from '../api-client';
import { Link } from 'react-router-dom';
import moment from 'moment';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await NotificationControllerService.getNotificationsByUserName();
            setNotifications(data);
        } catch (err) {
            setError('Error loading notifications: ' + err.message);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await NotificationControllerService.markAsRead(id);
            fetchNotifications();
        } catch (err) {
            setError('Error marking notification as read: ' + err.message);
        }
    };

    const humanReadableDate = (date) => moment(date).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <Container className="mt-5">
            <h2>Notifications</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {notifications.length === 0 ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <ListGroup>
                    {notifications.map(notification => (
                        <ListGroup.Item key={notification.id} className={notification.read ? '' : 'font-weight-bold'}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <span>{notification.message}</span>
                                    <br />
                                    {notification.project && (
                                        <Link to={`/projects/${notification.project.id}`}>
                                            <strong>View Project</strong>
                                        </Link>
                                    )}
                                    {notification.task && (
                                        <>
                                            <span> | </span>
                                            <Link to={`/tasks/${notification.task.id}`}>
                                                <strong>View Task</strong>
                                            </Link>
                                        </>
                                    )}
                                    <br />
                                    <small className="text-muted">Created at: {humanReadableDate(notification.createdAt)}</small>
                                </div>
                                {!notification.read && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        Mark as Read
                                    </Button>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default NotificationsPage;

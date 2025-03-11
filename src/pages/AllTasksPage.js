import React, { useEffect, useState } from 'react';
import { Container, Alert, Table, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { TaskControllerService, ProjectControllerService } from '../api-client';
import moment from 'moment';

const AllTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasksAndProjects = async () => {
            try {
                const taskData = await TaskControllerService.getAllTasks();
                setTasks(taskData);

                const projectPromises = taskData.map(task =>
                    ProjectControllerService.getProjectById(task.projectId)
                );

                const projectResults = await Promise.all(projectPromises);
                const projectMap = projectResults.reduce((acc, project) => {
                    acc[project.id] = project;
                    return acc;
                }, {});

                setProjects(projectMap);
            } catch (err) {
                setError('Error loading tasks and projects: ' + err.message);
            }
        };

        fetchTasksAndProjects();
    }, []);

    const humanReadableDate = (date) => moment(date).format('MMMM Do YYYY, h:mm A');

    return (
        <Container className="mt-5">
            {error && <Alert variant="danger">{error}</Alert>}

            {!tasks.length ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Card className="shadow-sm border-0 mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h4 className="mb-0">All Tasks</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive hover className="table-striped table-bordered">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Assigned User</th>
                                <th>Project</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tasks.map((task) => (
                                <tr
                                    key={task.id}
                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{task.title}</td>
                                    <td>{task.status}</td>
                                    <td>{task.priority}</td>
                                    <td>{task.assignedUser?.login || '-'}</td>
                                    <td>{projects[task.projectId]?.name || 'N/A'}</td>
                                    <td>{humanReadableDate(task.createdAt)}</td>
                                    <td>{humanReadableDate(task.updatedAt)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AllTasksPage;

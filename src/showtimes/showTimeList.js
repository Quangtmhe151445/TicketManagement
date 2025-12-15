import {
    Table,
    Button,
    Badge,
    Form,
    Card,
    Row,
    Col
} from 'react-bootstrap';
import { useState } from 'react';
import PropTypes from 'prop-types';

function ShowtimeList({ showtimes, movies, rooms, onEdit, onToggleLock, onDelete }) {
    const [filters, setFilters] = useState({
        keyword: '',
        roomId: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const resetFilter = () => {
        setFilters({
            keyword: '',
            roomId: '',
            status: '',
            startDate: '',
            endDate: ''
        });
    };

    const filtered = showtimes.filter(st => {
        const movieTitle =
            movies.find(m => m.id === st.movie_id)?.title.toLowerCase() || '';

        const matchKeyword = movieTitle.includes(filters.keyword.toLowerCase());
        const matchRoom = !filters.roomId || String(st.room_id) === filters.roomId;
        const matchStatus = !filters.status || st.status === filters.status;

        const startTime = new Date(st.start_time);

        const matchStartDate =
            !filters.startDate || startTime >= new Date(filters.startDate);

        const matchEndDate =
            !filters.endDate || startTime <= new Date(filters.endDate + 'T23:59:59');

        return (
            matchKeyword &&
            matchRoom &&
            matchStatus &&
            matchStartDate &&
            matchEndDate
        );
    });

    const formatTime = (time) =>
        new Date(time).toLocaleString('en-GB');

    return (
        <Row className="justify-content-center mt-4">
            <Col xl={11}>
                <Card className="shadow-sm border-0 rounded-4">
                    <Card.Body>

                        <Row className="g-3 mb-3">
                            <Col md={4}>
                                <Form.Control
                                    placeholder="🔍 Search by movie title"
                                    name="keyword"
                                    value={filters.keyword}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    name="roomId"
                                    value={filters.roomId}
                                    onChange={handleChange}
                                >
                                    <option value="">All rooms</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleChange}
                                >
                                    <option value="">All status</option>
                                    <option value="open">Open</option>
                                    <option value="locked">Locked</option>
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <div className="mb-3 text-end">
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={resetFilter}
                            >
                                ♻ Reset Filters
                            </Button>
                        </div>


                        <Table
                            hover
                            responsive
                            className="align-middle text-center"
                        >
                            <thead
                                style={{
                                    backgroundColor: '#e7f1ff',
                                    borderBottom: '2px solid #0d6efd'
                                }}
                            >
                                <tr>
                                    <th>🎬 Movie</th>
                                    <th>🏢 Room</th>
                                    <th>🕒 Start</th>
                                    <th>⏰ End</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-muted py-4">
                                            No showtimes found
                                        </td>
                                    </tr>
                                )}

                                {filtered.map(st => {
                                    const isLocked = st.status === 'locked';

                                    return (
                                        <tr key={st.id}>
                                            <td className="fw-semibold">
                                                {movies.find(m => m.id === st.movie_id)?.title}
                                            </td>
                                            <td>
                                                {rooms.find(r => r.id === st.room_id)?.name}
                                            </td>
                                            <td>{formatTime(st.start_time)}</td>
                                            <td>{formatTime(st.end_time)}</td>
                                            <td>
                                                <Badge bg={isLocked ? 'secondary' : 'success'}>
                                                    {isLocked ? 'Locked' : 'Open'}
                                                </Badge>
                                            </td>
                                            <td>
                                                {!isLocked && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            className="me-2"
                                                            onClick={() => onEdit(st)}
                                                        >
                                                            ✏ Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            className="me-2"
                                                            onClick={() => onDelete(st)}
                                                        >
                                                            🗑 Delete
                                                        </Button>
                                                    </>
                                                )}

                                                <Button
                                                    size="sm"
                                                    variant={isLocked ? 'success' : 'warning'}
                                                    onClick={() => onToggleLock(st)}
                                                >
                                                    {isLocked ? '🔓 Unlock' : '🔒 Lock'}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

ShowtimeList.propTypes = {
    showtimes: PropTypes.array.isRequired,
    movies: PropTypes.array.isRequired,
    rooms: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleLock: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ShowtimeList;
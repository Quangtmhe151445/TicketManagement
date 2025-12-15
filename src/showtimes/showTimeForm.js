import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ShowtimeForm({ movies, rooms, showtimes, onAdd }) {
    const [movieId, setMovieId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');

    const selectedMovie = movies.find(m => m.id === movieId);

    const calculateEndTime = () => {
        if (!selectedMovie || !startTime) return '';
        const start = new Date(startTime);
        const end = new Date(start.getTime() + selectedMovie.duration * 60000);
        return end.toISOString().slice(0, 16);
    };

    const hasConflict = (newStart, newEnd) => {
        return showtimes.some(st => {
            if (st.room_id !== roomId) return false;
            const existStart = new Date(st.start_time);
            const existEnd = new Date(st.end_time);
            return newStart < existEnd && newEnd > existStart;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!movieId || !roomId || !startTime) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const newStart = new Date(startTime);
        const newEnd = new Date(calculateEndTime());

        if (hasConflict(newStart, newEnd)) {
            setError('Trùng lịch chiếu trong cùng phòng');
            return;
        }

        onAdd({
            movie_id: movieId,
            room_id: roomId,
            start_time: newStart.toISOString(),
            end_time: newEnd.toISOString(),
            status: 'open',
            tickets_sold: 0
        });

        setMovieId('');
        setRoomId('');
        setStartTime('');
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-3 text-primary">
                    Tạo Lịch Chiếu Mới
                </Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Phim</Form.Label>
                                <Form.Select
                                    value={movieId}
                                    onChange={e => setMovieId(e.target.value)}
                                >
                                    <option value="">-- Chọn phim --</option>
                                    {movies
                                        .filter(m => m.status === 'now_showing')
                                        .map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.title}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Phòng chiếu</Form.Label>
                                <Form.Select
                                    value={roomId}
                                    onChange={e => setRoomId(e.target.value)}
                                >
                                    <option value="">-- Chọn phòng --</option>
                                    {rooms
                                        .filter(r => r.status === 'active')
                                        .map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Giờ bắt đầu</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Giờ kết thúc</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={calculateEndTime()}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button type="submit" variant="success">
                        Tạo lịch chiếu
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

ShowtimeForm.propTypes = {
    movies: PropTypes.array.isRequired,
    rooms: PropTypes.array.isRequired,
    showtimes: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default ShowtimeForm;

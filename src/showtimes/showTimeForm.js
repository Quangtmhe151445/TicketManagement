import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ShowtimeForm({
    movies,
    rooms,
    showtimes,
    onSubmit,
    initialData = null,
    submitLabel = 'Create Showtime'
}) {
    const [movieId, setMovieId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setMovieId(initialData.movie_id);
            setRoomId(initialData.room_id);
            setStartTime(initialData.start_time.slice(0, 16));
        } else {
            resetForm();
        }
    }, [initialData]);

    const resetForm = () => {
        setMovieId('');
        setRoomId('');
        setStartTime('');
        setError('');
    };

    const selectedMovie = movies.find(m => m.id === movieId);

    const calculateEndTime = () => {
        if (!selectedMovie || !startTime) return '';
        const start = new Date(startTime);
        const end = new Date(start.getTime() + selectedMovie.duration * 60000);
        return end.toISOString().slice(0, 16);
    };

    const hasConflict = (newStart, newEnd) => {
    if (!roomId) return false;

    return showtimes.some(st => {
        if (initialData && st.id === initialData.id) return false;

        if (Number(st.room_id) !== Number(roomId)) return false;

        if (!st.start_time || !st.end_time) return false;

        const existStart = new Date(st.start_time);
        const existEnd = new Date(st.end_time);

        if (isNaN(existStart) || isNaN(existEnd)) return false;

        console.log('Checking conflict with:', existStart, existEnd);

        return newStart < existEnd && newEnd > existStart;
    });
};



    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!movieId || !roomId || !startTime) {
            setError('Please fill in all required fields');
            return;
        }

        const newStart = new Date(startTime);
        const newEnd = new Date(calculateEndTime());

        if (hasConflict(newStart, newEnd)) {
            setError('Showtime conflicts with another showtime in the same room');
            return;
        }

        onSubmit({
            id: initialData?.id,
            movie_id: movieId,
            room_id: roomId,
            start_time: newStart.toISOString(),
            end_time: newEnd.toISOString(),
            status: initialData?.status ?? 'open',
            tickets_sold: initialData?.tickets_sold ?? 0
        });

        if (!initialData) resetForm();
    };

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>


                <Form.Group className="mb-3">
                    <Form.Label>Movie</Form.Label>
                    <Form.Select
                        value={movieId}
                        onChange={e => setMovieId(e.target.value)}
                        disabled={!!initialData}
                    >
                        <option value="">-- Select movie --</option>
                        {movies
                            .filter(m => m.status === 'now_showing')
                            .map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                    </Form.Select>

                    {selectedMovie && (
                        <small className="text-muted d-block mt-1">
                            Duration:{' '}
                            <Badge bg="secondary">
                                {selectedMovie.duration} minutes
                            </Badge>
                        </small>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Room</Form.Label>
                    <Form.Select
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                        disabled={!!initialData}
                    >
                        <option value="">-- Select room --</option>
                        {rooms
                            .filter(r => r.status === 'active')
                            .map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                    </Form.Select>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                    />
                </Form.Group>


                <Form.Group className="mb-4">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={calculateEndTime()}
                        readOnly
                    />
                    <small className="text-muted">
                        Automatically calculated based on movie duration
                    </small>
                </Form.Group>

                <div className="text-end">
                    <Button type="submit" variant="primary">
                        {submitLabel}
                    </Button>
                </div>
            </Form>
        </>
    );
}

ShowtimeForm.propTypes = {
    movies: PropTypes.array.isRequired,
    rooms: PropTypes.array.isRequired,
    showtimes: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    submitLabel: PropTypes.string
};

export default ShowtimeForm;

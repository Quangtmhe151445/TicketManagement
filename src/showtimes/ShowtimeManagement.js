import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

import ShowtimeForm from './showTimeForm';
import ShowtimeList from './showTimeList';

const MOVIES_API = 'http://localhost:9999/movies';
const ROOMS_API = 'http://localhost:9999/cinema_rooms';
const SHOWTIMES_API = 'http://localhost:9999/showtimes';

function ShowtimeManagement() {
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
    const fetchData = async () => {
        try {
            const moviesRes = await fetch(MOVIES_API);
            if (!moviesRes.ok) throw new Error('Movies API lỗi');

            const roomsRes = await fetch(ROOMS_API);
            if (!roomsRes.ok) throw new Error('Rooms API lỗi');

            const showtimesRes = await fetch(SHOWTIMES_API);
            if (!showtimesRes.ok) throw new Error('Showtimes API lỗi');

            setMovies(await moviesRes.json());
            setRooms(await roomsRes.json());
            setShowtimes(await showtimesRes.json());
        } catch (err) {
            console.error(err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
    }, []);

    const addShowtime = async (newShowtime) => {
        const res = await fetch(SHOWTIMES_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newShowtime)
        });

        const saved = await res.json();
        setShowtimes(prev => [...prev, saved]);
    };

    const lockShowtime = async (id) => {
        const st = showtimes.find(s => s.id === id);
        if (!st) return;

        const updated = { ...st, status: 'locked' };

        await fetch(`${SHOWTIMES_API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });

        setShowtimes(prev =>
            prev.map(s => (s.id === id ? updated : s))
        );
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h3 className="text-primary">
                        Quản Lý Lịch Chiếu
                    </h3>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            <Row>
                <Col md={12}>
                    <ShowtimeForm
                        movies={movies}
                        rooms={rooms}
                        showtimes={showtimes}
                        onAdd={addShowtime}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <ShowtimeList
                        showtimes={showtimes}
                        movies={movies}
                        rooms={rooms}
                        onLock={lockShowtime}
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default ShowtimeManagement;

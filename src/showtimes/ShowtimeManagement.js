import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';

import ShowtimeList from './showTimeList';
import ShowtimeModal from './showTimeEdit';

const MOVIES_API = 'http://localhost:9999/movies';
const ROOMS_API = 'http://localhost:9999/cinema_rooms';
const SHOWTIMES_API = 'http://localhost:9999/showtimes';

function ShowtimeManagement() {
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const moviesRes = await fetch(MOVIES_API);
                if (!moviesRes.ok) throw new Error('Failed to load movies');

                const roomsRes = await fetch(ROOMS_API);
                if (!roomsRes.ok) throw new Error('Failed to load rooms');

                const showtimesRes = await fetch(SHOWTIMES_API);
                if (!showtimesRes.ok) throw new Error('Failed to load showtimes');

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

    const handleSubmit = async (data) => {
        if (editingShowtime) {
            await fetch(`${SHOWTIMES_API}/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            setShowtimes(prev =>
                prev.map(st => (st.id === data.id ? data : st))
            );
        } else {
            const res = await fetch(SHOWTIMES_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const saved = await res.json();
            setShowtimes(prev => [...prev, saved]);
        }

        setEditingShowtime(null);
        setShowModal(false);
    };

    const handleEdit = (showtime) => {
        if (showtime.status === 'closed') return;
        setEditingShowtime(showtime);
        setShowModal(true);
    };

    const handleToggleLock = async (showtime) => {
        const updated = {
            ...showtime,
            status: showtime.status === 'open' ? 'locked' : 'open'
        };

        await fetch(`${SHOWTIMES_API}/${showtime.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });

        setShowtimes(prev =>
            prev.map(st => (st.id === showtime.id ? updated : st))
        );
    };

    const handleDelete = async (showtime) => {
        if (showtime.status === 'closed') return;

        if (!window.confirm('Are you sure you want to delete this showtime?')) {
            return;
        }

        await fetch(`${SHOWTIMES_API}/${showtime.id}`, {
            method: 'DELETE'
        });

        setShowtimes(prev =>
            prev.filter(st => st.id !== showtime.id)
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
                <Col className="text-center">
                    <h1 className="fw-bold text-primary mb-0">
                        🎬 Showtime Management
                    </h1>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="justify-content-center">
                <Col xl={10} className="text-end mb-3">
                    <Button
                        variant="primary"
                        onClick={() => {
                            setEditingShowtime(null);
                            setShowModal(true);
                        }}
                    >
                        ➕ Create Showtime
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <ShowtimeList
                        showtimes={showtimes}
                        movies={movies}
                        rooms={rooms}
                        onEdit={handleEdit}
                        onToggleLock={handleToggleLock}
                        onDelete={handleDelete}
                    />
                </Col>
            </Row>

            <ShowtimeModal
                show={showModal}
                onHide={() => setShowModal(false)}
                movies={movies}
                rooms={rooms}
                showtimes={showtimes}
                initialData={editingShowtime}
                onSubmit={handleSubmit}
            />
        </Container>
    );
}

export default ShowtimeManagement;

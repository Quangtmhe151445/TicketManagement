import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import RoomList from './RoomList';
import RoomForm from './RoomForm';

const API_URL = 'http://localhost:9999/cinema_rooms';

const numberToLetter = (n) => String.fromCharCode(65 + n);

const buildSeatData = (formData) => {
  const totalRows = parseInt(formData.total_rows, 10);
  const seatsPerRow = parseInt(formData.seats_per_row, 10);

  const vipRows = formData.vip_rows
    .toUpperCase()
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);

  const coupleRows = formData.couple_rows
    .toUpperCase()
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);

  const seat_map = [];
  const seat_types = {};
  let total_seats = 0;

  for (let i = 0; i < totalRows; i++) {
    const rowLetter = numberToLetter(i);
    const row = [];

    let type = 'Standard';
    if (vipRows.includes(rowLetter)) type = 'VIP';
    if (coupleRows.includes(rowLetter)) type = 'Couple';

    seat_types[rowLetter] = type;

    for (let j = 1; j <= seatsPerRow; j++) {
      row.push(`${rowLetter}${j}`);
      total_seats++;
    }

    seat_map.push(row);
  }

  return { seat_map, seat_types, total_seats };
};

function CinemaRoomManager() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        const text = await res.text();
        console.error('API ERROR:', text);
        throw new Error('Failed to load room data');
      }
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSave = async (formData, room) => {
    setError(null);
    const isEditing = !!room;
    const newRoomName = formData.name.trim();

    const isDuplicate = rooms.some(r => 
        r.name.trim().toLowerCase() === newRoomName.toLowerCase() && 
        (!isEditing || r.id !== room.id) 
    );

    if (isDuplicate) {
        setError(`Room name "${newRoomName}" already exists. Please choose a different name.`);
        return; 
    }

    const seatData = buildSeatData(formData);

    const newRoom = {
      id: room ? room.id : `room_${Date.now()}`,
      name: newRoomName, 
      type: formData.type,
      status: formData.status,
      ...seatData
    };

    const method = room ? 'PUT' : 'POST';
    const url = room ? `${API_URL}/${room.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });

      if (!res.ok) throw new Error('Failed to save room');

      setShowForm(false);
      setCurrentRoom(null);
      fetchRooms();
    } catch (err) {
      console.error('SAVE ERROR:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const res = await fetch(`${API_URL}/${roomId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion failed');
      fetchRooms();
    } catch (err) {
      console.error('DELETE ERROR:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" /> <div>Loading data...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 pb-5"> 
      <h3 className="text-center mb-4">🎬 Cinema Room Manager</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col className="text-end">
          <Button
            variant="success"
            onClick={() => {
              setCurrentRoom(null);
              setShowForm(true);
            }}
          >
            ➕ Add New Room
          </Button>
        </Col>
      </Row>

      {showForm && (
        <RoomForm
          room={currentRoom}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setCurrentRoom(null);
          }}
        />
      )}

      {!showForm && (
        <RoomList
          rooms={rooms}
          onEdit={(room) => {
            setCurrentRoom(room);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
}

export default CinemaRoomManager;
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const roomNameOptions = [
    ...Array.from({ length: 10 }, (_, i) => `Room ${i + 1}`),
    'Room VIP',
    'Room VIP Plus',
    'Room VIP Max',
];

const defaultRoomData = {
    name: roomNameOptions[0], 
    type: '2D Standard',
    status: 'active',
    total_rows: 10,
    seats_per_row: 15,
    vip_rows: '',
    couple_rows: '',
};

function RoomForm({ room, onSave, onCancel }) {
    const [formData, setFormData] = useState(defaultRoomData);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (room) {
            const seatTypes = room.seat_types || {};
            const vipRows = [];
            const coupleRows = [];

            Object.keys(seatTypes).forEach(rowLetter => {
                if (seatTypes[rowLetter] === 'VIP') {
                    vipRows.push(rowLetter);
                } else if (seatTypes[rowLetter] === 'Couple') {
                    coupleRows.push(rowLetter);
                }
            });

            const totalRows = room.seat_map ? room.seat_map.length : 0;
            const seatsPerRow = (room.seat_map && room.seat_map.length > 0)
                                ? room.seat_map[0].length
                                : 0;

            const initialRoomName = roomNameOptions.includes(room.name) ? room.name : room.name || defaultRoomData.name;

            setFormData({
                ...defaultRoomData,
                ...room,
                name: initialRoomName,
                total_rows: totalRows,
                seats_per_row: seatsPerRow,
                vip_rows: vipRows.join(', '),
                couple_rows: coupleRows.join(', '),
            });
        } else {
            setFormData(defaultRoomData);
        }
    }, [room]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            onSave(formData, room);
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="roomName">
                    <Form.Label>Cinema Room Name</Form.Label>
                    <Form.Select
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    >
                        {/* Render các tùy chọn tên phòng */}
                        {roomNameOptions.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Please select the room name.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="roomType">
                    <Form.Label>Room Type</Form.Label>
                    <Form.Select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="2D Standard">2D Standard</option>
                        <option value="3D IMAX">3D IMAX</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Please select a room type.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="roomStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Please select the status.</Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Card className="p-3 bg-light">
                <Card.Title>Seat Configuration</Card.Title>
                <Row>
                    <Form.Group as={Col} md="3" controlId="totalRows" className="mb-3">
                        <Form.Label>Total Number of Rows (Max 26)</Form.Label>
                        <Form.Control
                            type="number"
                            name="total_rows"
                            min="1"
                            max="26"
                            value={formData.total_rows}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Please enter the total number of rows (1-26).</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="seatsPerRow" className="mb-3">
                        <Form.Label>Seats Per Row (Max 30)</Form.Label>
                        <Form.Control
                            type="number"
                            name="seats_per_row"
                            min="1"
                            max="30"
                            value={formData.seats_per_row}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Please enter the number of seats per row (1-30).</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="vipRows" className="mb-3">
                        <Form.Label>VIP Rows (Ex: B,C)</Form.Label>
                        <Form.Control type="text" name="vip_rows" placeholder="B, C" value={formData.vip_rows} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="coupleRows" className="mb-3">
                        <Form.Label>Couple Rows (Ex: D)</Form.Label>
                        <Form.Control type="text" name="couple_rows" placeholder="D" value={formData.couple_rows} onChange={handleChange} />
                    </Form.Group>
                </Row>
            </Card>

            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={onCancel} className="me-2">Cancel</Button>
                <Button type="submit" variant="primary">{room ? 'Update Room' : 'Add Room'}</Button>
            </div>
        </Form>
    );
}

RoomForm.propTypes = {
    room: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default RoomForm;
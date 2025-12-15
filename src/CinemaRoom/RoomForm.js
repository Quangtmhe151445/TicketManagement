// src/CinemaRoom/RoomForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const defaultRoomData = {
    name: '',
    type: '2D Standard', 
    status: 'active', 
    total_rows: 10, 
    seats_per_row: 15,
    vip_rows: '', // String example: A,B,C
    couple_rows: '', // String example: D
};

function RoomForm({ room, onSave, onCancel }) {
    const [formData, setFormData] = useState(defaultRoomData);
    const [validated, setValidated] = useState(false);

    // Key Logic: Load data from DB (room object) into the form when editing
    useEffect(() => {
        if (room) {
            // Load data for editing from DB structure (room.seat_map, room.seat_types)
            
            // 1. Analyze seat types (seat_types): Convert object {'A': 'VIP', 'B': 'Standard'}
            // to string 'A' for vip_rows
            const seatTypes = room.seat_types || {};
            const vipRows = [];
            const coupleRows = [];
            
            Object.keys(seatTypes).forEach(rowLetter => {
                // Check seat type by name saved in database.json
                if (seatTypes[rowLetter] === 'VIP') {
                    vipRows.push(rowLetter);
                } else if (seatTypes[rowLetter] === 'Couple') {
                    coupleRows.push(rowLetter);
                }
            });

            // 2. Calculate number of rows and seats per row (from seat_map)
            const totalRows = room.seat_map ? room.seat_map.length : 0;
            // Assume all rows have the same number of seats, get the number of seats in the first row
            const seatsPerRow = (room.seat_map && room.seat_map.length > 0) 
                                ? room.seat_map[0].length 
                                : 0;
            
            setFormData({
                ...defaultRoomData,
                ...room, // Get basic properties (id, name, type, status)
                // Override with values calculated from DB
                total_rows: totalRows,
                seats_per_row: seatsPerRow,
                vip_rows: vipRows.join(', '), // Convert array to string
                couple_rows: coupleRows.join(', '), // Convert array to string
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
            // Call onSave function in CinemaRoomManager with formData and current room
            onSave(formData, room);
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="roomName">
                    <Form.Label>Cinema Room Name</Form.Label> {/* Dịch: Tên Phòng Chiếu */}
                    <Form.Control
                        required
                        type="text"
                        placeholder="Ex: Room 01" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">Please enter the room name.</Form.Control.Feedback> {/* Dịch: Vui lòng nhập tên phòng. */}
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="roomType">
                    <Form.Label>Room Type</Form.Label> {/* Dịch: Loại Phòng */}
                    <Form.Select name="type" value={formData.type} onChange={handleChange} required>
                        <option value="2D Standard">2D Standard</option>
                        <option value="3D IMAX">3D IMAX</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Please select a room type.</Form.Control.Feedback> {/* Dịch: Vui lòng chọn loại phòng. */}
                </Form.Group>

                <Form.Group as={Col} md="3" controlId="roomStatus">
                    <Form.Label>Status</Form.Label> {/* Dịch: Tình Trạng */}
                    <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="active">Active</option> {/* Dịch: Đang Sử Dụng */}
                        <option value="maintenance">Maintenance</option> {/* Dịch: Bảo Trì */}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Please select the status.</Form.Control.Feedback> {/* Dịch: Vui lòng chọn tình trạng. */}
                </Form.Group>
            </Row>

            <Card className="p-3 bg-light">
                <Card.Title>Seat Configuration</Card.Title> {/* Dịch: Cấu Hình Ghế */}
                <Row>
                    <Form.Group as={Col} md="3" controlId="totalRows" className="mb-3">
                        <Form.Label>Total Number of Rows</Form.Label> {/* Dịch: Tổng Số Hàng Ghế */}
                        <Form.Control type="number" name="total_rows" min="1" value={formData.total_rows} onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">Please enter the total number of rows.</Form.Control.Feedback> {/* Dịch: Vui lòng nhập tổng số hàng. */}
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="seatsPerRow" className="mb-3">
                        <Form.Label>Seats Per Row</Form.Label> {/* Dịch: Số Ghế Mỗi Hàng */}
                        <Form.Control type="number" name="seats_per_row" min="1" value={formData.seats_per_row} onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">Please enter the number of seats per row.</Form.Control.Feedback> {/* Dịch: Vui lòng nhập số ghế mỗi hàng. */}
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="vipRows" className="mb-3">
                        <Form.Label>VIP Rows (Ex: B,C)</Form.Label> {/* Dịch: Hàng Ghế VIP (VD: B,C) */}
                        <Form.Control type="text" name="vip_rows" placeholder="B, C" value={formData.vip_rows} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="coupleRows" className="mb-3">
                        <Form.Label>Couple Rows (Ex: D)</Form.Label> {/* Dịch: Hàng Ghế Couple (VD: D) */}
                        <Form.Control type="text" name="couple_rows" placeholder="D" value={formData.couple_rows} onChange={handleChange} />
                    </Form.Group>
                </Row>
            </Card>

            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={onCancel} className="me-2">Cancel</Button> {/* Dịch: Hủy */}
                <Button type="submit" variant="primary">{room ? 'Update Room' : 'Add Room'}</Button> {/* Dịch: Cập Nhật Phòng / Thêm Phòng */}
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
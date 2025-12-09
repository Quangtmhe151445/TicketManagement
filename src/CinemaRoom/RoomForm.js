// src/CinemaRoom/RoomForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const defaultRoomData = {
    name: '',
    type: '2D', 
    status: 'active', 
    total_rows: 10, 
    seats_per_row: 5,
    vip_rows: '', 
    couple_rows: '', 
};

function RoomForm({ room, onSave, onCancel }) {
    const [formData, setFormData] = useState(defaultRoomData);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (room) {
            // Load dữ liệu khi chỉnh sửa
            setFormData({
                name: room.name || '',
                type: room.type || '2D',
                status: room.status || 'active',
                
                // Giả lập dữ liệu cho UI từ dữ liệu DB
                total_rows: room.seat_map ? room.seat_map.length : defaultRoomData.total_rows, 
                seats_per_row: room.seat_map && room.seat_map[0] ? room.seat_map[0].length : defaultRoomData.seats_per_row,
                
                // Cấu hình lại hàng VIP/Couple từ object seat_types của DB
                vip_rows: Object.keys(room.seat_types || {}).filter(row => room.seat_types[row] === 'VIP').join(', ') || defaultRoomData.vip_rows, 
                couple_rows: Object.keys(room.seat_types || {}).filter(row => room.seat_types[row] === 'Couple').join(', ') || defaultRoomData.couple_rows, 
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
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            const finalData = { ...room, ...formData };
            onSave(finalData);
        }
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="roomName">
                    <Form.Label>Tên Phòng Chiếu <span className="text-danger">*</span></Form.Label>
                    <Form.Control required type="text" placeholder="Ví dụ: Phòng 5" name="name" value={formData.name} onChange={handleChange}/>
                    <Form.Control.Feedback type="invalid">Vui lòng nhập tên phòng.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="roomType">
                    <Form.Label>Loại Phòng</Form.Label>
                    <Form.Select required name="type" value={formData.type} onChange={handleChange}>
                        <option value="2D">2D Thường</option><option value="3D">3D</option><option value="IMAX">IMAX</option><option value="VIP">VIP</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">Vui lòng chọn loại phòng.</Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="roomStatus">
                    <Form.Label>Tình Trạng Phòng</Form.Label>
                    <Form.Select required name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Đang Sử Dụng</option><option value="maintenance">Bảo Trì</option>
                    </Form.Select>
                </Form.Group>
            </Row>

            <Card className="mt-3 p-3 bg-white">
                <Card.Title className="text-info">Cấu Hình Sơ Đồ Ghế (Ghế Thường, VIP, Couple)</Card.Title>
                <Row>
                    <Form.Group as={Col} md="3" controlId="totalRows">
                        <Form.Label>Tổng Số Hàng Ghế</Form.Label>
                        <Form.Control type="number" name="total_rows" min="1" value={formData.total_rows} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="seatsPerRow">
                        <Form.Label>Số Ghế Mỗi Hàng</Form.Label>
                        <Form.Control type="number" name="seats_per_row" min="1" value={formData.seats_per_row} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="vipRows">
                        <Form.Label>Hàng Ghế VIP (VD: B,C)</Form.Label>
                        <Form.Control type="text" name="vip_rows" placeholder="B, C" value={formData.vip_rows} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="coupleRows">
                        <Form.Label>Hàng Ghế Couple (VD: D)</Form.Label>
                        <Form.Control type="text" name="couple_rows" placeholder="D" value={formData.couple_rows} onChange={handleChange} />
                    </Form.Group>
                </Row>
            </Card>

            <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={onCancel} className="me-2">Hủy</Button>
                <Button type="submit" variant="primary">{room ? 'Cập Nhật Phòng' : 'Thêm Phòng'}</Button>
            </div>
        </Form>
    );
}

RoomForm.propTypes = { 
    room: PropTypes.object, 
    onSave: PropTypes.func.isRequired, 
    onCancel: PropTypes.func.isRequired, 
};

RoomForm.defaultProps = { room: null };

export default RoomForm;
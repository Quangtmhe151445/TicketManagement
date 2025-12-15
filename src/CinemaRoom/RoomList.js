// src/CinemaRoom/RoomList.js
import React from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

// Helper function to format seat types from object to readable string
// Example: {A: 'Standard', B: 'Standard', C: 'VIP'} -> 'Standard: A, B; VIP: C'
const formatSeatTypes = (seatTypes) => {
    if (!seatTypes || Object.keys(seatTypes).length === 0) {
        return 'Standard (Unknown)'; // Dịch: Standard (Chưa rõ)
    }

    const groups = {};
    
    // Group seat types
    Object.keys(seatTypes).forEach(rowLetter => {
        const type = seatTypes[rowLetter];
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(rowLetter);
    });

    // Convert groups to string
    return Object.keys(groups).map(type => {
        // Sort row letters (A, B, C...) before joining
        return `${type}: ${groups[type].sort().join(', ')}`;
    }).join('; ');
};

function RoomList({ rooms, onEdit, onDelete }) {
    const getStatusVariant = (status) => {
        return status === 'active' ? 'success' : 'warning';
    };

    return (
        <div className="table-responsive">
            <h4 className="mb-3 text-secondary">List of Existing Cinema Rooms</h4> {/* Dịch: Danh Sách Phòng Chiếu Hiện Có */}
            <Table striped bordered hover className="mt-3 align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Room Name</th> {/* Dịch: Tên Phòng */}
                        <th>Room Type</th> {/* Dịch: Loại Phòng */}
                        <th>Status</th> {/* Dịch: Tình Trạng */}
                        <th>Total Seats</th> {/* Dịch: Tổng Ghế */}
                        <th>Seat Configuration</th> {/* Dịch: Cấu Hình Ghế */}
                        <th>Actions</th> {/* Dịch: Thao Tác */}
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room, index) => (
                        <tr key={room.id}>
                            <td>{index + 1}</td>
                            <td>**{room.name}**</td>
                            <td>**{room.type}**</td>
                            <td>
                                <Badge pill bg={getStatusVariant(room.status)}>
                                    {room.status === 'active' ? 'Active' : 'Maintenance'} {/* Dịch: Đang Sử Dụng / Bảo Trì */}
                                </Badge>
                            </td>
                            <td>{room.total_seats}</td>
                            {/* Get and format data from room.seat_types */}
                            <td>{formatSeatTypes(room.seat_types)}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => onEdit(room)} className="me-2">Edit</Button> {/* Dịch: Sửa */}
                                <Button variant="danger" size="sm" onClick={() => onDelete(room.id)}>Delete</Button> {/* Dịch: Xóa */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {rooms.length === 0 && <Alert variant="info" className="text-center">No cinema rooms have been created yet.</Alert>} {/* Dịch: Chưa có phòng chiếu nào được tạo. */}
        </div>
    );
}

RoomList.propTypes = {
    rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default RoomList;
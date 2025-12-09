// src/CinemaRoom/RoomList.js
import React from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

function RoomList({ rooms, onEdit, onDelete }) {
    const getStatusVariant = (status) => {
        return status === 'active' ? 'success' : 'warning';
    };

    return (
        <div className="table-responsive">
            <h4 className="mb-3 text-secondary">Danh Sách Phòng Chiếu Hiện Có</h4>
            <Table striped bordered hover className="mt-3 align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Tên Phòng</th>
                        <th>Loại Phòng</th>
                        <th>Tình Trạng</th>
                        <th>Tổng Số Ghế</th>
                        <th>Sơ Đồ Ghế (Loại Ghế)</th>
                        <th>Hành Động</th>
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
                                    {room.status === 'active' ? 'Đang Sử Dụng' : 'Bảo Trì'}
                                </Badge>
                            </td>
                            <td>{room.total_seats}</td>
                            <td>{room.seat_types || 'N/A'}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => onEdit(room)} className="me-2">Sửa</Button>
                                <Button variant="danger" size="sm" onClick={() => onDelete(room.id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {rooms.length === 0 && <Alert variant="info" className="text-center">Chưa có phòng chiếu nào được tạo.</Alert>}
        </div>
    );
}

RoomList.propTypes = {
    rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default RoomList;
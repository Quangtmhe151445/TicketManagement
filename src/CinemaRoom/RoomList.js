import React from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const formatSeatTypes = (seatTypes) => {
    if (!seatTypes || Object.keys(seatTypes).length === 0) {
        return 'Standard (Unknown)'; 
    }

    const groups = {};
    Object.keys(seatTypes).forEach(rowLetter => {
        const type = seatTypes[rowLetter];
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(rowLetter);
    });

    return Object.keys(groups).map(type => {
        return `${type}: ${groups[type].sort().join(', ')}`;
    }).join('; ');
};

function RoomList({ rooms, onEdit, onDelete }) {
    const getStatusVariant = (status) => {
        return status === 'active' ? 'success' : 'warning';
    };

    return (
        <div className="table-responsive">
            <h4 className="mb-3 text-secondary">List of Existing Cinema Rooms</h4> 
            <Table striped bordered hover className="mt-3 align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Room Name</th> 
                        <th>Room Type</th> 
                        <th>Status</th> 
                        <th>Total Seats</th> 
                        <th>Seat Configuration</th> 
                        <th>Actions</th> 
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
                                    {room.status === 'active' ? 'Active' : 'Maintenance'} 
                                </Badge>
                            </td>
                            <td>{room.total_seats}</td>
                            <td>{formatSeatTypes(room.seat_types)}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => onEdit(room)} className="me-2">Edit</Button> 
                                <Button variant="danger" size="sm" onClick={() => onDelete(room.id)}>Delete</Button> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {rooms.length === 0 && <Alert variant="info" className="text-center">No cinema rooms have been created yet.</Alert>} 
        </div>
    );
}

RoomList.propTypes = {
    rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default RoomList;
import React from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ShowtimeList({ showtimes, movies, rooms, onLock }) {
const getStatusVariant = (status) => {
return status === 'open' ? 'success' : 'secondary';
};


const getMovieTitle = (movieId) => {
return movies.find(m => m.id === movieId)?.title || 'N/A';
};


const getRoomName = (roomId) => {
return rooms.find(r => r.id === roomId)?.name || 'N/A';
};


return (
<div className="table-responsive">
<h4 className="mb-3 text-secondary">Danh Sách Lịch Chiếu</h4>
<Table striped bordered hover className="align-middle">
<thead className="table-dark">
<tr>
<th>#</th>
<th>Phim</th>
<th>Phòng</th>
<th>Bắt đầu</th>
<th>Kết thúc</th>
<th>Trạng thái</th>
<th>Hành động</th>
</tr>
</thead>
<tbody>
{showtimes.map((st, index) => (
<tr key={st.id}>
<td>{index + 1}</td>
<td>{getMovieTitle(st.movie_id)}</td>
<td>{getRoomName(st.room_id)}</td>
<td>{st.start_time}</td>
<td>{st.end_time}</td>
<td>
<Badge pill bg={getStatusVariant(st.status)}>
{st.status === 'open' ? 'Đang mở' : 'Đã khóa'}
</Badge>
</td>
<td>
{st.status === 'open' && (
<Button
variant="warning"
size="sm"
onClick={() => onLock(st.id)}
>
Khóa
</Button>
)}
</td>
</tr>
))}
</tbody>
</Table>


{showtimes.length === 0 && (
<Alert variant="info" className="text-center">
Chưa có lịch chiếu nào được tạo.
</Alert>
)}
</div>
);
}

ShowtimeList.propTypes = {
showtimes: PropTypes.arrayOf(PropTypes.object).isRequired,
movies: PropTypes.arrayOf(PropTypes.object).isRequired,
rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
onLock: PropTypes.func.isRequired,
};


export default ShowtimeList;
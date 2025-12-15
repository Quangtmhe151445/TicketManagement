export default function ShowtimeList({ showtimes, movies, rooms, onLock }) {
return (
<table border="1" cellPadding="5">
<thead>
<tr>
<th>Phim</th>
<th>Phòng</th>
<th>Bắt đầu</th>
<th>Kết thúc</th>
<th>Trạng thái</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{showtimes.map(st => (
<tr key={st.id}>
<td>{movies.find(m => m.id === st.movie_id)?.title}</td>
<td>{rooms.find(r => r.id === st.room_id)?.name}</td>
<td>{st.start_time}</td>
<td>{st.end_time}</td>
<td>{st.status}</td>
<td>
{st.status === "open" && (
<button onClick={() => onLock(st.id)}>Khóa</button>
)}
</td>
</tr>
))}
</tbody>
</table>
);
}
import { useEffect, useState } from "react";


const MOVIES_API = "http://localhost:9999/movies";
const ROOMS_API = "http://localhost:9999/cinema_rooms";
const SHOWTIMES_API = "http://localhost:9999/showtimes";


export default function ShowtimeManagement() {
const [movies, setMovies] = useState([]);
const [rooms, setRooms] = useState([]);
const [showtimes, setShowtimes] = useState([]);


useEffect(() => {
fetch(MOVIES_API).then(r => r.json()).then(setMovies);
fetch(ROOMS_API).then(r => r.json()).then(setRooms);
fetch(SHOWTIMES_API).then(r => r.json()).then(setShowtimes);
}, []);


const addShowtime = async (newShowtime) => {
const res = await fetch(SHOWTIMES_API, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(newShowtime)
});
const saved = await res.json();
setShowtimes(prev => [...prev, saved]);
};


const lockShowtime = async (id) => {
const st = showtimes.find(s => s.id === id);
const updated = { ...st, status: "locked" };


await fetch(`${SHOWTIMES_API}/${id}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(updated)
});


setShowtimes(showtimes.map(s => s.id === id ? updated : s));
};


return (
<div style={{ padding: 20 }}>
<h2>Quản lý lịch chiếu</h2>


<ShowtimeForm
movies={movies}
rooms={rooms}
showtimes={showtimes}
onAdd={addShowtime}
/>


<ShowtimeList
showtimes={showtimes}
movies={movies}
rooms={rooms}
onLock={lockShowtime}
/>
</div>
);
}
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timetable from "./timeTable/PersonnelManagement";
import MyNav from "./navbar.js";
import MovieList from "./movie_management/list-movie.js";
import MyFooter from "./footer.js";
import Ticket from "./TicketManager/TicketManager.js";
import PopCornManager from "./PopCorn/PopCornManager.js";
import CinemaRoomManager from "./CinemaRoom/CinemaRoomManager.js";
import AddMovie from "./movie_management/add-movie.js";
import EditMovie from "./movie_management/edit-movie.js";
import MovieDetail from "./movie_management/movie-detail.js";

function App() {
  return (
    <Router>
      <MyNav />
      <div>
        <Link to="/timetable">Go to TimeTable</Link>
        <Link to="/cinema-rooms" className="ms-2 fw-bold text-success">Quản lý Phòng Chiếu</Link> |
      </div>
      
      {/* CHỈ CÓ MỘT KHỐI ROUTES DUY NHẤT */}
      <Routes>
        <Route path="/" element={<div>Chào mừng đến trang chủ!</div>} />
        <Route path="/movie-list" element={<MovieList />}  />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/edit-movie/:id" element={<EditMovie />} />
        <Route path="/movie-detail/:id" element={<MovieDetail />} />
        <Route path="/ticket" element={<Ticket />}  />
        <Route path="/popcorn" element={<PopCornManager />}  />
        <Route path="/timetable" element={<Timetable />} />
        {/* Đường dẫn của component Quản lý Phòng Chiếu */}
        <Route path="/cinema-rooms" element={<CinemaRoomManager />} />
      </Routes>

      <MyFooter />
    </Router>

  );
}

export default App;
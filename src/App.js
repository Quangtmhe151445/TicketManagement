import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MyNav from "./navbar.js";
import MyFooter from "./footer.js";
import Login from "./timeTable/components/LoginForm.js"; // File Login của bạn
import Home from "./Home.js";
import Ticket from "./TicketManager/TicketManager.js";
import CreateTicketPage from "./TicketManager/CreateTicketPage.js";
import EditTicketPage from "./TicketManager/EditTicketPage.js";
import ShowtimeManagement from "./showtimes/ShowtimeManagement.js";
import MovieList from "./movie_management/list-movie.js";
import AddMovie from "./movie_management/add-movie.js";
import CinemaRoomManager from "./CinemaRoom/CinemaRoomManager.js";
import PopCornManager from "./PopCorn/PopCornManager.js";
import Timetable from "./timeTable/PersonnelManagement.js";
import Register from "./Register.js";

function App() {
  const [user, setUser] = useState(null);

  // 1. Kiểm tra xem có user lưu trong máy không khi vừa mở web
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. Hàm xử lý khi đăng nhập thành công
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 3. Hàm xử lý khi đăng xuất
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      {/* Truyền user và hàm logout vào Navbar */}
      <MyNav user={user}  onLogout={handleLogout} />

      <Routes>

        {/* Các Route bảo vệ - Chỉ hiện nếu đã login, nếu chưa sẽ đá về trang chủ */}
        <Route
          path="/ticket"
          element={user ? <Ticket /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={user ? <CreateTicketPage /> : <Navigate to="/" />}
        />
        <Route
          path="/edit/:ticketId"
          element={user ? <EditTicketPage /> : <Navigate to="/" />}
        />
        <Route
          path="/movie-list"
          element={user ? <MovieList /> : <Navigate to="/" />}
        />
        <Route
          path="/add-movie"
          element={user ? <AddMovie /> : <Navigate to="/" />}
        />
        <Route
          path="/showtimes"
          element={user ? <ShowtimeManagement /> : <Navigate to="/" />}
        />
        <Route
          path="/cinema-rooms"
          element={user ? <CinemaRoomManager /> : <Navigate to="/" />}
        />
        <Route
          path="/popcorn"
          element={user ? <PopCornManager /> : <Navigate to="/" />}
        />
        <Route
          path="/timetable"
          element={user ? <Timetable /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login onLogin={handleLogin} /> : <Home />}
        />
          <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/" />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>

      <MyFooter />
    </Router>
  );
}

export default App;

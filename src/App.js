import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MyNav from "./navbar.js";
import MyFooter from "./footer.js";
import Ticket from "./TicketManager/TicketManager.js";
import PopCornManager from "./PopCorn/PopCornManager.js";
import CinemaRoomManager from "./CinemaRoom/CinemaRoomManager.js";
import EditTicketPage from "./TicketManager/EditTicketPage.js";
import MovieList from "./movie_management/list-movie.js";
import Timetable from "./timeTable/components/Timetable";
import CreateTicketPage from "./TicketManager/CreateTicketPage.js";

function App() {
  return (
    <Router>
      <MyNav />

      <Routes>
        <Route path="/movie-list" element={<MovieList />} />

        <Route path="/ticket" element={<Ticket />} />
        <Route path="/create" element={<CreateTicketPage />} />
        <Route path="/edit/:ticketId" element={<EditTicketPage />} />

        <Route path="/popcorn" element={<PopCornManager />} />
        <Route path="/timetable" element={<Timetable />} />

        <Route path="/cinema-rooms" element={<CinemaRoomManager />} />
      </Routes>

      <MyFooter />
    </Router>
  );
}

export default App;

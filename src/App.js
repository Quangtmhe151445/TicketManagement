
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timetable from "./timeTable/PersonnelManagement";
import MyNav from "./navbar.js";
import MovieList from "./movie_management/list-movie.js";
import MyFooter from "./footer.js";
import Ticket from "./TicketManager/TicketManager.js";
import PopCornManager from "./PopCorn/PopCornManager.js";

function App() {
  return (
    <Router>
      <MyNav />
      <div>
        <Link to="/timetable">Go to TimeTable</Link>
      </div>
      
      <Routes>
        <Route path="/movie-list" element={<MovieList />}  />
      </Routes>
       <Routes>
        <Route path="/ticket" element={<Ticket />}  />
      </Routes>
      <Routes>
        <Route path="/popcorn" element={<PopCornManager />}  />
        <Route path="/movie-list" element={<MovieList />} />
        <Route path="/timetable" element={<Timetable />} />
      </Routes>

      <MyFooter />
    </Router>

  );
}

export default App;

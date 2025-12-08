import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timetable from "./timeTable/PersonnelManagement";
import MyNav from "./navbar.js";
import MovieList from "./movie_management/list-movie.js";
import MyFooter from "./footer.js";

function App() {
  return (
    <Router>
      <MyNav />
      <div>
        <Link to="/timetable">Go to TimeTable</Link>
      </div>

      <Routes>
        <Route path="/movie-list" element={<MovieList />} />
        <Route path="/timetable" element={<Timetable />} />
      </Routes>

      <MyFooter />
    </Router>
  );
}

export default App;

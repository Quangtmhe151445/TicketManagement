import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Timetable from "./timeTable/PersonnelManagement";

function App() {
  return (
    <Router>
      <div>
        <Link to="/timetable">Go to TimeTable</Link>

        <Routes>
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

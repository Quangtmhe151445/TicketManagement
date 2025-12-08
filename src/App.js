import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNav from "./navbar.js";
import MovieList from "./movie_management/list-movie.js";
import MyFooter from "./footer.js";

function App() {
  return (
    <Router>
      <MyNav />

      <Routes>
        <Route path="/movie-list" element={<MovieList />} />
      </Routes>

      <MyFooter/>
    </Router>
  );
}

export default App;

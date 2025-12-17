import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Form, 
  Badge, 
  Table, 
  Spinner, 
  Container,
  Pagination 
} from "react-bootstrap";

const API_URL = "http://localhost:9999";

const ListMovie = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [movies, setMovies] = useState([]);
  const [movieStatus, setMovieStatus] = useState([]);
  const [ageRatings, setAgeRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- State cho phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, statusRes, ratingsRes] = await Promise.all([
        fetch(`${API_URL}/movies`),
        fetch(`${API_URL}/movieStatus`),
        fetch(`${API_URL}/ageRatings`)
      ]);
      const [moviesData, statusData, ratingsData] = await Promise.all([
        moviesRes.json(),
        statusRes.json(),
        ratingsRes.json()
      ]);
      setMovies(moviesData);
      setMovieStatus(statusData);
      setAgeRatings(ratingsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc dữ liệu
  const filteredMovies = movies.filter((movie) => {
    const matchName = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "" || movie.statusId === parseInt(statusFilter);
    return matchName && matchStatus;
  });

  // --- Tính toán phân trang ---
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Reset về trang 1 khi tìm kiếm hoặc lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusLabel = (id) => movieStatus.find((s) => s.id === id)?.label || "N/A";
  const getAgeRatingCode = (id) => ageRatings.find((r) => r.id === id)?.code || "N/A";

  if (loading) return (
    <Container className="py-5 text-center"><Spinner animation="border" /></Container>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🎬 MOVIE MANAGEMENT</h2>
        <Button variant="success" onClick={() => navigate('/add-movie')}>+ Add Movie</Button>
      </div>

      {/* Filter Section */}
      <Card className="shadow-sm mb-4 border-0 bg-light">
        <Card.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Control 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </Col>
            <Col md={4}>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                {movieStatus.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table Section */}
      <Card className="shadow-sm border-0 overflow-hidden mb-3">
        <Table hover align="middle" className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Rating</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentMovies.map((movie) => (
              <tr key={movie.id}>
                <td><img src={movie.poster} alt="p" style={{ width: '40px', borderRadius: '4px' }} /></td>
                <td><div className="fw-bold">{movie.title}</div></td>
                <td><small>{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</small></td>
                <td>{movie.duration}m</td>
                <td><Badge bg="warning" text="dark">{getAgeRatingCode(movie.ageRatingId)}</Badge></td>
                <td className="text-center">
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/movie-detail/${movie.id}`)}>View</Button>
                  <Button variant="outline-danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* --- UI Phân trang --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item 
                key={index + 1} 
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}

      <div className="text-center text-muted mt-2 small">
        Showing {indexOfFirstMovie + 1} to {Math.min(indexOfLastMovie, filteredMovies.length)} of {filteredMovies.length} movies
      </div>
    </div>
  );
};

export default ListMovie;
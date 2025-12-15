import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Form, Badge } from "react-bootstrap";

const API_URL = "http://localhost:9999";

const ListMovie = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [movies, setMovies] = useState([]);
  const [movieStatus, setMovieStatus] = useState([]);
  const [ageRatings, setAgeRatings] = useState([]);
  const [loading, setLoading] = useState(true);

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

      if (!moviesRes.ok || !statusRes.ok || !ratingsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [moviesData, statusData, ratingsData] = await Promise.all([
        moviesRes.json(),
        statusRes.json(),
        ratingsRes.json()
      ]);

      setMovies(moviesData);
      setMovieStatus(statusData);
      setAgeRatings(ratingsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Cannot load data. Please ensure the API server is running on http://localhost:9999');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (statusId) => {
    return movieStatus.find((s) => s.id === statusId)?.label || "";
  };

  const getStatusBadge = (statusId) => {
    switch (statusId) {
      case 1:
        return "success";
      case 2:
        return "primary";
      case 3:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getAgeRatingCode = (ageRatingId) => {
    return ageRatings.find((r) => r.id === ageRatingId)?.code || "";
  };

  const filteredMovies = movies.filter((movie) => {
    const matchName = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "" || movie.statusId === parseInt(statusFilter);
    return matchName && matchStatus;
  });

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        const response = await fetch(`${API_URL}/movies/${movieId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete movie');
        }

        setMovies(movies.filter(m => m.id !== movieId));
        alert('Movie deleted successfully!');
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete movie. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Movie List</h1>
        <Button variant="primary" onClick={() => navigate('/add-movie')}>
          + Add New Movie
        </Button>
      </div>

      {/* Filter */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by movie title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            <Col md={6}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All status</option>
                {movieStatus.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {filteredMovies.map((movie) => (
          <Col key={movie.id} xs={12} sm={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  style={{ height: "300px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />

                <Badge
                  bg={getStatusBadge(movie.statusId)}
                  className="position-absolute top-0 end-0 m-2"
                >
                  {getStatusLabel(movie.statusId)}
                </Badge>
              </div>

              <Card.Body>
                <Card.Title className="text-truncate" title={movie.title}>
                  {movie.title}
                </Card.Title>

                <div className="text-muted small mb-2">
                  <strong>Genre: </strong>
                  {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>Duration:</strong> {movie.duration} min
                  </div>

                  <Badge bg="warning" text="dark">
                    {getAgeRatingCode(movie.ageRatingId)}
                  </Badge>
                </div>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex-fill"
                    onClick={() => navigate(`/movie-detail/${movie.id}`)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="flex-fill"
                    onClick={() => navigate(`/edit-movie/${movie.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredMovies.length === 0 && (
        <Card className="shadow-sm text-center py-5 mt-4">
          <Card.Body>
            <h4 className="mb-2">No movies found</h4>
            <p className="text-muted">Try changing the filter or add a new movie</p>
          </Card.Body>
        </Card>
      )}

      <div className="text-center text-muted mt-4">
        Showing {filteredMovies.length} movie(s)
      </div>
    </div>
  );
};

export default ListMovie;
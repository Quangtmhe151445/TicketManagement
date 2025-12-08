import React, { useState } from "react";
import { Card, Button, Row, Col, Form, Badge } from "react-bootstrap";

const ListMovie = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Mock data
  const movies = [
    {
      id: 1,
      title: "Your Name",
      genre: ["Romance", "Drama"],
      duration: 106,
      poster:
        "https://files.tofugu.com/articles/reviews/2017-02-14-your-name/header-5120x.jpg",
      statusId: 1,
      ageRatingId: 2,
    },
    {
      id: 2,
      title: "Spirited Away",
      genre: ["Fantasy", "Adventure"],
      duration: 125,
      poster: "/img/spirited.jpg",
      statusId: 2,
      ageRatingId: 1,
    },
    {
      id: 3,
      title: "The Dark Knight",
      genre: ["Action", "Crime"],
      duration: 152,
      poster: "/img/darkknight.jpg",
      statusId: 1,
      ageRatingId: 3,
    },
    {
      id: 4,
      title: "Inception",
      genre: ["Sci-Fi", "Thriller"],
      duration: 148,
      poster: "/img/inception.jpg",
      statusId: 3,
      ageRatingId: 3,
    },
  ];

  const movieStatus = [
    { id: 1, code: "now-showing", label: "Đang chiếu" },
    { id: 2, code: "coming-soon", label: "Sắp chiếu" },
    { id: 3, code: "ended", label: "Ngưng chiếu" },
  ];

  const ageRatings = [
    { id: 1, code: "P" },
    { id: 2, code: "C13" },
    { id: 3, code: "C16" },
    { id: 4, code: "C18" },
  ];

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

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">Danh Sách Phim</h1>

      {/* Filter */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>

            <Col md={6}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
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

      {/* Movies */}
      <Row className="g-4">
        {filteredMovies.map((movie) => (
          <Col key={movie.id} xs={12} sm={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm">

              {/* Poster */}
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  style={{ height: "300px", objectFit: "cover" }}
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
                  <strong>Thể loại: </strong>
                  {movie.genre.join(", ")}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong>Thời lượng:</strong> {movie.duration} phút
                  </div>

                  <Badge bg="warning" text="dark">
                    {getAgeRatingCode(movie.ageRatingId)}
                  </Badge>
                </div>

                <div className="d-flex gap-2">
                  <Button variant="primary" size="sm" className="flex-fill">
                    Xem
                  </Button>
                  <Button variant="success" size="sm" className="flex-fill">
                    Sửa
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* No results */}
      {filteredMovies.length === 0 && (
        <Card className="shadow-sm text-center py-5 mt-4">
          <Card.Body>
            <h4 className="mb-2">Không tìm thấy phim nào</h4>
            <p className="text-muted">Thử thay đổi bộ lọc hoặc thêm phim mới</p>
          </Card.Body>
        </Card>
      )}

      <div className="text-center text-muted mt-4">
        Hiển thị {filteredMovies.length} phim
      </div>
    </div>
  );
};

export default ListMovie;

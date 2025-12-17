import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Button,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu cho phim
  const featuredMovies = [
    {
      id: 1,
      title: "The Dark Knight Rises",
      genre: "Action, Crime, Drama",
      img: "1-16589774198841110464172-21-0-434-660-crop-16589786005051270485434.webp",
      desc: "Eight years after the Joker's reign of chaos, Batman is forced out of exile.",
    },
    {
      id: 2,
      title: "Spirited Away",
      genre: "Animation, Fantasy, Family",
      img: "Chihiro_with_Haku.webp",
      desc: "A young girl wanders into a world ruled by gods, witches, and spirits.",
    },
    {
      id: 3,
      title: "Your Name",
      genre: "Anime, Romance, Drama",
      img: "1-16.jpg",
      desc: "Two strangers find themselves linked in a bizarre way through their dreams.",
    },
  ];

  return (
    <div className="pb-5">
      {/* Hero Section / Carousel */}
      <Carousel fade className="mb-5 shadow">
        {featuredMovies.map((movie) => (
          <Carousel.Item key={movie.id} style={{ maxHeight: "500px" }}>
            <div style={{ backgroundColor: "#121212", position: "relative" }}>
              <img
                className="d-block w-100 opacity-50"
                src={movie.img}
                alt={movie.title}
                style={{ objectFit: "cover", height: "500px" }}
              />
              <Carousel.Caption className="text-start pb-5 mb-5">
                <Badge bg="warning" text="dark" className="mb-2">
                  Featured
                </Badge>
                <h1 className="display-3 fw-bold">{movie.title}</h1>
                <p className="fs-5 w-75 d-none d-md-block">{movie.desc}</p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/ticket")}
                >
                  Book Tickets Now
                </Button>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <Container>
        {/* Welcome Section */}
        <Row className="mb-5 text-center">
          <Col>
            <h2 className="fw-bold">Welcome to Cinema Management System</h2>
            <p className="text-muted">
              Manage showtimes, movies, and bookings efficiently.
            </p>
            <hr
              style={{
                width: "100px",
                margin: "auto",
                borderTop: "3px solid #0d6efd",
              }}
            />
          </Col>
        </Row>

        {/* Movies Grid */}
        <Row className="mb-4">
          <Col>
            <h4 className="mb-4 border-start border-primary border-4 ps-3">
              Now Showing
            </h4>
          </Col>
        </Row>

        <Row>
          {/* Card 1: Your Name */}
          <Col lg={3} md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0 hover-shadow">
              <Card.Img variant="top" src="1-16.jpg" />
              <Card.Body>
                <Card.Title className="fw-bold">Your Name</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">
                  Fantasy, Romance
                </Card.Subtitle>
                <Card.Text className="small text-truncate-3">
                  A high school girl in rural Japan and a high school boy in
                  Tokyo swap bodies.
                </Card.Text>
                <Button variant="outline-primary" size="sm" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2: The Dark Knight */}
          <Col lg={3} md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src="1-16589774198841110464172-21-0-434-660-crop-16589786005051270485434.webp"
              />
              <Card.Body>
                <Card.Title className="fw-bold">The Dark Knight</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">
                  Action, Thriller
                </Card.Subtitle>
                <Card.Text className="small text-truncate-3">
                  The dark knight faces his greatest challenge yet against Bane.
                </Card.Text>
                <Button variant="outline-primary" size="sm" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3: Inception */}
          <Col lg={3} md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHEsvhk1qXrivsLoC86v3LVi3JDN-R2Km2lQ&s"
              />
              <Card.Body>
                <Card.Title className="fw-bold">Inception</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">
                  Sci-Fi, Action
                </Card.Subtitle>
                <Card.Text className="small">
                  A thief who steals corporate secrets through use of
                  dream-sharing technology.
                </Card.Text>
                <Button variant="outline-primary" size="sm" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 4: Spirited Away */}
          <Col lg={3} md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Img variant="top" src="Chihiro_with_Haku.webp" />
              <Card.Body>
                <Card.Title className="fw-bold">Spirited Away</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">
                  Family, Adventure
                </Card.Subtitle>
                <Card.Text className="small">
                  Chiriro enters a magical world to save her parents from a
                  curse.
                </Card.Text>
                <Button variant="outline-primary" size="sm" className="w-100">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Statistics Section (Bonus) */}
        <Row className="mt-5 py-5 bg-light rounded text-center shadow-sm">
          <Col md={4}>
            <h2 className="text-primary fw-bold">20+</h2>
            <p className="mb-0">Movies Available</p>
          </Col>
          <Col md={4}>
            <h2 className="text-primary fw-bold">15</h2>
            <p className="mb-0">Cinema Rooms</p>
          </Col>
          <Col md={4}>
            <h2 className="text-primary fw-bold">1000+</h2>
            <p className="mb-0">Daily Bookings</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;

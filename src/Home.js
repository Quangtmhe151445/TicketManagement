import React from "react";
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="mt-4">
      {/* Carousel */}
      <Carousel className="mb-5">
        <Carousel.Item style={{ backgroundColor: "#000", minHeight: "400px" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <img
              className="d-block w-100"
              src="1-16589774198841110464172-21-0-434-660-crop-16589786005051270485434.webp"
              alt="slide"
            />
          </div>
          <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-3">
            <h3>The Dark Knight Rise</h3>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item style={{ backgroundColor: "#000", minHeight: "400px" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <img
              className="d-block w-100"
              src="Chihiro_with_Haku.webp"
              alt="slide"
            />
          </div>
          <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-3">
            <h3>Spirited Away</h3>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item style={{ backgroundColor: "#000", minHeight: "400px" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <img className="d-block w-100" src="1-16.jpg" alt="slide" />
          </div>
          <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-3">
            <h3>Your Name</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Cards */}
      <Row>
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Your Name</Card.Title>
              <Card.Text>Anime, Fantasy, Romance, Drama </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>The Dark Knight Rise</Card.Title>
              <Card.Text>
                superhero, action, crime, drama, and thriller
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Inception </Card.Title>
              <Card.Text>Science Fiction Action Thriller.</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Spirited Away</Card.Title>
              <Card.Text>
                Animation Fantasy/Supernatural Adventure Family/Kids & Family
                Coming-of-Age
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

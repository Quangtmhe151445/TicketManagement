import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";

function MyNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      // Giả lập logic đăng nhập, chuyển hướng đến /timetable (như trong code gốc)
      navigate("/timetable"); 
    } else {
      // Giả lập logic đăng xuất
      navigate("/");

      alert("Logged out successfully!"); // Đổi alert cho đúng logic
    }

    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="shadow-lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-film me-2"></i>Cinema Admin
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/ticket">
                  <i className="bi bi-ticket-perforator-fill me-1"></i> Ticket
                  Management
                </Nav.Link>

                <Nav.Link as={Link} to="/movie-list">
                  <i className="bi bi-collection-play me-1"></i> Film Management
                </Nav.Link>
                
                {/* Đã thêm link Quản lý Phòng Chiếu */}
                <Nav.Link as={Link} to="/cinema-rooms">
                  <i className="bi bi-display me-1"></i> Cinema Room Management
                </Nav.Link>
                
                <Nav.Link as={Link} to="/popcorn">
                  <i className="bi bi-door-open-fill me-1"></i> PopCorn
                  Management
                </Nav.Link>

                <Nav.Link as={Link} to="/timetable">
                  <i className="bi bi-door-open-fill me-1"></i> TimeTable
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            <Nav.Link onClick={handleAuthClick}>
              {isLoggedIn ? (
                <Button variant="outline-danger" size="sm">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </Button>
              ) : (
                <Button variant="outline-info" size="sm">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Button>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;
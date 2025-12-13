import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

function MyNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthClick = () => {
    setIsLoggedIn(!isLoggedIn);
    if (isLoggedIn) {
      alert("Logged out successfully!");
    } else {
      alert("Logged in successfully!");
    }
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
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house-door-fill me-1"></i> Home
            </Nav.Link>

            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/ticket">
                  <i className="bi bi-ticket-perforator-fill me-1"></i> Ticket
                  Management
                </Nav.Link>

                <Nav.Link as={Link} to="/movies-list">
                  <i className="bi bi-collection-play me-1"></i> Film Management
                </Nav.Link>

                <Nav.Link as={Link} to="/popcorn">
                  <i className="bi bi-door-open-fill me-1"></i> PopCorn Management
                </Nav.Link>

                <NavDropdown
                  title="Settings & Pricing"
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item as={Link} to="/prices">
                    <i className="bi bi-currency-dollar me-1"></i> Price Rules
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/users">
                    <i className="bi bi-people-fill me-1"></i> User Management
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item as={Link} to="/config">
                    <i className="bi bi-gear-fill me-1"></i> System
                    Configuration
                  </NavDropdown.Item>
                </NavDropdown>
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

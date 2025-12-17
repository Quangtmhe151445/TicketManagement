import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function MyNav({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    // 1. Gọi hàm xóa trạng thái user (từ props App.js truyền xuống)
    onLogout(); 
    
    // 2. Chuyển hướng về trang chủ ngay lập tức
    navigate("/"); 
    
    // 3. Thông báo (Tùy chọn)
    console.log("User logged out");
  };

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="shadow-lg py-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <i className="bi bi-film me-2"></i>Cinema Admin
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {user && (
              <>
                <Nav.Link as={Link} to="/ticket">Ticket</Nav.Link>
                <Nav.Link as={Link} to="/movie-list">Film</Nav.Link>
                <Nav.Link as={Link} to="/cinema-rooms">Rooms</Nav.Link>
                <Nav.Link as={Link} to="/showtimes">ShowTimes</Nav.Link>
                <Nav.Link as={Link} to="/popcorn">PopCorn</Nav.Link>
                <Nav.Link as={Link} to="/timetable">TimeAble</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <div className="text-light me-2">
                  <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem' }}>Logged in as</small>
                  <span className="fw-medium">{user.name}</span>
                </div>
                
                {user.role === "admin" && (
                  <Button variant="outline-warning" size="sm" as={Link} to="/register">
                    + Add Staff
                  </Button>
                )}
                
                <Button variant="danger" size="sm" onClick={handleLogoutClick} className="px-3">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-info" size="sm" as={Link} to="/">
                  Login
                </Button>
                <Button variant="warning" size="sm" as={Link} to="/register">
                  Register Admin
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;
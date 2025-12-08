import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";

function MyNav() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Navbar scroll</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>

            <Nav.Link as={Link} to="/">Home</Nav.Link>

            <Nav.Link as={Link} to="/movie-list">
              Movies
            </Nav.Link>

            <Nav.Link as={Link} to="/ticket">
              Ticket
            </Nav.Link>

             <Nav.Link as={Link} to="/popcorn">
              PopCorn
            </Nav.Link>

            <NavDropdown title="More" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/action">Action</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/something">
                Something else
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Form className="d-flex">
            <Form.Control type="search" placeholder="Search" className="me-2" />
            <Button variant="outline-success">Search</Button>
          </Form>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNav;

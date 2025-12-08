import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Badge,
} from "react-bootstrap";
import EditTicket from "./EditTicketPage";


const mockTicketPrices = [
  {
    id: 101,
    showtime: "10:00",
    filmName: "Dune: Part Two",
    room: "Room 01",
    quantity: "All",
    type: "2D",
    price: "100,000 VND",
    status: "Active",
  },
  {
    id: 102,
    showtime: "13:00",
    filmName: "Oppenheimer",
    room: "Room VIP",
    quantity: "100",
    type: "3D IMAX",
    price: "180,000 VND",
    status: "Active",
  },
  {
    id: 103,
    showtime: "15:00 ",
    filmName: "Barbie",
    room: "Room 05",
    quantity: "1",
    type: "2D",
    price: "80,000 VND",
    status: "Inactive",
  },
  {
    id: 104,
    showtime: "18:00 ",
    filmName: "Avatar: The Way of Water",
    room: "Room 03",
    quantity: "100",
    type: "3D",
    price: "120,000 VND",
    status: "Active",
  },
];

const getStatusVariant = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "danger";
    default:
      return "secondary";
  }
};

function TicketManagement() {
  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">Ticket Management</h2>

      <Row className="mb-4 align-items-end g-3">
        <Col md={2}>
          <Form.Select aria-label="Filter type">
            <option>Filter type</option>
            <option value="1">2D</option>
            <option value="2">3D</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select aria-label="Filter Film">
            <option>Filter Film</option>
            <option value="1">Dune: Part Two</option>
            <option value="2">Oppenheimer</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select aria-label="Status">
            <option>Status</option>
            <option value="1">Active</option>
            <option value="2">Inactive</option>
          </Form.Select>
        </Col>

        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search by Showtime or Film Name..."
              aria-label="Search"
            />
            <Button variant="info">
              <i className="bi bi-search me-1"></i> Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <hr />

      <Row className="mb-3 align-items-center">
        <Col>
          <h4 className="mb-0">Current Price Table </h4>
        </Col>
      </Row>

      <Row>
        <Col>
          <div
            className="table-responsive"
            style={{ border: "1px solid #dee2e6" }}
          >
            <Table bordered hover className="mb-0 align-middle">
              <thead>
                <tr className="table-light">
                  <th>ID</th>
                  <th>Showtime</th>
                  <th>Film</th>
                  <th>Room</th>
                  <th>Quantity</th>
                  <th>Type</th>
                  <th>Price</th>

                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockTicketPrices.map((price, index) => (
                  <tr key={price.id}>
                    <td>{price.id}</td>
                    <td>{price.showtime}</td>
                    <td>{price.filmName}</td>
                    <td>{price.room}</td>
                    <td>{price.quantity}</td>
                    <td>{price.type}</td>
                    <td>
                      <span className="fw-bold text-primary">
                        {price.price}
                      </span>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(price.status)}>
                        {price.status}
                      </Badge>
                    </td>

                    <td className="d-flex justify-content-center align-items-center p-1">
                      <Button
                        variant="warning"
                        size="sm"
                        title="Edit Price"
                        style={{ minWidth: "60px" }}
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
                {[...Array(Math.max(0, 5 - mockTicketPrices.length))].map(
                  (_, rowIndex) => (
                    <tr
                      key={`empty-row-${rowIndex}`}
                      style={{ height: "50px" }}
                    >
                      <td /> <td /> <td /> <td /> <td /> <td /> <td /> <td />
                      <td />
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </Col>

        <EditTicket/>

      </Row>
    </Container>
  );
}

export default TicketManagement;

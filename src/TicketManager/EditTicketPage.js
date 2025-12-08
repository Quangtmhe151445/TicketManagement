import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const mockTicket = {
  id: 1001,
  filmName: "Avatar: The Way of Water",
  showtime: "2025-12-25 19:30",
  room: "VIP Room 01",
  quantity: 2,
  seat: "F15, F16",
  type: "Normal",
  price: "240000",
  status: "Active",
};

function EditTicketPage() {
  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Edit Ticket #{mockTicket.id}</h2>

      <Card className="p-4 shadow-lg">
        <Form>
          <h4 className="mb-4 text-primary">Ticket Details</h4>

          <Row className="g-3 mb-3">
            <Col md={2}>
              <Form.Group controlId="editId">
                <Form.Label className="fw-bold">ID</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={mockTicket.id}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={10}>
              <Form.Group controlId="editFilmName">
                <Form.Label className="fw-bold">Film Name</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={mockTicket.filmName}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group controlId="editShowtime">
                <Form.Label>Showtime</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={mockTicket.showtime}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="editRoom">
                <Form.Label>Room</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={mockTicket.room}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mb-4 text-primary">Editable Fields</h4>

          <Row className="g-3 mb-3">
            <Col md={4}>
              <Form.Group controlId="editSeat">
                <Form.Label>Seat Number(s)</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={mockTicket.seat}
                  placeholder="A1, A2, ..."
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="editQuantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={mockTicket.quantity}
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="editType">
                <Form.Label>Ticket Type</Form.Label>
                <Form.Select defaultValue={mockTicket.type}>
                  <option value="Normal">Normal (Đã chọn)</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Staff">Staff</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group controlId="editPrice">
                <Form.Label>Price (VND)</Form.Label>
                <Form.Control type="number" defaultValue={mockTicket.price} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="editStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select defaultValue={mockTicket.status}>
                  <option value="Active">Active (Đã chọn)</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Used">Used</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end pt-3">
            <Button variant="secondary" className="me-2">
              Cancel
            </Button>
            <Button variant="success">Save Changes</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default EditTicketPage;

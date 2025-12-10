import React, { useState, useEffect, useMemo } from "react";
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

import db from "../database.json";
import EditTicket from "./EditTicketPage";

const { movies, cinema_rooms, showtimes, price_rules } = db;

const getStatusVariant = (status) => {
  switch (status) {
    case "open":
      return "success";
    case "sold_out":
      return "warning";
    case "canceled":
      return "danger";
    default:
      return "secondary";
  }
};

const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("vi-VN")} VND` : "N/A";
};

const getBasePrice = (roomType, seatType) => {
  const rule = price_rules.find(
    (r) => r.room_type === roomType && r.seat_type === seatType
  );

  return rule ? rule.weekday : 0;
};

const normalizeShowtimes = () => {
  const movieMap = new Map(movies.map((m) => [m.id, m]));
  const roomMap = new Map(cinema_rooms.map((r) => [r.id, r]));

  return showtimes.map((st, index) => {
    const movie = movieMap.get(st.movie_id) || {};
    const room = roomMap.get(st.room_id) || {};

    const defaultSeatType =
      Object.values(room.seat_types || {})[0] || "Standard";

    const basePrice = getBasePrice(room.type, defaultSeatType);

    const startTime = new Date(st.start_time);

    return {
      id: st.id,
      showtime: startTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      filmName: movie.title || "N/A",
      room: room.name || "N/A",

      quantity: st.status === "open" ? "Available" : "N/A",
      type: room.type || "N/A",
      price: formatCurrency(basePrice),

      status: st.status,
    };
  });
};

function TicketManagement() {
  const [ticketList, setTicketList] = useState([]);

  const [filterType, setFilterType] = useState("All");
  const [filterFilm, setFilterFilm] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initialData = normalizeShowtimes();
    setTicketList(initialData);
  }, []);

  const uniqueFilms = useMemo(
    () => ["All", ...new Set(movies.map((m) => m.title))],
    []
  );
  const uniqueTypes = useMemo(
    () => ["All", ...new Set(cinema_rooms.map((r) => r.type))],
    []
  );
  const uniqueStatuses = useMemo(
    () => ["All", "open", "sold_out", "canceled"],
    []
  );

  const filteredTicketList = useMemo(() => {
    let filtered = ticketList;

    if (filterType !== "All") {
      filtered = filtered.filter((ticket) => ticket.type === filterType);
    }

    if (filterFilm !== "All") {
      filtered = filtered.filter((ticket) => ticket.filmName === filterFilm);
    }

    if (filterStatus !== "All") {
      const dbStatus = filterStatus;
      filtered = filtered.filter((ticket) => ticket.status === dbStatus);
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.showtime.toLowerCase().includes(lowerCaseSearch) ||
          ticket.filmName.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [ticketList, filterType, filterFilm, filterStatus, searchTerm]);

  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">🎬 Ticket Management (Dữ liệu từ DB)</h2>

      <Row className="mb-4 align-items-end g-3">
        <Col md={2}>
          <Form.Select
            aria-label="Filter type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">Filter Type</option>
            {uniqueTypes
              .filter((t) => t !== "All")
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            aria-label="Filter Film"
            value={filterFilm}
            onChange={(e) => setFilterFilm(e.target.value)}
          >
            <option value="All">Filter Film</option>
            {uniqueFilms
              .filter((f) => f !== "All")
              .map((film) => (
                <option key={film} value={film}>
                  {film}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            aria-label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Status</option>

            <option value="open">Open (Active)</option>
            <option value="sold_out">Sold Out</option>
            <option value="canceled">Canceled (Inactive)</option>
          </Form.Select>
        </Col>

        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search by Showtime or Film Name..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="info" onClick={() => {}}>
              <i className="bi bi-search me-1"></i> Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <hr />

      <Row className="mb-3 align-items-center">
        <Col>
          <h4 className="mb-0">
            Current Showtime Table ({filteredTicketList.length} results)
          </h4>
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
                  <th>Capacity/Status</th>
                  <th>Type</th>
                  <th>Base Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTicketList.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.showtime}</td>
                    <td>{ticket.filmName}</td>
                    <td>{ticket.room}</td>
                    <td>{ticket.quantity}</td>
                    <td>{ticket.type}</td>
                    <td>
                      <span className="fw-bold text-primary">
                        {ticket.price}
                      </span>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(ticket.status)}>
                        {ticket.status.toUpperCase()}
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

                {[...Array(Math.max(0, 5 - filteredTicketList.length))].map(
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

        <EditTicket />
      </Row>
    </Container>
  );
}

export default TicketManagement;

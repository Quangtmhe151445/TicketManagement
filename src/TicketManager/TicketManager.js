import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- HÀM TIỆN ÍCH (Utility Functions) ---
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

const getBasePrice = (priceRules, roomType, seatType) => {
  const rule = priceRules.find(
    (r) => r.room_type === roomType && r.seat_type === seatType
  );
  return rule ? rule.weekday : 0;
};

// Hàm chuẩn hóa dữ liệu
const normalizeShowtimes = (rawData) => {
  if (!rawData || !rawData.movies || !rawData.rooms || !rawData.showtimes) {
    return [];
  }

  const movieMap = new Map(rawData.movies.map((m) => [m.id, m]));
  const roomMap = new Map(rawData.rooms.map((r) => [r.id, r]));

  return rawData.showtimes.map((st) => {
    const movie = movieMap.get(st.movie_id) || {};
    const room = roomMap.get(st.room_id) || {};

    const defaultSeatType = Object.keys(room.seat_types || {})[0] || "Standard";

    const basePrice = getBasePrice(rawData.rules, room.type, defaultSeatType);

    const startTime = new Date(st.start_time);

    const totalSeats = room.total_seats || 0;
    const ticketsSold = st.tickets_sold || 0;
    const seatsRemaining = totalSeats - ticketsSold;

    let capacityDisplay = `${seatsRemaining} / ${totalSeats}`;

    if (st.status === "canceled" || st.status === "sold_out") {
      capacityDisplay = st.status.toUpperCase();
    }

    return {
      id: st.id,
      showtime: startTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      filmName: movie.title || "N/A",
      room: room.name || "N/A",
      quantity: capacityDisplay,
      type: room.type || "N/A",
      priceValue: basePrice,
      price: formatCurrency(basePrice),
      status: st.status,
    };
  });
};

export default function TicketManagement() {
  const navigate = useNavigate();

  // --- 1. STATE DỮ LIỆU GỐC VÀ TẢI ---
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);
  const [rawData, setRawData] = useState({
    movies: [],
    rooms: [],
    rules: [],
    showtimes: [],
  });

  // --- 2. STATE CHO LỌC ---
  const [filterType, setFilterType] = useState("All");
  const [filterFilm, setFilterFilm] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // --- 3. STATE CHO SẮP XẾP (Theo format Index) ---
  const [sortField, setSortField] = useState("showtime");
  const [isAsc, setIsAsc] = useState(true);
  const [isSorted, setIsSorted] = useState(true);

  // --- 4. DATA FETCHING (useEffect) ---
  useEffect(() => {
    setLoading(true);
    const endpoints = [
      "http://localhost:9999/movies",
      "http://localhost:9999/cinema_rooms",
      "http://localhost:9999/showtimes",
      "http://localhost:9999/price_rules",
    ];

    axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
        axios.spread((moviesRes, roomsRes, showtimesRes, rulesRes) => {
          const loadedData = {
            movies: moviesRes.data,
            rooms: roomsRes.data,
            showtimes: showtimesRes.data,
            rules: rulesRes.data,
          };
          setRawData(loadedData);
          setInitialData(normalizeShowtimes(loadedData));
        })
      )
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- 5. LOGIC LỌC (Tương tự filteredList trong Index) ---
  const filteredList = initialData.filter((ticket) => {
    const matchType = filterType === "All" || ticket.type === filterType;
    const matchFilm = filterFilm === "All" || ticket.filmName === filterFilm;
    const matchStatus =
      filterStatus === "All" || ticket.status === filterStatus;

    const lowerCaseSearch = searchTerm.toLowerCase();
    const matchSearch =
      searchTerm === "" ||
      ticket.showtime.toLowerCase().includes(lowerCaseSearch) ||
      ticket.filmName.toLowerCase().includes(lowerCaseSearch);

    return matchType && matchFilm && matchStatus && matchSearch;
  });

  // --- 6. LOGIC SẮP XẾP (Tương tự finalList trong Index) ---
  const finalList = isSorted
    ? [...filteredList].sort((a, b) => {
        let result = 0;

        if (sortField === "filmName" || sortField === "showtime") {
          result = a[sortField].localeCompare(b[sortField], "vi");
        } else if (sortField === "id") {
          result = a.id - b.id;
        } else if (sortField === "priceValue") {
          result = a.priceValue - b.priceValue;
        }

        return isAsc ? result : -result;
      })
    : filteredList;

  // --- 7. XỬ LÝ SỰ KIỆN ---
  const handleSort = (field) => {
    setIsSorted(true);
    setIsAsc((prev) => (sortField === field ? !prev : true));
    setSortField(field);
  };

  const handleEditClick = (ticketId) => {
    navigate(`/edit/${ticketId}`);
  };

  // --- 8. RENDER (JSX) ---
  const uniqueFilms = ["All", ...new Set(rawData.movies.map((m) => m.title))];
  const uniqueTypes = ["All", ...new Set(rawData.rooms.map((r) => r.type))];

  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">🎬 Ticket Management</h2>

      {/* --- Bộ lọc và Tìm kiếm --- */}
      <Row className="mb-4 align-items-end g-3">
        <Col md={2}>
          <Form.Select
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="info">
              <i className="bi bi-search me-1"></i> Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <hr />

      {/* --- Bảng Hiển thị --- */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h4 className="mb-0">
            Current Showtime Table ({finalList.length} results)
          </h4>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Đang tải dữ liệu lịch chiếu...</p>
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{ border: "1px solid #dee2e6" }}
            >
              <Table bordered hover className="mb-0 align-middle">
                <thead>
                  <tr className="table-light">
                    <th
                      onClick={() => handleSort("id")}
                      style={{ cursor: "pointer" }}
                    >
                      ID {sortField === "id" && (isAsc ? " ▲" : " ▼")}
                    </th>
                    <th
                      onClick={() => handleSort("showtime")}
                      style={{ cursor: "pointer" }}
                    >
                      Showtime{" "}
                      {sortField === "showtime" && (isAsc ? " ▲" : " ▼")}
                    </th>
                    <th
                      onClick={() => handleSort("filmName")}
                      style={{ cursor: "pointer" }}
                    >
                      Film {sortField === "filmName" && (isAsc ? " ▲" : " ▼")}
                    </th>
                    <th>Room</th>
                    <th>Seats Left / Total</th>
                    <th>Type</th>
                    <th
                      onClick={() => handleSort("priceValue")}
                      style={{ cursor: "pointer" }}
                    >
                      Base Price{" "}
                      {sortField === "priceValue" && (isAsc ? " ▲" : " ▼")}
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {finalList.length > 0 ? (
                    finalList.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.showtime}</td>
                        <td>{ticket.filmName}</td>
                        <td>{ticket.room}</td>
                        <td>
                          <span className="fw-bold text-secondary">
                            {ticket.quantity}
                          </span>
                        </td>
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
                            onClick={() => handleEditClick(ticket.id)}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center p-4 text-muted">
                        Không tìm thấy suất chiếu nào phù hợp.
                      </td>
                    </tr>
                  )}
                  {[...Array(Math.max(0, 5 - finalList.length))].map(
                    (_, rowIndex) => (
                      <tr
                        key={`empty-row-${rowIndex}`}
                        style={{ height: "50px" }}
                      >
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

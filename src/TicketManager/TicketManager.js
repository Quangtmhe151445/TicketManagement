import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("vi-VN")} VND` : "N/A";
};

const getStatusVariant = (status) => {
  switch (status) {
    case "open": return "success";
    case "sold_out":
    case "full": return "warning";
    case "canceled": return "danger";
    default: return "secondary";
  }
};

const getPriceFromRules = (roomName, roomType, priceRules) => {
  if (!roomName || !roomType || !priceRules || priceRules.length === 0) return 0;
  const typeInRule = roomType.includes("3D") ? "3D" : "2D";
  const rule = priceRules.find((r) => r.room_name === roomName && r.type === typeInRule);
  return rule ? rule.price : 0;
};

const normalizeShowtimes = (rawData) => {
  if (!rawData || !rawData.movies || !rawData.rooms || !rawData.showtimes || !rawData.rules) return [];

  const movieMap = new Map(rawData.movies.map((m) => [m.id, m]));
  const roomMap = new Map(rawData.rooms.map((r) => [r.id, r]));

  return rawData.showtimes.map((st) => {
    const movie = movieMap.get(st.movie_id) || {};
    const room = roomMap.get(st.room_id) || {};
    const basePrice = getPriceFromRules(room.name, room.type, rawData.rules);
    const startTime = new Date(st.start_time);

    const totalSeats = room.total_seats || 0;
    const ticketsSold = st.tickets_sold || 0;
    const safeSeatsRemaining = Math.max(0, totalSeats - ticketsSold);

    let capacityDisplay = st.status === "canceled" ? "CANCELED" : st.status === "sold_out" ? "SOLD OUT" : `${safeSeatsRemaining} / ${totalSeats}`;

    return {
      id: st.id,
      showtime: startTime.toLocaleTimeString("vi-VN", {
        year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
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
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);
  const [rawData, setRawData] = useState({ movies: [], rooms: [], rules: [], showtimes: [] });

  const [filterType, setFilterType] = useState("All");
  const [filterFilm, setFilterFilm] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const [sortField, setSortField] = useState("showtime");
  const [isAsc, setIsAsc] = useState(true);

  useEffect(() => {
    setLoading(true);
    const endpoints = [
      "http://localhost:9999/movies", "http://localhost:9999/cinema_rooms",
      "http://localhost:9999/showtimes", "http://localhost:9999/price_rules",
    ];

    axios.all(endpoints.map((ep) => axios.get(ep)))
      .then(axios.spread((moviesRes, roomsRes, showtimesRes, rulesRes) => {
        const data = { movies: moviesRes.data, rooms: roomsRes.data, showtimes: showtimesRes.data, rules: rulesRes.data };
        setRawData(data);
        setInitialData(normalizeShowtimes(data));
      }))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const { uniqueFilms, uniqueTypes } = useMemo(() => {
    const films = ["All", ...new Set(rawData.movies.map((m) => m.title))];
    const types = ["All", ...new Set(rawData.rooms.map((r) => r.type))];
    return { uniqueFilms: films, uniqueTypes: types };
  }, [rawData.movies, rawData.rooms]);

  const filteredList = useMemo(() => {
    return initialData.filter((ticket) => {
      const matchType = filterType === "All" || ticket.type === filterType;
      const matchFilm = filterFilm === "All" || ticket.filmName === filterFilm;
      const matchStatus = filterStatus === "All" || ticket.status === filterStatus;
      return matchType && matchFilm && matchStatus;
    });
  }, [initialData, filterType, filterFilm, filterStatus]);

  const finalList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      let result = 0;
      if (sortField === "filmName" || sortField === "showtime") {
        result = a[sortField].localeCompare(b[sortField], "vi");
      } else if (sortField === "id") {
        result = parseInt(a.id) - parseInt(b.id);
      } else if (sortField === "priceValue") {
        result = a.priceValue - b.priceValue;
      }
      return isAsc ? result : -result;
    });
  }, [filteredList, sortField, isAsc]);

  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">🎬 Quản Lý Suất Chiếu</h2>

      <Row className="mb-4 align-items-end g-3">
        <Col md={4}>
          <Form.Label className="fw-bold text-secondary mb-1">Loại Phòng</Form.Label>
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">Tất cả loại phòng</option>
            {uniqueTypes.filter(t => t !== "All").map(t => <option key={t} value={t}>{t}</option>)}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Label className="fw-bold text-secondary mb-1">Phim</Form.Label>
          <Form.Select value={filterFilm} onChange={(e) => setFilterFilm(e.target.value)}>
            <option value="All">Tất cả phim</option>
            {uniqueFilms.filter(f => f !== "All").map(f => <option key={f} value={f}>{f}</option>)}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Label className="fw-bold text-secondary mb-1">Trạng Thái</Form.Label>
          <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">Tất cả trạng thái</option>
            <option value="open">Đang mở (Open)</option>
            <option value="sold_out">Hết vé (Sold Out)</option>
            <option value="canceled">Đã hủy (Canceled)</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-primary">Danh sách suất chiếu ({finalList.length})</h4>
          <Button variant="success" onClick={() => navigate("/create")}>
            + Tạo suất chiếu mới
          </Button>
        </Col>
      </Row>

      <div className="table-responsive shadow-sm border rounded">
        <Table bordered hover className="mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th onClick={() => {setSortField("id"); setIsAsc(!isAsc)}} style={{cursor:'pointer'}}>
                ID {sortField==='id'?(isAsc?'▲':'▼'):''}
              </th>
              <th onClick={() => {setSortField("showtime"); setIsAsc(!isAsc)}} style={{cursor:'pointer'}}>
                Giờ Chiếu 
              </th>
              <th>Phim</th>
              <th>Phòng</th>
              <th>Ghế Trống</th>
              <th>Loại</th>
              <th>Giá Vé</th>
              <th>Trạng Thái</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="text-center p-5"><Spinner animation="border" /></td></tr>
            ) : finalList.length > 0 ? (
              finalList.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="text-muted small">{ticket.id}</td>
                  <td className="fw-bold text-primary">{ticket.showtime}</td>
                  <td>{ticket.filmName}</td>
                  <td>{ticket.room}</td>
                  <td className="fw-bold text-secondary">{ticket.quantity}</td>
                  <td>{ticket.type}</td>
                  <td className="fw-bold">{ticket.price}</td>
                  <td>
                    <Badge bg={getStatusVariant(ticket.status)}>{ticket.status.toUpperCase()}</Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" onClick={() => navigate(`/edit/${ticket.id}`)}>
                      Sửa
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="text-center p-4">Không tìm thấy dữ liệu phù hợp.</td></tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
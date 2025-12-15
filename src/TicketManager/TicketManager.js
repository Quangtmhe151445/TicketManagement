import React, { useState, useEffect, useMemo, useCallback } from "react";
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

const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("vi-VN")} VND` : "N/A";
};

const getStatusVariant = (status) => {
  switch (status) {
    case "open":
      return "success";
    case "sold_out":
    case "full":
      return "warning";
    case "canceled":
      return "danger";
    default:
      return "secondary";
  }
};

const getRoomCategory = (roomId) => {
  const vipRoomIds = ["room02", "room07", "room08"];
  return vipRoomIds.includes(roomId) ? "VIP" : "Phòng Thường";
};



const getPriceFromRules = (roomName, roomType, priceRules) => {
  if (!roomName || !roomType || !priceRules || priceRules.length === 0) {
    return 0;
  }

  const typeInRule = roomType.includes("3D") ? "3D" : "2D";

  const rule = priceRules.find(
    (r) => r.room_name === roomName && r.type === typeInRule
  );

  return rule ? rule.price : 0;
};

const normalizeShowtimes = (rawData) => {
  if (!rawData || !rawData.movies || !rawData.rooms || !rawData.showtimes || !rawData.rules) {
    return [];
  }

  const movieMap = new Map(rawData.movies.map((m) => [m.id, m]));
  const roomMap = new Map(rawData.rooms.map((r) => [r.id, r]));

  return rawData.showtimes.map((st) => {
    const movie = movieMap.get(st.movie_id) || {};
    const room = roomMap.get(st.room_id) || {};

    const roomCategory = getRoomCategory(st.room_id);
    const roomType = room.type || "2D Standard";
    const roomName = room.name || "N/A";

    const basePrice = getPriceFromRules(roomName, roomType, rawData.rules);

    const startTime = new Date(st.start_time);

    const totalSeats = room.total_seats || 0;
    const ticketsSold = st.tickets_sold || 0;
    const safeSeatsRemaining = Math.max(0, totalSeats - ticketsSold);

    let capacityDisplay = `${safeSeatsRemaining} / ${totalSeats}`;

    if (st.status === "canceled") {
      capacityDisplay = "CANCELED";
    } else if (st.status === "sold_out") {
      capacityDisplay = "SOLD OUT";
    }

    return {
      id: st.id,
      showtime: startTime.toLocaleTimeString("vi-VN", {
       year: "numeric",
      month: "2-digit",
      day: "2-digit",
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

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);
  const [rawData, setRawData] = useState({
    movies: [],
    rooms: [],
    rules: [], 
    showtimes: [],
  });

  const [filterType, setFilterType] = useState("All");
  const [filterFilm, setFilterFilm] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [sortField, setSortField] = useState("showtime");
  const [isAsc, setIsAsc] = useState(true);
  const [isSorted, setIsSorted] = useState(true);

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

  const { uniqueFilms, uniqueTypes } = useMemo(() => {
    const films = ["All", ...new Set(rawData.movies.map((m) => m.title))];
    const types = ["All", ...new Set(rawData.rooms.map((r) => r.type))];
    return { uniqueFilms: films, uniqueTypes: types };
  }, [rawData.movies, rawData.rooms]);

  const filteredList = useMemo(() => {
    return initialData.filter((ticket) => {
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
  }, [initialData, filterType, filterFilm, filterStatus, searchTerm]);

  const finalList = useMemo(() => {
    if (!isSorted) {
      return filteredList;
    }

    return [...filteredList].sort((a, b) => {
      let result = 0;

      if (sortField === "filmName" || sortField === "showtime") {
        result = a[sortField].localeCompare(b[sortField], "vi");
      } else if (sortField === "id") {

        const idA = parseInt(a.id.slice(2));
        const idB = parseInt(b.id.slice(2));
        result = idA - idB;
      } else if (sortField === "priceValue") {
        result = a.priceValue - b.priceValue;
      } else if (sortField === "status") {

        result = a.status.localeCompare(b.status);
      }

      return isAsc ? result : -result;
    });
  }, [filteredList, isSorted, sortField, isAsc]);

  const handleSort = (field) => {
    setIsSorted(true);

    setIsAsc((prev) => (sortField === field ? !prev : true));
    setSortField(field);
  };

  const handleEditClick = useCallback(
    (ticketId) => {
      navigate(`/edit/${ticketId}`);
    },
    [navigate]
  );

  const sortIndicator = (field) => {
    if (sortField === field) {
      return isAsc ? " ▲" : " ▼";
    }
    return null;
  };

  const unSortableKeys = ["quantity", "room", "type", "status", "action"];

  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">🎬 Ticket Management (Showtimes)</h2>

      <Row className="mb-4 align-items-end g-3">

        <Col md={2}>
          <Form.Label className="fw-bold text-secondary mb-0">Type</Form.Label>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            {uniqueTypes
              .filter((t) => t !== "All")
              .map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Label className="fw-bold text-secondary mb-0">Film</Form.Label>
          <Form.Select
            value={filterFilm}
            onChange={(e) => setFilterFilm(e.target.value)}
          >
            <option value="All">All Films</option>
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
          <Form.Label className="fw-bold text-secondary mb-0">
            Status
          </Form.Label>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="open">Open (Active)</option>
            <option value="sold_out">Sold Out</option>
            <option value="canceled">Canceled</option>
          </Form.Select>
        </Col>

        <Col md={5}>
          <Form.Label className="fw-bold text-secondary mb-0">
            Search
          </Form.Label>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Search by Showtime or Film Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="info" disabled>
              <i className="bi bi-search me-1"></i> Search
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <hr />

      <Row className="mb-3 align-items-center">
        <Col>
          <h4 className="mb-0 text-primary">
            Current Showtimes ({finalList.length} results)
          </h4>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => navigate("/create")}>
            <i className="bi bi-plus-circle me-2"></i>
            Create New Showtime
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status" />
              <p className="mt-2">Loading screening schedule data...</p>
            </div>
          ) : (
            <div
              className="table-responsive shadow-sm"
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Table bordered hover className="mb-0 align-middle">
                <thead>
                  <tr className="table-dark">
                    {[
                      { key: "id", label: "ID" },
                      { key: "showtime", label: "Showtime" },
                      { key: "filmName", label: "Film" },
                      { key: "room", label: "Room" },
                      { key: "quantity", label: "Seats Left / Total" },
                      { key: "type", label: "Type" },
                      { key: "priceValue", label: "Base Price" },
                      { key: "status", label: "Status" },
                      { key: "action", label: "Action" },
                    ].map((col) => {
                      const isSortable = !unSortableKeys.includes(col.key);
                      return (
                        <th
                          key={col.key}
                          onClick={() => isSortable && handleSort(col.key)}
                          style={{
                            cursor: isSortable ? "pointer" : "default",
                          }}
                        >
                          {col.label}
                          {sortIndicator(col.key)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {finalList.length > 0 ? (
                    finalList.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="text-muted small">{ticket.id}</td>
                        <td className="fw-bold">{ticket.showtime}</td>
                        <td>{ticket.filmName}</td>
                        <td>{ticket.room}</td>
                        <td className="fw-bold text-secondary">
                          {ticket.quantity}
                        </td>
                        <td>{ticket.type}</td>
                        <td>
                          <span className="fw-bold text-primary">
                            {ticket.price}
                          </span>
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(ticket.status)}>
                            {ticket.status.toUpperCase().replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="text-center p-1">
                          <Button
                            variant="warning"
                            size="sm"
                            title="Edit Showtime"
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
                        <td colSpan="9"></td>
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
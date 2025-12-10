import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

// --- Utility Functions ---

const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("en-US")} VND` : "N/A";
};

const getBasePrice = (priceRules, roomType, seatType = "Standard") => {
  const rule = priceRules.find(
    (r) => r.room_type === roomType && r.seat_type === seatType
  );
  return rule ? rule.weekday : 0;
};

const getUniqueRoomTypes = (priceRules) => {
  const types = new Set(priceRules.map((rule) => rule.room_type));
  return Array.from(types);
};

const normalizeShowtimeData = (st, movieMap, roomMap, priceRules) => {
  const movie = movieMap.get(st.movie_id) || {};
  const room = roomMap.get(st.room_id) || {};
  const totalSeats = room.total_seats || 0;
  const ticketsSold = st.tickets_sold || 0;
  const seatsRemaining = totalSeats - ticketsSold;
  const originalRoomType =
    room.type || getUniqueRoomTypes(priceRules)[0] || "Standard";

  let capacityDisplay = `${seatsRemaining} / ${totalSeats}`;
  if (st.status === "canceled" || st.status === "sold_out") {
    capacityDisplay = st.status.toUpperCase();
  }

  return {
    // Editable fields (giá trị ban đầu)
    Showtime: st.start_time,
    Film: st.movie_id,
    Room: st.room_id,
    Type: originalRoomType, // Read-Only fields (Hiển thị)

    id: st.id,
    CapacityStatus: capacityDisplay,
    Status: st.status,
  };
};
// --- End Utility Functions ---

function EditTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate(); // --- 1. STATE DỮ LIỆU TẢI TỪ API ---

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    movies: [],
    cinema_rooms: [],
    price_rules: [],
    showtime: null,
  });

  const [originalTicket, setOriginalTicket] = useState(null);
  const [formData, setFormData] = useState({}); // --- Unique Types (Tạo sau khi dữ liệu tải xong) --- // Sử dụng dataLoaded.price_rules để tính toán các loại phòng duy nhất cho dropdown

  const uniqueRoomTypes = useMemo(
    () => getUniqueRoomTypes(dataLoaded.price_rules),
    [dataLoaded.price_rules]
  ); // --- Tính toán lại BasePrice mỗi khi Type thay đổi (useMemo) ---

  const calculatedBasePrice = useMemo(() => {
    return getBasePrice(dataLoaded.price_rules, formData.Type);
  }, [formData.Type, dataLoaded.price_rules]); // --- 2. DATA FETCHING (useEffect) ---

  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const endpoints = [
      "http://localhost:9999/movies",
      "http://localhost:9999/cinema_rooms",
      "http://localhost:9999/price_rules",
      `http://localhost:9999/showtimes/${ticketId}`, // Lấy suất chiếu cụ thể
    ];

    axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
        axios.spread((moviesRes, roomsRes, rulesRes, showtimeRes) => {
          const showtime = showtimeRes.data;
          const moviesData = moviesRes.data;
          const roomsData = roomsRes.data;
          const rulesData = rulesRes.data;

          // TẠO MAPS VỚI DỮ LIỆU VỪA TẢI XUỐNG
          const currentMovieMap = new Map(moviesData.map((m) => [m.id, m]));
          const currentRoomMap = new Map(roomsData.map((r) => [r.id, r]));

          setDataLoaded({
            movies: moviesData,
            cinema_rooms: roomsData,
            price_rules: rulesData,
            showtime: showtime,
          });

          if (showtime) {
            const initialData = normalizeShowtimeData(
              showtime,
              currentMovieMap, // Dùng Map được tạo với dữ liệu mới
              currentRoomMap, // Dùng Map được tạo với dữ liệu mới
              rulesData
            );

            setOriginalTicket(initialData);

            setFormData({
              Showtime: initialData.Showtime,
              Film: initialData.Film,
              Room: initialData.Room,
              Type: initialData.Type,
              status: initialData.Status,
            });
          }
        })
      )
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }, [ticketId]); // CHỈ PHỤ THUỘC VÀO ticketId // Xử lý thay đổi form

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/ticket");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const dataToSave = {
      start_time: formData.Showtime,
      movie_id: formData.Film,
      room_id: formData.Room,
      status: formData.status,
    };

    try {
      // Gọi API PATCH
      const response = await axios.patch(
        `http://localhost:9999/showtimes/${ticketId}`,
        dataToSave
      );
      console.log(`Update successful:`, response.data);
      alert(`Showtime updated for ID #${ticketId}!`);
      navigate("/ticket");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  }; // --- 3. RENDER ---

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <h2 className="text-center">Loading Showtime Data...</h2>{" "}
      </Container>
    );
  }

  if (!originalTicket) {
    return (
      <Container className="my-5">
        <h2 className="text-center text-danger">
          Showtime ID: {ticketId} not found.
        </h2>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Edit Showtime #{originalTicket.id}</h2> 
      <Card className="p-4 shadow-lg">
        <Form onSubmit={handleSave}>
          <h4 className="mb-4 text-primary">Modify Showtime Details</h4>
          <Row className="g-3 mb-4">
            {/* ID (Readonly) */}
            <Col md={2}>
              <Form.Group controlId="id">
                <Form.Label className="fw-bold">ID</Form.Label>

                <Form.Control
                  type="text"
                  defaultValue={originalTicket.id}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="Showtime">
                <Form.Label className="fw-bold">Showtime</Form.Label>

                <Form.Control
                  type="datetime-local"
                  value={formData.Showtime || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="Film">
                <Form.Label className="fw-bold">Film</Form.Label>
                <Form.Select
                  value={formData.Film || ""}
                  onChange={handleChange}
                >
                  {dataLoaded.movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Group controlId="Room">
                <Form.Label className="fw-bold">Room</Form.Label>
                <Form.Select
                  value={formData.Room || ""}
                  onChange={handleChange}
                >
                  {dataLoaded.cinema_rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="Type">
                <Form.Label className="fw-bold">
                  Type (Affects Price)
                </Form.Label>
                <Form.Select
                  value={formData.Type || ""}
                  onChange={handleChange}
                >
                  {uniqueRoomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="BasePrice">
                <Form.Label className="fw-bold">
                  Calculated Base Price
                </Form.Label>

                <Form.Control
                  type="text"
                  value={formatCurrency(calculatedBasePrice)}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <h4 className="mb-4 text-danger">Status & Capacity (Context)</h4>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group controlId="readCapacity">
                <Form.Label className="fw-bold">Seats Left/Total</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={originalTicket.CapacityStatus}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label className="fw-bold">Status</Form.Label>

                <Form.Select
                  value={formData.status || "open"}
                  onChange={handleChange}
                >
                  <option value="open">Open </option>
                  <option value="sold_out">Sold Out</option>
                  <option value="canceled">Canceled </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end pt-3">
            <Button variant="secondary" className="me-2" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Save Changes
            </Button>
             
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default EditTicketPage;

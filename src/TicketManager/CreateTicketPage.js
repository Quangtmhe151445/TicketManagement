import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("vi-VN")} VND` : "N/A";
};

const getRoomCategory = (roomId) => {
  const vipRoomIds = ["room02", "room07", "room08"];
  return vipRoomIds.includes(roomId) ? "VIP" : "Regular Room";
};

const getCalculatedBasePrice = (roomName, roomType, priceRules) => {
  if (!roomName || !roomType || !priceRules || priceRules.length === 0) {
    return 0;
  }

  const typeInRule = roomType.includes("3D") ? "3D" : "2D";

  const rule = priceRules.find(
    (r) => r.room_name === roomName && r.type === typeInRule
  );

  return rule ? rule.price : 0;
};

// --- CHỈ SỬA HÀM NÀY: SINH ID TỰ TĂNG 1, 2, 3... ---
const generateNewShowtimeId = (showtimes) => {
  if (!showtimes || showtimes.length === 0) {
    return "1";
  }

  // Chuyển tất cả ID hiện có về số nguyên và tìm Max
  const maxId = showtimes.reduce((max, st) => {
    const num = parseInt(st.id); // Chuyển "1", "2" hoặc "st001" thành số
    return !isNaN(num) && num > max ? num : max;
  }, 0);

  return (maxId + 1).toString(); // Trả về số tiếp theo dưới dạng chuỗi
};

function CreateTicketPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [dataLoaded, setDataLoaded] = useState({
    movies: [],
    cinema_rooms: [],
    showtimes: [],
    price_rules: [],
  });

  const [formData, setFormData] = useState({
    Showtime: "",
    Film: "",
    Room: "",
    Type: "",
    RoomCategory: "",
    status: "open",
  });

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
          const moviesData = moviesRes.data;
          const roomsData = roomsRes.data.filter((r) => r.status === "active");

          setDataLoaded({
            movies: moviesData,
            cinema_rooms: roomsData,
            showtimes: showtimesRes.data,
            price_rules: rulesRes.data,
          });

          if (moviesData.length > 0 && roomsData.length > 0) {
            const defaultMovieId = moviesData[0].id;
            const defaultRoomId = roomsData[0].id;
            const defaultRoomType = roomsData[0].type;
            const defaultRoomCategory = getRoomCategory(defaultRoomId);

            setFormData((prev) => ({
              ...prev,
              Film: defaultMovieId,
              Room: defaultRoomId,
              Type: defaultRoomType,
              RoomCategory: defaultRoomCategory,
            }));
          }
        })
      )
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu Phim và Phòng. Vui lòng kiểm tra API.");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedRoomName = useMemo(() => {
    return dataLoaded.cinema_rooms.find((r) => r.id === formData.Room)?.name;
  }, [formData.Room, dataLoaded.cinema_rooms]);

  const calculatedBasePrice = useMemo(() => {
    return getCalculatedBasePrice(
      selectedRoomName,
      formData.Type,
      dataLoaded.price_rules
    );
  }, [selectedRoomName, formData.Type, dataLoaded.price_rules]);

  const handleChange = useCallback(
    (e) => {
      const { id, value } = e.target;
      setError(null);

      setFormData((prev) => {
        let newState = { ...prev, [id]: value };

        if (id === "Room") {
          const selectedRoom = dataLoaded.cinema_rooms.find(
            (r) => r.id === value
          );
          if (selectedRoom) {
            newState = {
              ...newState,
              RoomCategory: getRoomCategory(selectedRoom.id),
              Type: selectedRoom.type,
            };
          }
        }
        return newState;
      });
    },
    [dataLoaded.cinema_rooms]
  );

  const handleCancel = () => {
    navigate("/ticket");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.Showtime || !formData.Film || !formData.Room) {
      setError("Vui lòng điền đầy đủ Showtime, Film và Room.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // ID sinh ra sẽ là "1", "2", "3"...
    const newId = generateNewShowtimeId(dataLoaded.showtimes);

    const dataToSave = {
      id: newId,
      movie_id: formData.Film,
      room_id: formData.Room,
      start_time: formData.Showtime,
      status: formData.status,
      tickets_sold: 0,
    };

    try {
      await axios.post("http://localhost:9999/showtimes", dataToSave);
      alert(
        `Showtime ${newId} created successfully! Base Price: ${formatCurrency(
          calculatedBasePrice
        )}`
      );
      navigate("/ticket");
    } catch (error) {
      console.error("Error saving new showtime:", error);
      setError("Lưu suất chiếu thất bại. Vui lòng kiểm tra server API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <h2 className="text-center">Loading Movies and Rooms...</h2>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">🎬 Create New Showtime</h2>
      <Card className="p-4 shadow-lg">
        <Form onSubmit={handleSave}>
          <h4 className="mb-4 text-primary">Showtime Configuration</h4>

          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group controlId="Showtime">
                <Form.Label className="fw-bold">
                  Showtime (Date & Time) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={formData.Showtime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="Film">
                <Form.Label className="fw-bold">
                  Film <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.Film}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a Film
                  </option>
                  {dataLoaded.movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} (
                      {movie.status === "coming_soon"
                        ? "Coming soon"
                        : "Now showing"}
                      )
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mb-4 align-items-end">
            <Col md={3}>
              <Form.Group controlId="Room">
                <Form.Label className="fw-bold">
                  Room <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.Room}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a Room
                  </option>
                  {dataLoaded.cinema_rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.id})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group controlId="RoomCategory">
                <Form.Label className="fw-bold">Room Category</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.RoomCategory || "N/A"}
                  readOnly
                  style={{
                    backgroundColor:
                      formData.RoomCategory === "VIP" ? "#fff0f0" : "#f0f8ff",
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="Type">
                <Form.Label className="fw-bold">Type (3D/2D)</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.Type || "N/A"}
                  readOnly
                />
                <Form.Text className="text-muted">
                  Type is determined by the selected Room.
                </Form.Text>
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
                  className="bg-warning text-dark fw-bold"
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group controlId="status">
                <Form.Label className="fw-bold">Initial Status</Form.Label>
                <Form.Select value={formData.status} onChange={handleChange}>
                  <option value="open">Open (Active)</option>
                  <option value="sold_out" disabled>
                    Sold Out (Disabled for creation)
                  </option>
                  <option value="canceled">Canceled</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end pt-3">
            <Button
              variant="secondary"
              className="me-2"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Creating...
                </>
              ) : (
                "Create Showtime"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default CreateTicketPage;

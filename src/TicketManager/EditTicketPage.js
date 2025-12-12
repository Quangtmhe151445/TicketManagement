import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  // Định dạng tiền tệ Việt Nam Đồng (VND)
  return amount ? `${amount.toLocaleString("vi-VN")} VND` : "N/A";
};

const getRoomCategory = (roomId) => {
  // Logic phân loại phòng VIP
  const vipRoomIds = ["room02", "room07", "room08"];
  if (vipRoomIds.includes(roomId)) {
    return "VIP";
  }
  return "Phòng Thường";
};

const getCalculatedBasePrice = (roomCategory, roomType) => {
  // Lấy giá cơ sở dựa trên loại phòng và định dạng (2D/3D)
  const safeRoomType = roomType || "";
  const is3D = safeRoomType.includes("3D");

  if (roomCategory === "VIP") {
    // Giá VIP: 999,999 (3D) hoặc 500,000 (2D)
    return is3D ? 999999 : 500000;
  }
  // Giá Thường: 190,000 (3D) hoặc 110,000 (2D)
  return is3D ? 190000 : 110000;
};

// Hàm chuẩn hóa dữ liệu suất chiếu từ API
const normalizeShowtimeData = (st, movieMap, roomMap) => {
  const room = roomMap.get(st.room_id) || {};
  const totalSeats = room.total_seats || 0;
  const ticketsSold = st.tickets_sold || 0;
 const safeSeatsRemaining = Math.max(0, totalSeats - ticketsSold);
  const currentRoomType = room.type || "2D Standard";
  const currentRoomCategory = getRoomCategory(st.room_id);

  let capacityDisplay = `${safeSeatsRemaining} / ${totalSeats}`;
  if (st.status === "canceled" || st.status === "sold_out") {
    capacityDisplay = st.status.toUpperCase().replace("_", " ");
  }

  return {
    Showtime: st.start_time,
    Film: st.movie_id,
    Room: st.room_id,
    Type: currentRoomType,
    RoomCategory: currentRoomCategory,
    id: st.id,
    CapacityStatus: capacityDisplay,
    Status: st.status,
  };
};

// --- Main Component ---

function EditTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    movies: [],
    cinema_rooms: [],
    showtime: null, // Không cần price_rules vì logic tính giá đã được đưa vào utility function
  });

  const [originalTicket, setOriginalTicket] = useState(null);
  const [formData, setFormData] = useState({});

  // Lấy các loại phòng duy nhất cho dropdown Type (Dù Type đã bị làm readOnly)
  const uniqueRoomTypes = useMemo(() => {
    const types = new Set(dataLoaded.cinema_rooms.map((r) => r.type));
    return Array.from(types).sort();
  }, [dataLoaded.cinema_rooms]);

  // Tính toán giá cơ sở dựa trên các thuộc tính của phòng hiện tại
  const calculatedBasePrice = useMemo(() => {
    return getCalculatedBasePrice(formData.RoomCategory, formData.Type);
  }, [formData.Type, formData.RoomCategory]);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const endpoints = [
      "http://localhost:9999/movies",
      "http://localhost:9999/cinema_rooms",
      `http://localhost:9999/showtimes/${ticketId}`,
    ];

    axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
        axios.spread((moviesRes, roomsRes, showtimeRes) => {
          const showtime = showtimeRes.data;
          const moviesData = moviesRes.data;
          const roomsData = roomsRes.data;

          const currentMovieMap = new Map(moviesData.map((m) => [m.id, m]));
          const currentRoomMap = new Map(roomsData.map((r) => [r.id, r]));

          setDataLoaded({
            movies: moviesData,
            cinema_rooms: roomsData,
            showtime: showtime,
          });

          if (showtime) {
            const initialData = normalizeShowtimeData(
              showtime,
              currentMovieMap,
              currentRoomMap
            );

            setOriginalTicket(initialData);

            // Khởi tạo formData với dữ liệu đã chuẩn hóa
            setFormData({
              Showtime: initialData.Showtime,
              Film: initialData.Film,
              Room: initialData.Room,
              Type: initialData.Type,
              RoomCategory: initialData.RoomCategory,
              status: initialData.Status,
            });
          }
        })
      )
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }, [ticketId]);

  // --- Event Handlers ---

  const handleChange = useCallback(
    (e) => {
      const { id, value } = e.target;

      setFormData((prev) => {
        let newState = { ...prev, [id]: value };

        // Logic CẬP NHẬT TỰ ĐỘNG Loại Phòng (Type & RoomCategory) khi thay đổi Room
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
  ); // Dependency để tìm phòng

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
      // Các trường khác như tickets_sold sẽ được giữ nguyên ở backend (json-server)
      // Nếu cần cập nhật tickets_sold, bạn phải tìm giá trị ban đầu (originalTicket) hoặc logic khác.
    };

    try {
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
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <h2 className="text-center">Loading Showtime Data...</h2>
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

          {/* Hàng 1: ID, Showtime, Film */}
          <Row className="g-3 mb-4">
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

          {/* Hàng 2: Room, Room Category, Type, Base Price */}
          <Row className="g-3 mb-4 align-items-end">
            <Col md={3}>
              <Form.Group controlId="Room">
                <Form.Label className="fw-bold">Room</Form.Label>
                <Form.Select
                  value={formData.Room || ""}
                  onChange={handleChange}
                >
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
                      formData.RoomCategory === "VIP" ? "#ffebee" : "#f0f8ff",
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group controlId="Type">
                <Form.Label className="fw-bold">
                  Type (Affects Price)
                </Form.Label>
                {/* Type tự động cập nhật khi chọn Room, và là readOnly */}
                <Form.Select
                  value={formData.Type || ""}
                  onChange={handleChange}
                  readOnly
                  disabled
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
                  className="bg-warning text-dark fw-bold"
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          {/* Hàng 3: Capacity Status, Status */}
          <h4 className="mb-4 text-secondary">Status & Capacity (Context)</h4>
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
                  <option value="open">Open</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="canceled">Canceled</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Nút Hành Động */}
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

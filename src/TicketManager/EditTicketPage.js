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

const formatCurrency = (amount) => {
  return amount ? `${amount.toLocaleString("vi-VN")} VND` : "N/A";
};

const getRoomCategory = (roomId) => {
  const vipRoomIds = ["room02", "room07", "room08"];
  if (vipRoomIds.includes(roomId)) {
    return "VIP";
  }
  return "Regular room";
};

const getCalculatedBasePriceByRule = (roomName, roomType, priceRules) => {
  if (!roomName || !roomType || !priceRules || priceRules.length === 0) {
    return 0;
  }

  const typeInRule = roomType.includes("3D") ? "3D" : "2D";

  const rule = priceRules.find(
    (r) => r.room_name === roomName && r.type === typeInRule
  );

  return rule ? rule.price : 0;
};

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

  const currentRoomName = room.name || "";

  return {
    Showtime: st.start_time,
    Film: st.movie_id,
    Room: st.room_id,
    Type: currentRoomType,
    RoomCategory: currentRoomCategory,
    id: st.id,
    CapacityStatus: capacityDisplay,
    Status: st.status,
    RoomName: currentRoomName, 
  };
};

function EditTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    movies: [],
    cinema_rooms: [],
    price_rules: [], 
    showtime: null,
  });

  const [originalTicket, setOriginalTicket] = useState(null);
  const [formData, setFormData] = useState({});

  const selectedRoomName = useMemo(() => {
    return dataLoaded.cinema_rooms.find((r) => r.id === formData.Room)?.name;
  }, [formData.Room, dataLoaded.cinema_rooms]);

  const calculatedBasePrice = useMemo(() => {

    return getCalculatedBasePriceByRule(
      selectedRoomName,
      formData.Type,
      dataLoaded.price_rules
    );
  }, [selectedRoomName, formData.Type, dataLoaded.price_rules]);

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
      "http://localhost:9999/price_rules",
    ];

    axios
      .all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
     
        axios.spread((moviesRes, roomsRes, showtimeRes, rulesRes) => {
          const showtime = showtimeRes.data;
          const moviesData = moviesRes.data;
          const roomsData = roomsRes.data;
          const rulesData = rulesRes.data; 

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
              currentMovieMap,
              currentRoomMap
            );

            setOriginalTicket(initialData);

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

  const handleChange = useCallback(
    (e) => {
      const { id, value } = e.target;

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

    const dataToSave = {
      start_time: formData.Showtime,
      movie_id: formData.Film,
      room_id: formData.Room,
      status: formData.status,
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
                      {room.name}
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

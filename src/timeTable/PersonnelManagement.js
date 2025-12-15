import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import EventForm from "./components/EventForm.js";
import Timetable from "./components/Timetable.js";
import Login from "./components/LoginForm.js";
import "bootstrap/dist/css/bootstrap.min.css";

const weeks = [
  { label: "08/12 - 14/12", value: "2025-12-08" },
  { label: "15/12 - 21/12", value: "2025-12-15" },
  { label: "22/12 - 28/12", value: "2025-12-22" },
];

function App() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(weeks[0].value);
  const [staff, setstaff] = useState(null);
  const [staffList, setStaffList] = useState([]);

  const cancelEdit = () => {
    setEditingEvent(null);
  };

  const tableName = "work schedule";

  const fetchEvents = () => {
    if (!tableName) return;
    fetch(`http://localhost:9999/${tableName}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Fetch error:", error));
    fetch("http://localhost:9999/staff")
      .then((res) => res.json())
      .then((data) => setStaffList(data));
  };

  useEffect(() => {
    if (staff) fetchEvents();
  }, [staff]);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      week: selectedWeek,
    };
    fetch(`http://localhost:9999/${tableName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    }).then(() => fetchEvents());
  };

  const updateEvent = (event) => {
    const original = events.find((e) => e.id === event.id);
    const updated = {
      ...event,
      week: event.week || original?.week || selectedWeek, // giữ lại tuần gốc
    };

    fetch(`http://localhost:9999/${tableName}/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => {
      fetchEvents();
      setEditingEvent(null);
    });
  };

  const deleteEvent = (id) => {
    fetch(`http://localhost:9999/${tableName}/${id}`, {
      method: "DELETE",
    }).then(() => fetchEvents());
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(filter.toLowerCase()) &&
      event.week === selectedWeek
  );

  if (!staff) return <Login onLogin={setstaff} />;

  return (
    <Container className="py-4" fluid>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">📅 Weekly work schedule ({staff.name})</h2>
      </div>

      <Row className="g-4">
        {staff?.role === "admin" && (
          <Col md={4}>
            <Card className="shadow rounded-4 h-100">
              <Card.Body>
                <h4 className="text-secondary mb-3">
                  {editingEvent ? "✏️ Edit shift" : "📝 Create shift"}
                </h4>
                <EventForm
                  addEvent={addEvent}
                  updateEvent={updateEvent}
                  editingEvent={editingEvent}
                  cancelEdit={cancelEdit}
                  staffList={staffList}
                  staff={staff}
                />
              </Card.Body>
            </Card>
          </Col>
        )}

        {staff?.role !== "admin" && (
          <Col md={4}>
            <Card className="shadow rounded-4 h-100">
              <Card.Body>
                <h4 className="text-secondary mb-3">✏️ View Event</h4>
                <EventForm
                  addEvent={addEvent}
                  updateEvent={updateEvent}
                  editingEvent={editingEvent}
                  staffList={staffList}
                  staff={staff}
                />
                <div className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
                  📌 Click an card to view it.
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}

        <Col md={8}>
          <Card className="shadow rounded-4 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 className="text-secondary mb-0">📆 Weekly schedule</h4>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    style={{ width: "180px" }}
                  >
                    {weeks.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    type="text"
                    placeholder="Filter by name..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
              <Timetable
                events={filteredEvents}
                onDelete={deleteEvent}
                onEdit={setEditingEvent}
                staff={staff}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

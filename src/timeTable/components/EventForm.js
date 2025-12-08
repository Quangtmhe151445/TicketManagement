import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const EventForm = ({
  addEvent,
  updateEvent,
  editingEvent,
  cancelEdit,
  staff,
  staffList = [],
}) => {
  const [title, setTitle] = useState(""); // Tên nhân viên
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  // Khi bấm Edit → load dữ liệu vào form
  useEffect(() => {
    console.log("EventForm STAFF:", staff);

    if (editingEvent) {
      setTitle(editingEvent.title);
      setDay(editingEvent.day);
      setTime(editingEvent.time);
      setEndTime(editingEvent.endTime || "09:00");
    }
  }, [editingEvent]);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDay("Monday");
    setTime("08:00");
    setEndTime("09:00");
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const event = {
      id: editingEvent?.id,
      title, // tên nhân viên
      day,
      time,
      endTime,
    };

    if (editingEvent) {
      updateEvent(event);
    } else {
      addEvent(event); // Không thêm participants và ratings nữa
    }

    resetForm();
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* SELECT STAFF */}
      <Form.Group controlId="formTitle" className="mb-2">
        <Form.Label>Staff Name</Form.Label>
        <Form.Select
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        >
          <option value="">-- Select Staff --</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.name}>
              {staff.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* DAY */}
      <Form.Group controlId="formDay" className="mb-2">
        <Form.Label>Day of the week</Form.Label>
        <Form.Select value={day} onChange={(e) => setDay(e.target.value)}>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* START TIME */}
      <Form.Group controlId="formTime" className="mb-2">
        <Form.Label>Start Time</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </Form.Group>

      {/* END TIME */}
      <Form.Group controlId="formEndTime" className="mb-3">
        <Form.Label>End Time</Form.Label>
        <Form.Control
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </Form.Group>

      {/* BUTTONS */}
      {staff?.role === "admin" && (
        <div className="d-flex gap-2">
          <Button variant={editingEvent ? "warning" : "primary"} type="submit">
            {editingEvent ? "Update" : "Add"}
          </Button>

          {editingEvent && (
            <Button
              variant="secondary"
              onClick={() => {
                resetForm();
                cancelEdit();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </Form>
  );
};

export default EventForm;

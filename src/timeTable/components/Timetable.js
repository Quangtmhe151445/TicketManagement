import React from "react";
import { Button } from "react-bootstrap";
import "./css/Timetable.css";

// Danh sách 7 ngày trong tuần
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Timetable({ events = [], onDelete, onEdit, staff }) {
  // an toàn khi events = undefined
  const safeEvents = Array.isArray(events) ? events : [];

  // Tìm sự kiện theo ngày + giờ
  const getEventAt = (day, time) =>
    safeEvents.find(
      (e) => e.day === day && e.time?.slice(0, 5) === time.padStart(5, "0")
    );

  // Danh sách giờ duy nhất
  const uniqueHours = Array.from(
    new Set(safeEvents.map((e) => e.time?.slice(0, 5)).filter(Boolean))
  ).sort();

  return (
    <div className="calendar-grid">
      {/* Ô trống góc trái */}
      <div className="calendar-header" />

      {/* Header các ngày */}
      {days.map((day) => (
        <div key={`header-${day}`} className="calendar-header">
          {day}
        </div>
      ))}

      {/* Các hàng theo từng giờ */}
      {uniqueHours.map((hour) => (
        <React.Fragment key={`row-${hour}`}>
          {/* Cột giờ */}
          <div className="calendar-time">{hour}</div>

          {/* Cột ngày - giờ */}
          {days.map((day) => {
            const event = getEventAt(day, hour);
            return (
              <div key={`${day}-${hour}`} className="calendar-cell">
                {event ? (
                  <div
                    className="event-box"
                    onClick={() => {
                      onEdit(event); // chỉ admin được edit
                    }}
                  >
                    <div className="fw-bold">{event.title}</div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(event.id);
                      }}
                    >
                      x
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Timetable;

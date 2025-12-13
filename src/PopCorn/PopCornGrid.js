import { Card, Button, Badge, Row, Col, Form, Image, InputGroup } from "react-bootstrap";
import { useState, useMemo } from "react";

const badgeColor = s =>
  s === "active" ? "success" : s === "low_stock" ? "warning" : "secondary";

const canSell = (item, day, ticket) => {
  const okDay =
    !item.allowed_days?.length || item.allowed_days.includes(day);

  const okTicket =
    !item.allowed_ticket_types?.length ||
    item.allowed_ticket_types.includes(ticket);

  return okDay && okTicket;
};

export default function PopCornGrid({
  items,
  startEdit,
  toggleSelling,
  deleteItem,
  money,
}) {
  const [day, setDay] = useState("weekday");
  const [ticket, setTicket] = useState("2D");
  const [q, setQ] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = q.toLowerCase().trim();
    if (!keyword) return items;

    return items.filter(
      i =>
        i.name.toLowerCase().includes(keyword) ||
        i.sku.toLowerCase().includes(keyword)
    );
  }, [items, q]);


  return (
    <>

      <Card className="mb-3 shadow-sm">
        <Card.Body className="d-flex gap-2">
          <InputGroup style={{ maxWidth: 260 }}>
            <Form.Control
              placeholder="Search by name or SKU"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </InputGroup>

          <Form.Select value={day} onChange={e => setDay(e.target.value)}>
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
            <option value="holiday">Holiday</option>
          </Form.Select>

          <Form.Select value={ticket} onChange={e => setTicket(e.target.value)}>
            <option>2D</option>
            <option>3D</option>
            <option>IMAX</option>
            <option>VIP</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <Row className="g-3">
       {filteredItems.map(i => {
          const available = canSell(i, day, ticket);
          const displayStatus = available ? i.status : "inactive";

          return (
            <Col md={6} xl={4} key={i.id}>
              <Card className="h-100 shadow-sm">
                {i.image && (
                  <Image
                    src={i.image}
                    height={160}
                    style={{ objectFit: "contain" }}
                  />
                )}

                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{i.name}</strong>
                    <Badge bg={badgeColor(displayStatus)}>
                      {displayStatus}
                    </Badge>
                  </div>

                  <div className="text-muted small mt-1">{i.sku}</div>

                  <div className="mt-2">
                    <strong>{money(i.price)}</strong>
                  </div>

                  <div className="small text-muted">
                    Stock: {i.stock}
                  </div>

                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => startEdit(i)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant={i.status === "active" ? "danger" : "success"}
                      disabled={!available}
                      onClick={() => toggleSelling(i.id)}
                    >
                      {i.status === "active" ? "Stop selling" : "Continue"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete product "${i.name}"? This cannot be undone.`
                          )
                        ) {
                          deleteItem(i.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}

        {filteredItems.length === 0 && (
          <Col>
            <div className="text-center text-muted py-5">
              No products found
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}

import { Row, Col, Card, Image, Button } from "react-bootstrap";

export default function PopCornGrid({ items, startEdit, remove, money, toggleStatus }) {

  return (
    <Row>
      {items.map((item) => (
        <Col md={6} lg={4} key={item.id} className="mb-3">
          <Card className="h-100 shadow-sm">
            <div
              style={{
                height: 140,
                background: "#fafafa",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.image ? (
                <Image src={item.image} style={{ maxHeight: 140 }} />
              ) : (
                "No image"
              )}
            </div>

            <Card.Body>
              <h6>{item.name}</h6>
              <div className="text-muted small">
                {item.sku} • {item.category}
              </div>

              <div className="d-flex justify-content-between mt-2">
                <strong>{money(item.price)}</strong>

                {/* Click đổi trạng thái */}
                <Button size="sm" onClick={() => toggleStatus(item.id)}>
                  {item.status === "active" ? "Tạm ngưng" : "Bán lại"}
                </Button>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <Button size="sm" onClick={() => startEdit(item)}>
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => remove(item.id)}
                >
                  Xóa
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

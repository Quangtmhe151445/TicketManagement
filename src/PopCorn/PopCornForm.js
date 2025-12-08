import { Card, Form, Row, Col, Button, InputGroup } from "react-bootstrap";

export default function PopCornForm({ form, setF, resetForm, save }) {
  return (
    <Card className="p-3 mb-3 shadow-sm">
      <div className="d-flex justify-content-between mb-2">
        <strong>{form.id ? "Sửa mặt hàng" : "Thêm mặt hàng"}</strong>

        <div>
          <Button
            size="sm"
            variant="outline-secondary"
            className="me-2"
            onClick={resetForm}
          >
            + Thêm
          </Button>
          <Button size="sm" variant="secondary" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </div>

      <Form.Group className="mb-2">
        <Form.Label>SKU</Form.Label>
        <Form.Control
          value={form.sku}
          onChange={(e) => setF("sku", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Tên</Form.Label>
        <Form.Control
          value={form.name}
          onChange={(e) => setF("name", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Category</Form.Label>
        <Form.Control
          value={form.category}
          onChange={(e) => setF("category", e.target.value)}
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-2">
            <Form.Label>Loại</Form.Label>
            <Form.Select
              value={form.type}
              onChange={(e) => setF("type", e.target.value)}
            >
              <option value="popcorn">Bắp</option>
              <option value="drink">Nước</option>
              <option value="combo">Combo</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-2">
            <Form.Label>Size</Form.Label>
            <Form.Control
              value={form.size}
              onChange={(e) => setF("size", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2">
        <Form.Label>Giá</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            value={form.price}
            onChange={(e) => setF("price", e.target.value)}
          />
          <InputGroup.Text>₫</InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Ảnh (URL)</Form.Label>
        <Form.Control
          value={form.image}
          onChange={(e) => setF("image", e.target.value )}
          placeholder="https://..."
        />
      </Form.Group>

      <div className="d-flex justify-content-end mt-2">
        <Button size="sm" variant="primary" onClick={save}>
          Lưu
        </Button>
      </div>
    </Card>
  );
}

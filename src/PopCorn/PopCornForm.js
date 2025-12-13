import {
  Card,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const DAY_OPTIONS = [
  { value: "weekday", label: "Weekday" },
  { value: "weekend", label: "Weekend" },
  { value: "holiday", label: "Holiday" },
];

const TICKET_OPTIONS = ["2D", "3D", "IMAX", "VIP"];

export default function PopCornForm({ form, setF, resetForm, save }) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [form.id]);

  const validate = () => {
    const e = {};

    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.name.trim()) e.name = "Product name is required";
    if (+form.price <= 0) e.price = "Price must be greater than 0";
    if (+form.stock < 0) e.stock = "Stock cannot be negative";
    if (!form.image.trim()) e.image = "Image is required";
    if (form.allowed_days.length === 0)
      e.allowed_days = "Select at least one day";
    if (form.allowed_ticket_types.length === 0)
      e.allowed_ticket_types = "Select at least one ticket type";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    save();
  };

  return (
    <Card className="p-3 mb-3 shadow-sm">
      <h5 className="mb-2">{form.id ? "Edit Product" : "Add New Product"}</h5>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>SKU *</Form.Label>
          <Form.Control
            value={form.sku}
            isInvalid={!!errors.sku}
            onChange={(e) => setF("sku", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.sku}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Name *</Form.Label>
          <Form.Control
            value={form.name}
            isInvalid={!!errors.name}
            onChange={(e) => setF("name", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Type</Form.Label>
          <Form.Select
            value={form.type}
            onChange={(e) => setF("type", e.target.value)}
          >
            <option value="popcorn">Popcorn</option>
            <option value="drink">Drink</option>
            <option value="combo">Combo</option>
          </Form.Select>
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-2">
              <Form.Label>Price *</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min={0}
                  value={form.price}
                  isInvalid={!!errors.price}
                  onChange={(e) => setF("price", e.target.value)}
                />
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup>
              <div className="text-danger small">{errors.price}</div>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-2">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={form.stock}
                isInvalid={!!errors.stock}
                onChange={(e) => setF("stock", e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.stock}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            value={form.image}
             isInvalid={!!errors.image}
            onChange={(e) => setF("image", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.image}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.description}
            onChange={(e) => setF("description", e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Allowed Days *</Form.Label>
          {DAY_OPTIONS.map((d) => (
            <Form.Check
              key={d.value}
              type="checkbox"
              label={d.label}
              checked={form.allowed_days.includes(d.value)}
              onChange={(e) =>
                setF(
                  "allowed_days",
                  e.target.checked
                    ? [...form.allowed_days, d.value]
                    : form.allowed_days.filter((x) => x !== d.value)
                )
              }
            />
          ))}
          {errors.allowed_days && (
            <Alert variant="danger" className="py-1 mt-1">
              {errors.allowed_days}
            </Alert>
          )}
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Allowed Ticket Types *</Form.Label>
          {TICKET_OPTIONS.map((t) => (
            <Form.Check
              key={t}
              type="checkbox"
              label={t}
              checked={form.allowed_ticket_types.includes(t)}
              onChange={(e) =>
                setF(
                  "allowed_ticket_types",
                  e.target.checked
                    ? [...form.allowed_ticket_types, t]
                    : form.allowed_ticket_types.filter((x) => x !== t)
                )
              }
            />
          ))}
          {errors.allowed_ticket_types && (
            <Alert variant="danger" className="py-1 mt-1">
              {errors.allowed_ticket_types}
            </Alert>
          )}
        </Form.Group>


        <div className="d-flex justify-content-end gap-2">
          <Button variant="outline-secondary" onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit">{form.id ? "Update" : "Create"}</Button>
        </div>
      </Form>
    </Card>
  );
}

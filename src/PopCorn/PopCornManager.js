import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import PopCornForm from "./PopCornForm";
import PopCornGrid from "./PopCornGrid";

const API = "http://localhost:9999";
const money = n => Number(n || 0).toLocaleString() + "₫";
const genId = () => "p" + Date.now().toString(36);

export default function PopCornManager() {
  const emptyForm = {
    id: null,
    sku: "",
    name: "",
    type: "popcorn",
    price: "",
    stock: 0,
    image: "",
    description: "",
    allowed_days: [],
    allowed_ticket_types: [],
    status: "active",
  };

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = () =>
    fetch(`${API}/popcorns`)
      .then(r => r.json())
      .then(setItems);

  useEffect(() => {
    load();
  }, []);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ✅ SAVE (CREATE + UPDATE chuẩn)
  const save = async () => {
    // ---- VALIDATE TRÙNG SKU / NAME ----
    const duplicated = items.find(
      i =>
        i.id !== form.id &&
        (i.sku.trim().toLowerCase() === form.sku.trim().toLowerCase() ||
         i.name.trim().toLowerCase() === form.name.trim().toLowerCase())
    );

    if (duplicated) {
      alert("SKU hoặc tên sản phẩm đã tồn tại");
      return;
    }

    const isCreate = !form.id;

    const payload = {
      ...form,
      id: isCreate ? genId() : form.id,
      price: +form.price,
      stock: +form.stock,
    };

    await fetch(`${API}/popcorns${isCreate ? "" : "/" + form.id}`, {
      method: isCreate ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm(emptyForm);
    load();
  };

  const toggleSelling = async id => {
    const item = items.find(i => i.id === id);

    await fetch(`${API}/popcorns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        status: item.status === "active" ? "inactive" : "active",
      }),
    });

    load();
  };

  const deleteItem = async id => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API}/popcorns/${id}`, { method: "DELETE" });

    if (form.id === id) setForm(emptyForm);
    load();
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={4}>
          <PopCornForm
            form={form}
            setF={setF}
            resetForm={() => setForm(emptyForm)}
            save={save}
          />
        </Col>

        <Col md={8}>
          <PopCornGrid
            items={items}
            startEdit={item => setForm(item)}
            toggleSelling={toggleSelling}
            deleteItem={deleteItem}
            money={money}
          />
        </Col>
      </Row>
    </Container>
  );
}

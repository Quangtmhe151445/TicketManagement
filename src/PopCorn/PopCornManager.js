import { Container, Row, Col } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import PopCornForm from "./PopCornForm";
import PopCornFilters from "./PopCornFilters";
import PopCornGrid from "./PopCornGrid";

const money = (n) => Number(n || 0).toLocaleString() + "₫";
const genId = () => "x" + Date.now().toString(36).slice(-6);

export default function PopCornManager() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/popcorns")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const emptyForm = {
    id: null,
    sku: "",
    name: "",
    category: "",
    type: "popcorn",
    size: "",
    price: "",
    stock: 0,
    threshold: 5,
    image: "",
    description: "",
    status: "active",
  };

  const [form, setForm] = useState(emptyForm);

  const setF = (key, value) =>
    setForm(f => ({ ...f, [key]: value }));

  const resetForm = () => setForm(emptyForm);

  const save = () => {
    if (!form.sku || !form.name)
      return alert("Thiếu SKU / Tên");

    const payload = {
      ...form,
      price: +form.price,
      stock: +form.stock,
      id: form.id || genId(),
    };

    setItems(prev =>
      prev.some(i => i.id === payload.id)
        ? prev.map(i => i.id === payload.id ? payload : i)
        : [payload, ...prev]
    );

    resetForm();
  };

  const remove = (id) => {
    if (window.confirm("Xóa?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const startEdit = (item) => setForm(item);

  const toggleStatus = (id) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, status: i.status === "active" ? "inactive" : "active" }
          : i
      )
    );
  };

  const [q, setQ] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const categories = useMemo(
    () => [...new Set(items.map(i => i.category))],
    [items]
  );

  const filtered = items.filter(
    i =>
      (q === "" ||
        `${i.name} ${i.sku}`.toLowerCase().includes(q.toLowerCase())) &&
      (!filterCategory || i.category === filterCategory)
  );

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={4}>
          <PopCornForm
            form={form}
            setF={setF}
            resetForm={resetForm}
            save={save}
          />

          <PopCornFilters
            q={q}
            setQ={setQ}
            categories={categories}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        </Col>

        <Col md={8}>
          <PopCornGrid
            items={filtered}
            startEdit={startEdit}
            remove={remove}
            money={money}
            toggleStatus={toggleStatus}
          />
        </Col>
      </Row>
    </Container>
  );
}

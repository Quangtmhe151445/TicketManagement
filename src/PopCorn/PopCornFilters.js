import { Card, Form } from "react-bootstrap";

export default function PopCornFilters({ q, setQ, categories, filterCategory, setFilterCategory }) {
  return (
    <Card className="p-3 shadow-sm">
      <strong>Filters</strong>

      <div className="d-flex gap-2 mt-2">
        <Form.Control
          placeholder="Tìm theo tên hoặc SKU..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <Form.Select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">Tất cả</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </Form.Select>
      </div>
    </Card>
  );
}

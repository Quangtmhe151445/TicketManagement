import React, { useState } from "react";
import { Button, Form, Card, Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "staff", // Mặc định để staff cho an toàn
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Mật khẩu phải từ 8 ký tự trở lên.");
      return;
    }

    setLoading(true);
    try {
      // 1. Kiểm tra username đã tồn tại chưa
      const checkUser = await axios.get(
        `http://localhost:9999/staff?username=${formData.username}`
      );

      if (checkUser.data.length > 0) {
        setError("Tên đăng nhập đã tồn tại!");
        setLoading(false);
        return;
      }

      // 2. Tạo ID mới và gửi dữ liệu
      const newStaff = { ...formData, id: `sf${Date.now()}` };
      await axios.post("http://localhost:9999/staff", newStaff);

      alert("Tạo tài khoản thành công!");
      navigate("/"); // Quay lại trang chủ/login
    } catch (err) {
      setError("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-body">
      {" "}
      {/* Class từ file CSS cũ */}
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card
          className="auth-card shadow-lg p-4"
          style={{ maxWidth: "450px", width: "100%" }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold auth-title">
              CREATE <span>ACCOUNT</span>
            </h2>
            <p className="text-white-50 small">
              Đăng ký thành viên mới vào hệ thống
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="py-2 small text-center">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Họ và Tên</Form.Label>
              <Form.Control
                className="auth-input"
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Username</Form.Label>
              <Form.Control
                className="auth-input"
                placeholder="Tên đăng nhập"
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="auth-label">Mật khẩu</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Form.Group>

            {/* --- PHẦN CHỌN ROLE --- */}
            <Form.Group className="mb-4">
              <Form.Label className="auth-label">Quyền hạn (Role)</Form.Label>
              <Form.Select
                className="auth-input"
                style={{ cursor: "pointer" }}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="staff" className="text-dark">
                  Staff (Nhân viên)
                </option>
                <option value="admin" className="text-dark">
                  Admin (Quản trị viên)
                </option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 btn-auth mb-2"
              disabled={loading}
            >
              {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
            </Button>

            <Button
              variant="link"
              className="w-100 text-info text-decoration-none small"
              onClick={() => navigate("/")}
            >
              Quay lại Đăng nhập
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Register;

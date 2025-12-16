import React, { useState } from "react";
import { Button, Form, Card, Container } from "react-bootstrap";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // 👉 Validate password length
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    fetch(
      `http://localhost:9999/staff?username=${username}&password=${password}`
    )
      .then((res) => res.json())
      .then((users) => {
        if (users.length > 0) {
          const user = users[0];
          onLogin({
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          });
          alert("Logged in successfully!");
        } else {
          alert("Invalid username or password");
        }
      })
      .catch(() => alert("Server error"));
  };

  return (
    <Container className="py-5">
      <Card className="p-4 mx-auto shadow" style={{ maxWidth: "400px" }}>
        <h4 className="mb-3 text-center">🔐 Login</h4>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;

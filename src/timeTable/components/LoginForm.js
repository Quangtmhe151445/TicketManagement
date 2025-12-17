import React, { useState } from "react";
import { Button, Form, Card, Container, Spinner } from "react-bootstrap";
import "./css/Login.css"; // Cleaned up import

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Note: Ideally, this should be a POST request to a /login endpoint
      const response = await fetch(
        `http://localhost:9999/staff?username=${username}&password=${password}`
      );

      const users = await response.json();

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
    } catch (error) {
      alert("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Card
          className="p-4 shadow"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h4 className="mb-3 text-center">🔐 Login</h4>

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Login;

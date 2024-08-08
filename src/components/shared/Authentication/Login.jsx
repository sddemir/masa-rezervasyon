import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../../../services/userRole";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authenticateUser(email, password);
      onLogin(user); // Pass the user object which includes user ID
      navigate("/home");
    } catch (error) {
      setError("Yanlış kullanıcı bilgileri. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Container className="login-container">
      <Form className="login-form" onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email adresi</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email giriniz."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            placeholder="Şifre giriniz."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Giriş
        </Button>

        {error && <p className="text-danger">{error}</p>}
      </Form>
    </Container>
  );
};

export default Login;

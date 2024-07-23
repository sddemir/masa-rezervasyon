import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import "./Login.css";

const Password = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (email && password && password === confirmPassword) {
      setEmailSent(true);
      setSuccess(true);
      setError("");
      console.log("Şifre sıfırlandı - Email:", email, "Yeni Şifre:", password);
    } else {
      setEmailSent(false);
      setSuccess(false);
      setError("Lütfen geçerli bir e-posta adresi ve eşleşen şifreler girin.");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <div className="form-container">
            <h2 style={{ color: "red" }}>Şifremi Unuttum</h2>
            {success ? (
              <Alert variant="success" className="mt-3">
                Şifre başarıyla sıfırlandı. Yeni şifrenizle giriş
                yapabilirsiniz.
              </Alert>
            ) : (
              <Form onSubmit={handlePasswordReset}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email adresi</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email girin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Yeni Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Yeni şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                  <Form.Label>Şifreyi Onayla</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Yeni şifrenizi tekrar girin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="mt-2">
                    {error}
                  </Alert>
                )}

                <Button
                  variant="gradient"
                  type="submit"
                  className="w-100 mt-3 button-gradient"
                >
                  Şifreyi Sıfırla
                </Button>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Password; // Ensure this line is present

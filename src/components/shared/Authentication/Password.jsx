import React, { useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
// import { updatePassword } from "../../../services/userService";
import "./Login.css";
import "./Password.css";

const Password = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor.");
      setSuccess(false);
      return;
    }

    try {
      await updatePassword(userId, currentPassword, newPassword);
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
      setError("Şifre değiştirirken bir hata oluştu.");
      setSuccess(false);
    }
  };

  return (
    <Container className="password-container">
      <h3>Şifreyi Yenile</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Şifre başarıyla değiştirildi!</Alert>
      )}
      <Form onSubmit={handleSubmit} className="password-form">
        <Form.Group controlId="currentPassword">
          <Form.Label>Mevcut Şifre</Form.Label>
          <Form.Control
            type="password"
            placeholder="Mevcut şifrenizi girin"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="newPassword" className="mt-3">
          <Form.Label>Yeni Şifre</Form.Label>
          <Form.Control
            type="password"
            placeholder="Yeni şifrenizi girin"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mt-3">
          <Form.Label>Yeni Şifreyi Onayla</Form.Label>
          <Form.Control
            type="password"
            placeholder="Yeni şifrenizi tekrar girin"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="text-center mt-4">
          <Button variant="primary" type="submit">
            Şifreyi Değiştir
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Password;

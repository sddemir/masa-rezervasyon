import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { createReservation } from "../../../services/userService";
import Scene from "../../shared/Kroki/Scene";

const FormComponent = ({ onSubmit, userId }) => {
  const [selectedOda, setSelectedOda] = useState("");
  const [selectedChair, setSelectedChair] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChairSelect = (chairId) => {
    setSelectedChair(chairId);
  };

  const handleOdaSelect = (odaType) => {
    setSelectedOda(odaType);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedChair || !selectedOda) {
      setError("Please fill all fields before submitting.");
      return;
    }

    const reservationData = {
      deskId: selectedChair,
      userId: userId,
      reservationDate: new Date().toISOString().split("T")[0],
    };

    try {
      await createReservation(reservationData);
      setSuccess(true);
      setError(null);
      onSubmit(reservationData);
    } catch (error) {
      console.error(
        "Error creating reservation:",
        error.response || error.message
      );
      setError("Failed to make reservation.");
      setSuccess(false);
    }
  };

  return (
    <Container className="form-container">
      <h3>Form Component</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <Alert variant="success">Reservation made successfully!</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="odaSelect">
          <Form.Label>Odalar</Form.Label>
          <Button
            variant="primary"
            onClick={() => handleOdaSelect("Mobilite")}
            className={selectedOda === "Mobilite" ? "active" : ""}
          >
            Mobilite
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleOdaSelect("Kat")}
            className={selectedOda === "Kat" ? "active" : ""}
          >
            Kat
          </Button>
        </Form.Group>

        {selectedOda && (
          <Scene selectedOda={selectedOda} onChairSelect={handleChairSelect} />
        )}

        {selectedChair && (
          <Form.Group controlId="selectedChair">
            <Form.Label>Seçilen Masa</Form.Label>
            <Form.Control type="text" value={selectedChair} readOnly />
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          Masayı Seç
        </Button>
      </Form>
    </Container>
  );
};

export default FormComponent;

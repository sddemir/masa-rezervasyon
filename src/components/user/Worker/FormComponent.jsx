import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { createReservation } from "../../../services/userService";
import Scene from "../../shared/Kroki/Scene";

const FormComponent = ({ onSubmit, userId, selectedDate }) => {
  // Add selectedDate prop
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
      reservationDate: selectedDate.toISOString().split("T")[0], // Use selectedDate here
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
        <Alert variant="success">Reservation created successfully!</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="odaType">
          <Form.Label>Select Oda</Form.Label>
          <div className="d-flex justify-content-center mb-3">
            <Button
              variant={
                selectedOda === "Mobilite" ? "primary" : "outline-primary"
              }
              className="me-3"
              onClick={() => handleOdaSelect("Mobilite")}
            >
              Mobilite
            </Button>
            <Button
              variant={selectedOda === "Kat" ? "primary" : "outline-primary"}
              onClick={() => handleOdaSelect("Kat")}
            >
              Kat
            </Button>
          </div>
        </Form.Group>
        {selectedOda && (
          <Scene selectedOda={selectedOda} onChairSelect={handleChairSelect} />
        )}
        <div className="d-flex justify-content-center mt-4">
          <Button variant="success" type="submit">
            Reserve
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormComponent;

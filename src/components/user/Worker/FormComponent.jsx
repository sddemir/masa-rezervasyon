import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import {
  createReservation,
  listReservations,
} from "../../../services/userService";
import Scene from "../../shared/Kroki/Scene";

const FormComponent = ({ onSubmit, userId, selectedDate }) => {
  const [selectedOda, setSelectedOda] = useState("");
  const [selectedChair, setSelectedChair] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await listReservations();
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Error fetching reservations");
      }
    };

    fetchReservations();
  }, []);

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

    const reservationDate = selectedDate.toISOString().split("T")[0];

    // Check if the user already has a reservation for the selected date
    const userReservation = reservations.find(
      (reservation) =>
        reservation.userId === userId &&
        reservation.reservationDate === reservationDate
    );

    if (userReservation) {
      setError("You already have a reservation for this date.");
      setSuccess(false);
      return;
    }

    // Check if the chair is already reserved for the selected date
    const existingReservation = reservations.find(
      (reservation) =>
        reservation.deskId === selectedChair &&
        reservation.reservationDate === reservationDate
    );

    if (existingReservation) {
      setError("This chair is already reserved for the selected date.");
      setSuccess(false);
      return;
    }

    const reservationData = {
      deskId: selectedChair,
      userId: userId,
      reservationDate: reservationDate,
    };

    try {
      const response = await createReservation(reservationData);
      setReservations([...reservations, response.data]);
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
          <Scene
            selectedOda={selectedOda}
            onChairSelect={handleChairSelect}
            selectedDate={selectedDate}
          />
        )}
        {selectedChair && (
          <div className="text-center mt-3">
            <Alert variant="info">Selected Chair: {selectedChair}</Alert>
          </div>
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
